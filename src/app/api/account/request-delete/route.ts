import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { createDeleteAccountToken } from "@/services/auth.service";

/** Sends a delete confirmation email to the logged-in user. For Google users who may not have a password. */
export async function POST(req: NextRequest) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;

  try {
    await createDeleteAccountToken(result.session.userId);
    return NextResponse.json({
      success: true,
      message: "If an account exists, you will receive a confirmation link shortly.",
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to send confirmation";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
