/**
 * One-time backfill: set emailVerifiedAt = createdAt for all users where
 * emailVerifiedAt is null. This restores login access for existing users
 * who signed up before email verification was required.
 *
 * Usage: npx tsx scripts/backfill-email-verified.ts
 * Or:    npm run script:backfill-email-verified
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { emailVerifiedAt: null },
    select: { id: true, createdAt: true },
  });
  for (const u of users) {
    await prisma.user.update({
      where: { id: u.id },
      data: { emailVerifiedAt: u.createdAt },
    });
  }
  console.log(`Updated ${users.length} user(s) to treat them as email-verified.`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
