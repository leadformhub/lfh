import { getFormById } from "@/services/forms.service";
import { getFormStats } from "@/services/analytics.service";
import { getSession } from "@/lib/auth";
import { getRazorpayKeyId } from "@/lib/razorpay";
import { redirect } from "next/navigation";
import { FormBuilder } from "@/components/FormBuilder";
import type { PlanKey } from "@/lib/plans";

export default async function FormDesignPage({
  params,
}: { params: Promise<{ username: string; formId: string }> }) {
  const session = await getSession();
  const { username, formId } = await params;
  if (!session || session.username.toLowerCase() !== username.toLowerCase()) redirect("/login");
  const form = await getFormById(formId, session.userId);
  if (!form) redirect(`/${username}/forms`);
  const formStats = await getFormStats(formId, session.userId);
  const plan = (session.plan ?? "free") as PlanKey;
  const razorpayKeyId = getRazorpayKeyId();

  return (
    <div className="min-h-full bg-[var(--background-alt)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {formStats && (
          <section
            className="rounded-xl border border-[var(--border-default)] bg-[var(--background-elevated)] p-4 shadow-[var(--shadow-sm)] sm:p-5"
            aria-label="Form analytics"
          >
            <h2 className="font-heading text-sm font-semibold text-[var(--foreground-muted)]">
              Form analytics
            </h2>
            <div className="mt-3 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xl font-bold tracking-tight text-[var(--foreground-heading)]">
                  {formStats.views.toLocaleString()}
                </p>
                <p className="text-xs text-[var(--foreground-muted)]">Views</p>
              </div>
              <div>
                <p className="text-xl font-bold tracking-tight text-[var(--foreground-heading)]">
                  {formStats.submissions.toLocaleString()}
                </p>
                <p className="text-xs text-[var(--foreground-muted)]">Submissions</p>
              </div>
              <div>
                <p className="text-xl font-bold tracking-tight text-[var(--foreground-heading)]">
                  {formStats.conversionRate.toFixed(1)}%
                </p>
                <p className="text-xs text-[var(--foreground-muted)]">Conversion</p>
              </div>
            </div>
          </section>
        )}
        <FormBuilder
          username={username}
          formId={form.id}
          formName={form.name}
          initialSchema={{
            fields: form.schema?.fields ?? [],
            settings: form.schema?.settings,
          }}
          plan={plan}
          razorpayKeyId={razorpayKeyId ?? null}
        />
      </div>
    </div>
  );
}
