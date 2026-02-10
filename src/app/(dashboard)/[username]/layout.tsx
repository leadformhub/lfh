import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireVerifiedSession } from "@/lib/auth";
import { getDashboardPlanQuotaCached } from "@/lib/dashboard-quota";
import { type PlanKey } from "@/lib/plans";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardSidebarProvider } from "@/components/DashboardSidebarContext";
import { DashboardTopbar } from "@/components/DashboardTopbar";
import { DashboardFooter } from "@/components/DashboardFooter";

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
  const planQuota = await getDashboardPlanQuotaCached(session.userId, session.plan as PlanKey);
  return (
    <DashboardSidebarProvider>
        <div className="flex h-screen min-h-screen overflow-hidden bg-[var(--dashboard-main-bg)]">
        {/* Left column: theme-aware sidebar */}
        <div className="flex w-0 shrink-0 flex-col bg-[var(--dashboard-sidebar-bg)] lg:w-64">
          <DashboardSidebar
            username={session.username}
            planQuota={planQuota}
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col min-h-0">
          <DashboardTopbar username={session.username} email={session.email} />
          <main className="flex min-h-0 flex-1 flex-col overflow-auto" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom, 0px))" }}>
            <div className="flex min-h-0 flex-1 flex-col">
              {children}
              <DashboardFooter />
            </div>
          </main>
        </div>
      </div>
    </DashboardSidebarProvider>
  );
}
