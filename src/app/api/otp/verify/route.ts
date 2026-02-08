import { NextRequest, NextResponse } from "next/server";
import { verifyOtp, verifyEmailOtp } from "@/services/otp.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formId, phone, email, otp } = body;
    if (!formId || !otp) {
      return NextResponse.json({ error: "formId and otp required" }, { status: 400 });
    }
    const otpStr = String(otp).trim();

    if (email != null && String(email).trim() !== "") {
      const ok = await verifyEmailOtp(formId, String(email).trim(), otpStr);
      if (!ok) {
        return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
      }
      return NextResponse.json({ verified: true });
    }

    if (phone != null && String(phone).trim() !== "") {
      const ok = await verifyOtp(formId, String(phone).trim(), otpStr);
      if (!ok) {
        return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
      }
      return NextResponse.json({ verified: true });
    }

    return NextResponse.json({ error: "phone or email required" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
