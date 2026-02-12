import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import {
  getPipelineByFormId,
  createPipeline,
  createDefaultStagesForPipeline,
  getLeadsByPipelineStages,
  serializeBoardForApi,
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
    pipeline = created;
  }

  const plan = (session.plan ?? "free") as string;
  const board = await getLeadsByPipelineStages(session.userId, pipeline.id, plan);
  return NextResponse.json(serializeBoardForApi(board));
}
