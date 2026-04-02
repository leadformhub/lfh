import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSuperAdminSession } from "@/lib/super-admin-auth";
import { isEmailConfigured, sendSupportReplyToUser } from "@/lib/email";

const postBodySchema = z.object({
  message: z.string().min(1).max(10000),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const session = await getSuperAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { requestId } = await params;

  try {
    const request = await prisma.supportRequest.findUnique({
      where: { id: requestId },
      include: {
        replies: { orderBy: { createdAt: "asc" } },
        user: { select: { name: true, email: true, username: true } },
      },
    });

    if (!request) return NextResponse.json({ error: "Ticket not found." }, { status: 404 });

    return NextResponse.json({
      request: {
        id: request.id,
        ticketNumber: request.ticketNumber,
        category: request.category,
        subject: request.subject,
        message: request.message,
        status: request.status,
        createdAt: request.createdAt,
        user: request.user,
      },
      replies: request.replies.map((reply) => ({
        id: reply.id,
        body: reply.body,
        isFromStaff: reply.isFromStaff,
        createdAt: reply.createdAt,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to load ticket thread." }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const session = await getSuperAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { requestId } = await params;

  try {
    const body = await req.json();
    const parsed = postBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid reply payload." }, { status: 400 });
    }

    const request = await prisma.supportRequest.findUnique({
      where: { id: requestId },
      include: { user: { select: { email: true } } },
    });
    if (!request) return NextResponse.json({ error: "Ticket not found." }, { status: 404 });

    const reply = await prisma.supportRequestReply.create({
      data: {
        supportRequestId: requestId,
        body: parsed.data.message,
        isFromStaff: true,
      },
    });

    await prisma.supportRequest.update({
      where: { id: requestId },
      data: {
        lastActivityAt: new Date(),
        status: request.status === "resolved" ? "in_progress" : request.status,
      },
    });

    const ticketDisplay = request.ticketNumber
      ? `#${request.ticketNumber}`
      : `#REF-${request.id.slice(-6)}`;

    const emailConfigured = await isEmailConfigured();
    let emailSent = false;
    let emailError: string | null = null;
    try {
      if (!emailConfigured) {
        emailError = "SMTP is not configured. Update Super Admin SMTP settings.";
      } else {
        emailSent = await sendSupportReplyToUser(request.user.email, {
          ticketNumber: ticketDisplay,
          subject: request.subject,
          replyBody: parsed.data.message,
        });
        if (!emailSent) {
          emailError =
            "SMTP delivery failed. Verify SMTP host/port/credentials and sender domain setup (SPF/DKIM/DMARC).";
        }
      }
    } catch (err) {
      console.error("[api/super-admin/tickets/replies] Reply saved but email delivery failed", {
        requestId,
        userEmail: request.user.email,
        error: err,
      });
      emailError = "Unexpected email transport error while delivering reply.";
    }

    return NextResponse.json({
      ok: true,
      email: {
        sent: emailSent,
        configured: emailConfigured,
        error: emailError,
      },
      reply: {
        id: reply.id,
        createdAt: reply.createdAt,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to send reply." }, { status: 500 });
  }
}
