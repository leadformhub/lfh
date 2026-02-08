# LeadFormHub API & Webhooks

This document describes the HTTP APIs and webhooks available for [LeadFormHub](https://leadformhub.com/). All URLs use the base:

**Base URL:** `https://leadformhub.com`

---

## Table of contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Public API (no auth)](#public-api-no-auth)
4. [Dashboard API (session)](#dashboard-api-session)
5. [Support API (session or API key)](#support-api-session-or-api-key)
6. [Webhooks](#webhooks)
7. [Errors](#errors)

---

## Overview

| Area | Auth | Use case |
|------|------|----------|
| **Submit lead** | None | Public form submissions (embed on your site) |
| **Forms, leads, account** | Session (cookies) | Dashboard / logged-in user actions |
| **Support requests** | Session or API key | Create tickets, post replies (support staff via key) |
| **Inbound email webhook** | Secret header | Record email replies into support ticket threads |

---

## Authentication

### Session (cookies)

Most dashboard endpoints require a logged-in user. Authenticate via the web app:

1. **Login:** `POST https://leadformhub.com/api/auth/login` with `{ "usernameOrEmail", "password" }`
2. The response sets a session cookie. Use the same cookie for subsequent requests (same origin or with credentials).

Use this when calling the API from the LeadFormHub frontend or from a same-origin script. For server-to-server or external tools, session cookies are not ideal; API keys for programmatic access may be available on higher plans.

### Webhook / inbound secret

For the **inbound email webhook**, send your secret in one of these ways:

- Header: `x-inbound-secret: <INBOUND_EMAIL_SECRET>`
- Or: `Authorization: Bearer <INBOUND_EMAIL_SECRET>`

Set `INBOUND_EMAIL_SECRET` in your environment (and in the service that POSTs to the webhook).

### Support API key (staff replies)

To post a reply as **support staff** (without a user session), use:

- Header: `Authorization: Bearer <SUPPORT_API_KEY>`
- Or: `x-support-key: <SUPPORT_API_KEY>`

Configure `SUPPORT_API_KEY` in your environment. Only use this from secure, server-side code.

---

## Public API (no auth)

These endpoints do not require authentication. They are used for public form submission and embed flows.

### Submit a lead (form submission)

Submit a new lead for a **public** form. The form must have status `PUBLIC`.

**Endpoint:** `POST https://leadformhub.com/api/leads/submit`

**Request body (JSON):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `formId` | string | Yes | Form ID (from form builder or forms list API) |
| `data` | object | Yes | Field values keyed by field `id` from the form schema |
| `recaptchaToken` | string | Conditional | Required if the form has reCAPTCHA enabled |

**Example:**

```json
{
  "formId": "clxxxxxxxxxxxxxxxxxx",
  "data": {
    "field_email_abc": "user@example.com",
    "field_name_xyz": "Jane Doe",
    "field_phone_def": "+1234567890"
  },
  "recaptchaToken": "03AGdBq24..."
}
```

Field keys in `data` must match the form schema field IDs. For semantic keys (e.g. `email`, `name`, `phone_number`), the server maps them from the schema when storing the lead.

**Success response:** `200 OK`

```json
{
  "id": "lead-uuid-here"
}
```

**Error responses:**

- `400` – Invalid request (e.g. missing `formId`, validation errors, missing reCAPTCHA, or OTP verification required)
- `404` – Form not found or form is not public

**Notes:**

- If the form has **email OTP** or **phone OTP** enabled, the submitter must complete verification before this endpoint accepts the submission.
- Optional headers: `User-Agent`, `X-Forwarded-For` / `X-Real-IP` (for IP logging).

---

## Dashboard API (session)

All endpoints in this section require a valid **session** (cookie set after login). Include credentials when making requests (e.g. `credentials: 'include'` in fetch).

### Forms

#### List forms

**Endpoint:** `GET https://leadformhub.com/api/forms/list`

**Response:** `200 OK`

```json
{
  "forms": [
    { "id": "form-id-1", "name": "Contact Us" },
    { "id": "form-id-2", "name": "Newsletter" }
  ]
}
```

---

#### Create form

**Endpoint:** `POST https://leadformhub.com/api/forms/create`

**Request body (JSON):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Form name (1–200 chars) |
| `status` | string | No | `"PUBLIC"` or `"PRIVATE"` (default: `"PUBLIC"`) |
| `description` | string | No | Optional description (max 2000 chars) |
| `redirectUrl` | string | No | URL to redirect after submit (empty string to clear) |
| `emailAlertEnabled` | boolean | No | Send email on new lead (plan-dependent) |
| `emailOtpEnabled` | boolean | No | Require email OTP (plan-dependent) |
| `mobileOtpEnabled` | boolean | No | Require phone OTP (plan-dependent) |

**Response:** `200 OK`

```json
{
  "form": { "id": "new-form-id", "name": "My Form" }
}
```

---

#### Get form

**Endpoint:** `GET https://leadformhub.com/api/forms/[formId]`

**Response:** `200 OK`

```json
{
  "form": {
    "id": "...",
    "name": "...",
    "schema": { "fields": [...], "settings": {...} },
    "createdAt": "2025-01-15T12:00:00.000Z"
  }
}
```

---

#### Update form

**Endpoint:** `PATCH https://leadformhub.com/api/forms/[formId]`

**Request body (JSON):** Any of `name`, `status`, `description`, `redirectUrl`, `emailAlertEnabled`, `emailOtpEnabled`, `mobileOtpEnabled` (same semantics as create).

**Response:** `200 OK` – full form object (including schema).

---

#### Update form schema (fields)

**Endpoint:** `PUT https://leadformhub.com/api/forms/[formId]/schema`

**Request body (JSON):**

```json
{
  "fields": [
    { "id": "field_1", "type": "email", "label": "Email", "required": true },
    { "id": "field_2", "type": "text", "label": "Name", "required": false }
  ],
  "settings": { }
}
```

Each field: `id`, `type`, `label`, `required`; optional `options` for choice fields. `settings` is optional.

**Response:** `200 OK` – `{ "ok": true, "formId": "..." }`.

---

#### Delete form

**Endpoint:** `POST https://leadformhub.com/api/forms/[formId]/delete`

**Response:** `200 OK` – `{ "ok": true }`.

---

#### List forms with schema

**Endpoint:** `GET https://leadformhub.com/api/forms/with-schema`

**Response:** `200 OK`

```json
{
  "forms": [
    { "id": "...", "name": "...", "schema": { "fields": [...], "settings": {...} }
  ]
}
```

Useful for building leads tables with correct column definitions.

---

### Leads

#### List leads

**Endpoint:** `GET https://leadformhub.com/api/leads`

**Query parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `formId` | string | If provided, returns leads for this form only |
| `page` | number | Page number (default: 1) |
| `search` | string | Optional search term |

When `formId` is provided, response includes `form`, `leads`, `total`, `page`, `perPage`. Without `formId`, leads list is empty (form selection required).

**Response:** `200 OK`

```json
{
  "form": { "id": "...", "name": "...", "schema_json": { "fields": [] } },
  "leads": [
    {
      "id": "lead-id",
      "formName": "Contact Us",
      "formId": "form-id",
      "data": { "email": "...", "name": "..." },
      "createdAt": "2025-01-15T12:00:00.000Z"
    }
  ],
  "total": 42,
  "page": 1,
  "perPage": 25
}
```

---

#### Get one lead

**Endpoint:** `GET https://leadformhub.com/api/leads/[leadId]`

**Query:** `?raw=1` – returns raw storage keys and sample data for debugging.

**Response:** `200 OK`

```json
{
  "id": "...",
  "formId": "...",
  "formName": "Contact Us",
  "data": { "email": "...", "name": "..." },
  "ipAddress": "...",
  "userAgent": "...",
  "createdAt": "2025-01-15T12:00:00.000Z"
}
```

---

#### Delete lead

**Endpoint:** `DELETE https://leadformhub.com/api/leads/[leadId]`

**Response:** `200 OK` – `{ "ok": true }`.

---

#### Export leads

**Endpoint:** `GET https://leadformhub.com/api/leads/export`

**Query parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `formId` | string | Optional; limit export to one form |
| `format` | string | `csv` (default) or `xlsx` / `excel` |

**Response:** File download (CSV or Excel). Headers include `Content-Disposition: attachment; filename="leads-YYYY-MM-DD.csv"` (or `.xlsx`).

---

## Support API (session or API key)

### Create support request (session)

**Endpoint:** `POST https://leadformhub.com/api/support-requests`

**Auth:** Session (logged-in user).

**Request body (JSON):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `category` | string | Yes | One of: `billing`, `bug`, `feature`, `general`, `other` |
| `subject` | string | Yes | Subject (1–200 chars) |
| `message` | string | Yes | Message (1–10000 chars) |

**Response:** `200 OK`

```json
{
  "request": {
    "id": "request-id",
    "ticketNumber": "#LFH-000001",
    "category": "general",
    "subject": "Need help",
    "status": "open",
    "createdAt": "2025-01-15T12:00:00.000Z"
  }
}
```

---

### List my support requests (session)

**Endpoint:** `GET https://leadformhub.com/api/support-requests`

**Response:** `200 OK`

```json
{
  "requests": [
    {
      "id": "...",
      "ticketNumber": "#LFH-000001",
      "category": "general",
      "subject": "...",
      "message": "...",
      "status": "open",
      "createdAt": "...",
      "replyCount": 2
    }
  ]
}
```

---

### Get ticket thread (session)

**Endpoint:** `GET https://leadformhub.com/api/support-requests/[requestId]/replies`

**Response:** `200 OK`

```json
{
  "request": {
    "id": "...",
    "ticketNumber": "#LFH-000001",
    "subject": "...",
    "message": "...",
    "status": "open",
    "createdAt": "..."
  },
  "replies": [
    { "id": "...", "body": "...", "isFromStaff": false, "createdAt": "..." },
    { "id": "...", "body": "...", "isFromStaff": true, "createdAt": "..." }
  ]
}
```

---

### Post reply as user (session)

**Endpoint:** `POST https://leadformhub.com/api/support-requests/[requestId]/replies`

**Request body (JSON):**

```json
{
  "message": "My follow-up message.",
  "fromSupport": false
}
```

Omit `fromSupport` or set to `false` when the logged-in user is replying.

**Response:** `200 OK` – `{ "reply": { "id": "...", "createdAt": "..." } }`.

---

### Post reply as support (API key)

**Endpoint:** `POST https://leadformhub.com/api/support-requests/[requestId]/replies`

**Auth:** `Authorization: Bearer <SUPPORT_API_KEY>` or `x-support-key: <SUPPORT_API_KEY>`.

**Request body (JSON):**

```json
{
  "message": "Thanks, we've updated your account.",
  "fromSupport": true
}
```

**Response:** `200 OK` – `{ "reply": { "id": "...", "createdAt": "..." } }`. The user receives an email with the reply.

---

### Update ticket status (session)

**Endpoint:** `PATCH https://leadformhub.com/api/support-requests/[requestId]`

**Request body (JSON):**

```json
{
  "status": "resolved"
}
```

`status` must be one of: `open`, `in_progress`, `resolved`.

**Response:** `200 OK` – `{ "ok": true, "status": "resolved" }`.

---

## Webhooks

### Inbound email webhook (support ticket replies)

When a user or support staff replies by email to a ticket, you can POST that email to LeadFormHub so the reply appears in the ticket thread in the dashboard.

**Endpoint:** `POST https://leadformhub.com/api/support-requests/inbound`

**Authentication:** Send your webhook secret using one of:

- Header: `x-inbound-secret: <INBOUND_EMAIL_SECRET>`
- Or: `Authorization: Bearer <INBOUND_EMAIL_SECRET>`

**Request body**

**JSON:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `from` | string | Yes | Sender email address |
| `subject` | string | Yes | Full subject; must contain ticket id (e.g. `#LFH-000006` or `Re: Ticket #LFH-000006: ...`) |
| `text` | string | No | Plain text body (or use `body-plain`, `plain`) |
| `html` | string | No | HTML body (used if `text` is empty) |

Alternative body keys accepted: `From`, `Subject`, `sender`; `body-plain`, `body-html`, `body_html`.

**Form-urlencoded / multipart:** `from`, `subject`, `text` (or `body-plain`), optional `html` (or `body-html`).

**Example (JSON):**

```bash
curl -X POST https://leadformhub.com/api/support-requests/inbound \
  -H "Content-Type: application/json" \
  -H "x-inbound-secret: YOUR_INBOUND_EMAIL_SECRET" \
  -d '{
    "from": "user@example.com",
    "subject": "Re: Ticket #LFH-000006: My issue",
    "text": "Here is my follow-up message."
  }'
```

**Success response:** `200 OK`

```json
{
  "ok": true,
  "ticketNumber": "#LFH-000006",
  "recorded": true
}
```

**Other responses:**

- `200 OK` with `ok: false` – e.g. no ticket number in subject, ticket not found, or empty body (reply not recorded).
- `400` – Missing `from`.
- `401` – Invalid or missing webhook secret.

**Behavior:**

- The subject must contain a ticket reference in the form `#LFH-000006` or `LFH-6` (normalized to 6-digit).
- If the sender email matches your configured support email (`SUPPORT_EMAIL` or `MAIL_SUPPORT_TO`), the reply is stored as **Support**; otherwise as **User**.
- Quoted/reply text in the body is stripped when possible; only the new message is stored.

**Setup:** Configure your email provider (SendGrid Inbound Parse, Mailgun, etc.) or automation (Zapier, Make) to POST incoming support emails to this URL with the secret. See [support-inbound-email.md](./support-inbound-email.md) for detailed setup options.

---

## Errors

- **401 Unauthorized** – Not logged in (session missing or invalid), or invalid webhook/API secret.
- **403 Forbidden** – Valid auth but not allowed (e.g. form limit, support key required for `fromSupport: true`).
- **404 Not Found** – Resource not found or not accessible (e.g. form private, wrong owner).
- **400 Bad Request** – Validation error; response body often includes `error` (and sometimes `details`).

Error responses are JSON, e.g.:

```json
{
  "error": "Form not found"
}
```

---

## Links

- **Product:** [https://leadformhub.com/](https://leadformhub.com/)
- **Support inbound email setup:** [docs/support-inbound-email.md](./support-inbound-email.md)
