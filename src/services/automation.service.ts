import { getFormByIdForPublic } from "@/services/forms.service";
import { getAutomationRulesForForm } from "@/services/automation-rules.service";
import { sendAutomationEmail } from "@/lib/email";

export type AutomationTrigger = "lead_submitted" | "lead_stage_changed";

export type AutomationContext = {
  leadData: Record<string, unknown>;
  formName: string;
  adminEmail: string | null;
  stageName?: string;
};

/**
 * Build substitution map for templates: {{name}}, {{email}}, {{formName}}, {{stageName}}, plus all lead fields.
 */
function buildSubstitutionData(context: AutomationContext): Record<string, string> {
  const data: Record<string, string> = {
    formName: context.formName ?? "",
    stageName: context.stageName ?? "",
    name: "",
    email: "",
  };
  for (const [key, value] of Object.entries(context.leadData)) {
    if (value != null && typeof value === "string") data[key] = value;
    else if (value != null) data[key] = String(value);
    else data[key] = "";
  }
  data.name = data.name || data.Name || data.full_name || data.fullName || "";
  data.email = data.email || data.Email || "";
  return data;
}

/**
 * Run automation rules for a form when a trigger fires. Sends emails via SMTP (env MAIL_*).
 * Called after lead submit or stage change. Does not throw; logs errors.
 * Skips entirely for free plan (automation is Pro/Business only).
 */
export async function runFormAutomation(
  formId: string,
  trigger: AutomationTrigger,
  context: AutomationContext
): Promise<void> {
  const form = await getFormByIdForPublic(formId);
  if (!form) return;
  const plan = form.user?.plan ?? "free";
  if (plan === "free") return;
  const rules = await getAutomationRulesForForm(formId);
  if (rules.length === 0) return;

  const stageName = context.stageName ?? "";
  const data = buildSubstitutionData(context);

  for (const rule of rules) {
    if (!rule.enabled || rule.trigger !== trigger) continue;
    if (trigger === "lead_stage_changed" && rule.triggerStageName != null && rule.triggerStageName.trim() !== "") {
      if (stageName.trim().toLowerCase() !== rule.triggerStageName.trim().toLowerCase()) continue;
    }

    let to: string | null = null;
    if (rule.action === "email_lead") {
      to = data.email?.trim() || null;
      if (!to) continue;
    } else if (rule.action === "email_admin") {
      to = context.adminEmail?.trim() || null;
      if (!to) continue;
    }
    if (!to) continue;

    sendAutomationEmail(to, rule.subject, rule.body, data).catch((err) =>
      console.error("[automation] Rule", rule.id, "send failed:", err)
    );
  }
}
