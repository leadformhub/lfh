# Recording email replies in the support ticket thread

When a user (or support) replies by email, that reply does not automatically appear in the dashboard thread. To have email replies **recorded** and shown at [Your Dashboard → Raise Request → View thread], you need to send those emails to the app’s **inbound webhook**.

## How it works

1. **User** or **support** sends an email in the ticket thread (e.g. reply to “Ticket #LFH-000006: …”).
2. That email is received at your **support inbox** (or a dedicated address you use for tickets).
3. Your email provider or an automation (Zapier, Make, etc.) **POSTs** the email to the app’s inbound URL.
4. The app parses the subject (finds the ticket number), stores the reply in the database, and marks it as from **user** or **support** based on the sender.
5. The reply appears in the **thread** on the Raise Request page.

## Setup

### 1. Set the webhook secret

In `.env`:

```env
INBOUND_EMAIL_SECRET=your-long-random-secret-here
```

Use a long random string (e.g. 32+ characters). You’ll use the **same value** when configuring the webhook caller.

### 2. Webhook endpoint

- **URL:** `https://your-domain.com/api/support-requests/inbound`  
  (Local: `http://localhost:3000/api/support-requests/inbound` for testing.)
- **Method:** `POST`
- **Auth:** Send the secret in one of these ways:
  - Header: `x-inbound-secret: <INBOUND_EMAIL_SECRET>`
  - Or: `Authorization: Bearer <INBOUND_EMAIL_SECRET>`

### 3. Request body

**JSON:**

```json
{
  "from": "user@example.com",
  "subject": "Re: Ticket #LFH-000006: My issue",
  "text": "Here is my follow-up message."
}
```

Optional: `html` – used if `text` is empty.

**Form (e.g. SendGrid/Mailgun style):**

- `from` – sender email
- `subject` – full subject (must contain ticket id, e.g. `Ticket #LFH-000006` or `Re: Ticket #LFH-000006: …`)
- `text` or `body-plain` – plain text body

The subject **must** contain a ticket number in the form `#LFH-000006` (or `LFH-6`). The body is stored as the reply; quoted/previous messages are stripped when possible.

### 4. Who is “support” vs “user”

- If the **From** address matches **SUPPORT_EMAIL** (or MAIL_SUPPORT_TO), the reply is stored as **Support**.
- Otherwise it is stored as **You** (the user who opened the ticket).

So: emails **to** your support inbox that you forward to this webhook will usually be **user** replies. If support staff send from SUPPORT_EMAIL (e.g. by replying and then forwarding that reply to the webhook), those can be stored as **Support**.

## Ways to connect your inbox

### Option A: SendGrid Inbound Parse

1. In SendGrid go to **Settings → Inbound Parse**.
2. Add a host/URL that points to your app (or a proxy that forwards to your app).
3. Set the destination URL to: `https://your-domain.com/api/support-requests/inbound`.
4. SendGrid will POST in a specific format; the app accepts `from`, `subject`, `text`, and `body-plain`-style fields. If your provider uses different names, you may need a small proxy that maps them to `from`, `subject`, `text` and adds `x-inbound-secret`.

### Option B: Mailgun Routes

1. In Mailgun, add a **Route** that matches emails to your support address.
2. Set the action to forward to: `https://your-domain.com/api/support-requests/inbound` with the body and the `x-inbound-secret` header (if Mailgun supports custom headers; otherwise use a serverless function in between).

### Option C: Zapier / Make (Integromat)

1. Trigger: **Email by Zapier** or **Gmail** – “New Email” in the folder/inbox that receives ticket replies.
2. Action: **Webhooks by Zapier** – POST to `https://your-domain.com/api/support-requests/inbound`.
3. Map: From → `from`, Subject → `subject`, Body (plain) → `text`.
4. Add a header: `x-inbound-secret` = your `INBOUND_EMAIL_SECRET`.

### Option D: Manual test (curl)

```bash
curl -X POST https://your-domain.com/api/support-requests/inbound \
  -H "Content-Type: application/json" \
  -H "x-inbound-secret: YOUR_INBOUND_EMAIL_SECRET" \
  -d '{"from":"user@example.com","subject":"Re: Ticket #LFH-000006: Test","text":"This is my reply."}'
```

Replace the ticket number with a real one and use an email that matches the ticket owner if you want it to show as “You”.

## Local testing

1. Set `INBOUND_EMAIL_SECRET` in `.env`.
2. Run the app (e.g. `npm run dev`).
3. Use curl (or Postman) to POST to `http://localhost:3000/api/support-requests/inbound` with the same headers and body as above.
4. Open the ticket’s thread on the Raise Request page; the new reply should appear after refresh (or when you “View thread” again).

## Replies that won’t be recorded

- **Support replying by email to the user:** that email goes to the **user’s** inbox. The app does not read the user’s mailbox, so that reply is **not** recorded unless:
  - Support also posts the same reply via the **dashboard/API** (with `SUPPORT_API_KEY`), or
  - Support (or an automation) **forwards** that sent reply to the inbound webhook with the correct ticket subject and `from` = support address.

So for support replies to appear in the thread, either use the **Raise Request / API** to post the reply, or forward the reply email to the inbound URL with the right subject and headers.
