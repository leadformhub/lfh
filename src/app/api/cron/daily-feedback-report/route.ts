import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendDailyFeedbackReport } from "@/lib/email";

/**
 * Send daily feedback report (latest 10 entries) to SUPPORT_EMAIL.
 * Call via cron (e.g. once per day): GET or POST with header x-cron-secret: CRON_SECRET
 */
export async function GET(req: NextRequest) {
  return runDailyFeedbackReport(req);
}

export async function POST(req: NextRequest) {
  return runDailyFeedbackReport(req);
}

async function runDailyFeedbackReport(req: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  const provided =
    req.headers.get("x-cron-secret") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (secret && provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supportEmail = process.env.SUPPORT_EMAIL?.trim();
  if (!supportEmail) {
    return NextResponse.json(
      { error: "SUPPORT_EMAIL not configured" },
      { status: 500 }
    );
  }

  const feedbacks = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      message: true,
      userId: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          username: true,
          email: true,
        },
      },
    },
  });

  const ok = await sendDailyFeedbackReport(supportEmail, feedbacks);

  return NextResponse.json({
    ok,
    count: feedbacks.length,
    sentTo: supportEmail,
  });
}
