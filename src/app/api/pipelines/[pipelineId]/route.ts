import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { getPipelineById, updatePipelineName } from "@/services/pipelines.service";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ pipelineId: string }> }
) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  const { pipelineId } = await params;
  if (!pipelineId) return NextResponse.json({ error: "Pipeline ID required" }, { status: 400 });
  const pipeline = await getPipelineById(pipelineId, session.userId);
  if (!pipeline) return NextResponse.json({ error: "Pipeline not found" }, { status: 404 });
  return NextResponse.json({
    pipeline: {
      id: pipeline.id,
      name: pipeline.name,
      formId: pipeline.formId,
      form: pipeline.form,
      stages: pipeline.stages,
    },
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ pipelineId: string }> }
) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  const { pipelineId } = await params;
  if (!pipelineId) return NextResponse.json({ error: "Pipeline ID required" }, { status: 400 });
  let body: { name?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (body.name === undefined) return NextResponse.json({ error: "name required" }, { status: 400 });
  const update = await updatePipelineName(pipelineId, session.userId, body.name);
  if (update.count === 0) return NextResponse.json({ error: "Pipeline not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
