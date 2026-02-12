# Email template previews

These are **sample email templates for preview only**. They are not wired into the app.

## How to preview

Open either HTML file in your browser (double-click or drag into Chrome/Edge/Firefox):

- **sample-lead-notification-preview.html** — New lead notification (form owner)
- **sample-verification-preview.html** — Email verification

## Design notes

- **Layout:** Table-based, inline styles (email-client safe).
- **Colors:** Neutral grays (`#18181b`, `#3f3f46`, `#71717a`, `#a1a1aa`) with blue accent `#2563eb` and light backgrounds (`#f4f4f5`, `#fafafa`, `#f0f0f2`).
- **Typography:** System font stack; clear hierarchy with size and weight.
- **Cards:** Rounded corners (16px outer, 8–12px inner), subtle border and shadow.
- **CTAs:** Solid blue button, rounded, no gradient.

To use this design in the app, copy the structure and inline styles into the corresponding builders in `src/lib/email.ts`.
