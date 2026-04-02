import type { PlanKey } from "@/lib/plans";
import { getEffectivePlanLimits } from "./resolver";

export async function canCreateFormWithEffectiveLimits(plan: PlanKey, currentCount: number): Promise<boolean> {
  const { maxForms } = await getEffectivePlanLimits(plan);
  return currentCount < maxForms;
}

export async function getLeadsLimitEffective(plan: PlanKey): Promise<number | null> {
  const { maxLeadsPerMonth } = await getEffectivePlanLimits(plan);
  return maxLeadsPerMonth;
}

export async function hasLeadsRemainingEffective(
  plan: PlanKey,
  leadsUsedThisMonth: number,
): Promise<boolean> {
  const limit = await getLeadsLimitEffective(plan);
  if (limit === null) return true;
  return leadsUsedThisMonth < limit;
}

export async function getMaxTeamMembersEffective(plan: PlanKey): Promise<number> {
  const { maxTeamMembers } = await getEffectivePlanLimits(plan);
  return maxTeamMembers;
}
