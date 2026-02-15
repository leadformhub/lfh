import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { getRole } from "@/lib/team";
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
  const accountOwnerId = session.accountOwnerId ?? session.userId;
  const role = getRole(session);
  const assignedToUserId = role === "sales" ? session.userId : undefined;

  const plan = (session.plan ?? "free") as PlanKey;
  if (!canUseBoard(plan)) {
    return NextResponse.json(
      { error: "Moving leads between stages is available on Pro and higher plans." },
      { status: 403 }
    );
  }
  const [resolvedParams, body] = await Promise.all([
    params,
    req.json().then((b: { stageId?: string | null }) => b).catch(() => null),
  ]);
  if (body === null) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  const { leadId } = resolvedParams;
  if (!leadId) return NextResponse.json({ error: "Lead ID required" }, { status: 400 });
  const stageId = body.stageId === null ? null : (body.stageId && String(body.stageId).trim()) || null;

  const { ok, error } = await updateLeadStage(leadId, accountOwnerId, stageId, {
    assignedToUserId,
  });
  if (!ok) {
    return NextResponse.json({ error: error ?? "Failed to update stage" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
