import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { createOrder } from "@/services/payment.service";

const bodySchema = z.object({ plan: z.enum(["pro", "business"]) });

export async function POST(req: NextRequest) {
  const auth = await getVerifiedSessionOrResponse();
  if ("response" in auth) return auth.response;
  const session = auth.session;
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }
  const result = await createOrder(session.userId, parsed.data.plan);
  if (!result) {
    return NextResponse.json({ error: "Could not create order. Check Razorpay config." }, { status: 500 });
  }
  return NextResponse.json(result);
}
