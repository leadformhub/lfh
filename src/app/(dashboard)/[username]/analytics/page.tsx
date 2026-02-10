import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { canUseAnalytics } from "@/lib/plan-features";
import type { PlanKey } from "@/lib/plans";
import {
  getDashboardStats,
  getTopForms,
  getSubmissionsOverTime,
  getViewsOverTime,
  getAllFormsWithStats,
  getTotalViews,
} from "@/services/analytics.service";
import {
  SubmissionsOverTimeChart,
  ViewsVsSubmissionsChart,
  FormPerformanceBarChart,
  ConversionRateBarChart,
} from "@/components/AnalyticsCharts";
import { SITE_URL } from "@/lib/seo";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const url = `${SITE_URL}/${username}/analytics`;
  return {
    title: "Form Analytics & Lead Conversion Tracking | LeadFormHub",
    description:
      "Track form performance, submission rates, and lead conversion analytics to optimize your lead capture strategy.",
    alternates: { canonical: url },
    openGraph: { title: "Form Analytics & Lead Conversion Tracking | LeadFormHub", description: "Track form performance, submission rates, and lead conversion analytics to optimize your lead capture strategy.", url, siteName: "LeadFormHub", type: "website" },
    twitter: { card: "summary_large_image", title: "Form Analytics & Lead Conversion Tracking | LeadFormHub", description: "Track form performance, submission rates, and lead conversion analytics to optimize your lead capture strategy." },
    robots: { index: false, follow: false },
  };
}

