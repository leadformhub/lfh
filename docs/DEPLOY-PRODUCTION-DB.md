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

## Summary

| Step | Action |
|------|--------|
| 1 | Create MySQL DB and get `DATABASE_URL` |
| 2 | Set `DATABASE_URL` (and other env) in hosting |
| 3 | Deploy (build runs `prisma db push`) |
| 4 | Run `npm run db:seed` once (with prod `DATABASE_URL`) if plans aren’t there yet |
