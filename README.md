# LeadFormHub

Multi-tenant SaaS for lead capture forms with optional mobile OTP verification.

**Domain:** https://leadformhub.com  
**Routes:** `https://leadformhub.com/{username}/dashboard`, `/forms`, `/leads`, etc.

**Documentation:** [API & Webhooks](docs/API-AND-WEBHOOKS.md) — endpoints, auth, and inbound email webhook for support tickets.

## Tech stack

- **Next.js 16** (App Router)
- **Node.js** API routes
- **MySQL** + **Prisma ORM**
- **Tailwind CSS**
- **JWT** session (httpOnly cookie)
- **Fast2SMS** for mobile OTP (server-only)
- **Razorpay** for plan upgrades (Pro / Business)

## Setup

1. **Clone and install**
   ```bash
   npm install
   ```

2. **Environment**
   - Copy `.env.example` to `.env`
   - Set `DATABASE_URL` (MySQL), `JWT_SECRET`, and optionally `FAST2SMS_API_KEY`, `RESEND_API_KEY`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`

3. **Database**
   ```bash
   npx prisma db push
   npm run db:seed
   ```

4. **Run**
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` – development server
- `npm run build` – production build (includes `prisma generate` and `prisma db push`)
- `npm run start` – start production server
- `npm run db:push` – push Prisma schema to DB
- `npm run db:migrate` – run migrations
- `npm run db:seed` – seed plans (free, pro, business)

**Production DB:** See [docs/DEPLOY-PRODUCTION-DB.md](docs/DEPLOY-PRODUCTION-DB.md) for deploying with a production MySQL database.

## Architecture

- **`/app`** – App Router: `(auth)`, `(dashboard)/[username]`, `api`
- **`/services`** – auth, forms, leads, otp, analytics (no direct DB in UI)
- **`/lib`** – db, jwt, plans, sms, email

## Features

- **Auth:** Signup, login, email verification, forgot/reset password, logout
- **Dashboard:** Widgets (forms, submissions, automations), plan badge
- **Forms:** List, create, design (drag-and-drop fields), embed, public `/f/[slug]`
- **Leads:** Table, search, filter by form, export CSV, 25 per page
- **OTP:** Fast2SMS, 5 min expiry, max 3 per phone per hour; only when `mobileOtpEnabled`
- **Plans:** Free (3 forms, no OTP), Pro (unlimited forms, 500 OTP/mo), Business (5000 OTP/mo)
- **Payments:** Razorpay checkout in Settings; one-time upgrade to Pro (₹499) or Business (₹1,999); session updated after verification
- **SEO:** title, meta description, canonical, OpenGraph, sitemap.xml, robots.txt

## Security

- Passwords hashed with bcrypt
- JWT in httpOnly cookie
- Fast2SMS API key server-only
- Prisma parameterized queries (SQL injection safe)
- File upload and input validation in forms

## Deploy

- **Vercel:** Connect repo, set env vars, use MySQL (e.g. PlanetScale, Railway).
- **VPS:** `npm run build && npm run start`, reverse proxy (e.g. Nginx) to Node, MySQL on same host or managed DB.

Ensure `DATABASE_URL`, `JWT_SECRET`, and (optional) `FAST2SMS_API_KEY`, `RESEND_API_KEY`, `RAZORPAY_KEY_ID`, and `RAZORPAY_KEY_SECRET` are set in production. Run `npx prisma db push` after adding the `Payment` model if you haven’t migrated yet.
