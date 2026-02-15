import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getWebhooksByUserId } from "@/services/webhook.service";
import { WebhooksListClient } from "./WebhooksListClient";

export const metadata: Metadata = {
  title: "Webhooks | Integrations | LeadFormHub",
  description: "Manage webhook integrations for lead events.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function WebhooksPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const session = await getSession();
  const { username } = await params;
  if (!session) redirect("/login");
  if (session.username.toLowerCase() !== username.toLowerCase()) {
    redirect(`/${session.username}/integrations/webhooks`);
  }

  const webhooks = await getWebhooksByUserId(session.userId);
  const base = `/${username}/integrations/webhooks`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--foreground-muted)]">
          Send lead events to your URLs when leads are created, moved, or won.
        </p>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          <Link
            href={`${base}/logs`}
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg border border-[var(--border-default)] bg-white px-4 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--background-alt)] sm:w-auto"
          >
            View logs
          </Link>
          <Link
            href={`${base}/new`}
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[var(--color-accent)] px-4 text-sm font-medium text-white transition-colors hover:opacity-90 sm:w-auto"
          >
            Add webhook
          </Link>
        </div>
      </div>

      <WebhooksListClient
        username={username}
        initialWebhooks={webhooks.map((w) => ({
          id: w.id,
          name: w.name,
          url: w.url,
          triggerEvent: w.triggerEvent,
          active: w.active,
          createdAt: w.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
