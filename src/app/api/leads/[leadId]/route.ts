import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { deleteLead, getLeadById } from "@/services/leads.service";

/** GET one lead (owner only). Use ?raw=1 to see stored data_json and parsed keys for debugging. */
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
  const url = new URL(_req.url);
  if (url.searchParams.get("raw") === "1") {
    let parsed: Record<string, unknown> = {};
    try {
      parsed = JSON.parse(lead.dataJson) as Record<string, unknown>;
    } catch {
      // ignore
    }
    return NextResponse.json({
      id: lead.id,
      formId: lead.formId,
      dataStringLength: lead.dataJson?.length ?? 0,
      dataKeys: Object.keys(parsed),
      dataSample: parsed,
    });
  }
  return NextResponse.json({
    id: lead.id,
    formId: lead.formId,
    formName: lead.form?.name ?? null,
    data: lead.dataJson,
    ipAddress: lead.ipAddress,
    userAgent: lead.userAgent,
    createdAt: lead.createdAt.toISOString(),
    followUpBy: lead.followUpBy?.toISOString() ?? null,
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const auth = await getVerifiedSessionOrResponse();
  if ("response" in auth) return auth.response;
  const session = auth.session;

  const { leadId } = await params;
  if (!leadId) return NextResponse.json({ error: "Lead ID required" }, { status: 400 });

  const deleteResult = await deleteLead(leadId, session.userId);
  if (deleteResult.count === 0) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
