import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendSupportReplyToUser, sendUserReplyNotificationToSupport } from "@/lib/email";

const postBodySchema = z.object({
  message: z.string().min(1).max(10000),
  fromSupport: z.boolean().optional().default(false),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  const { requestId } = await params;
  const request = await prisma.supportRequest.findFirst({
    where: { id: requestId, userId: session.userId },
    include: { replies: { orderBy: { createdAt: "asc" } } },
  });
  if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    request: {
      id: request.id,
      ticketNumber: request.ticketNumber,
      subject: request.subject,
      message: request.message,
      status: request.status,
      createdAt: request.createdAt,
    },
    replies: request.replies.map((r) => ({
      id: r.id,
      body: r.body,
      isFromStaff: r.isFromStaff,
      createdAt: r.createdAt,
    })),
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const { requestId } = await params;
  const body = await req.json();
  const parsed = postBodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  const { message, fromSupport } = parsed.data;

  if (fromSupport) {
    const supportKey = process.env.SUPPORT_API_KEY?.trim();
    const authHeader = req.headers.get("authorization");
    const headerKey = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const keyFromHeader = req.headers.get("x-support-key");
    const providedKey = headerKey ?? keyFromHeader;
    if (!supportKey || providedKey !== supportKey) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const supportRequest = await prisma.supportRequest.findUnique({
      where: { id: requestId },
      include: { user: { select: { email: true } } },
    });
    if (!supportRequest) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const reply = await prisma.supportRequestReply.create({
      data: {
        supportRequestId: requestId,
        body: message,
        isFromStaff: true,
      },
    });
    await prisma.supportRequest.update({
      where: { id: requestId },
      data: { lastActivityAt: new Date() },
    });
    const ticketDisplay = supportRequest.ticketNumber ? `#${supportRequest.ticketNumber}` : `#REF-${supportRequest.id.slice(-6)}`;
    await sendSupportReplyToUser(supportRequest.user.email, {
      ticketNumber: ticketDisplay,
      subject: supportRequest.subject,
      replyBody: message,
    });
    return NextResponse.json({ reply: { id: reply.id, createdAt: reply.createdAt } });
  }

  const authResult = await getVerifiedSessionOrResponse();
  if ("response" in authResult) return authResult.response;
  const session = authResult.session;
  const supportRequest = await prisma.supportRequest.findFirst({
    where: { id: requestId, userId: session.userId },
    include: { user: { select: { name: true, email: true } } },
  });
  if (!supportRequest) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const reply = await prisma.supportRequestReply.create({
    data: {
      supportRequestId: requestId,
      body: message,
      isFromStaff: false,
    },
  });
  await prisma.supportRequest.update({
    where: { id: requestId },
    data: { lastActivityAt: new Date() },
  });

  const supportEmail = process.env.SUPPORT_EMAIL || process.env.MAIL_SUPPORT_TO;
  if (supportEmail?.trim()) {
    const ticketDisplay = supportRequest.ticketNumber
      ? `#${supportRequest.ticketNumber}`
      : `#REF-${supportRequest.id.slice(-6)}`;
    await sendUserReplyNotificationToSupport(supportEmail.trim(), {
      ticketNumber: ticketDisplay,
      subject: supportRequest.subject,
      userName: supportRequest.user.name ?? session.username,
      userEmail: supportRequest.user.email,
      replyBody: message,
    });
  }

  return NextResponse.json({ reply: { id: reply.id, createdAt: reply.createdAt } });
}
