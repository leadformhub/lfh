import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { consumePasswordResetToken, updatePassword } from "@/services/auth.service";

const bodySchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(100),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const userId = await consumePasswordResetToken(parsed.data.token);
    if (!userId) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }
    await updatePassword(userId, parsed.data.password);
    return NextResponse.json({ message: "Password updated. You can now log in." });
  } catch (e) {
    return NextResponse.json({ error: "Reset failed" }, { status: 500 });
  }
}
