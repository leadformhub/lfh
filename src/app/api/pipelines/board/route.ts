import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { getRole } from "@/lib/team";
import { canUseBoard } from "@/lib/plan-features";
import type { PlanKey } from "@/lib/plans";
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
 * Pro and Business plans only; free plan returns 403.
 */
export async function GET(req: NextRequest) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  const accountOwnerId = session.accountOwnerId ?? session.userId;
  const role = getRole(session);
  const assignedToUserId = role === "sales" ? session.userId : undefined;

  const plan = (session.plan ?? "free") as PlanKey;
  if (!canUseBoard(plan)) {
    return NextResponse.json(
      { error: "Kanban board is available on Pro and higher plans." },
      { status: 403 }
    );
  }
  const formId = req.nextUrl.searchParams.get("formId")?.trim() || null;
  if (!formId) {
    return NextResponse.json({ error: "formId is required" }, { status: 400 });
  }

  let pipeline = await getPipelineByFormId(accountOwnerId, formId);
  if (!pipeline) {
    const created = await createPipeline(accountOwnerId, { formId, name: "Default" });
    await createDefaultStagesForPipeline(created.id);
    pipeline = await getPipelineByFormId(accountOwnerId, formId);
  }
  if (!pipeline) return NextResponse.json({ error: "Pipeline not found" }, { status: 404 });

  const board = await getLeadsByPipelineStages(accountOwnerId, pipeline.id, plan, assignedToUserId ? { assignedToUserId } : undefined);
  return NextResponse.json(serializeBoardForApi(board));
}
