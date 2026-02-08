import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireVerifiedSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getOtpUsageForUser } from "@/services/otp.service";
import { getPlanLimits, type PlanKey } from "@/lib/plans";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardSidebarProvider } from "@/components/DashboardSidebarContext";
import { DashboardTopbar } from "@/components/DashboardTopbar";

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
  const planKey = session.plan as PlanKey;
  const limits = getPlanLimits(planKey);
  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);
  const leadsThisMonth = await prisma.lead.count({
    where: { userId: session.userId, createdAt: { gte: startOfMonth } },
  });
  const [formsCount, otpUsage] = await Promise.all([
    prisma.form.count({ where: { userId: session.userId } }),
    getOtpUsageForUser(session.userId),
  ]);
  const planQuota = {
    plan: planKey,
    formsUsed: formsCount,
    formsLimit: limits.maxForms,
    leadsUsed: leadsThisMonth,
    leadsLimit: limits.maxLeadsPerMonth,
    otpUsed: otpUsage.used,
    otpLimit: limits.otpLimit,
  };
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
          <main className="flex min-h-0 flex-1 flex-col overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </DashboardSidebarProvider>
  );
}
