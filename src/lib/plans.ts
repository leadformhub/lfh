export type PlanKey = "free" | "pro" | "business";

export const PLAN_LIMITS: Record<
  PlanKey,
  { maxForms: number; maxLeadsPerMonth: number | null; otpLimit: number | null; maxTeamMembers: number }
> = {
  free: { maxForms: 3, maxLeadsPerMonth: 50, otpLimit: null, maxTeamMembers: 0 },
  pro: { maxForms: Infinity, maxLeadsPerMonth: null, otpLimit: 100, maxTeamMembers: 3 },
  business: { maxForms: Infinity, maxLeadsPerMonth: null, otpLimit: 1000, maxTeamMembers: Infinity },
};

export function getMaxTeamMembers(plan: PlanKey): number {
  return getPlanLimits(plan).maxTeamMembers;
}

export function getPlanLimits(plan: PlanKey) {
  return PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;
}

export function canCreateForm(plan: PlanKey, currentCount: number): boolean {
  const { maxForms } = getPlanLimits(plan);
  return currentCount < maxForms;
}

export function canUseOtp(plan: PlanKey): boolean {
  return getPlanLimits(plan).otpLimit !== null;
}

export function hasOtpRemaining(plan: PlanKey, usedThisMonth: number): boolean {
  const { otpLimit } = getPlanLimits(plan);
  if (otpLimit === null) return false;
  return usedThisMonth < otpLimit;
}

export function getLeadsLimit(plan: PlanKey): number | null {
  return getPlanLimits(plan).maxLeadsPerMonth;
}

export function hasLeadsRemaining(plan: PlanKey, leadsUsedThisMonth: number): boolean {
  const limit = getLeadsLimit(plan);
  if (limit === null) return true;
  return leadsUsedThisMonth < limit;
}
