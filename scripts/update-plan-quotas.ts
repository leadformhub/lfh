/**
 * Update Pro and Business plan OTP limits in the database.
 * Keeps DB in sync with PLAN_LIMITS in src/lib/plans.ts.
 *
 * Usage: npx tsx scripts/update-plan-quotas.ts
 * Or: npm run script:update-plan-quotas
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const QUOTAS = { pro: 100, business: 1000 } as const;

async function main() {
  for (const [name, otpLimit] of Object.entries(QUOTAS)) {
    await prisma.plan.updateMany({
      where: { name },
      data: { otpLimit },
    });
  }
  console.log("Plan quotas updated: pro=100 OTP/month, business=1000 OTP/month");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
