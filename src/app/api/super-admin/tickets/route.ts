import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSuperAdminSession } from "@/lib/super-admin-auth";

export async function GET() {
  const session = await getSuperAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const requests = await prisma.supportRequest.findMany({
      orderBy: [{ lastActivityAt: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        ticketNumber: true,
        category: true,
        subject: true,
        status: true,
        createdAt: true,
        lastActivityAt: true,
        user: {
          select: {
            name: true,
            email: true,
            username: true,
          },
        },
        _count: { select: { replies: true } },
      },
    });

    return NextResponse.json({
      requests: requests.map(({ _count, ...request }) => ({
        ...request,
        replyCount: _count.replies,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to load tickets." }, { status: 500 });
  }
}
