import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Inbound email webhook: record replies so they show in the dashboard thread.
 * Call this when an email is received at your support inbox (e.g. user replying to the ticket thread).
 *
 * Configure your email provider to POST to: https://your-domain.com/api/support-requests/inbound
 * With header: x-inbound-secret: <INBOUND_EMAIL_SECRET>
 *
 * Body (JSON or form-like): from, subject, text (plain body). Optional: html
 */

const TICKET_REGEX = /(?:Ticket\s+)?#?LFH-(\d+)/i;

/** Extract and normalize ticket number from subject (e.g. LFH-6 or LFH-000006 -> LFH-000006). */
function extractTicketNumber(subject: string): string | null {
  const match = subject.match(TICKET_REGEX);
  if (!match) return null;
  const num = match[1];
  return `LFH-${num.padStart(6, "0")}`;
}

function normalizeEmail(email: string): string {
  const addr = email.replace(/^.*<([^>]+)>$/, "$1").trim().toLowerCase();
  return addr;
}

function getBodyText(text: string | null, html: string | null): string {
  if (text && text.trim()) return text.trim();
  if (html && html.trim()) {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  return "";
}

/** Strip common quoted reply lines so we store only the new message. */
function stripQuotedReply(body: string): string {
  const lines = body.split(/\r?\n/);
  const result: string[] = [];
  for (const line of lines) {
    if (/^On\s+.+wrote:$/i.test(line.trim())) break;
    if (/^>{1,2}\s*/.test(line)) continue;
    if (/^-{3,}\s*Original Message\s*-{3,}/i.test(line)) break;
    if (/^From:\s+/i.test(line) && result.length > 0) break;
    result.push(line);
  }
  return result.join("\n").trim();
}

export async function POST(req: NextRequest) {
  const secret = process.env.INBOUND_EMAIL_SECRET?.trim();
  const provided =
    req.headers.get("x-inbound-secret") ?? req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let from = "";
  let subject = "";
  let text: string | null = null;
  let html: string | null = null;

  const contentType = req.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = await req.json();
    from = String(body.from ?? body.From ?? body.sender ?? "").trim();
    subject = String(body.subject ?? body.Subject ?? "").trim();
    text = body.text ?? body["body-plain"] ?? body.plain ?? null;
    html = body.html ?? body["body-html"] ?? body["body_html"] ?? null;
  } else {
    const formData = await req.formData();
    from = String(formData.get("from") ?? formData.get("sender") ?? "").trim();
    subject = String(formData.get("subject") ?? "").trim();
    const rawText = formData.get("text") ?? formData.get("body-plain") ?? null;
    text = rawText != null && typeof rawText === "string" ? rawText : null;
    const rawHtml = formData.get("html") ?? formData.get("body-html") ?? null;
    html = rawHtml != null && typeof rawHtml === "string" ? rawHtml : null;
  }

  if (!from) {
    return NextResponse.json({ error: "Missing from" }, { status: 400 });
  }

  const ticketNumber = extractTicketNumber(subject);
  if (!ticketNumber) {
    return NextResponse.json({ error: "No ticket number in subject", ok: false }, { status: 200 });
  }

  const supportRequest = await prisma.supportRequest.findUnique({
    where: { ticketNumber },
    include: { user: { select: { email: true } } },
  });
  if (!supportRequest) {
    return NextResponse.json({ error: "Ticket not found", ok: false }, { status: 200 });
  }

  const bodyText = getBodyText(text, html);
  if (!bodyText) {
    return NextResponse.json({ error: "Empty body", ok: false }, { status: 200 });
  }

  const normalizedFrom = normalizeEmail(from);
  const userEmail = normalizeEmail(supportRequest.user.email);
  const supportEmails = [
    process.env.SUPPORT_EMAIL,
    process.env.MAIL_SUPPORT_TO,
  ]
    .filter(Boolean)
    .map((e) => normalizeEmail(String(e)));

  const isFromStaff = supportEmails.includes(normalizedFrom);
  const replyBody = stripQuotedReply(bodyText).slice(0, 10000);

  await prisma.supportRequestReply.create({
    data: {
      supportRequestId: supportRequest.id,
      body: replyBody,
      isFromStaff,
    },
  });
  await prisma.supportRequest.update({
    where: { id: supportRequest.id },
    data: { lastActivityAt: new Date() },
  });

  return NextResponse.json({ ok: true, ticketNumber: `#${ticketNumber}`, recorded: true });
}
