import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { getOtpUsageForUser } from "@/services/otp.service";
import { getOtpLimitForPlan } from "@/lib/plan-quotas";
import { getPlanLimits, type PlanKey } from "@/lib/plans";

export type DashboardPlanQuota = {
  plan: PlanKey;
  formsUsed: number;
  formsLimit: number | null; // null = unlimited (Infinity not JSON-serializable)
  leadsUsed: number;
  leadsLimit: number | null;
  otpUsed: number;
  otpLimit: number | null;
  /** Leads submitted today (for dashboard page). */
  leadsToday: number;
  /** Total leads all-time (for dashboard page). */
  totalSubmissions: number;
};

async function fetchDashboardPlanQuota(userId: string, planKey: PlanKey): Promise<DashboardPlanQuota> {
  const limits = getPlanLimits(planKey);
  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);

  const [formsCount, leadsThisMonth, leadsToday, totalSubmissions, otpUsage, otpLimit] = await Promise.all([
    prisma.form.count({ where: { userId } }),
    prisma.lead.count({
      where: { userId, createdAt: { gte: startOfMonth } },
    }),
    prisma.lead.count({
      where: { userId, createdAt: { gte: startOfToday } },
    }),
    prisma.lead.count({ where: { userId } }),
    getOtpUsageForUser(userId),
    getOtpLimitForPlan(planKey),
  ]);

  return {
    plan: planKey,
    formsUsed: formsCount,
    formsLimit: limits.maxForms === Infinity ? null : limits.maxForms,
    leadsUsed: leadsThisMonth,
    leadsLimit: limits.maxLeadsPerMonth,
    otpUsed: otpUsage.used,
    otpLimit,
    leadsToday,
    totalSubmissions,
  };
}

/** Short-lived cross-request cache (60s) so repeated navigations avoid DB hits. */
const getQuotaCrossRequest = unstable_cache(
  (userId: string, planKey: PlanKey) => fetchDashboardPlanQuota(userId, planKey),
  ["dashboard-plan-quota"],
  { revalidate: 60 }
);

/** Cached per-request so layout and dashboard page share one fetch; also uses 60s cross-request cache. */
export const getDashboardPlanQuotaCached = cache(
  async (userId: string, planKey: PlanKey): Promise<DashboardPlanQuota> => {
    return getQuotaCrossRequest(userId, planKey);
  }
);
