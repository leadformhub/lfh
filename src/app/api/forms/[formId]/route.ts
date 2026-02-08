import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { canUseEmailAlertOnLead } from "@/lib/plan-features";
import { canUseOtp, type PlanKey } from "@/lib/plans";
import { getFormById, updateForm, updateFormSchema } from "@/services/forms.service";
import { parseFormSchema } from "@/lib/form-schema";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;
  const { formId } = await params;
  const form = await getFormById(formId, session.userId);
  if (!form) return NextResponse.json({ error: "Form not found" }, { status: 404 });
  return NextResponse.json({
    form: {
      ...form,
      createdAt: form.createdAt.toISOString(),
    },
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  const auth = await getVerifiedSessionOrResponse();
  if ("response" in auth) return auth.response;
  const session = auth.session;
  const { formId } = await params;
  const body = await req.json();
  const plan = (session.plan ?? "free") as PlanKey;
  const canUseEmailAlert = canUseEmailAlertOnLead(plan);
  const canUseOtpVerification = canUseOtp(plan);

  const updates: { name?: string } = {};
  if (body.name !== undefined) updates.name = body.name;

  const form = await getFormById(formId, session.userId);
  if (!form) return NextResponse.json({ error: "Form not found" }, { status: 404 });

  let result = updates.name ? await updateForm(formId, session.userId, updates) : form;
  if (!result) return NextResponse.json({ error: "Form not found" }, { status: 404 });

  const schema = parseFormSchema(form.schemaJson);
  const settings = { ...schema.settings };
  let schemaUpdated = false;
  if (body.status !== undefined) {
    settings.status = body.status;
    schemaUpdated = true;
  }
  if (body.description !== undefined) {
    settings.description = body.description ?? undefined;
    schemaUpdated = true;
  }
  if (body.redirectUrl !== undefined) {
    settings.redirectUrl = body.redirectUrl || undefined;
    schemaUpdated = true;
  }
  if (body.emailAlertEnabled !== undefined) {
    settings.emailAlertEnabled = canUseEmailAlert ? body.emailAlertEnabled : false;
    schemaUpdated = true;
  }
  if (body.emailOtpEnabled !== undefined) {
    settings.emailOtpEnabled = canUseOtpVerification ? body.emailOtpEnabled : false;
    schemaUpdated = true;
  }
  if (body.mobileOtpEnabled !== undefined) {
    settings.mobileOtpEnabled = canUseOtpVerification ? body.mobileOtpEnabled : false;
    schemaUpdated = true;
  }
  if (schemaUpdated) {
    result = await updateFormSchema(formId, session.userId, { ...schema, settings }) ?? result;
  }

  return NextResponse.json({
    form: {
      id: result.id,
      name: result.name,
      schema: parseFormSchema(result.schemaJson),
      createdAt: result.createdAt.toISOString(),
    },
  });
}
