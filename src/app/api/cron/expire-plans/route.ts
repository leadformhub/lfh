import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Downgrade paid users whose plan validity + 1-day grace has passed.
 * Lock excess forms (keep 3 most recently updated active).
 * Call via cron (e.g. daily): GET or POST with header x-cron-secret: CRON_SECRET
 */
export async function GET(req: NextRequest) {
  return runExpirePlans(req);
}

export async function POST(req: NextRequest) {
  return runExpirePlans(req);
}

async function runExpirePlans(req: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  const provided =
    req.headers.get("x-cron-secret") ?? req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (secret && provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const graceEnd = new Date();
  graceEnd.setTime(graceEnd.getTime() - 24 * 60 * 60 * 1000); // now - 1 day

  const users = await prisma.user.findMany({
    where: {
      plan: { in: ["pro", "business"] },
      planValidUntil: { not: null, lt: graceEnd },
    },
    select: { id: true },
  });

  if (users.length === 0) {
    return NextResponse.json({ ok: true, downgraded: 0, userIds: [] });
  }

  const userIds = users.map((u) => u.id);

  for (const userId of userIds) {
    await prisma.user.update({
      where: { id: userId },
      data: { plan: "free", planValidUntil: null },
    });

    const forms = await prisma.form.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: { id: true },
    });
    if (forms.length > 3) {
      const toLock = forms.slice(3).map((f) => f.id);
      await prisma.form.updateMany({
        where: { id: { in: toLock } },
        data: { lockedAt: new Date() },
      });
    }
  }

  return NextResponse.json({
    ok: true,
    downgraded: userIds.length,
    userIds,
  });
}
