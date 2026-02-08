import { NextRequest, NextResponse } from "next/server";
import { createAndSendOtp, createAndSendEmailOtp } from "@/services/otp.service";
import { prisma } from "@/lib/db";
import { parseFormSchema } from "@/lib/form-schema";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  try {
    const { formId, phone, email } = body && typeof body === "object" ? (body as { formId?: string; phone?: string; email?: string }) : {};
    if (!formId) {
      return NextResponse.json({ error: "formId required" }, { status: 400 });
    }
    const form = await prisma.form.findUnique({ where: { id: formId } });
    if (!form) return NextResponse.json({ error: "Form not found" }, { status: 404 });
    const schema = parseFormSchema(form.schemaJson);

    if (email != null && String(email).trim() !== "") {
      if (!schema.settings?.emailOtpEnabled) {
        return NextResponse.json({ error: "Email OTP not enabled for this form" }, { status: 400 });
      }
      const result = await createAndSendEmailOtp(formId, form.userId, String(email).trim());
      if (!result.success) {
        return NextResponse.json({ error: result.message }, { status: 400 });
      }
      return NextResponse.json({ message: "OTP sent to your email" });
    }

    if (phone != null && String(phone).trim() !== "") {
      if (!schema.settings?.mobileOtpEnabled) {
        return NextResponse.json({ error: "OTP not enabled for this form" }, { status: 400 });
      }
      console.warn("[api/otp/send] Sending mobile OTP – formId:", formId, "phone: ****" + String(phone).trim().slice(-4));
      const result = await createAndSendOtp(formId, form.userId, String(phone).trim());
      if (!result.success) {
        console.warn("[api/otp/send] Mobile OTP failed:", result.message);
        return NextResponse.json({ error: result.message }, { status: 400 });
      }
      return NextResponse.json({ message: "OTP sent" });
    }

    return NextResponse.json({ error: "phone or email required" }, { status: 400 });
  } catch (e) {
    console.error("[api/otp/send]", e);
    const message =
      e instanceof Error ? e.message : "Failed to send OTP. Check server logs or try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
