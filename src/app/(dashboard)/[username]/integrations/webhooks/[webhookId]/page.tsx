import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { getWebhookById } from "@/services/webhook.service";
import { notFound } from "next/navigation";
import { WebhookEditClient } from "../WebhookEditClient";

export const metadata: Metadata = {
  title: "Edit webhook | Integrations | LeadFormHub",
  description: "Edit webhook integration.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditWebhookPage({
  params,
}: {
  params: Promise<{ username: string; webhookId: string }>;
}) {
  const session = await getSession();
  const { username, webhookId } = await params;
  if (!session || session.username.toLowerCase() !== username.toLowerCase()) {
    notFound();
  }

  const webhook = await getWebhookById(webhookId, session.userId);
  if (!webhook) notFound();

  return (
    <WebhookEditClient
      username={username}
      webhookId={webhook.id}
      initialName={webhook.name}
      initialUrl={webhook.url}
      initialTriggerEvent={webhook.triggerEvent}
      initialSecretKeySet={!!webhook.secretKey}
      initialActive={webhook.active}
    />
  );
}
