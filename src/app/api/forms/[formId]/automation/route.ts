import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { getFormById } from "@/services/forms.service";
import { getAutomationRulesByFormId, setAutomationRulesForForm } from "@/services/automation-rules.service";
import { canUseAutomation } from "@/lib/plan-features";
import { z } from "zod";

const automationRulesSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string().optional(),
    enabled: z.boolean(),
    trigger: z.enum(["lead_submitted", "lead_stage_changed"]),
    triggerStageName: z.string().optional(),
    action: z.enum(["email_lead", "email_admin"]),
    subject: z.string(),
    body: z.string(),
  })
);

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) {
    console.log("[automation] GET auth failed", { formId: (await params).formId });
    return result.response;
  }
  const { formId } = await params;
  const form = await getFormById(formId, result.session.userId);
  if (!form) {
    console.log("[automation] GET form not found", { formId, userId: result.session.userId });
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }
  const rules = await getAutomationRulesByFormId(formId, result.session.userId);
  console.log("[automation] GET success", { formId, userId: result.session.userId, rulesCount: rules.length });
  return NextResponse.json({ rules });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) {
    console.log("[automation] PUT auth failed", { formId: (await params).formId });
    return result.response;
  }
  const session = result.session;
  const plan = (session.plan ?? "free") as "free" | "pro" | "business";
  if (!canUseAutomation(plan)) {
    console.log("[automation] PUT plan blocked", { formId: (await params).formId, plan });
    return NextResponse.json(
      { error: "Email automation is available on Pro and Business plans." },
      { status: 403 }
    );
  }
  const { formId } = await params;
  const body = await req.json();
  const parsed = automationRulesSchema.safeParse(body);
  if (!parsed.success) {
    console.log("[automation] PUT validation failed", { formId, errors: parsed.error.flatten() });
    return NextResponse.json({ error: "Invalid rules", details: parsed.error.flatten() }, { status: 400 });
  }
  const form = await getFormById(formId, session.userId);
  if (!form) {
    console.log("[automation] PUT form not found", { formId, userId: session.userId });
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }
  console.log("[automation] PUT saving", { formId, userId: session.userId, rulesCount: parsed.data.length });
  const payloads = parsed.data.map((r) => ({
    name: r.name,
    enabled: r.enabled,
    trigger: r.trigger,
    triggerStageName: r.triggerStageName,
    action: r.action,
    subject: r.subject,
    body: r.body,
  }));
  const rules = await setAutomationRulesForForm(formId, session.userId, payloads);
  console.log("[automation] PUT saved", { formId, rulesReturned: rules.length, ruleIds: rules.map((r) => r.id) });
  revalidatePath(`/f/${formId}`);
  const username = session.username;
  if (username) {
    revalidatePath(`/${username}/forms`);
    revalidatePath(`/${username}/forms/${formId}`);
  }
  return NextResponse.json({ ok: true, rules });
}
