import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.plan.upsert({
    where: { name: "free" },
    create: { name: "free", maxForms: 3, otpLimit: null },
    update: {},
  });
  await prisma.plan.upsert({
    where: { name: "pro" },
    create: { name: "pro", maxForms: 9999, otpLimit: 500 },
    update: {},
  });
  await prisma.plan.upsert({
    where: { name: "business" },
    create: { name: "business", maxForms: 9999, otpLimit: 5000 },
    update: {},
  });
  console.log("Plans seeded");

  // Optional: create a dev user after DB reset so you can log in without signup (dev only).
  const seedUserEmail = process.env.SEED_USER_EMAIL;
  const seedUserPassword = process.env.SEED_USER_PASSWORD;
  if (seedUserEmail && seedUserPassword && process.env.NODE_ENV !== "production") {
    const hashed = await bcrypt.hash(seedUserPassword, 10);
    const username = seedUserEmail.replace(/@.*/, "").replace(/[^a-z0-9]/gi, "").toLowerCase() || "devuser";
    await prisma.user.upsert({
      where: { email: seedUserEmail },
      create: {
        name: "Dev User",
        username,
        email: seedUserEmail,
        password: hashed,
        plan: "free",
      },
      update: {},
    });
    console.log("Dev user seeded (email:", seedUserEmail + ")");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
