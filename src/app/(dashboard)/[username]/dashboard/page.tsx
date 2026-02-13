import dynamic from "next/dynamic";
import Link from "next/link";
import {
  getRecentLeads,
  getSubmissionsOverTime,
  getTopForms,
  getConversionRate,
  getTopPerformingForm,
} from "@/services/analytics.service";
import { getVerifiedSessionCached } from "@/lib/auth";
import { getDashboardPlanQuotaCached } from "@/lib/dashboard-quota";
import { canUseAnalytics } from "@/lib/plan-features";
import { canCreateForm, type PlanKey } from "@/lib/plans";
import { getRazorpayKeyId } from "@/lib/razorpay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const CreateFormButton = dynamic(
  () => import("@/components/CreateFormButton").then((m) => ({ default: m.CreateFormButton })),
  { ssr: true }
);

export const metadata = {
  title: "Dashboard",
  description: "Overview of your forms, leads, and activity.",
};

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US");
}

export default async function DashboardPage({
  params,
}: { params: Promise<{ username: string }> }) {
  const session = await getVerifiedSessionCached();
  const { username } = await params;
  if (!session || session.username.toLowerCase() !== username.toLowerCase()) {
    return null;
  }

  const planQuota = await getDashboardPlanQuotaCached(session.userId, session.plan as PlanKey);
  const { leadsToday, leadsThisMonth, totalSubmissions, formsUsed } = {
    leadsToday: planQuota.leadsToday,
    leadsThisMonth: planQuota.leadsUsed,
    totalSubmissions: planQuota.totalSubmissions,
    formsUsed: planQuota.formsUsed,
  };

  const plan = session.plan as PlanKey;
  const showAnalytics = canUseAnalytics(plan);
  const [recentLeads, topForms, submissionsOverTime, conversionRate, topPerformingForm] = await Promise.all([
    getRecentLeads(session.userId, 5),
    getTopForms(session.userId, 5),
    showAnalytics ? getSubmissionsOverTime(session.userId, 30) : Promise.resolve([]),
    getConversionRate(session.userId),
    getTopPerformingForm(session.userId),
  ]);

  const maxSubmissions = Math.max(1, ...submissionsOverTime.map((d) => d.submissions));
  const planLabel = session.plan.charAt(0).toUpperCase() + session.plan.slice(1);
  const canCreate = canCreateForm(plan, formsUsed);
  const razorpayKeyId = getRazorpayKeyId();

  return (
    <div className="p-4 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Welcome + quick actions */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base text-neutral-500">
              Welcome back
            </p>
            <h2 className="mt-1 font-heading text-xl font-semibold tracking-tight text-neutral-900 lg:text-2xl">
              Here’s your overview
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <CreateFormButton
              username={username}
              canCreate={canCreate}
              currentPlan={session.plan ?? "free"}
              razorpayKeyId={razorpayKeyId}
            />
            <Link
              href={`/${username}/leads`}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-default)] bg-white px-4 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--neutral-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] sm:flex-initial"
            >
              View Leads
            </Link>
          </div>
        </div>

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

        {showAnalytics ? (
          <>
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Submissions over time — last 30 days (live) */}
              <section className="lg:col-span-2" aria-label="Submissions over time">
                <Card className="h-full min-h-[280px] transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-neutral-900">Submissions over time</CardTitle>
                    <p className="text-base text-neutral-500">
                      Last 30 days
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex h-40 sm:h-52 items-end justify-between gap-0.5 sm:gap-1 rounded-lg bg-neutral-100 p-3 sm:p-4" role="img" aria-label={`Submissions per day for the last 30 days. Total: ${submissionsOverTime.reduce((s, d) => s + d.submissions, 0)} submissions.`}>
                      {submissionsOverTime.map((d) => {
                        const pct = maxSubmissions > 0 ? (d.submissions / maxSubmissions) * 100 : 0;
                        const label = new Date(d.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
                        return (
                          <div
                            key={d.date}
                            className="flex-1 rounded-t bg-blue-500 transition-all duration-200 hover:bg-blue-600 min-w-0"
                            style={{ height: `${Math.max(pct, 2)}%`, minHeight: "4px" }}
                            title={`${label}: ${d.submissions} submission${d.submissions !== 1 ? "s" : ""}`}
                          />
                        );
                      })}
                    </div>
                    <p className="mt-2 text-xs text-neutral-500 text-center">
                      {submissionsOverTime.reduce((s, d) => s + d.submissions, 0)} total in last 30 days
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Activity feed */}
              <section aria-label="Recent activity">
                <Card className="h-full transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-neutral-900">Recent activity</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {recentLeads.length === 0 ? (
                      <div className="empty-state py-8">
                        <p className="empty-state-title">No activity yet</p>
                        <p className="empty-state-description mt-1">Create a form and share it to see leads here.</p>
                      </div>
                    ) : (
                      <ul className="divide-y divide-neutral-200">
                        {recentLeads.map((lead) => (
                          <li key={lead.id} className="py-4 first:pt-0">
                            <Link
                              href={`/${username}/leads`}
                              className="block rounded-lg py-1 transition-colors hover:bg-neutral-50"
                            >
                              <p className="text-sm font-medium text-neutral-900 line-clamp-1">
                                {lead.formTitle}
                              </p>
                              <p className="mt-0.5 text-xs text-neutral-500 line-clamp-1">
                                {lead.preview}
                              </p>
                              <p className="mt-1 text-xs text-neutral-400">
                                {formatRelativeTime(lead.submittedAt)}
                              </p>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* Top forms */}
            <section className="mt-8" aria-label="Top forms by submissions">
              <Card className="transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base text-neutral-900">Top forms</CardTitle>
                  <Link
                    href={`/${username}/forms`}
                    className="text-sm font-medium text-[var(--color-accent)] transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-accent)]"
                  >
                    View all
                  </Link>
                </CardHeader>
                <CardContent>
                  {topForms.length === 0 ? (
                    <div className="empty-state py-6">
                      <p className="empty-state-title">No forms yet</p>
                      <p className="empty-state-description mt-1">Create your first form to get started.</p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-neutral-200">
                      {topForms.map((form) => (
                        <li key={form.id} className="flex flex-col gap-1 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                          <Link
                            href={`/${username}/forms/${form.id}`}
                            className="min-w-0 flex-1 font-medium text-neutral-900 hover:underline"
                          >
                            <span className="truncate">{form.name}</span>
                          </Link>
                          <span className="shrink-0 text-base text-neutral-500">
                            {form.submissions} submissions
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </section>
          </>
        ) : (
          <Card className="mt-6 border-[var(--border-default)] bg-[var(--background-alt)]">
            <CardContent className="p-8 text-center">
              <p className="font-medium text-[var(--foreground-heading)]">Analytics on Pro & Business</p>
              <p className="mt-1 text-base text-[var(--foreground-muted)]">
                Submissions over time, recent activity, and top forms are available when you upgrade.
              </p>
              <Link
                href={`/${username}/pricing`}
                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              >
                Upgrade Plan
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
