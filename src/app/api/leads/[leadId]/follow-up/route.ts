import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { updateLeadFollowUpBy } from "@/services/leads.service";

/** PATCH follow-up date for a lead. Body: { followUpBy: string | null } (ISO date or null). */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  const { leadId } = await params;
  if (!leadId) return NextResponse.json({ error: "Lead ID required" }, { status: 400 });
  let body: { followUpBy?: string | null } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const raw = body.followUpBy;
  let followUpBy: Date | null = null;
  if (raw != null && raw !== "") {
    const parsed = new Date(raw as string);
    if (Number.isNaN(parsed.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }
    followUpBy = parsed;
  }
  const updated = await updateLeadFollowUpBy(leadId, session.userId, followUpBy);
  if (!updated) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  return NextResponse.json({
    ok: true,
    followUpBy: updated.followUpBy?.toISOString() ?? null,
  });
}
