import { NextResponse } from "next/server";
import { getSuperAdminSession } from "@/lib/super-admin-auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getSuperAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const jobs = await prisma.cronJobHealth.findMany({
      orderBy: { jobKey: "asc" },
      select: {
        jobKey: true,
        lastRunAt: true,
        lastOk: true,
        lastDurationMs: true,
        lastError: true,
      },
    });

    return NextResponse.json({
      jobs: jobs.map((j) => ({
        jobKey: j.jobKey,
        lastRunAt: j.lastRunAt ? j.lastRunAt.toISOString() : null,
        lastOk: j.lastOk,
        lastDurationMs: j.lastDurationMs ?? null,
        lastError: j.lastError ?? null,
      })),
    });
  } catch (error) {
    console.error("[api/super-admin/cron-status][GET] Failed to load cron status", error);
    return NextResponse.json({ error: "Failed to load cron status." }, { status: 500 });
  }
}

