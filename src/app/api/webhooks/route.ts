import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { getWebhooksByUserId, createWebhook } from "@/services/webhook.service";

export async function GET() {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const webhooks = await getWebhooksByUserId(result.session.userId);
  return NextResponse.json({ webhooks });
}

export async function POST(req: NextRequest) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;

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

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const url = typeof body.url === "string" ? body.url.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "Webhook name is required" }, { status: 400 });
  }
  if (!url) {
    return NextResponse.json({ error: "Webhook URL is required" }, { status: 400 });
  }

  try {
    const webhook = await createWebhook(result.session.userId, {
      name,
      url,
      triggerEvent: body.triggerEvent ?? "lead.created",
      secretKey: body.secretKey,
      active: body.active ?? true,
    });
    return NextResponse.json({ webhook });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create webhook";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
