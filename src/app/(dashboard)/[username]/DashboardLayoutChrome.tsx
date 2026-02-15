import { Suspense } from "react";
import { redirect } from "next/navigation";
import { canManageIntegrations } from "@/lib/team";
import { listTeamsForMember } from "@/services/team.service";
import { getDashboardPlanQuotaCached } from "@/lib/dashboard-quota";
import { getVerifiedSessionCached } from "@/lib/auth";
import { type PlanKey } from "@/lib/plans";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardTopbar } from "@/components/DashboardTopbar";
import { DashboardFooter } from "@/components/DashboardFooter";
import { PlanExpiryBanner } from "@/components/PlanExpiryBanner";
import { DashboardShellSkeleton } from "./DashboardShellSkeleton";

type Props = {
  layoutUsername: string;
  razorpayKeyId: string | null;
  children: React.ReactNode;
};

/** Resolves full session (DB), then planQuota + otherTeams in parallel. Redirects if username mismatch (e.g. team switch). */
async function DashboardChromeContent({ layoutUsername, razorpayKeyId, children }: Props) {
  let session;
  try {
    session = await getVerifiedSessionCached();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "EMAIL_NOT_VERIFIED") {
      redirect("/api/auth/logout?redirect=" + encodeURIComponent("/login?error=verify_email"));
    }
    redirect("/login");
  }
  if (!session) redirect("/login");
  if (session.username.toLowerCase() !== layoutUsername.toLowerCase()) {
    redirect(`/${session.username}/dashboard`);
  }
  const accountOwnerId = session.accountOwnerId ?? session.userId;
  const planKey = (session.plan ?? "free") as PlanKey;
  const isOwnAccount = session.accountOwnerId === session.userId;

  const [planQuota, otherTeams] = await Promise.all([
    getDashboardPlanQuotaCached(accountOwnerId, planKey),
    isOwnAccount ? listTeamsForMember(session.userId) : Promise.resolve([]),
  ]);

  return (
    <div className="flex h-screen min-h-screen overflow-hidden bg-[var(--dashboard-main-bg)]">
      <div className="flex w-0 shrink-0 flex-col bg-[var(--dashboard-sidebar-bg)] lg:w-64">
        <DashboardSidebar
          username={session.username}
          planQuota={planQuota}
          razorpayKeyId={razorpayKeyId}
          showIntegrationsLink={canManageIntegrations(session)}
          isTeamAccount={session.accountOwnerId !== session.userId}
          otherTeams={otherTeams}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col min-h-0">
        <DashboardTopbar username={session.username} email={session.email} />
        <main
          className="flex min-h-0 flex-1 flex-col overflow-auto"
          style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom, 0px))" }}
        >
          <PlanExpiryBanner
            plan={session.plan}
            planValidUntil={session.planValidUntil ?? undefined}
            username={session.username}
          />
          <div className="flex min-h-full min-w-0 shrink-0 flex-col">
            <div className="min-h-0 flex-1">{children}</div>
            <DashboardFooter />
          </div>
        </main>
      </div>
    </div>
  );
}

export function DashboardLayoutChrome({ layoutUsername, razorpayKeyId, children }: Props) {
  return (
    <Suspense fallback={<DashboardShellSkeleton />}>
      <DashboardChromeContent layoutUsername={layoutUsername} razorpayKeyId={razorpayKeyId}>
        {children}
      </DashboardChromeContent>
    </Suspense>
  );
}
