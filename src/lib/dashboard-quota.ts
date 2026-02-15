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

/** MySQL COUNT(*) can come back as bigint; we use Number() so fallback can be number (ES2017-safe). */
type QuotaCountsRow = {
  formsCount: number | bigint;
  leadsThisMonth: number | bigint;
  leadsToday: number | bigint;
  totalSubmissions: number | bigint;
};

/** One round trip for form + lead counts (MySQL). Table/column names match Prisma schema. */
async function fetchQuotaCounts(accountOwnerId: string, startOfMonth: Date, startOfToday: Date): Promise<QuotaCountsRow> {
  const rows = await prisma.$queryRaw<QuotaCountsRow[]>`
    SELECT
      (SELECT COUNT(*) FROM Form WHERE user_id = ${accountOwnerId}) AS formsCount,
      (SELECT COUNT(*) FROM Lead WHERE user_id = ${accountOwnerId} AND created_at >= ${startOfMonth}) AS leadsThisMonth,
      (SELECT COUNT(*) FROM Lead WHERE user_id = ${accountOwnerId} AND created_at >= ${startOfToday}) AS leadsToday,
      (SELECT COUNT(*) FROM Lead WHERE user_id = ${accountOwnerId}) AS totalSubmissions
  `;
  if (rows[0]) return rows[0];
  return { formsCount: 0, leadsThisMonth: 0, leadsToday: 0, totalSubmissions: 0 };
}

/** Fetches plan quota for the account (owner). Limits are shared across all team members. Uses single query for counts + parallel OTP. */
async function fetchDashboardPlanQuota(accountOwnerId: string, planKey: PlanKey): Promise<DashboardPlanQuota> {
  const limits = getPlanLimits(planKey);
  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);

  const [counts, otpUsage, otpLimit] = await Promise.all([
    fetchQuotaCounts(accountOwnerId, startOfMonth, startOfToday),
    getOtpUsageForUser(accountOwnerId, planKey),
    getOtpLimitForPlan(planKey),
  ]);

  return {
    plan: planKey,
    formsUsed: Number(counts.formsCount),
    formsLimit: limits.maxForms === Infinity ? null : limits.maxForms,
    leadsUsed: Number(counts.leadsThisMonth),
    leadsLimit: limits.maxLeadsPerMonth,
    otpUsed: otpUsage.used,
    otpLimit,
    leadsToday: Number(counts.leadsToday),
    totalSubmissions: Number(counts.totalSubmissions),
  };
}

/** Short-lived cross-request cache (60s) so repeated navigations avoid DB hits. */
const getQuotaCrossRequest = unstable_cache(
  (accountOwnerId: string, planKey: PlanKey) => fetchDashboardPlanQuota(accountOwnerId, planKey),
  ["dashboard-plan-quota"],
  { revalidate: 60 }
);

/** Cached per-request so layout and dashboard page share one fetch; also uses 60s cross-request cache. Plan limits are per account (shared by all team members). */
export const getDashboardPlanQuotaCached = cache(
  async (accountOwnerId: string, planKey: PlanKey): Promise<DashboardPlanQuota> => {
    return getQuotaCrossRequest(accountOwnerId, planKey);
  }
);
