import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { verifyRecaptcha, isRecaptchaConfigured } from "@/lib/recaptcha";

const bodySchema = z.object({
  message: z.string().min(1, "Feedback is required").max(10000),
  recaptchaToken: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.message },
        { status: 400 }
      );
    }

    if (isRecaptchaConfigured()) {
      const token = typeof parsed.data.recaptchaToken === "string" ? parsed.data.recaptchaToken.trim() : "";
      if (!token) {
        return NextResponse.json(
          { error: "reCAPTCHA token missing. Please try again." },
          { status: 400 }
        );
      }
      const { success } = await verifyRecaptcha(token);
      if (!success) {
        return NextResponse.json(
          { error: "reCAPTCHA verification failed (low score or invalid). Please try again." },
          { status: 400 }
        );
      }
    }

    const session = await getSession();
    await prisma.feedback.create({
      data: {
        message: parsed.data.message.trim(),
        userId: session?.userId ?? null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/feedback]", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
