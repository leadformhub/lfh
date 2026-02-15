import { getFormById } from "@/services/forms.service";
import { getFormStats } from "@/services/analytics.service";
import { getAutomationRulesByFormId } from "@/services/automation-rules.service";
import { getSession } from "@/lib/auth";
import { getRazorpayKeyId } from "@/lib/razorpay";
import { redirect } from "next/navigation";
import { FormPageTabs } from "@/components/FormPageTabs";
import { canUseAutomation } from "@/lib/plan-features";
import type { FormSchema } from "@/lib/form-schema";
import type { PlanKey } from "@/lib/plans";

export const dynamic = "force-dynamic";

/**
 * Single form page: Design | Embed | Automation via ?tab=
 * One route = no nested [formId]/automation = no 404.
 */
export default async function FormPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string; formId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await getSession();
  const { username, formId } = await params;
  if (!session || session.username.toLowerCase() !== username.toLowerCase()) redirect("/login");

  const userId = session.userId;
  const [form, formStats, rules] = await Promise.all([
    getFormById(formId, userId),
    getFormStats(formId, userId),
    getAutomationRulesByFormId(formId, userId),
  ]);
  if (!form) redirect(`/${username}/forms`);
  if (form.lockedAt) redirect(`/${username}/forms`);

  const plan = (session.plan ?? "free") as PlanKey;

  const schema: FormSchema = {
    fields: form.schema?.fields ?? [],
    settings: form.schema?.settings,
  };
  const embedUrl = `${process.env.NEXTAUTH_URL || "https://leadformhub.com"}/f/${form.id}?embed=1`;
  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0"></iframe>`;

  return (
    <FormPageTabs
      username={username}
      formId={form.id}
      formName={form.name}
      formSchema={schema}
      formStats={formStats ? { views: formStats.views, submissions: formStats.submissions, conversionRate: formStats.conversionRate } : null}
      automationRules={rules}
      canUseAutomation={canUseAutomation(plan)}
      plan={plan}
      razorpayKeyId={getRazorpayKeyId()}
      embedUrl={embedUrl}
      iframeCode={iframeCode}
    />
  );
}
