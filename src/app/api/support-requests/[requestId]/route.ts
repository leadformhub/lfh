import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { prisma } from "@/lib/db";

const patchBodySchema = z.object({
  status: z.enum(["open", "in_progress", "resolved"]),
});

/** Allow the ticket owner to update the ticket status. */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  const { requestId } = await params;
  const body = await req.json();
  const parsed = patchBodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 });

  const supportRequest = await prisma.supportRequest.findFirst({
    where: { id: requestId, userId: session.userId },
  });
  if (!supportRequest) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.supportRequest.update({
    where: { id: requestId },
    data: {
      status: parsed.data.status,
      lastActivityAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true, status: parsed.data.status });
}
