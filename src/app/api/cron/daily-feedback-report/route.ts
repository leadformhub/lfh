import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getConfiguredSupportEmail, sendDailyFeedbackReport } from "@/lib/email";
import { recordCronJobHealth } from "@/lib/cron-health";

/**
 * Send daily feedback report (latest 10 entries) to the configured Support Email.
 * Call via cron (e.g. once per day): GET or POST with header x-cron-secret: CRON_SECRET
 */
export async function GET(req: NextRequest) {
  return runDailyFeedbackReport(req);
}

export async function POST(req: NextRequest) {
  return runDailyFeedbackReport(req);
}

async function runDailyFeedbackReport(req: NextRequest) {
  const startedAt = Date.now();
  const secret = process.env.CRON_SECRET?.trim();
  const provided =
    req.headers.get("x-cron-secret") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (secret && provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supportEmail = (await getConfiguredSupportEmail()).trim();
    if (!supportEmail) {
      await recordCronJobHealth({
        jobKey: "daily-feedback-report",
        ok: false,
        startedAt,
        error: "Support email is not configured in Super Admin settings.",
      });
      return NextResponse.json(
        { error: "Support email is not configured in Super Admin settings." },
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
    await recordCronJobHealth({ jobKey: "daily-feedback-report", ok, startedAt });

    return NextResponse.json({
      ok,
      count: feedbacks.length,
      sentTo: supportEmail,
    });
  } catch (error) {
    await recordCronJobHealth({ jobKey: "daily-feedback-report", ok: false, startedAt, error });
    throw error;
  }
}
