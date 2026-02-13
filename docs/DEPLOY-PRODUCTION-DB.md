# Deploy with production database

## 1. Production MySQL

Create a MySQL 8 database (any provider):

- **PlanetScale** – `pscale database create leadformhub` then use the connection string
- **Railway** – create MySQL service, copy `DATABASE_URL`
- **AWS RDS** – create MySQL instance, allow your app’s IP/security group, copy endpoint
- **DigitalOcean** – Managed Database → MySQL
- **Hostinger / cPanel** – create MySQL DB and user, note host, port, database name, user, password

Connection format:

```txt
mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
```

For PlanetScale you may need `?sslaccept=strict` or the URL they provide. For RDS/Hostinger use the host and port they give you.

## 2. Set production env

On your hosting (Vercel, Railway, etc.) set:

```txt
DATABASE_URL="mysql://..."
```

Set all other required vars from `.env.example` (e.g. `JWT_SECRET`, `GOOGLE_CLIENT_*`, `MAIL_*`, `RAZORPAY_*`, etc.).

## 3. Apply schema and seed (first time)

**Option A – Let the build do it (recommended)**  
Your `npm run build` already runs:

```txt
prisma generate && prisma db push && tsx scripts/update-plan-quotas.ts && next build
```

So on **first deploy**, set `DATABASE_URL` in the hosting dashboard and deploy. The build will run `prisma generate` and `prisma db push` against the production DB and create/update tables.

- **Vercel:** `vercel.json` sets `buildCommand` to `npm run build`, so every production deploy runs the full script (Prisma + Next.js build).
- **Other platforms:** Use **Build Command** = `npm run build` so Prisma runs before the Next.js build.

**Option B – Run from your machine once**  
If you prefer to push the schema before deploying the app:

```bash
# Use production URL only for this command (don’t overwrite .env)
set DATABASE_URL=mysql://user:pass@prod-host:3306/leadformhub
npx prisma db push
npm run db:seed
```

Then deploy the app with the same `DATABASE_URL` set in production.

## 4. Seed plans (required once)

Plans (free, pro, business) must exist. Either:

- Run seed during deploy: in your hosting, add a build step or run after deploy:  
  `npx prisma db push && tsx prisma/seed.ts`  
  (with `DATABASE_URL` set), or  
- Run locally once pointing at production:

  ```bash
  set DATABASE_URL=mysql://...
  npm run db:seed
  ```

Seed is idempotent (upserts), so safe to run again.

## 5. Later deploys

- Keep `DATABASE_URL` set in production.
- Each deploy runs `prisma generate && prisma db push` in `npm run build`, so schema changes are applied automatically.
- No need to run seed again unless you change `prisma/seed.ts`.

## Faster Vercel builds (optional)

If deploys are slow because `prisma db push` and plan-quota updates run on every build, set in Vercel:

```text
SKIP_DB_PUSH=1
```

Then the build skips database push and plan-quota updates; it only runs `prisma generate` and `next build`. Use this for routine deploys when the schema hasn’t changed. When you change the Prisma schema, either:

- Remove `SKIP_DB_PUSH` (or set it to `0`) and deploy once, or  
- Run `npx prisma db push` locally with `DATABASE_URL` pointing at production, then deploy with `SKIP_DB_PUSH=1`.

## PostgreSQL (Supabase / Neon) – avoid "max clients reached"

If you use **PostgreSQL** with a connection pooler (e.g. Supabase pooler, Neon) and deploy to **serverless** (Vercel, etc.), you may see:

```text
FATAL: MaxClientsInSessionMode: max clients reached - in Session mode max clients are limited to pool_size
```

**Fix:** Add `connection_limit=1` to your **DATABASE_URL** so each serverless instance uses at most one connection. Example:

```text
DATABASE_URL="postgresql://...@...pooler....:6543/postgres?pgbouncer=true&connection_limit=1"
```

Keep **DIRECT_URL** unchanged (no `connection_limit`); use it for migrations. See `.env.example` for the full format.

## Summary

| Step | Action |
|------|--------|
| 1 | Create MySQL DB and get `DATABASE_URL` |
| 2 | Set `DATABASE_URL` (and other env) in hosting |
| 3 | Deploy (build runs `prisma db push`) |
| 4 | Run `npm run db:seed` once (with prod `DATABASE_URL`) if plans aren’t there yet |
