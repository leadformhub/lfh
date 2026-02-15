import { Suspense } from "react";
import { getVerifiedSessionCached } from "@/lib/auth";
import { getRole } from "@/lib/team";
import { canUseAnalytics } from "@/lib/plan-features";
import { getRazorpayKeyId } from "@/lib/razorpay";
import { type PlanKey } from "@/lib/plans";
import { DashboardUpgradeCard } from "./DashboardUpgradeCard";
import { DashboardQuickActions } from "./DashboardQuickActions";
import { DashboardStatsSection } from "./DashboardStatsSection";
import { DashboardSubmissionsChart } from "./DashboardSubmissionsChart";
import { DashboardRecentActivity } from "./DashboardRecentActivity";
import { DashboardTopForms } from "./DashboardTopForms";
import {
  QuickActionsSkeleton,
  StatsSectionSkeleton,
  SubmissionsChartSkeleton,
  RecentActivitySkeleton,
  TopFormsSkeleton,
} from "./DashboardSkeletons";

export const metadata = {
  title: "Dashboard",
  description: "Overview of your forms, leads, and activity.",
};

export default async function DashboardPage({
  params,
}: { params: Promise<{ username: string }> }) {
  const session = await getVerifiedSessionCached();
  const { username } = await params;
  if (!session || session.username.toLowerCase() !== username.toLowerCase()) {
    return null;
  }

  const accountOwnerId = session.accountOwnerId ?? session.userId;
  const role = getRole(session);
  const assignedToUserId = role === "sales" ? session.userId : undefined;
  const plan = session.plan as PlanKey;
  const showAnalytics = canUseAnalytics(plan);
  const razorpayKeyId = getRazorpayKeyId();

  return (
    <div className="p-4 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Welcome + quick actions — shell renders immediately */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base text-neutral-500">Welcome back</p>
            <h2 className="mt-1 font-heading text-xl font-semibold tracking-tight text-neutral-900 lg:text-2xl">
              Here&apos;s your overview
            </h2>
          </div>
          <Suspense fallback={<QuickActionsSkeleton />}>
            <DashboardQuickActions
              username={username}
              accountOwnerId={accountOwnerId}
              plan={plan}
              razorpayKeyId={razorpayKeyId}
            />
          </Suspense>
        </div>

        {/* Stats section — streams when ready */}
        <Suspense fallback={<StatsSectionSkeleton />}>
          <DashboardStatsSection
            accountOwnerId={accountOwnerId}
            username={username}
            plan={plan}
            assignedToUserId={assignedToUserId}
          />
        </Suspense>

        {showAnalytics ? (
          <>
            <div className="grid gap-8 lg:grid-cols-3">
              <Suspense fallback={<SubmissionsChartSkeleton />}>
                <DashboardSubmissionsChart
                  accountOwnerId={accountOwnerId}
                  assignedToUserId={assignedToUserId}
                />
              </Suspense>
              <Suspense fallback={<RecentActivitySkeleton />}>
                <DashboardRecentActivity
                  accountOwnerId={accountOwnerId}
                  username={username}
                  assignedToUserId={assignedToUserId}
                />
              </Suspense>
            </div>

            <Suspense fallback={<TopFormsSkeleton />}>
              <DashboardTopForms
                accountOwnerId={accountOwnerId}
                username={username}
                assignedToUserId={assignedToUserId}
              />
            </Suspense>
          </>
        ) : (
          <DashboardUpgradeCard />
        )}
      </div>
    </div>
  );
}
