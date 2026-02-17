import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendDailyUsersReport } from "@/lib/email";

/**
 * Send daily users list to SUPPORT_EMAIL.
 * Call via cron (e.g. once per day): GET or POST with header x-cron-secret: CRON_SECRET
 */
export async function GET(req: NextRequest) {
  return runDailyUsersReport(req);
}

export async function POST(req: NextRequest) {
  return runDailyUsersReport(req);
}

async function runDailyUsersReport(req: NextRequest) {
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

  return NextResponse.json({
    ok,
    totalUsers: users.length,
    sentTo: supportEmail,
  });
}
