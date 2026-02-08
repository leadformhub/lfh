import { NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { getRazorpayKeyId, isRazorpayConfigured } from "@/lib/razorpay";

export async function GET() {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  const keyId = getRazorpayKeyId();
  const configured = isRazorpayConfigured();
  return NextResponse.json({
    keyId: keyId ?? null,
    configured: !!configured,
  });
}
