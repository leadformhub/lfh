import { NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { testWebhook } from "@/services/webhook.service";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ webhookId: string }> }
) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;

  const { webhookId } = await params;
  if (!webhookId) {
    return NextResponse.json({ error: "Webhook ID required" }, { status: 400 });
  }

  const outcome = await testWebhook(webhookId, result.session.userId);
  if (outcome.error === "Webhook not found") {
    return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
  }
  return NextResponse.json({
    success: outcome.success,
    statusCode: outcome.statusCode,
    responseTimeMs: outcome.responseTimeMs,
    error: outcome.error,
  });
}
