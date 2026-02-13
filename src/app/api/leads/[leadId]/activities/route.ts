import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { getLeadById } from "@/services/leads.service";
import { getLeadActivities, createLeadActivity } from "@/services/lead-activity.service";

const NOTE_BODY_MAX_LENGTH = 2000;

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

/** POST a follow-up note. Body: { type: "note", body: string }. */
export async function POST(
  req: NextRequest,
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
  let body: { type?: string; body?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (body.type !== "note") {
    return NextResponse.json({ error: "type must be 'note'" }, { status: 400 });
  }
  const noteBody =
    typeof body.body === "string" ? body.body.trim() : "";
  if (!noteBody) {
    return NextResponse.json({ error: "body is required" }, { status: 400 });
  }
  if (noteBody.length > NOTE_BODY_MAX_LENGTH) {
    return NextResponse.json(
      { error: `body must be at most ${NOTE_BODY_MAX_LENGTH} characters` },
      { status: 400 }
    );
  }
  const activity = await createLeadActivity(leadId, "note", { body: noteBody });
  return NextResponse.json({
    id: activity.id,
    type: activity.type,
    metadata: activity.metadata ? (JSON.parse(activity.metadata) as Record<string, unknown>) : null,
    createdAt: activity.createdAt.toISOString(),
  });
}
