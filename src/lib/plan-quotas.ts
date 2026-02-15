import { prisma } from "@/lib/db";
import { PLAN_LIMITS, type PlanKey } from "@/lib/plans";

/** OTP limit: free uses static (no DB); pro/business from DB with code fallback. */
export async function getOtpLimitForPlan(plan: PlanKey): Promise<number | null> {
  if (plan === "free") return PLAN_LIMITS.free.otpLimit;
  const record = await prisma.plan.findUnique({
    where: { name: plan },
    select: { otpLimit: true },
  });
  if (record?.otpLimit != null) return record.otpLimit;
  return PLAN_LIMITS[plan]?.otpLimit ?? null;
}
