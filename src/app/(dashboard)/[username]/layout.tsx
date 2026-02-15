import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireVerifiedSession } from "@/lib/auth";
import { canManageIntegrations } from "@/lib/team";
import { listTeamsForMember } from "@/services/team.service";
import { getDashboardPlanQuotaCached } from "@/lib/dashboard-quota";
import { getRazorpayKeyId } from "@/lib/razorpay";
import { type PlanKey } from "@/lib/plans";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardSidebarProvider } from "@/components/DashboardSidebarContext";
import { DashboardTopbar } from "@/components/DashboardTopbar";
import { UpgradeModalProvider } from "@/components/UpgradeModalProvider";
import { DashboardFooter } from "@/components/DashboardFooter";
import { PlanExpiryBanner } from "@/components/PlanExpiryBanner";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  let session;
  try {
    session = await requireVerifiedSession();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "EMAIL_NOT_VERIFIED") {
      redirect("/api/auth/logout?redirect=" + encodeURIComponent("/login?error=verify_email"));
    }
    redirect("/login");
  }
  const { username } = await params;
  if (username.toLowerCase() !== session.username.toLowerCase()) {
    redirect(`/${session.username}/dashboard`);
  }
  const accountOwnerId = session.accountOwnerId ?? session.userId;
  const planQuota = await getDashboardPlanQuotaCached(accountOwnerId, session.plan as PlanKey);
  const razorpayKeyId = getRazorpayKeyId();
  const currentPlan = session.plan ?? "free";
  const isOwnAccount = session.accountOwnerId === session.userId;
  const otherTeams = isOwnAccount ? await listTeamsForMember(session.userId) : [];
  return (
    <UpgradeModalProvider currentPlan={currentPlan} razorpayKeyId={razorpayKeyId}>
      <DashboardSidebarProvider>
        <ToastProvider>
          <div className="flex h-screen min-h-screen overflow-hidden bg-[var(--dashboard-main-bg)]">
        {/* Left column: theme-aware sidebar */}
        <div className="flex w-0 shrink-0 flex-col bg-[var(--dashboard-sidebar-bg)] lg:w-64">
          <DashboardSidebar
            username={session.username}
            planQuota={planQuota}
            razorpayKeyId={razorpayKeyId ?? null}
            showIntegrationsLink={canManageIntegrations(session)}
            isTeamAccount={session.accountOwnerId !== session.userId}
            otherTeams={otherTeams}
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col min-h-0">
          <DashboardTopbar username={session.username} email={session.email} />
          <main className="flex min-h-0 flex-1 flex-col overflow-auto" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom, 0px))" }}>
            <PlanExpiryBanner plan={session.plan} planValidUntil={session.planValidUntil ?? undefined} username={session.username} />
            <div className="flex min-h-full min-w-0 shrink-0 flex-col">
              <div className="min-h-0 flex-1">{children}</div>
              <DashboardFooter />
            </div>
          </main>
        </div>
      </div>
      </ToastProvider>
    </DashboardSidebarProvider>
    </UpgradeModalProvider>
  );
}
