import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { getLeadById } from "@/services/leads.service";
import { getLeadActivities } from "@/services/lead-activity.service";

/** GET activities for a lead. Auth: same as lead GET. */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  const { leadId } = await params;
  if (!leadId) return NextResponse.json({ error: "Lead ID required" }, { status: 400 });

  const plan = (session.plan ?? "free") as string;
  const lead = await getLeadById(leadId, session.userId, plan);
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const activities = await getLeadActivities(leadId);

  const payload = activities.map((a) => ({
    id: a.id,
    type: a.type,
    metadata: a.metadata ? (JSON.parse(a.metadata) as Record<string, unknown>) : null,
    createdAt: a.createdAt.toISOString(),
  }));

  return NextResponse.json({ activities: payload });
}
