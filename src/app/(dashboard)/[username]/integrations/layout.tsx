import Link from "next/link";
import { getVerifiedSessionCached } from "@/lib/auth";
import { getRole } from "@/lib/team";
import { redirect } from "next/navigation";
import { canUseIntegrations } from "@/lib/plan-features";
import type { PlanKey } from "@/lib/plans";

export default async function IntegrationsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const session = await getVerifiedSessionCached();
  const { username } = await params;
  if (!session) redirect("/login");
  if (session.username.toLowerCase() !== username.toLowerCase()) {
    redirect(`/${session.username}/integrations/webhooks`);
  }
  if (getRole(session) === "sales") {
    redirect(`/${username}/access-denied`);
  }
  const plan = (session.plan ?? "free") as PlanKey;
  if (!canUseIntegrations(plan)) {
    redirect(`/${username}/pricing`);
  }

  const base = `/${username}/integrations`;
  return (
    <div className="min-w-0 p-4 sm:p-5 md:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 sm:mb-8">
          <h1 className="font-heading text-xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-2xl">
            Integrations
          </h1>
          <p className="mt-1 text-base text-[var(--foreground-muted)]">
            Connect LeadFormHub with external tools via webhooks.
          </p>
          <nav
            aria-label="Integrations sub-navigation"
            className="mt-4 flex gap-1 rounded-xl bg-[var(--background-alt)] p-1.5 w-fit"
          >
            <Link
              href={`${base}/webhooks`}
              className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors min-h-[44px] bg-white text-[var(--foreground-heading)] shadow-[var(--shadow-xs)]"
            >
              Webhooks
            </Link>
          </nav>
        </header>
        {children}
      </div>
    </div>
  );
}
