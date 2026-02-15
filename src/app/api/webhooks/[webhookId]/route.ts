import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import {
  getWebhookById,
  updateWebhook,
  deleteWebhook,
} from "@/services/webhook.service";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ webhookId: string }> }
) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;

  const { webhookId } = await params;
  if (!webhookId) {
    return NextResponse.json({ error: "Webhook ID required" }, { status: 400 });
  }

  const webhook = await getWebhookById(webhookId, result.session.userId);
  if (!webhook) {
    return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
  }

  return NextResponse.json({
    webhook: {
      id: webhook.id,
      name: webhook.name,
      url: webhook.url,
      triggerEvent: webhook.triggerEvent,
      secretKey: webhook.secretKey ? "(set)" : null,
      active: webhook.active,
      createdAt: webhook.createdAt.toISOString(),
      updatedAt: webhook.updatedAt.toISOString(),
    },
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ webhookId: string }> }
) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;

  const { webhookId } = await params;
  if (!webhookId) {
    return NextResponse.json({ error: "Webhook ID required" }, { status: 400 });
  }

  let body: {
    name?: string;
    url?: string;
    triggerEvent?: string;
    secretKey?: string | null;
    active?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const webhook = await updateWebhook(webhookId, result.session.userId, body);
    if (!webhook) {
      return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
    }
    return NextResponse.json({
      webhook: {
        id: webhook.id,
        name: webhook.name,
        url: webhook.url,
        triggerEvent: webhook.triggerEvent,
        secretKey: webhook.secretKey ? "(set)" : null,
        active: webhook.active,
        createdAt: webhook.createdAt.toISOString(),
        updatedAt: webhook.updatedAt.toISOString(),
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update webhook";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ webhookId: string }> }
) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;

  const { webhookId } = await params;
  if (!webhookId) {
    return NextResponse.json({ error: "Webhook ID required" }, { status: 400 });
  }

  const deleted = await deleteWebhook(webhookId, result.session.userId);
  if (!deleted) {
    return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
