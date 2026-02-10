import { prisma } from "@/lib/db";
import { PLAN_LIMITS, type PlanKey } from "@/lib/plans";

/** OTP limit from DB (updated at deploy); falls back to PLAN_LIMITS in code. */
export async function getOtpLimitForPlan(plan: PlanKey): Promise<number | null> {
  const record = await prisma.plan.findUnique({
    where: { name: plan },
    select: { otpLimit: true },
  });
  if (record?.otpLimit != null) return record.otpLimit;
  return PLAN_LIMITS[plan]?.otpLimit ?? null;
}
