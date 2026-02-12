import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateStage } from "@/services/pipelines.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ stageId: string }> }
) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  const { stageId } = await params;
  if (!stageId) return NextResponse.json({ error: "Stage ID required" }, { status: 400 });
  const stage = await prisma.pipelineStage.findFirst({
    where: { id: stageId },
    include: { pipeline: { select: { userId: true } } },
  });
  if (!stage || stage.pipeline.userId !== session.userId) {
    return NextResponse.json({ error: "Stage not found" }, { status: 404 });
  }
  let body: { name?: string; order?: number } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const updated = await updateStage(stageId, { name: body.name, order: body.order });
  return NextResponse.json({ stage: updated });
}
