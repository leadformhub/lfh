import { createHmac } from "crypto";
import { prisma } from "@/lib/db";
import { parseLeadData } from "./leads.service";

export const WEBHOOK_TRIGGER_EVENTS = ["lead.created", "lead.stage_changed", "lead.won"] as const;
export type WebhookTriggerEvent = (typeof WEBHOOK_TRIGGER_EVENTS)[number];

const WEBHOOK_TIMEOUT_MS = 5000;
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1500;

export type LeadForPayload = {
  id: string;
  dataJson: string;
  createdAt: Date;
  utmSource?: string | null;
  stage?: { name: string } | null;
};

function getByKeys(data: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = data[k];
    if (v != null && String(v).trim() !== "") return String(v).trim();
  }
  return "";
}

/**
 * Build the fixed webhook payload shape. Same structure for all events.
 */
export function buildWebhookPayload(
  event: WebhookTriggerEvent,
  lead: LeadForPayload
): { event: string; timestamp: string; lead: Record<string, string> } {
  const data = parseLeadData(lead.dataJson);
  const name = getByKeys(data, ["name", "Name", "full_name", "fullName"]);
  const email = getByKeys(data, ["email", "Email"]);
  const phone = getByKeys(data, ["phone_number", "phone"]);
  const stage = lead.stage?.name ?? "New";
  const source = lead.utmSource?.trim() || "Direct";

  return {
    event,
    timestamp: new Date().toISOString(),
    lead: {
      id: lead.id,
      name,
      email,
      phone,
      stage,
      source,
      created_at: lead.createdAt.toISOString(),
    },
  };
}

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function getWebhooksByUserId(userId: string) {
  return prisma.webhook.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getWebhookById(webhookId: string, userId: string) {
  return prisma.webhook.findFirst({
    where: { id: webhookId, userId },
  });
}

export async function createWebhook(
  userId: string,
  data: {
    name: string;
    url: string;
    triggerEvent: string;
    secretKey?: string | null;
    active?: boolean;
  }
) {
  const name = data.name?.trim() || "Webhook";
  const url = data.url?.trim() || "";
  if (!isValidUrl(url)) {
    throw new Error("Invalid webhook URL");
  }
  const triggerEvent = data.triggerEvent?.trim();
  if (!triggerEvent || !WEBHOOK_TRIGGER_EVENTS.includes(triggerEvent as WebhookTriggerEvent)) {
    throw new Error("Invalid trigger event");
  }

  return prisma.webhook.create({
    data: {
      userId,
      name,
      url,
      triggerEvent,
      secretKey: data.secretKey?.trim() || null,
      active: data.active ?? true,
    },
  });
}

export async function updateWebhook(
  webhookId: string,
  userId: string,
  data: {
    name?: string;
    url?: string;
    triggerEvent?: string;
    secretKey?: string | null;
    active?: boolean;
  }
) {
  const existing = await prisma.webhook.findFirst({
    where: { id: webhookId, userId },
  });
  if (!existing) return null;

  const update: {
    name?: string;
    url?: string;
    triggerEvent?: string;
    secretKey?: string | null;
    active?: boolean;
  } = {};

  if (data.name !== undefined) update.name = data.name.trim() || existing.name;
  if (data.url !== undefined) {
    const url = data.url.trim();
    if (!isValidUrl(url)) throw new Error("Invalid webhook URL");
    update.url = url;
  }
  if (data.triggerEvent !== undefined) {
    const triggerEvent = data.triggerEvent.trim();
    if (!WEBHOOK_TRIGGER_EVENTS.includes(triggerEvent as WebhookTriggerEvent)) {
      throw new Error("Invalid trigger event");
    }
    update.triggerEvent = triggerEvent;
  }
  if (data.secretKey !== undefined) update.secretKey = data.secretKey?.trim() || null;
  if (data.active !== undefined) update.active = data.active;

  if (Object.keys(update).length === 0) return existing;

  return prisma.webhook.update({
    where: { id: webhookId },
    data: update,
  });
}

export async function deleteWebhook(webhookId: string, userId: string) {
  const result = await prisma.webhook.deleteMany({
    where: { id: webhookId, userId },
  });
  return result.count > 0;
}

function computeSignature(payloadString: string, secret: string): string {
  return createHmac("sha256", secret).update(payloadString, "utf8").digest("hex");
}

type WebhookRow = {
  id: string;
  name: string;
  url: string;
  triggerEvent: string;
  secretKey: string | null;
  active: boolean;
};

/**
 * Send one webhook with retries (max 3 attempts). Logs each attempt; never throws.
 */
async function sendOneWebhook(
  webhook: WebhookRow,
  payload: { event: string; timestamp: string; lead: Record<string, string> }
): Promise<void> {
  const payloadString = JSON.stringify(payload);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (webhook.secretKey) {
    headers["x-webhook-signature"] = computeSignature(payloadString, webhook.secretKey);
  }

  let lastStatus: number | null = null;
  let lastError: string | null = null;
  let responseTimeMs: number | null = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const start = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

    try {
      const res = await fetch(webhook.url, {
        method: "POST",
        headers,
        body: payloadString,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      responseTimeMs = Date.now() - start;
      lastStatus = res.status;

      if (res.ok) {
        await prisma.webhookLog.create({
          data: {
            webhookId: webhook.id,
            event: payload.event,
            targetUrl: webhook.url,
            status: "success",
            httpStatus: res.status,
            responseTimeMs,
            attemptCount: attempt,
          },
        });
        return;
      }
      lastError = `HTTP ${res.status}`;
    } catch (err) {
      clearTimeout(timeoutId);
      responseTimeMs = Date.now() - start;
      lastError = err instanceof Error ? err.message : String(err);
    }

    if (attempt < MAX_ATTEMPTS) {
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    }
  }

  await prisma.webhookLog.create({
    data: {
      webhookId: webhook.id,
      event: payload.event,
      targetUrl: webhook.url,
      status: "failed",
      httpStatus: lastStatus,
      responseTimeMs,
      attemptCount: MAX_ATTEMPTS,
      errorMessage: lastError,
    },
  });
}

/**
 * Dispatch webhooks for an event. Loads active webhooks for user and event, builds payload, sends each (with retry). Fire-and-forget; never throws.
 */
export async function dispatchWebhooksForEvent(
  userId: string,
  event: WebhookTriggerEvent,
  lead: LeadForPayload
): Promise<void> {
  const webhooks = await prisma.webhook.findMany({
    where: { userId, triggerEvent: event, active: true },
  });
  if (webhooks.length === 0) return;

  const payload = buildWebhookPayload(event, lead);

  for (const webhook of webhooks) {
    sendOneWebhook(webhook, payload).catch((err) =>
      console.error("[webhooks] sendOneWebhook failed:", webhook.id, err)
    );
  }
}

const SAMPLE_LEAD: LeadForPayload = {
  id: "sample-lead-id",
  dataJson: JSON.stringify({
    name: "Sample Lead",
    email: "sample@example.com",
    phone: "+1234567890",
  }),
  createdAt: new Date(),
  utmSource: "Direct",
  stage: { name: "New" },
};

/**
 * Test webhook: send sample payload once, log result, return outcome.
 */
export async function testWebhook(
  webhookId: string,
  userId: string
): Promise<{ success: boolean; statusCode?: number; responseTimeMs?: number; error?: string }> {
  const webhook = await prisma.webhook.findFirst({
    where: { id: webhookId, userId },
  });
  if (!webhook) {
    return { success: false, error: "Webhook not found" };
  }

  const payload = buildWebhookPayload("lead.created", SAMPLE_LEAD);
  const payloadString = JSON.stringify(payload);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (webhook.secretKey) {
    headers["x-webhook-signature"] = computeSignature(payloadString, webhook.secretKey);
  }

  const start = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

  try {
    const res = await fetch(webhook.url, {
      method: "POST",
      headers,
      body: payloadString,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const responseTimeMs = Date.now() - start;

    await prisma.webhookLog.create({
      data: {
        webhookId: webhook.id,
        event: "lead.created",
        targetUrl: webhook.url,
        status: res.ok ? "success" : "failed",
        httpStatus: res.status,
        responseTimeMs,
        attemptCount: 1,
        errorMessage: res.ok ? null : `HTTP ${res.status}`,
      },
    });

    return {
      success: res.ok,
      statusCode: res.status,
      responseTimeMs,
      error: res.ok ? undefined : `HTTP ${res.status}`,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    const responseTimeMs = Date.now() - start;
    const errorMessage = err instanceof Error ? err.message : String(err);

    await prisma.webhookLog.create({
      data: {
        webhookId: webhook.id,
        event: "lead.created",
        targetUrl: webhook.url,
        status: "failed",
        httpStatus: null,
        responseTimeMs,
        attemptCount: 1,
        errorMessage,
      },
    });

    return {
      success: false,
      responseTimeMs,
      error: errorMessage,
    };
  }
}

export async function getWebhookLogs(
  userId: string,
  options: {
    event?: string;
    status?: string;
    page?: number;
    perPage?: number;
  } = {}
) {
  const page = Math.max(1, options.page ?? 1);
  const perPage = Math.min(50, Math.max(1, options.perPage ?? 20));
  const skip = (page - 1) * perPage;

  const where: { webhook: { userId: string }; event?: string; status?: string } = {
    webhook: { userId },
  };
  if (options.event?.trim()) where.event = options.event.trim();
  if (options.status?.trim() && ["success", "failed"].includes(options.status.trim())) {
    where.status = options.status.trim();
  }

  const [logs, total] = await Promise.all([
    prisma.webhookLog.findMany({
      where,
      include: { webhook: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
    }),
    prisma.webhookLog.count({ where }),
  ]);

  return {
    logs: logs.map((l) => ({
      id: l.id,
      webhookId: l.webhookId,
      webhookName: l.webhook.name,
      event: l.event,
      targetUrl: l.targetUrl,
      status: l.status,
      httpStatus: l.httpStatus,
      responseTimeMs: l.responseTimeMs,
      attemptCount: l.attemptCount,
      errorMessage: l.errorMessage,
      createdAt: l.createdAt.toISOString(),
    })),
    total,
    page,
    perPage,
  };
}
