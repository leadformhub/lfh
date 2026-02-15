import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { getRole } from "@/lib/team";
import { getLeadsByUserId } from "@/services/leads.service";
import { getFormById } from "@/services/forms.service";

export async function GET(req: NextRequest) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  const accountOwnerId = session.accountOwnerId ?? session.userId;
  const role = getRole(session);
  const assignedToUserId = role === "sales" ? session.userId : undefined;

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const formIdParam = searchParams.get("formId")?.trim();
  const formId =
    formIdParam && formIdParam !== "undefined" && formIdParam !== "null" ? formIdParam : undefined;
  const search = searchParams.get("search")?.trim() || undefined;
  const followUpDue = searchParams.get("followUpDue") === "1";

  const hasFormId = Boolean(formId);
  const plan = (session.plan ?? "free") as string;
  const { leads, total, perPage } = hasFormId
    ? await getLeadsByUserId(accountOwnerId, {
        page,
        perPage: 25,
        formId: formId!,
        search: search || undefined,
        plan,
        followUpDue: followUpDue || undefined,
        assignedToUserId,
      })
    : { leads: [], total: 0, perPage: 25 };

  let form: { id: string; name: string; schema_json: { fields: unknown[] } } | null = null;
  if (formId) {
    const formRow = await getFormById(formId, accountOwnerId);
    if (formRow) {
      form = {
        id: formRow.id,
        name: formRow.name,
        schema_json: formRow.schema ?? { fields: [] },
      };
    }
  }

  const leadsPayload = leads.map((l) => ({
    id: l.id,
    formName: l.form?.name ?? "Form Deleted",
    formId: l.formId ?? "",
    data: l.dataJson,
    createdAt: l.createdAt.toISOString(),
    stageId: l.stageId ?? null,
    stageName: l.stage?.name ?? "New",
    followUpBy: l.followUpBy?.toISOString() ?? null,
    assignedToUserId: l.assignedToUserId ?? null,
    utmSource: l.utmSource ?? null,
    utmMedium: l.utmMedium ?? null,
    utmCampaign: l.utmCampaign ?? null,
    utmTerm: l.utmTerm ?? null,
    utmContent: l.utmContent ?? null,
    referrerUrl: l.referrerUrl ?? null,
    landingPageUrl: l.landingPageUrl ?? null,
  }));

  return NextResponse.json({
    form,
    leads: leadsPayload,
    total,
    page,
    perPage,
  });
}
