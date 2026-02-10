/**
 * One-time sync: set User.plan from latest captured Payment for any user
 * who paid but is still on a lower plan (e.g. paid for pro but plan stayed free).
 *
 * Usage: npx tsx scripts/sync-plan-from-payments.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PLAN_RANK: Record<string, number> = { free: 0, pro: 1, business: 2 };

async function main() {
  const captured = await prisma.payment.findMany({
    where: { status: "captured" },
    orderBy: { createdAt: "desc" },
    select: { userId: true, plan: true, createdAt: true },
  });
  const latestByUser = new Map<string, { plan: string; createdAt: Date }>();
  for (const p of captured) {
    if (!latestByUser.has(p.userId)) {
      latestByUser.set(p.userId, { plan: p.plan, createdAt: p.createdAt });
    }
  }

  let updated = 0;
  for (const [userId, { plan: paidPlan }] of latestByUser) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, plan: true, username: true },
    });
    if (!user) continue;
    const currentRank = PLAN_RANK[user.plan] ?? 0;
    const paidRank = PLAN_RANK[paidPlan] ?? 0;
    if (paidRank <= currentRank) continue;

    await prisma.user.update({
      where: { id: userId },
      data: { plan: paidPlan as "pro" | "business" },
    });
    const planRecord = await prisma.plan.findFirst({ where: { name: paidPlan } });
    if (planRecord) {
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      await prisma.subscription.upsert({
        where: { userId },
        create: { userId, planId: planRecord.id, monthStart, otpUsedThisMonth: 0 },
        update: { planId: planRecord.id, monthStart, otpUsedThisMonth: 0 },
      });
    }
    updated++;
    console.log(`Updated ${user.username} to ${paidPlan}`);
  }
  console.log(`Synced plan for ${updated} user(s).`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
