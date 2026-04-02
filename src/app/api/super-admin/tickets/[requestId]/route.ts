import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSuperAdminSession } from "@/lib/super-admin-auth";

const patchBodySchema = z.object({
  status: z.enum(["open", "in_progress", "resolved"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const session = await getSuperAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { requestId } = await params;

  try {
    const body = await req.json();
    const parsed = patchBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid status payload." }, { status: 400 });
    }

    const existing = await prisma.supportRequest.findUnique({
      where: { id: requestId },
      select: { id: true },
    });
    if (!existing) return NextResponse.json({ error: "Ticket not found." }, { status: 404 });

    await prisma.supportRequest.update({
      where: { id: requestId },
      data: {
        status: parsed.data.status,
        lastActivityAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true, status: parsed.data.status });
  } catch {
    return NextResponse.json({ error: "Failed to update ticket status." }, { status: 500 });
  }
}
