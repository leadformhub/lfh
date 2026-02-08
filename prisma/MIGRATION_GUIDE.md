# Syncing the database to the new schema (dynamic forms + leads)

## Lead formId optional (keep leads when form is deleted)

The `Lead` model has `formId` optional and `onDelete: SetNull` on the form relation. When a form is deleted, its leads are kept and `form_id` is set to null; the UI shows "Form Deleted" for those leads.

To apply this change to your database, run:

```bash
npx prisma db push
```

Or create and run a migration. After that, run `npx prisma generate` if needed.

---

Your `schema.prisma` uses the **new** structure (forms with `schema_json`, leads with `data_json` / `created_at`, no `form_fields` table). The database is still on the **old** structure, so Prisma reports "drift."

## Option 1: Push schema (dev, OK to lose data) — recommended for local dev

This updates the database to match `schema.prisma` without using migration history. **Existing data in `form`, `form_fields`, and `lead` may be lost or altered.**

```bash
npx prisma db push
```

Then:

1. Restart the Next.js dev server (or run `npm run dev` again).
2. If the error persists, clear the Next cache and restart:
   ```bash
   rm -r .next
   npm run dev
   ```
   On Windows PowerShell: `Remove-Item -Recurse -Force .next; npm run dev`

## Option 2: Reset database and create initial migration

Use this if you want a clean migration history and don’t need to keep current data.

1. **Reset the database** (drops all data):
   ```bash
   npx prisma migrate reset --force
   ```
   If that fails (e.g. no migrations yet), create the first migration and apply it on an empty DB:

2. **Create and apply the first migration:**
   ```bash
   npx prisma migrate dev --name init
   ```
   If you still get "drift" because the DB already has tables, run **Option 1** (`npx prisma db push`) once so the DB matches the schema, then run:
   ```bash
   npx prisma migrate dev --name init
   ```
   Prisma will create a migration that matches the current DB state (baseline).

## After the DB is in sync

- `prisma generate` is already done, so the client is up to date.
- Restart the dev server and, if needed, delete the `.next` folder so the app uses the layout that counts leads via raw SQL and the new Prisma models.
