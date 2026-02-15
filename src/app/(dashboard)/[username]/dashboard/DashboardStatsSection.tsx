import Link from "next/link";
import {
  getConversionRate,
  getTopPerformingForm,
} from "@/services/analytics.service";
import { getDashboardPlanQuotaCached } from "@/lib/dashboard-quota";
import { canCreateForm, type PlanKey } from "@/lib/plans";
import { Card, CardContent } from "@/components/ui/Card";

type Props = {
  accountOwnerId: string;
  username: string;
  plan: PlanKey;
  assignedToUserId?: string;
};

export async function DashboardStatsSection({
  accountOwnerId,
  username,
  plan,
  assignedToUserId,
}: Props) {
  const [planQuota, conversionRate, topPerformingForm] = await Promise.all([
    getDashboardPlanQuotaCached(accountOwnerId, plan),
    getConversionRate(accountOwnerId, assignedToUserId),
    getTopPerformingForm(accountOwnerId, assignedToUserId),
  ]);

  const { leadsToday, leadsUsed: leadsThisMonth, totalSubmissions, formsUsed } = planQuota;
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);

  return (
    <>
      {/* Enterprise stats widgets */}
      <section className="mb-6 sm:mb-8" aria-label="Enterprise stats">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          <Card className="min-w-0 transition-shadow duration-200">
            <CardContent className="p-4 sm:p-6">
              <p className="text-sm font-medium text-neutral-500">Leads today</p>
              <p className="mt-2 font-heading text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
                {leadsToday}
              </p>
            </CardContent>
          </Card>
          <Card className="min-w-0 transition-shadow duration-200">
            <CardContent className="p-4 sm:p-6">
              <p className="text-sm font-medium text-neutral-500">Leads this month</p>
              <p className="mt-2 font-heading text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
                {leadsThisMonth}
              </p>
            </CardContent>
          </Card>
          <Card className="min-w-0 transition-shadow duration-200">
            <CardContent className="p-4 sm:p-6">
              <p className="text-sm font-medium text-neutral-500">Conversion rate</p>
              <p className="mt-2 font-heading text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
                {conversionRate}%
              </p>
            </CardContent>
          </Card>
          <Card className="min-w-0 transition-shadow duration-200">
            <CardContent className="p-4 sm:p-6">
              <p className="text-sm font-medium text-neutral-500">Top performing form</p>
              {topPerformingForm ? (
                <Link
                  href={`/${username}/forms/${topPerformingForm.id}`}
                  className="mt-2 block font-heading text-base font-semibold tracking-tight text-neutral-900 transition-colors hover:text-blue-600 sm:text-lg"
                >
                  <span className="line-clamp-2">{topPerformingForm.name}</span>
                </Link>
              ) : (
                <p className="mt-2 font-heading text-base font-semibold text-neutral-400 sm:text-lg">
                  —
                </p>
              )}
              {topPerformingForm && (
                <p className="mt-1 text-xs text-neutral-500">
                  {topPerformingForm.submissions} submission{topPerformingForm.submissions !== 1 ? "s" : ""}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Secondary KPIs: forms, total submissions, plan */}
      <section className="mb-6 sm:mb-8" aria-label="Account overview">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          <Card className="min-w-0 transition-shadow duration-200">
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs font-medium text-neutral-500 sm:text-sm">Forms</p>
              <p className="mt-1 font-heading text-lg font-bold text-neutral-900 sm:text-xl">
                {formsUsed}
              </p>
            </CardContent>
          </Card>
          <Card className="min-w-0 transition-shadow duration-200">
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs font-medium text-neutral-500 sm:text-sm">Total leads</p>
              <p className="mt-1 font-heading text-lg font-bold text-neutral-900 sm:text-xl">
                {totalSubmissions}
              </p>
            </CardContent>
          </Card>
          <Card className="min-w-0 col-span-2 transition-shadow duration-200 sm:col-span-1">
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs font-medium text-neutral-500 sm:text-sm">Plan</p>
              <p className="mt-1 font-heading text-lg font-semibold capitalize text-neutral-900">
                {planLabel}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
