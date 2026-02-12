# Email template links – audit and update report

This report documents all email templates, the links they use, where those URLs are built, and the changes made to centralize base URL and add missing links.

---

## Base URL (single source of truth)

- **Source:** `getBaseUrlForEmail()` in [src/lib/app-url.ts](../src/lib/app-url.ts)
- **Env:** `APP_URL` (e.g. `https://leadformhub.com`). No trailing slash.
- **Fallbacks:** If `APP_URL` is unset: in development uses `NEXTAUTH_URL` or `http://localhost:3000`; otherwise `https://leadformhub.com`.

All email action links (verify, reset, welcome, delete, email change, new lead, ticket confirmation) now use this single function so behaviour is consistent across environments.

---

## Template-by-template link inventory

| Template | Purpose | Link(s) | Where URL is built | Path / target |
|----------|---------|---------|---------------------|----------------|
| **Verification** | Verify email after signup | Verify button + fallback plain link | [auth.service.ts](../src/services/auth.service.ts): caller passes `baseUrl` from `getBaseUrlForEmail()` | `{baseUrl}/api/auth/verify-email?token=...` |
| **Welcome** | Post signup / post verify | "Go to dashboard" button | [email.ts](../src/lib/email.ts) via `getBaseUrlForEmail()` | `{baseUrl}/login` |
| **Password reset** | Forgot password | "Reset password" button | [auth.service.ts](../src/services/auth.service.ts) | `{getBaseUrlForEmail()}/reset-password?token=...` |
| **Delete account** | Confirm account deletion | "Delete my account" button | [auth.service.ts](../src/services/auth.service.ts) | `{getBaseUrlForEmail()}/confirm-delete?token=...` |
| **Email change** | Confirm new email address | "Confirm new email" button | [auth.service.ts](../src/services/auth.service.ts) | `{getBaseUrlForEmail()}/api/auth/verify-email-change?token=...` |
| **OTP** | One-time code for form submission | None | — | — |
| **New lead notification** | Notify form owner of new submission | "View leads in dashboard" button + mailto (lead email) | [email.ts](../src/lib/email.ts) via `getBaseUrlForEmail()`; optional `username` from [leads/submit/route.ts](../src/app/api/leads/submit/route.ts) | `{baseUrl}/{username}/dashboard` or `{baseUrl}/login` if no username |
| **Support (internal / public form / reply / user reply)** | Support flow | mailto only | — | No app URLs |
| **Ticket confirmation** | Confirm support request received | "Open support page" button | [email.ts](../src/lib/email.ts) via `getBaseUrlForEmail()` | `{baseUrl}/support` |

---

## Changes made

1. **Centralized base URL**
   - Added [src/lib/app-url.ts](../src/lib/app-url.ts) with `getBaseUrlForEmail()`.
   - [src/services/auth.service.ts](../src/services/auth.service.ts) now imports and re-exports `getBaseUrlForEmail` from `@/lib/app-url` (all verify/reset/delete/email-change links unchanged; they already used this logic).
   - [src/lib/email.ts](../src/lib/email.ts) imports `getBaseUrlForEmail` from `@/lib/app-url`. Welcome email no longer reads `APP_URL` directly; it uses `getBaseUrlForEmail() + "/login"` so it shares the same base URL and fallbacks as other emails.

2. **New lead notification**
   - Payload for `sendNewLeadNotification` now accepts optional `username`.
   - [src/app/api/leads/submit/route.ts](../src/app/api/leads/submit/route.ts) passes `form.user.username` when sending the notification.
   - Template includes a "View leads in dashboard" button: link is `{baseUrl}/{username}/dashboard` when username is present, otherwise `{baseUrl}/login`.

3. **Ticket confirmation**
   - `buildTicketConfirmationEmailHtml` now includes an "Open support page" button linking to `{getBaseUrlForEmail()}/support`.

---

## Checklist

- Verification email: uses base URL from caller (signup/resend use `getBaseUrlForEmail()`).
- Welcome email: uses `getBaseUrlForEmail()/login`.
- Password reset: uses `getBaseUrlForEmail()/reset-password?token=...`.
- Delete account: uses `getBaseUrlForEmail()/confirm-delete?token=...`.
- Email change: uses `getBaseUrlForEmail()/api/auth/verify-email-change?token=...`.
- New lead: uses `getBaseUrlForEmail()` for dashboard or login link.
- Ticket confirmation: uses `getBaseUrlForEmail()/support`.

No `.env` changes are required if `APP_URL` is already set (e.g. `https://leadformhub.com`).
