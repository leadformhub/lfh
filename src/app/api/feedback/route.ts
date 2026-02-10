import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const bodySchema = z.object({
  message: z.string().min(1, "Feedback is required").max(10000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join(" ");
      return NextResponse.json({ error: msg }, { status: 400 });
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
