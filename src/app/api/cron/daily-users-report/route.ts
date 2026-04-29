import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getConfiguredSupportEmail, sendDailyUsersReport } from "@/lib/email";
import { recordCronJobHealth } from "@/lib/cron-health";

/**
 * Send daily users list to the configured Support Email.
 * Call via cron (e.g. once per day): GET or POST with header x-cron-secret: CRON_SECRET
 */
export async function GET(req: NextRequest) {
  return runDailyUsersReport(req);
}

export async function POST(req: NextRequest) {
  return runDailyUsersReport(req);
}

async function runDailyUsersReport(req: NextRequest) {
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
        jobKey: "daily-users-report",
        ok: false,
        startedAt,
        error: "Support email is not configured in Super Admin settings.",
      });
      return NextResponse.json(
        { error: "Support email is not configured in Super Admin settings." },
        { status: 500 }
      );
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        plan: true,
        status: true,
        createdAt: true,
      },
    });

    const ok = await sendDailyUsersReport(supportEmail, users);
    await recordCronJobHealth({ jobKey: "daily-users-report", ok, startedAt });

    return NextResponse.json({
      ok,
      totalUsers: users.length,
      sentTo: supportEmail,
    });
  } catch (error) {
    await recordCronJobHealth({ jobKey: "daily-users-report", ok: false, startedAt, error });
    throw error;
  }
}
