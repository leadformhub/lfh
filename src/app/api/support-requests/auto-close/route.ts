import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const INACTIVE_DAYS = 7;

/**
 * Auto-close tickets with no activity for 7 days.
 * Call via cron (e.g. daily): GET or POST with header x-cron-secret: CRON_SECRET
 */
export async function GET(req: NextRequest) {
  return runAutoClose(req);
}

export async function POST(req: NextRequest) {
  return runAutoClose(req);
}

async function runAutoClose(req: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  const provided = req.headers.get("x-cron-secret") ?? req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (secret && provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - INACTIVE_DAYS);

  const toClose = await prisma.supportRequest.findMany({
    where: {
      status: { not: "resolved" },
      OR: [
        { lastActivityAt: { lt: cutoff } },
        { lastActivityAt: null, updatedAt: { lt: cutoff } },
      ],
    },
    select: { id: true, ticketNumber: true, subject: true },
  });

  if (toClose.length === 0) {
    return NextResponse.json({ ok: true, closed: 0, message: "No tickets to close" });
  }

  await prisma.supportRequest.updateMany({
    where: { id: { in: toClose.map((t) => t.id) } },
    data: { status: "resolved" },
  });

  return NextResponse.json({
    ok: true,
    closed: toClose.length,
    tickets: toClose.map((t) => ({ id: t.id, ticketNumber: t.ticketNumber, subject: t.subject })),
  });
}
