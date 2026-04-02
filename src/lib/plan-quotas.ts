import type { PlanKey } from "@/lib/plans";
import { getEffectivePlanLimits } from "@/lib/super-admin-plan-pricing";

/** Monthly OTP cap from super-admin plan pricing (merged with code defaults). */
export async function getOtpLimitForPlan(plan: PlanKey): Promise<number | null> {
  const { otpLimit } = await getEffectivePlanLimits(plan);
  return otpLimit;
}
