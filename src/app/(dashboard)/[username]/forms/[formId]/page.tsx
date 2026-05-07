import { getFormById } from "@/services/forms.service";
import { getFormStats } from "@/services/analytics.service";
import { getAutomationRulesByFormId } from "@/services/automation-rules.service";
import { getVerifiedSessionCached } from "@/lib/auth";
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
  const session = await getVerifiedSessionCached();
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
  const iframeCode = `<div id="lfh-embed-${form.id}" style="position:relative;width:100%;">
  <div data-lfh-loader style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;min-height:240px;border:1px solid #e5e7eb;border-radius:12px;background:#f8fafc;color:#475569;font:14px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,Arial,sans-serif;">
    Loading form…
  </div>
  <iframe src="${embedUrl}" width="100%" height="400" frameborder="0" title="Form" style="display:block;width:100%;border:0;border-radius:12px;background:transparent;"></iframe>
</div>
<script>
(function(){
  var wrapper = document.getElementById("lfh-embed-${form.id}");
  var iframe = wrapper ? wrapper.getElementsByTagName("iframe")[0] : null;
  if (iframe) {
    iframe.addEventListener("load", function() {
      try {
        var loader = wrapper.querySelector("[data-lfh-loader]");
        if (loader) loader.parentNode.removeChild(loader);
      } catch (e) {}
    });
  }
  window.addEventListener("message", function(e) {
    if (e.data && e.data.type === "leadformhub-resize" && typeof e.data.height === "number") {
      if (iframe && iframe.contentWindow === e.source) iframe.style.height = Math.max(200, e.data.height) + "px";
    }
    if (e.data && e.data.type === "leadformhub-redirect" && typeof e.data.url === "string") {
      try { window.location.href = e.data.url; } catch (err) {}
    }
  });
})();
</script>`;

  const razorpayKeyId = await getRazorpayKeyId();

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
      razorpayKeyId={razorpayKeyId}
      embedUrl={embedUrl}
      iframeCode={iframeCode}
    />
  );
}
