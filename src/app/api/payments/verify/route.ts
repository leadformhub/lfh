import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { verifyAndFulfill } from "@/services/payment.service";
import { createToken } from "@/lib/jwt";
import { getSessionCookieName, getSessionMaxAge } from "@/lib/jwt";

const bodySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export async function POST(req: NextRequest) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;
  const result = await verifyAndFulfill(
    session.userId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );
  if (!result.success) {
    return NextResponse.json({ error: result.error ?? "Verification failed" }, { status: 400 });
  }
  const newToken = await createToken({
    userId: session.userId,
    username: session.username,
    email: session.email,
    plan: result.plan!,
  });
  const res = NextResponse.json({ success: true, plan: result.plan });
  res.cookies.set(getSessionCookieName(), newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: getSessionMaxAge(),
    path: "/",
  });
  return res;
}
