import { prisma } from "@/lib/db";

export type AutomationRuleRow = {
  id: string;
  formId: string;
  name: string | null;
  enabled: boolean;
  trigger: string;
  triggerStageName: string | null;
  action: string;
  subject: string;
  body: string;
  order: number;
};

/** Shape used by UI and API (camelCase for triggerStageName). */
export type AutomationRulePayload = {
  id: string;
  name?: string;
  enabled: boolean;
  trigger: "lead_submitted" | "lead_stage_changed";
  triggerStageName?: string;
  action: "email_lead" | "email_admin";
  subject: string;
  body: string;
};

function rowToPayload(row: AutomationRuleRow): AutomationRulePayload {
  return {
    id: row.id,
    name: row.name ?? undefined,
    enabled: row.enabled,
    trigger: row.trigger as AutomationRulePayload["trigger"],
    triggerStageName: row.triggerStageName ?? undefined,
    action: row.action as AutomationRulePayload["action"],
    subject: row.subject,
    body: row.body,
  };
}

/** Get all automation rules for a form (owner check via form). */
export async function getAutomationRulesByFormId(
  formId: string,
  userId: string
): Promise<AutomationRulePayload[]> {
  const form = await prisma.form.findFirst({
    where: { id: formId, userId },
    select: { id: true },
  });
  if (!form) {
    console.log("[automation] getAutomationRulesByFormId: form not found", { formId, userId });
    return [];
  }
  const rows = await prisma.automationRule.findMany({
    where: { formId },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  const rules = rows.map(rowToPayload);
  console.log("[automation] getAutomationRulesByFormId", { formId, userId, rulesCount: rules.length });
  return rules;
}

/** Get rules for a form by formId only (used by runner; no auth). */
export async function getAutomationRulesForForm(formId: string): Promise<AutomationRulePayload[]> {
  const rows = await prisma.automationRule.findMany({
    where: { formId },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(rowToPayload);
}

/** Replace all automation rules for a form. Creates/updates/deletes as needed. */
export async function setAutomationRulesForForm(
  formId: string,
  userId: string,
  rules: Omit<AutomationRulePayload, "id">[]
): Promise<AutomationRulePayload[]> {
  const form = await prisma.form.findFirst({
    where: { id: formId, userId },
    select: { id: true },
  });
  if (!form) {
    console.log("[automation] setAutomationRulesForForm: form not found", { formId, userId });
    return [];
  }
  const deleted = await prisma.automationRule.deleteMany({ where: { formId } });
  console.log("[automation] setAutomationRulesForForm: deleted existing", { formId, deletedCount: deleted.count });
  if (rules.length === 0) return [];
  await prisma.automationRule.createMany({
    data: rules.map((r, i) => ({
      formId,
      name: r.name ?? null,
      enabled: r.enabled,
      trigger: r.trigger,
      triggerStageName: r.triggerStageName ?? null,
      action: r.action,
      subject: r.subject,
      body: r.body,
      order: i,
    })),
  });
  const out = await getAutomationRulesForForm(formId);
  console.log("[automation] setAutomationRulesForForm: created and read back", { formId, rulesIn: rules.length, rulesOut: out.length });
  return out;
}
