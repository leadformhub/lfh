import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { getWebhookLogs } from "@/services/webhook.service";

export async function GET(req: NextRequest) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;

  const { searchParams } = new URL(req.url);
  const event = searchParams.get("event")?.trim() || undefined;
  const status = searchParams.get("status")?.trim() || undefined;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get("perPage") || "20", 10) || 20));

  const data = await getWebhookLogs(result.session.userId, {
    event,
    status,
    page,
    perPage,
  });
  return NextResponse.json(data);
}
