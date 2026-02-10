import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendPublicSupportFormNotification } from "@/lib/email";

const bodySchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email"),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(1, "Message is required").max(10000),
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

    const supportEmail = process.env.SUPPORT_EMAIL?.trim();
    if (!supportEmail) {
      return NextResponse.json(
        { error: "Support is not configured. Please try again later." },
        { status: 503 }
      );
    }

    const sent = await sendPublicSupportFormNotification(supportEmail, parsed.data);
    if (!sent) {
      return NextResponse.json(
        { error: "Failed to send your request. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/support/public]", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
