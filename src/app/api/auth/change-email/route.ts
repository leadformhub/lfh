import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { createEmailChangeRequest } from "@/services/auth.service";

const bodySchema = z.object({ newEmail: z.string().email() });

export async function POST(req: NextRequest) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  try {
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
    await createEmailChangeRequest(session.userId, parsed.data.newEmail);
    return NextResponse.json({
      message: "Verification email sent. Check your new email inbox to confirm the change.",
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to send verification email";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
