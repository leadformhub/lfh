import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { WebhookLogsClient } from "../WebhookLogsClient";

export const metadata: Metadata = {
  title: "Webhook logs | Integrations | LeadFormHub",
  description: "View webhook delivery logs.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function WebhookLogsPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const session = await getSession();
  const { username } = await params;
  if (!session) redirect("/login");
  if (session.username.toLowerCase() !== username.toLowerCase()) {
    redirect(`/${session.username}/integrations/webhooks/logs`);
  }

  const base = `/${username}/integrations/webhooks`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--foreground-muted)]">
          Delivery history for all webhook requests and test calls.
        </p>
        <Link
          href={base}
          className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg border border-[var(--border-default)] bg-white px-4 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--background-alt)] sm:w-auto"
        >
          Back to webhooks
        </Link>
      </div>

      <WebhookLogsClient username={username} />
    </div>
  );
}
