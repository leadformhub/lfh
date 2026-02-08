import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createPasswordResetToken } from "@/services/auth.service";

const bodySchema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    await createPasswordResetToken(parsed.data.email);
    return NextResponse.json({ message: "If an account exists, you will receive a reset link." });
  } catch {
    return NextResponse.json({ message: "If an account exists, you will receive a reset link." });
  }
}
