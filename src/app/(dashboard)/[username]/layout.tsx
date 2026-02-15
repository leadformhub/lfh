import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireVerifiedSession } from "@/lib/auth";
import { getRazorpayKeyId } from "@/lib/razorpay";
import { DashboardLayoutChrome } from "./DashboardLayoutChrome";
import { DashboardSidebarProvider } from "@/components/DashboardSidebarContext";
import { UpgradeModalProvider } from "@/components/UpgradeModalProvider";
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
  const razorpayKeyId = getRazorpayKeyId();
  const currentPlan = session.plan ?? "free";
  return (
    <UpgradeModalProvider currentPlan={currentPlan} razorpayKeyId={razorpayKeyId}>
      <DashboardSidebarProvider>
        <ToastProvider>
          <DashboardLayoutChrome session={session} razorpayKeyId={razorpayKeyId}>
            {children}
          </DashboardLayoutChrome>
        </ToastProvider>
      </DashboardSidebarProvider>
    </UpgradeModalProvider>
  );
}
