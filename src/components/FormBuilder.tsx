"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { FormSchema } from "@/lib/form-schema";
import { canUseOtp } from "@/lib/plans";
import { canUseEmailAlertOnLead } from "@/lib/plan-features";
import { UpgradeModal } from "@/components/UpgradeModal";
import type { PlanKey } from "@/lib/plans";

const FIELD_TYPES = [
  { type: "text", label: "Name", icon: "Aa" },
  { type: "email", label: "Email", icon: "✉" },
  { type: "phone", label: "Phone", icon: "☎" },
  { type: "select", label: "Dropdown", icon: "▾" },
  { type: "radio", label: "Radio", icon: "○" },
  { type: "checkbox", label: "Checkbox", icon: "☑" },
  { type: "textarea", label: "Textarea", icon: "¶" },
  { type: "recaptcha", label: "reCAPTCHA", icon: "🛡" },
];

/** Editor representation: id is used as submission key; name kept for display/legacy. */
export type FormFieldEditor = {
  id: string;
  type: string;
  label: string;
  name: string;
  placeholder: string;
  required: boolean;
  order: number;
  options: string; // newline-separated in UI
};

/** Default semantic key by field type (used when name is not set). */
function defaultSemanticNameForType(type: string): string | undefined {
  switch (type) {
    case "phone":
      return "phone_number";
    case "email":
      return "email";
    case "text":
      return "name";
    default:
      return undefined;
  }
}

function schemaFieldsToEditor(fields: FormSchema["fields"]): FormFieldEditor[] {
  return (fields ?? []).map((f, i) => {
    const raw = f as { name?: string };
    return {
      id: f.id,
      type: f.type === "select" ? "select" : f.type,
      label: f.label,
      name: raw.name ?? defaultSemanticNameForType(f.type) ?? f.id,
      placeholder: "",
      required: f.required ?? false,
      order: i,
      options: Array.isArray(f.options) ? f.options.join("\n") : "",
    };
  });
}

function editorFieldsToSchema(fields: FormFieldEditor[], currentSettings?: FormSchema["settings"]): FormSchema {
  return {
    fields: fields.map((f) => {
      const type = f.type === "dropdown" ? "select" : f.type;
      const options =
        type === "select" || type === "radio" || type === "checkbox"
          ? (f.options || "")
              .split("\n")
              .map((o) => o.trim())
              .filter(Boolean)
          : undefined;
      const id = f.id.startsWith("new-") ? `field_${Date.now()}_${f.order}` : f.id;
      const semanticName = (f.name && f.name.trim() !== "") ? f.name.trim() : (defaultSemanticNameForType(type) ?? id);
      return {
        id,
        type,
        name: semanticName,
        label: f.label,
        required: f.required,
        ...(options?.length ? { options } : {}),
      };
    }),
    settings: currentSettings,
  };
}

