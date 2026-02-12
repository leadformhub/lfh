import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import {
  getPipelineByFormId,
  createPipeline,
  createDefaultStagesForPipeline,
  getLeadsByPipelineStages,
  trimLeadDataForBoard,
} from "@/services/pipelines.service";

/**
 * GET /api/pipelines/board?formId=X
 * Returns board data for the form. Creates a pipeline (with default stages) if none exists.
 * Single round-trip alternative to: GET pipelines list -> POST create (if needed) -> GET board.
 */
export async function GET(req: NextRequest) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  const formId = req.nextUrl.searchParams.get("formId")?.trim() || null;
  if (!formId) {
    return NextResponse.json({ error: "formId is required" }, { status: 400 });
  }

  let pipeline = await getPipelineByFormId(session.userId, formId);
  if (!pipeline) {
    const created = await createPipeline(session.userId, { formId, name: "Default" });
    await createDefaultStagesForPipeline(created.id);
    pipeline = await getPipelineByFormId(session.userId, formId);
  }
  if (!pipeline) {
    return NextResponse.json({ error: "Failed to get or create pipeline" }, { status: 500 });
  }

  const plan = (session.plan ?? "free") as string;
  const board = await getLeadsByPipelineStages(session.userId, pipeline.id, plan);

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
