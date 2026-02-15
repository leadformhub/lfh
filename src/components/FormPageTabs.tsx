"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FormBuilder } from "@/components/FormBuilder";
import { FormAutomation } from "@/components/FormAutomation";
import type { FormSchema, AutomationRule } from "@/lib/form-schema";
import type { PlanKey } from "@/lib/plans";

type Tab = "design" | "embed" | "automation";

const TABS: { id: Tab; label: string }[] = [
  { id: "design", label: "Design" },
  { id: "embed", label: "Embed" },
  { id: "automation", label: "Automation" },
];

export function FormPageTabs({
  username,
  formId,
  formName,
  formSchema,
  formStats,
  automationRules,
  canUseAutomation,
  plan,
  razorpayKeyId,
  embedUrl,
  iframeCode,
}: {
  username: string;
  formId: string;
  formName: string;
  formSchema: FormSchema;
  formStats: { views: number; submissions: number; conversionRate: number } | null;
  automationRules: AutomationRule[];
  canUseAutomation: boolean;
  plan: PlanKey;
  razorpayKeyId: string | null;
  embedUrl: string;
  iframeCode: string;
}) {
  const searchParams = useSearchParams();
  const tab = (searchParams.get("tab") as Tab) || "design";
  const basePath = `/${username}/forms/${formId}`;
  const [iframeCopied, setIframeCopied] = useState(false);

  const copyIframeCode = async () => {
    try {
      await navigator.clipboard.writeText(iframeCode);
      setIframeCopied(true);
      setTimeout(() => setIframeCopied(false), 2000);
    } catch {
      // fallback for older browsers
      setIframeCopied(false);
    }
  };

  return (
    <div className="min-h-full bg-[var(--background-alt)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link
          href={`/${username}/forms`}
          className="flex min-h-[44px] w-fit items-center gap-2 text-sm font-medium text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
        >
          <svg className="size-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Forms
        </Link>
        <div>
          <h1 className="font-heading text-xl font-semibold tracking-tight text-[var(--foreground-heading)]">{formName}</h1>
          <nav className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm" aria-label="Form sections">
            {TABS.map((t) => (
              <Link
                key={t.id}
                href={t.id === "design" ? basePath : `${basePath}?tab=${t.id}`}
                className={tab === t.id ? "text-[var(--foreground-muted)]" : "text-[var(--color-accent)] hover:underline"}
                aria-current={tab === t.id ? "page" : undefined}
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </div>

        {tab === "design" && (
          <div className="space-y-8">
            {formStats && (
              <section
                className="rounded-xl border border-[var(--border-default)] bg-[var(--background-elevated)] p-4 shadow-[var(--shadow-sm)] sm:p-5"
                aria-label="Form Analytics"
              >
                <h2 className="font-heading text-sm font-semibold text-[var(--foreground-muted)]">Form Analytics</h2>
                <div className="mt-3 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xl font-bold tracking-tight text-[var(--foreground-heading)]">{formStats.views.toLocaleString()}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">Views</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold tracking-tight text-[var(--foreground-heading)]">{formStats.submissions.toLocaleString()}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">Submissions</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold tracking-tight text-[var(--foreground-heading)]">{formStats.conversionRate.toFixed(1)}%</p>
                    <p className="text-xs text-[var(--foreground-muted)]">Conversion</p>
                  </div>
                </div>
              </section>
            )}
            <FormBuilder
              username={username}
              formId={formId}
              formName={formName}
              initialSchema={formSchema}
              plan={plan}
              razorpayKeyId={razorpayKeyId}
            />
          </div>
        )}

        {tab === "embed" && (
          <div className="min-w-0 max-w-2xl space-y-4">
            <h2 className="font-heading text-lg font-bold text-[var(--foreground-heading)] sm:text-xl">Embed form</h2>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">Form URL</label>
              <input
                type="text"
                readOnly
                value={embedUrl}
                className="w-full min-w-0 rounded-lg border border-[var(--border-default)] bg-[var(--neutral-50)] px-3 py-2.5 text-sm text-[var(--foreground)]"
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between gap-2">
                <label className="text-sm font-medium text-[var(--foreground-muted)]">iframe code</label>
                <button
                  type="button"
                  onClick={copyIframeCode}
                  className="shrink-0 rounded-md border border-[var(--border-default)] bg-[var(--background-elevated)] px-2.5 py-1.5 text-xs font-medium text-[var(--foreground)] shadow-[var(--shadow-sm)] transition-colors hover:bg-[var(--neutral-100)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-accent)]"
                >
                  {iframeCopied ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="w-full min-w-0 overflow-x-auto rounded-lg border border-[var(--border-default)] bg-[var(--neutral-50)] p-3 text-sm text-[var(--foreground)]">
                {iframeCode}
              </pre>
            </div>
            <p className="mt-4">
              <a
                href={`/f/${formId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[#2563EB] hover:underline min-h-[44px] inline-flex items-center"
              >
                Open form in new tab
              </a>
            </p>
          </div>
        )}

        {tab === "automation" && (
          <div className="max-w-3xl">
            <FormAutomation
              username={username}
              formId={formId}
              formName={formName}
              initialSchema={formSchema}
              initialRules={automationRules}
              canUseAutomation={canUseAutomation}
            />
          </div>
        )}
      </div>
    </div>
  );
}
