import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendPlanExpiryReminder } from "@/lib/email";
import { getBaseUrlForEmail } from "@/lib/app-url";

/**
 * Send "3 days before expiry" email to paid users whose planValidUntil is in the 2.5–3.5 day window.
 * Call via cron (e.g. daily): GET or POST with header x-cron-secret: CRON_SECRET
 */
export async function GET(req: NextRequest) {
  return runSendReminders(req);
}

export async function POST(req: NextRequest) {
  return runSendReminders(req);
}

async function runSendReminders(req: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  const provided =
    req.headers.get("x-cron-secret") ?? req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (secret && provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = Date.now();
  const inDays = (d: number) => d * 24 * 60 * 60 * 1000;
  const from = new Date(now + inDays(2.5));
  const to = new Date(now + inDays(3.5));

  const users = await prisma.user.findMany({
    where: {
      plan: { in: ["pro", "business"] },
      planValidUntil: { not: null, gte: from, lte: to },
    },
    select: { id: true, email: true, plan: true, planValidUntil: true },
  });

  const baseUrl = getBaseUrlForEmail();
  const upgradeUrl = `${baseUrl}/pricing`;

  let sent = 0;
  for (const user of users) {
    const expiryDate = user.planValidUntil!;
    const planName = user.plan === "business" ? "Business" : "Pro";
    const ok = await sendPlanExpiryReminder(user.email, planName, expiryDate, upgradeUrl);
    if (ok) sent++;
  }

  return NextResponse.json({
    ok: true,
    usersInWindow: users.length,
    sent,
  });
}
