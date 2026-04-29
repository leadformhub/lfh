import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSuperAdminSession } from "@/lib/super-admin-auth";
import { getBaseUrlForEmail } from "@/lib/app-url";

const bodySchema = z.object({
  jobKey: z.enum([
    "expire-plans",
    "send-expiry-reminders",
    "daily-users-report",
    "daily-feedback-report",
    "support-requests-auto-close",
  ]),
});

function getJobPath(jobKey: z.infer<typeof bodySchema>["jobKey"]) {
  switch (jobKey) {
    case "expire-plans":
      return "/api/cron/expire-plans";
    case "send-expiry-reminders":
      return "/api/cron/send-expiry-reminders";
    case "daily-users-report":
      return "/api/cron/daily-users-report";
    case "daily-feedback-report":
      return "/api/cron/daily-feedback-report";
    case "support-requests-auto-close":
      return "/api/support-requests/auto-close";
  }
}

export async function POST(req: NextRequest) {
  const session = await getSuperAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const secret = process.env.CRON_SECRET?.trim() || "";
  const baseUrl = getBaseUrlForEmail();
  const url = `${baseUrl}${getJobPath(parsed.data.jobKey)}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        ...(secret ? { "x-cron-secret": secret } : {}),
      },
      cache: "no-store",
    });

    const text = await res.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    return NextResponse.json(
      {
        ok: res.ok,
        status: res.status,
        jobKey: parsed.data.jobKey,
        result: data,
      },
      { status: res.ok ? 200 : 502 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { ok: false, jobKey: parsed.data.jobKey, error: `Failed to run cron job. ${message}` },
      { status: 502 }
    );
  }
}

