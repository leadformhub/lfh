import { NextResponse } from "next/server";
import { resendEmailVerification } from "@/services/auth.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const result = await resendEmailVerification(email);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ message: "Verification email sent. Check your inbox." });
  } catch (e) {
    console.error("Resend verification error:", e);
    return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
  }
}