export function FormBuilder({
  username,
  formId,
  formName,
  initialSchema,
  plan = "free",
  razorpayKeyId = null,
}: {
  username: string;
  formId: string;
  formName: string;
  /** Full form schema (fields + settings) so we can merge on save */
  initialSchema: FormSchema;
  plan?: PlanKey;
  razorpayKeyId?: string | null;
}) {
  const router = useRouter();
  const [fields, setFields] = useState<FormFieldEditor[]>(() =>
    schemaFieldsToEditor(initialSchema.fields ?? [])
  );
  const [showFormName, setShowFormName] = useState<boolean>(
    initialSchema.settings?.showFormName !== false
  );
  const [mobileOtpEnabled, setMobileOtpEnabled] = useState<boolean>(
    initialSchema.settings?.mobileOtpEnabled ?? false
  );
  const [emailOtpEnabled, setEmailOtpEnabled] = useState<boolean>(
    initialSchema.settings?.emailOtpEnabled ?? false
  );
  const [emailAlertEnabled, setEmailAlertEnabled] = useState<boolean>(
    initialSchema.settings?.emailAlertEnabled ?? true
  );
  const [recaptchaEnabled, setRecaptchaEnabled] = useState<boolean>(
    initialSchema.settings?.recaptchaEnabled !== false
  );
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeModalReason, setUpgradeModalReason] = useState<"otp" | "email">("otp");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const canUseOtpFeature = canUseOtp(plan);
  const canUseEmailAlert = canUseEmailAlertOnLead(plan);

  const usedTypes = new Set(fields.map((f) => f.type));

  const addField = useCallback((type: string) => {
    setFields((prev) => {
      const alreadyUsed = prev.some((f) => f.type === type);
      if (alreadyUsed) return prev;
      const id = `field_${Date.now()}`;
      const label =
        type === "text"
          ? "Name"
          : type.charAt(0).toUpperCase() + type.slice(1).replace("select", "Dropdown");
      const name = defaultSemanticNameForType(type) ?? id;
      return [
        ...prev,
        {
          id,
          type,
          label,
          name,
          placeholder: "",
          required: true,
          order: prev.length,
          options: type === "select" || type === "radio" ? "Option 1\nOption 2" : "",
        },
      ];
    });
  }, []);

  const updateField = useCallback((id: string, updates: Partial<FormFieldEditor>) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  }, []);

  const removeField = useCallback((id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const moveField = useCallback((index: number, direction: 1 | -1) => {
    const next = index + direction;
    if (next < 0 || next >= fields.length) return;
    setFields((prev) => {
      const copy = [...prev];
      const a = copy[index];
      copy[index] = { ...copy[next], order: index };
      copy[next] = { ...a, order: next };
      return copy;
    });
  }, [fields.length]);

  const save = useCallback(async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      const settings = {
        ...initialSchema.settings,
        showFormName,
        recaptchaEnabled,
        emailAlertEnabled: canUseEmailAlert ? emailAlertEnabled : false,
        mobileOtpEnabled: canUseOtpFeature ? mobileOtpEnabled : false,
        emailOtpEnabled: canUseOtpFeature ? emailOtpEnabled : false,
      };
      const schema = editorFieldsToSchema(fields, settings);
      const res = await fetch(`/api/forms/${formId}/schema`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(schema),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSaveMessage({ type: "success", text: "Form design saved." });
        router.refresh();
        router.push(`/${username}/forms`);
      } else {
        setSaveMessage({ type: "error", text: (data.error as string) || "Failed to save." });
      }
    } catch {
      setSaveMessage({ type: "error", text: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  }, [formId, fields, initialSchema.settings, showFormName, recaptchaEnabled, emailAlertEnabled, mobileOtpEnabled, emailOtpEnabled, canUseOtpFeature, canUseEmailAlert, router, username]);

  const selected = fields.find((f) => f.id === selectedId);
  const fieldIcon = (type: string) => FIELD_TYPES.find((t) => t.type === type)?.icon ?? "•";

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={`/${username}/forms`}
        className="flex min-h-[44px] w-fit items-center gap-2 text-sm font-medium text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
      >
        <svg className="size-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Forms
      </Link>

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[var(--border-default)] bg-white p-4 shadow-[var(--shadow-sm)]">
            <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
              Display
            </h3>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={showFormName}
                onChange={(e) => setShowFormName(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--border-default)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
              />
              <span className="text-sm text-[var(--foreground)]">Show form name above form</span>
            </label>
          </div>
          <div className="rounded-xl border border-[var(--border-default)] bg-white p-4 shadow-[var(--shadow-sm)]">
            <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
              Security
            </h3>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={recaptchaEnabled}
                onChange={(e) => setRecaptchaEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--border-default)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
              />
              <span className="text-sm text-[var(--foreground)]">Enable reCAPTCHA</span>
            </label>
            <p className="mt-1.5 text-xs text-[var(--foreground-muted)]">
              Reduce spam with reCAPTCHA v3 (invisible).
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border-default)] bg-white p-4 shadow-[var(--shadow-sm)]">
            <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
              Verification
            </h3>
            <p className="mb-3 text-xs text-[var(--foreground-muted)]">
              Require OTP verification before submission. Needs a phone or email field in the form.
            </p>
            <div className="flex flex-col gap-2">
              <label
                className={`flex cursor-pointer items-center gap-3 ${!canUseOtpFeature ? "cursor-pointer" : ""}`}
                onClick={(e) => {
                  if (!canUseOtpFeature) {
                    e.preventDefault();
                    setUpgradeModalReason("otp");
                    setShowUpgradeModal(true);
                  }
                }}
              >
                <input
                  type="checkbox"
                  checked={mobileOtpEnabled}
                  onChange={(e) => canUseOtpFeature && setMobileOtpEnabled(e.target.checked)}
                  disabled={!canUseOtpFeature}
                  className="h-4 w-4 rounded border-[var(--border-default)] text-[var(--color-accent)] focus:ring-[var(--color-accent)] disabled:cursor-pointer"
                />
                <span className="text-sm text-[var(--foreground)]">Mobile OTP</span>
              </label>
              <label
                className={`flex cursor-pointer items-center gap-3 ${!canUseOtpFeature ? "cursor-pointer" : ""}`}
                onClick={(e) => {
                  if (!canUseOtpFeature) {
                    e.preventDefault();
                    setUpgradeModalReason("otp");
                    setShowUpgradeModal(true);
                  }
                }}
              >
                <input
                  type="checkbox"
                  checked={emailOtpEnabled}
                  onChange={(e) => canUseOtpFeature && setEmailOtpEnabled(e.target.checked)}
                  disabled={!canUseOtpFeature}
                  className="h-4 w-4 rounded border-[var(--border-default)] text-[var(--color-accent)] focus:ring-[var(--color-accent)] disabled:cursor-pointer"
                />
                <span className="text-sm text-[var(--foreground)]">Email OTP</span>
              </label>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border-default)] bg-white p-4 shadow-[var(--shadow-sm)]">
            <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
              Notifications
            </h3>
            <label
              className={`flex cursor-pointer items-center gap-3 ${!canUseEmailAlert ? "cursor-pointer" : ""}`}
              onClick={(e) => {
                if (!canUseEmailAlert) {
                  e.preventDefault();
                  setUpgradeModalReason("email");
                  setShowUpgradeModal(true);
                }
              }}
            >
              <input
                type="checkbox"
                checked={emailAlertEnabled}
                onChange={(e) => canUseEmailAlert && setEmailAlertEnabled(e.target.checked)}
                disabled={!canUseEmailAlert}
                className="h-4 w-4 rounded border-[var(--border-default)] text-[var(--color-accent)] focus:ring-[var(--color-accent)] disabled:cursor-pointer"
              />
              <span className="text-sm text-[var(--foreground)]">Notify Lead By Email</span>
            </label>
            <p className="mt-1.5 text-xs text-[var(--foreground-muted)]">
              Send an email to your account when someone submits this form.
            </p>
          </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <div className="w-full shrink-0 lg:w-64">
          <div className="rounded-xl border border-[var(--border-default)] bg-white p-4 shadow-[var(--shadow-sm)]">
            <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
              Add Field
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
              {FIELD_TYPES.map(({ type, label, icon }) => {
                const alreadyAdded = usedTypes.has(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => addField(type)}
                    disabled={alreadyAdded}
                    title={alreadyAdded ? `${label} already added` : `Add ${label}`}
                    className={`flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-lg border border-[var(--border-default)] bg-[var(--background-elevated)] px-2 py-3 text-center text-sm font-medium shadow-[var(--shadow-xs)] transition-all active:scale-[0.98] ${
                      alreadyAdded
                        ? "cursor-not-allowed opacity-50"
                        : "text-[var(--foreground)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)] hover:shadow-[var(--shadow-sm)]"
                    }`}
                  >
                    <span className="text-lg">{icon}</span>
                    <span className="line-clamp-1">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <UpgradeModal
            open={showUpgradeModal}
            onClose={() => setShowUpgradeModal(false)}
            currentPlan={plan}
            razorpayKeyId={razorpayKeyId}
            title={upgradeModalReason === "email" ? "Upgrade to notify leads by email" : "Upgrade to unlock OTP verification"}
            description={upgradeModalReason === "email" ? "Notify Lead By Email is available on Pro and Business plans. Upgrade to get email alerts when a new lead is submitted." : "Mobile and email OTP verification are available on Pro and Business plans. Upgrade to verify leads and reduce fake numbers."}
          />
        </div>

        <div className="min-w-0 flex-1">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="font-heading text-xl font-bold text-[var(--foreground-heading)] sm:text-2xl">
              Design form
            </h1>
            <p className="mt-1 truncate text-sm text-[var(--foreground-muted)]">{formName}</p>
          </div>
          <div className="flex flex-shrink-0 flex-wrap items-center gap-3">
            {saveMessage && (
              <span
                className={`text-sm font-medium ${saveMessage.type === "success" ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}
              >
                {saveMessage.text}
              </span>
            )}
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="btn-base min-h-[44px] rounded-[var(--radius-md)] bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-white shadow-[var(--shadow-cta)] transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save & Exit"}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--background-elevated)] p-4 shadow-[var(--shadow-sm)] sm:p-6 lg:p-8">
          {fields.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center sm:py-16">
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-[var(--color-accent-subtle)] text-2xl sm:size-16 sm:text-3xl">
                ✏️
              </div>
              <h3 className="font-heading text-base font-semibold text-[var(--foreground-heading)] sm:text-lg">
                No fields yet
              </h3>
              <p className="mt-2 max-w-sm px-2 text-base text-[var(--foreground-muted)]">
                Tap a field type above to add it. Use arrows to reorder, tap a field to edit.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {fields.map((f, index) => (
                <div
                  key={f.id}
                  onClick={() => setSelectedId(f.id)}
                  className={`flex cursor-pointer flex-col gap-3 rounded-xl border p-4 transition-all sm:flex-row sm:items-center sm:gap-4 ${
                    selectedId === f.id
                      ? "border-[var(--color-accent)] bg-[var(--color-accent-subtle)] ring-2 ring-[var(--color-accent)]/20"
                      : "border-[var(--border-default)] bg-[var(--background-elevated)] hover:border-[var(--neutral-300)] hover:bg-[var(--neutral-50)]"
                  }`}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3 sm:order-2">
                    <div className="flex shrink-0 items-center gap-2 text-[var(--foreground-muted)]">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-[var(--neutral-100)] text-sm font-medium">
                        {fieldIcon(f.type)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); moveField(index, -1); }}
                        disabled={index === 0}
                        className="flex size-10 min-w-[44px] items-center justify-center rounded-lg text-[var(--foreground-muted)] hover:bg-[var(--neutral-200)] hover:text-[var(--foreground)] disabled:opacity-30"
                        aria-label="Move up"
                      >
                        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); moveField(index, 1); }}
                        disabled={index === fields.length - 1}
                        className="flex size-10 min-w-[44px] items-center justify-center rounded-lg text-[var(--foreground-muted)] hover:bg-[var(--neutral-200)] hover:text-[var(--foreground)] disabled:opacity-30"
                        aria-label="Move down"
                      >
                        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate font-medium text-[var(--foreground-heading)]">
                          {f.label || f.name || "(Untitled)"}
                        </span>
                        <span className="shrink-0 rounded-md bg-[var(--neutral-100)] px-2 py-0.5 text-xs font-medium text-[var(--foreground-muted)]">
                          {f.type}
                        </span>
                        {f.required && (
                          <span className="shrink-0 text-xs text-[var(--color-danger)]">Required</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeField(f.id); }}
                    className="btn-base min-h-[44px] shrink-0 self-start rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-[var(--color-danger)] transition-colors hover:bg-[var(--color-danger)]/10 sm:order-3"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {selected && (
            <div className="mt-6 rounded-xl border border-[var(--border-default)] bg-[var(--background-elevated)] p-4 shadow-[var(--shadow-sm)] sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h3 className="font-heading text-base font-semibold text-[var(--foreground-heading)]">
                  Edit Field
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg text-[var(--foreground-muted)] transition-colors hover:bg-[var(--neutral-200)] hover:text-[var(--foreground)]"
                  aria-label="Close Edit Field"
                >
                  <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--foreground-muted)]">Label</label>
                  <input
                    value={selected.label}
                    onChange={(e) => updateField(selected.id, { label: e.target.value })}
                    className="form-input-base w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--background-elevated)] px-3 py-2 text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--foreground-muted)]">Field ID (used in form HTML)</label>
                  <input
                    value={selected.id}
                    onChange={(e) => updateField(selected.id, { id: e.target.value })}
                    className="form-input-base w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--background-elevated)] px-3 py-2 text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--foreground-muted)]">Semantic key (storage)</label>
                  <input
                    value={selected.name}
                    onChange={(e) => updateField(selected.id, { name: e.target.value })}
                    placeholder="e.g. name, email, phone_number"
                    className="form-input-base w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--background-elevated)] px-3 py-2 text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/30"
                  />
                  <p className="mt-1 text-xs text-[var(--foreground-muted)]">Saved under this key regardless of field order.</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-[var(--foreground-muted)]">Placeholder</label>
                  <input
                    value={selected.placeholder}
                    onChange={(e) => updateField(selected.id, { placeholder: e.target.value })}
                    className="form-input-base w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--background-elevated)] px-3 py-2 text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/30"
                  />
                </div>
                {(selected.type === "select" || selected.type === "radio") && (
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-[var(--foreground-muted)]">
                      Options (one per line)
                    </label>
                    <textarea
                      value={selected.options}
                      onChange={(e) => updateField(selected.id, { options: e.target.value })}
                      className="form-input-base w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--background-elevated)] px-3 py-2 text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/30"
                      rows={3}
                    />
                  </div>
                )}
                <label className="flex cursor-pointer items-center gap-2 sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={selected.required}
                    onChange={(e) => updateField(selected.id, { required: e.target.checked })}
                    className="h-4 w-4 rounded border-[var(--border-default)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                  />
                  <span className="text-sm font-medium text-[var(--foreground)]">Required field</span>
                </label>
                {selected.type === "recaptcha" && (
                  <div className="sm:col-span-2 rounded-lg border border-[var(--border-default)] bg-[var(--neutral-50)] p-3 text-sm text-[var(--foreground-muted)]">
                    <p className="font-medium text-[var(--foreground)]">reCAPTCHA v3 (score-based)</p>
                    <p className="mt-1">
                      The public form uses reCAPTCHA v3: no checkbox — verification runs on submit. Set{" "}
                      <code className="rounded bg-[var(--neutral-200)] px-1 py-0.5 text-xs">NEXT_PUBLIC_RECAPTCHA_SITE_KEY</code> and{" "}
                      <code className="rounded bg-[var(--neutral-200)] px-1 py-0.5 text-xs">RECAPTCHA_SECRET_KEY</code> (v3 keys) in your .env.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