export default async function AnalyticsPage({
  params,
}: { params: Promise<{ username: string }> }) {
  const session = await getSession();
  const { username } = await params;
  if (!session || session.username.toLowerCase() !== username.toLowerCase()) return null;

  const plan = session.plan as PlanKey;
  if (!canUseAnalytics(plan)) {
    return (
      <div className="min-h-0 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-xl rounded-xl border border-[var(--border-default)] bg-white p-8 text-center shadow-[var(--shadow-sm)]">
          <h1 className="font-heading text-xl font-bold text-[var(--foreground-heading)] sm:text-2xl">
            Analytics
          </h1>
          <p className="mt-2 text-base text-[var(--foreground-muted)]">
            Views, submissions over time, and conversion metrics are available on Pro and Business plans.
          </p>
          <Link
            href={`/${username}/pricing`}
            className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#2563EB] px-4 text-sm font-medium text-white hover:bg-[#1D4ED8]"
          >
            Upgrade plan
          </Link>
        </div>
      </div>
    );
  }

  const [
    stats,
    topForms,
    submissionsOverTime,
    viewsOverTime,
    allFormsWithStats,
    totalViews,
  ] = await Promise.all([
    getDashboardStats(session.userId),
    getTopForms(session.userId, 10),
    getSubmissionsOverTime(session.userId, 30),
    getViewsOverTime(session.userId, 30),
    getAllFormsWithStats(session.userId),
    getTotalViews(session.userId),
  ]);

  const avgConversion =
    allFormsWithStats.length > 0
      ? allFormsWithStats
          .filter((f) => f.views > 0)
          .reduce((acc, f) => acc + f.conversionRate, 0) /
        Math.max(1, allFormsWithStats.filter((f) => f.views > 0).length)
      : 0;

  const combinedTimeData = submissionsOverTime.map((s) => {
    const v = viewsOverTime.find((x) => x.date === s.date);
    return { date: s.date, views: v?.views ?? 0, submissions: s.submissions };
  });

  const hasData = stats.totalSubmissions > 0 || totalViews > 0 || stats.totalForms > 0;

  return (
    <div className="min-h-0 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-2xl">
              Form analytics and lead conversion tracking
            </h1>
            <p className="mt-1 text-base text-[var(--foreground-muted)]">
              Single view of form performance, submissions, and conversion metrics
            </p>
          </div>
          <Link
            href={`/${username}/forms`}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[var(--border-default)] bg-white px-4 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--neutral-50)] sm:shrink-0"
          >
            View forms
          </Link>
        </div>

        {/* KPI cards */}
        <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" aria-label="Key metrics">
          <div className="rounded-xl border border-[var(--border-default)] bg-white p-4 shadow-[var(--shadow-sm)] sm:p-6">
            <p className="text-xs font-medium text-[var(--foreground-muted)] sm:text-sm">
              Total views
            </p>
            <p className="mt-2 font-heading text-xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-2xl">
              {totalViews.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-[var(--foreground-muted)]">Total form page visits</p>
          </div>
          <div className="rounded-xl border border-[var(--border-default)] bg-white p-4 shadow-[var(--shadow-sm)] sm:p-6">
            <p className="text-xs font-medium text-[var(--foreground-muted)] sm:text-sm">
              Submissions
            </p>
            <p className="mt-2 font-heading text-xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-2xl">
              {stats.totalSubmissions.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-[var(--foreground-muted)]">Total leads captured</p>
          </div>
          <div className="rounded-xl border border-[var(--border-default)] bg-white p-4 shadow-[var(--shadow-sm)] sm:p-6">
            <p className="text-xs font-medium text-[var(--foreground-muted)] sm:text-sm">
              Active forms
            </p>
            <p className="mt-2 font-heading text-xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-2xl">
              {stats.totalForms}
            </p>
            <p className="mt-1 text-xs text-[var(--foreground-muted)]">Forms in your account</p>
          </div>
          <div className="col-span-2 rounded-xl border border-[var(--border-default)] bg-white p-4 shadow-[var(--shadow-sm)] sm:col-span-1 sm:p-6">
            <p className="text-xs font-medium text-[var(--foreground-muted)] sm:text-sm">
              Avg. conversion
            </p>
            <p className="mt-2 font-heading text-xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-2xl">
              {avgConversion.toFixed(1)}%
            </p>
            <p className="mt-1 text-xs text-[var(--foreground-muted)]">Views → submissions</p>
          </div>
        </section>

        {!hasData ? (
          <div className="rounded-xl border border-[var(--border-default)] bg-white p-12 text-center shadow-[var(--shadow-sm)]">
            <p className="text-lg font-medium text-[var(--foreground-heading)]">No analytics data yet</p>
            <p className="mt-2 max-w-md mx-auto text-base text-[var(--foreground-muted)]">
              Create forms, share them, and collect submissions. Your views and conversion metrics will appear here.
            </p>
            <Link
              href={`/${username}/forms/new`}
              className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[var(--color-accent)] px-4 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]"
            >
              Create your first form
            </Link>
          </div>
        ) : (
          <>
            {/* Charts row 1: Time series */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="overflow-hidden rounded-xl border border-[var(--border-default)] bg-white shadow-[var(--shadow-sm)]">
                <div className="border-b border-[var(--border-default)] px-4 py-4 sm:px-6 sm:py-5">
                  <h2 className="font-heading text-base font-semibold text-[var(--foreground-heading)] sm:text-lg">
                    Submissions over time
                  </h2>
                  <p className="mt-0.5 text-base text-[var(--foreground-muted)]">
                    Last 30 days
                  </p>
                </div>
                <div className="p-4 sm:p-6">
                  <SubmissionsOverTimeChart data={submissionsOverTime} />
                </div>
              </div>
              <div className="overflow-hidden rounded-xl border border-[var(--border-default)] bg-white shadow-[var(--shadow-sm)]">
                <div className="border-b border-[var(--border-default)] px-4 py-4 sm:px-6 sm:py-5">
                  <h2 className="font-heading text-base font-semibold text-[var(--foreground-heading)] sm:text-lg">
                    Views vs submissions
                  </h2>
                  <p className="mt-0.5 text-base text-[var(--foreground-muted)]">
                    Daily comparison · Last 30 days
                  </p>
                </div>
                <div className="p-4 sm:p-6">
                  <ViewsVsSubmissionsChart data={combinedTimeData} />
                </div>
              </div>
            </div>

            {/* Charts row 2: Form performance */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="overflow-hidden rounded-xl border border-[var(--border-default)] bg-white shadow-[var(--shadow-sm)]">
                <div className="border-b border-[var(--border-default)] px-4 py-4 sm:px-6 sm:py-5">
                  <h2 className="font-heading text-base font-semibold text-[var(--foreground-heading)] sm:text-lg">
                    Form performance
                  </h2>
                  <p className="mt-0.5 text-base text-[var(--foreground-muted)]">
                    Views and submissions by form
                  </p>
                </div>
                <div className="p-4 sm:p-6">
                  {allFormsWithStats.length > 0 ? (
                    <FormPerformanceBarChart data={allFormsWithStats.map((f) => ({ ...f, title: f.name }))} />
                  ) : (
                    <p className="py-12 text-center text-base text-[var(--foreground-muted)]">
                      No form data yet
                    </p>
                  )}
                </div>
              </div>
              <div className="overflow-hidden rounded-xl border border-[var(--border-default)] bg-white shadow-[var(--shadow-sm)]">
                <div className="border-b border-[var(--border-default)] px-4 py-4 sm:px-6 sm:py-5">
                  <h2 className="font-heading text-base font-semibold text-[var(--foreground-heading)] sm:text-lg">
                    Conversion rate by form
                  </h2>
                  <p className="mt-0.5 text-base text-[var(--foreground-muted)]">
                    Forms with views only
                  </p>
                </div>
                <div className="p-4 sm:p-6">
                  {allFormsWithStats.filter((f) => f.views > 0).length > 0 ? (
                    <ConversionRateBarChart data={allFormsWithStats.map((f) => ({ ...f, title: f.name }))} />
                  ) : (
                    <p className="py-12 text-center text-base text-[var(--foreground-muted)]">
                      No conversion data yet
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Top forms table */}
            <div className="overflow-hidden rounded-xl border border-[var(--border-default)] bg-white shadow-[var(--shadow-sm)]">
              <div className="border-b border-[var(--border-default)] px-4 py-4 sm:px-6 sm:py-5">
                <h2 className="font-heading text-base font-semibold text-[var(--foreground-heading)] sm:text-lg">
                  Top performing forms
                </h2>
                <p className="mt-0.5 text-base text-[var(--foreground-muted)]">
                  Ranked by submissions
                </p>
              </div>
              <div className="p-4 sm:p-6">
                {topForms.length === 0 ? (
                  <p className="py-8 text-center text-base text-[var(--foreground-muted)]">
                    No data yet. Share your forms to see analytics.
                  </p>
                ) : (
                  <>
                    <div className="md:hidden space-y-4">
                      {topForms.map((f, i) => (
                        <div
                          key={f.id}
                          className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border-default)] p-4"
                        >
                          <div className="min-w-0 flex-1">
                            <span className="text-sm font-medium text-[var(--foreground-muted)]">#{i + 1}</span>
                            <Link
                              href={`/${username}/forms/${f.id}/design`}
                              className="mt-1 block font-medium text-[var(--foreground-heading)] truncate hover:underline"
                            >
                              {f.name}
                            </Link>
                            <dl className="mt-2 flex flex-wrap gap-4 text-xs text-[var(--foreground-muted)]">
                              <span>{f.views} views</span>
                              <span>{f.submissions} submissions</span>
                              <span>
                                {f.views > 0 ? ((f.submissions / f.views) * 100).toFixed(1) : 0}% conv.
                              </span>
                            </dl>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full min-w-[500px] text-base">
                        <thead>
                          <tr className="border-b border-[var(--border-default)]">
                            <th className="py-3 text-left font-medium text-[var(--foreground-muted)]">#</th>
                            <th className="py-3 text-left font-medium text-[var(--foreground-muted)]">Form</th>
                            <th className="py-3 text-right font-medium text-[var(--foreground-muted)]">Views</th>
                            <th className="py-3 text-right font-medium text-[var(--foreground-muted)]">Submissions</th>
                            <th className="py-3 text-right font-medium text-[var(--foreground-muted)]">Conversion</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topForms.map((f, i) => (
                            <tr key={f.id} className="border-b border-[var(--neutral-100)] last:border-0 hover:bg-[var(--neutral-50)]/50">
                              <td className="py-3 text-base text-[var(--foreground-muted)]">{i + 1}</td>
                              <td className="py-3">
                                <Link
                                  href={`/${username}/forms/${f.id}/design`}
                                  className="font-medium text-[var(--foreground-heading)] hover:underline"
                                >
                                  {f.name}
                                </Link>
                              </td>
                              <td className="py-3 text-right text-[var(--foreground)]">{f.views.toLocaleString()}</td>
                              <td className="py-3 text-right text-[var(--foreground)]">{f.submissions.toLocaleString()}</td>
                              <td className="py-3 text-right font-medium text-[var(--foreground)]">
                                {f.views > 0 ? ((f.submissions / f.views) * 100).toFixed(1) : 0}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
