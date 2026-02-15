import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMinimalSessionFromJwt } from "@/lib/auth";
import { getRazorpayKeyId } from "@/lib/razorpay";
import { DashboardLayoutChrome } from "./DashboardLayoutChrome";
import { DashboardSidebarProvider } from "@/components/DashboardSidebarContext";
import { UpgradeModalProvider } from "@/components/UpgradeModalProvider";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Layout uses JWT-only auth (no DB) so the first byte can stream immediately.
 * Full session + quota + teams load inside Suspense in DashboardLayoutChrome.
 */
export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const minimal = await getMinimalSessionFromJwt();
  if (!minimal) redirect("/login");
  const { username } = await params;
  const razorpayKeyId = getRazorpayKeyId();
  const currentPlan = minimal.plan ?? "free";
  return (
    <UpgradeModalProvider currentPlan={currentPlan} razorpayKeyId={razorpayKeyId}>
      <DashboardSidebarProvider>
        <ToastProvider>
          <DashboardLayoutChrome layoutUsername={username} razorpayKeyId={razorpayKeyId}>
            {children}
          </DashboardLayoutChrome>
        </ToastProvider>
      </DashboardSidebarProvider>
    </UpgradeModalProvider>
  );
}
