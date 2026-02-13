/**
 * Build-time check: ensure DATABASE_URL is set and not a placeholder.
 * Run before prisma db push in CI/Vercel so the error message is clear.
 *
 * Usage: npx tsx scripts/check-db-url.ts
 */

const url = process.env.DATABASE_URL;

if (!url || typeof url !== "string" || !url.trim()) {
  console.error(
    "\n\u001b[31mDATABASE_URL is not set.\u001b[0m\n\n" +
      "On Vercel: Project → Settings → Environment Variables → add DATABASE_URL with your real Supabase (or Postgres) connection string.\n" +
      "Use the pooler URL from Supabase (e.g. Session mode, port 6543). Replace PROJECT_REF, REGION, and [YOUR-PASSWORD] with your values.\n"
  );
  process.exit(1);
}

// Literal placeholders from .env.example (real Supabase URLs have actual region/ref/password)
const placeholders = ["REGION", "[YOUR-PASSWORD]", "PROJECT_REF"];
const hasPlaceholder = placeholders.some((p) => url.includes(p));

if (hasPlaceholder) {
  console.error(
    "\n\u001b[31mDATABASE_URL still contains placeholder values.\u001b[0m\n\n" +
      "Replace REGION (e.g. us-east-1), PROJECT_REF, and [YOUR-PASSWORD] with your real Supabase project details.\n" +
      "Get the connection string from: Supabase Dashboard → Project Settings → Database → Connection string (URI).\n" +
      "On Vercel, set DATABASE_URL (and DIRECT_URL) in Project → Settings → Environment Variables.\n"
  );
  process.exit(1);
}

process.exit(0);
