# Error logs summary

**Checked:** Terminal output, `.next/dev/logs/next-development.log`, and codebase.

---

## 1. Hydration error (fixed)

**Log:** `Browser ERROR uncaughtError: Error: Hydration failed because the server rendered text didn't match the client.`

**Cause:** In **LeadsTable**, `submittedAt` was rendered with `new Date(l.submittedAt).toLocaleString()`. Server and client use different locales (e.g. server `5/2/2026, 6:59:46 pm` vs client `2/5/2026, 6:59:46 PM`), so React reported a hydration mismatch.

**Fix:** Use a fixed locale and options so server and client output match:
- `new Date(l.submittedAt).toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" })`
- Applied in **LeadsTable** (desktop table and mobile card).
- **Dashboard** `formatRelativeTime` fallback updated to `date.toLocaleDateString("en-US")` for consistency.

---

## 2. Middleware deprecation (warning only)

**Log:** `The "middleware" file convention is deprecated. Please use "proxy" instead.`

**Cause:** Next.js 16 deprecates the `middleware` file in favor of a new “proxy” convention.

**Status:** Warning only; app still runs. You can migrate to the new convention when ready (see Next.js docs).

---

## 3. Server / API

- **HTTP:** All sampled requests returned **200** (no 404/500 in the checked logs).
- **Prisma:** Queries logged; no DB errors in the sampled output.
- **POST /api/leads/submit:** Succeeds (200) with lead insert and analytics event.

---

## 4. Build note

- `npm run build` can fail with **EPERM** (rename of Prisma query engine) if the dev server is running and locking the file. Stop the dev server before running a full build.
