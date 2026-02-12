import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { getLeadsByPipelineStages, trimLeadDataForBoard } from "@/services/pipelines.service";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ pipelineId: string }> }
) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  const { pipelineId } = await params;
  if (!pipelineId) return NextResponse.json({ error: "Pipeline ID required" }, { status: 400 });
  const plan = (session.plan ?? "free") as string;
  const board = await getLeadsByPipelineStages(session.userId, pipelineId, plan);
  if (!board.pipeline.id) return NextResponse.json({ error: "Pipeline not found" }, { status: 404 });
  return NextResponse.json({
    pipeline: board.pipeline,
    stages: board.stages,
    unassignedLeads: board.unassignedLeads.map((l) => ({
      id: l.id,
      formId: l.formId,
      stageId: l.stageId,
      data: trimLeadDataForBoard(l.dataJson),
      createdAt: l.createdAt.toISOString(),
      formName: l.form?.name ?? null,
    })),
    leadsByStage: board.stages.map((s) => ({
      stageId: s.id,
      stageName: s.name,
      order: s.order,
      leads: s.leads.map((l) => ({
        id: l.id,
        formId: l.formId,
        stageId: l.stageId,
        data: trimLeadDataForBoard(l.dataJson),
        createdAt: l.createdAt.toISOString(),
        formName: l.form?.name ?? null,
      })),
    })),
  });
}
