import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendSupportRequestNotification, sendTicketConfirmationToUser } from "@/lib/email";

const CATEGORY_LABELS: Record<string, string> = {
  billing: "Billing",
  bug: "Bug Report",
  feature: "Feature Request",
  general: "General",
  other: "Other",
};

const createBodySchema = z.object({
  category: z.enum(["billing", "bug", "feature", "general", "other"]),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(10000),
});

export async function POST(req: NextRequest) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  try {
    const body = await req.json();
    const parsed = createBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 });
    }
    const { category, subject, message } = parsed.data;

    // Generate unique ticket number: #LFH-000001, #LFH-000002, ...
    let ticketNumber: string;
    for (let attempt = 0; attempt < 5; attempt++) {
      const count = await prisma.supportRequest.count();
      ticketNumber = `LFH-${String(count + 1).padStart(6, "0")}`;
      try {
        const supportRequest = await prisma.supportRequest.create({
          data: {
            ticketNumber,
            userId: session.userId,
            category,
            subject,
            message,
            lastActivityAt: new Date(),
          },
        });

        const ticketDisplay = `#${ticketNumber}`;
        const categoryLabel = CATEGORY_LABELS[category] ?? category;

        // Notify support staff by email (if SUPPORT_EMAIL is set). Reply-To is set to user's email so support's reply goes to the user.
        const supportEmail = process.env.SUPPORT_EMAIL || process.env.MAIL_SUPPORT_TO;
        if (supportEmail && supportEmail.trim()) {
          const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { name: true },
          });
          await sendSupportRequestNotification(supportEmail.trim(), {
            ticketNumber: ticketDisplay,
            userName: user?.name ?? session.username,
            userEmail: session.email,
            username: session.username,
            category,
            subject,
            message,
            requestId: supportRequest.id,
          });
        }

        // Confirm to the user: ticket number + where to see replies (their inbox). Reply-To support so user can reply to add more info.
        await sendTicketConfirmationToUser(session.email, {
          ticketNumber: ticketDisplay,
          subject,
          categoryLabel,
        });

        return NextResponse.json({
          request: {
            id: supportRequest.id,
            ticketNumber: ticketDisplay,
            category: supportRequest.category,
            subject: supportRequest.subject,
            status: supportRequest.status,
            createdAt: supportRequest.createdAt,
          },
        });
      } catch (createErr: unknown) {
        const isUniqueViolation =
          createErr && typeof createErr === "object" && "code" in createErr && (createErr as { code: string }).code === "P2002";
        if (isUniqueViolation && attempt < 4) continue;
        throw createErr;
      }
    }
    throw new Error("Failed to generate ticket number");
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create support request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET() {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  try {
    const requests = await prisma.supportRequest.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        ticketNumber: true,
        category: true,
        subject: true,
        message: true,
        status: true,
        createdAt: true,
        _count: { select: { replies: true } },
      },
    });
    return NextResponse.json({
      requests: requests.map(({ _count, ...r }) => ({ ...r, replyCount: _count.replies })),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch support requests";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
