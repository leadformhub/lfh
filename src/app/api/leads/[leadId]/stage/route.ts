import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { canUseBoard } from "@/lib/plan-features";
import type { PlanKey } from "@/lib/plans";
import { updateLeadStage } from "@/services/pipelines.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  const plan = (session.plan ?? "free") as PlanKey;
  if (!canUseBoard(plan)) {
    return NextResponse.json(
      { error: "Moving leads between stages is available on Pro and higher plans." },
      { status: 403 }
    );
  }
  const { leadId } = await params;
  if (!leadId) return NextResponse.json({ error: "Lead ID required" }, { status: 400 });
  let body: { stageId?: string | null } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const stageId = body.stageId === null ? null : body.stageId?.trim() || null;
  const { ok, error } = await updateLeadStage(leadId, session.userId, stageId);
  if (!ok) {
    return NextResponse.json({ error: error ?? "Failed to update stage" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
