/**
 * Create a user with the business plan (or upgrade an existing user to business).
 *
 * Usage:
 *   npx tsx scripts/create-business-user.ts
 *   npx tsx scripts/create-business-user.ts --email=user@example.com --password=secret
 *
 * Or set env vars:
 *   BUSINESS_USER_EMAIL=user@example.com BUSINESS_USER_PASSWORD=secret npx tsx scripts/create-business-user.ts
 *
 * If the user already exists (by email), their plan is updated to business.
 */

import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function getArg(name: string): string | undefined {
  const prefix = `--${name}=`;
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith(prefix)) return arg.slice(prefix.length).trim();
  }
  return undefined;
}

async function main() {
  const email =
    getArg("email") ?? process.env.BUSINESS_USER_EMAIL ?? process.env.SEED_USER_EMAIL;
  const password =
    getArg("password") ?? process.env.BUSINESS_USER_PASSWORD ?? process.env.SEED_USER_PASSWORD;

  if (!email || !password) {
    console.error(
      "Usage: npx tsx scripts/create-business-user.ts [--email=...] [--password=...]"
    );
    console.error(
      "Or set BUSINESS_USER_EMAIL and BUSINESS_USER_PASSWORD (or SEED_USER_EMAIL / SEED_USER_PASSWORD)."
    );
    process.exit(1);
  }

  const username =
    email
      .replace(/@.*/, "")
      .replace(/[^a-z0-9]/gi, "")
      .toLowerCase() || "businessuser";

  const hashed = await bcrypt.hash(password, 10);

  const baseName = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ").trim() || "Business User";
  const name = baseName ? baseName.charAt(0).toUpperCase() + baseName.slice(1) : "Business User";

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      name,
      username,
      email,
      password: hashed,
      plan: "business",
    },
    update: { plan: "business" },
  });

  console.log("User with business plan ready:");
  console.log("  Email:", user.email);
  console.log("  Username:", user.username);
  console.log("  Plan:", user.plan);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
