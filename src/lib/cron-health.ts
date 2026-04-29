import { prisma } from "@/lib/db";

export type CronJobKey =
  | "expire-plans"
  | "send-expiry-reminders"
  | "daily-users-report"
  | "daily-feedback-report"
  | "support-requests-auto-close";

export async function recordCronJobHealth(input: {
  jobKey: CronJobKey;
  ok: boolean;
  startedAt: number;
  error?: unknown;
}) {
  const durationMs = Math.max(0, Date.now() - input.startedAt);
  const message = input.ok
    ? null
    : input.error instanceof Error
      ? input.error.message
      : typeof input.error === "string"
        ? input.error
        : "Unknown error";

  try {
    await prisma.cronJobHealth.upsert({
      where: { jobKey: input.jobKey },
      create: {
        jobKey: input.jobKey,
        lastRunAt: new Date(),
        lastOk: input.ok,
        lastDurationMs: durationMs,
        lastError: message,
      },
      update: {
        lastRunAt: new Date(),
        lastOk: input.ok,
        lastDurationMs: durationMs,
        lastError: message,
      },
    });
  } catch (e) {
    // Best-effort only: cron should still succeed/fail based on its real work.
    console.warn("[cron-health] Failed to record cron health", e);
  }
}

