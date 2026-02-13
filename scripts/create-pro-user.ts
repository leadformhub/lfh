/**
 * One-off script: create a Pro user in the database (localhost).
 * Run: npx tsx scripts/create-pro-user.ts
 * Requires DATABASE_URL in .env.
 */

import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/db";

const SALT_ROUNDS = 12;

const PRO_EMAIL = "pro@leadformhub.local";
const PRO_USERNAME = "prouser";
const PRO_PASSWORD = "ProUser123!";
const PRO_NAME = "Pro User";

async function main() {
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email: PRO_EMAIL }, { username: PRO_USERNAME }],
    },
  });
  if (existing) {
    console.log("Pro user already exists:", existing.email, "username:", existing.username);
    console.log("Login: email =", existing.email, "| password = (use the one you set when creating, or reset via app)");
    process.exit(0);
    return;
  }

  const hashed = await bcrypt.hash(PRO_PASSWORD, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      name: PRO_NAME,
      username: PRO_USERNAME,
      email: PRO_EMAIL.toLowerCase(),
      password: hashed,
      authProvider: "email",
      plan: "pro",
      status: "active",
      emailVerifiedAt: new Date(),
    },
  });

  console.log("Pro user created successfully.");
  console.log("");
  console.log("--- Login credentials (localhost) ---");
  console.log("Email:    ", user.email);
  console.log("Username: ", user.username);
  console.log("Password: ", PRO_PASSWORD);
  console.log("------------------------------------");
  console.log("");
  console.log("Dashboard (after login): http://localhost:3000/" + user.username);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
