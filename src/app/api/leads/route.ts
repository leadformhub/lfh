import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { getLeadsByUserId } from "@/services/leads.service";
import { getFormById } from "@/services/forms.service";

export async function GET(req: NextRequest) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const formIdParam = searchParams.get("formId")?.trim();
  const formId =
    formIdParam && formIdParam !== "undefined" && formIdParam !== "null" ? formIdParam : undefined;
  const search = searchParams.get("search")?.trim() || undefined;

  // Leads and form are returned ONLY when a specific form is selected (one form → many leads).
  const hasFormId = Boolean(formId);
  const { leads, total, perPage } = hasFormId
    ? await getLeadsByUserId(session.userId, {
        page,
        perPage: 25,
        formId: formId!,
        search: search || undefined,
      })
    : { leads: [], total: 0, perPage: 25 };

  let form: { id: string; name: string; schema_json: { fields: unknown[] } } | null = null;
  if (formId) {
    const formRow = await getFormById(formId, session.userId);
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
  }));

  return NextResponse.json({
    form,
    leads: leadsPayload,
    total,
    page,
    perPage,
  });
}
