import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { getPipelineById, createStage } from "@/services/pipelines.service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ pipelineId: string }> }
) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  const { pipelineId } = await params;
  if (!pipelineId) return NextResponse.json({ error: "Pipeline ID required" }, { status: 400 });
  const pipeline = await getPipelineById(pipelineId, session.userId);
  if (!pipeline) return NextResponse.json({ error: "Pipeline not found" }, { status: 404 });
  let body: { name?: string; order?: number } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const order = typeof body.order === "number" ? body.order : pipeline.stages.length;
  const stage = await createStage(pipelineId, {
    name: body.name?.trim() ?? "Stage",
    order,
  });
  return NextResponse.json({ stage });
}
