"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { FormSchema, AutomationRule } from "@/lib/form-schema";
import { useUpgradeModal } from "@/components/UpgradeModalProvider";

function newRule(): AutomationRule {
  return {
    id: `rule_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    name: "",
    enabled: true,
    trigger: "lead_submitted",
    action: "email_lead",
    subject: "Thanks for your enquiry",
    body: "Hi {{name}},\n\nWe received your submission and will get back to you soon.",
  };
}

export function FormAutomation({
  username,
  formId,
  formName,
  initialSchema,
  initialRules,
  canUseAutomation = true,
}: {
  username: string;
  formId: string;
  formName: string;
  initialSchema: FormSchema;
  initialRules: AutomationRule[];
  /** When false, show locked state and disable editing (free plan). */
  canUseAutomation?: boolean;
}) {
  const router = useRouter();
  const { showUpgradeModal } = useUpgradeModal();
  const [rules, setRules] = useState<AutomationRule[]>(initialRules);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  console.log("[automation] FormAutomation mount/render", { formId, initialRulesLength: initialRules.length, rulesLength: rules.length });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const url = `/api/forms/${formId}/automation`;
    console.log("[automation] client GET", { url });
    fetch(url)
      .then((res) => {
        console.log("[automation] client GET response", { url, ok: res.ok, status: res.status });
        return res.ok ? res.json() : { rules: [] };
      })
      .then((data) => {
        if (!cancelled && Array.isArray(data.rules)) {
          console.log("[automation] client GET parsed", { rulesCount: data.rules.length });
          setRules(data.rules);
        }
      })
      .catch((err) => console.log("[automation] client GET error", { url, err }))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [formId]);

  const save = useCallback(async () => {
    setSaving(true);
    setMessage(null);
    const url = `/api/forms/${formId}/automation`;
    console.log("[automation] client PUT", { url, rulesCount: rules.length });
    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rules),
      });
      const data = await res.json().catch(() => ({}));
      console.log("[automation] client PUT response", { ok: res.ok, status: res.status, rulesInResponse: Array.isArray(data.rules) ? data.rules.length : 0, error: data.error });
      if (res.ok) {
        if (Array.isArray(data.rules)) setRules(data.rules);
        setMessage({ type: "success", text: "Saved successfully." });
        router.refresh();
      } else {
        setMessage({ type: "error", text: (data.error as string) || "Failed to save." });
      }
    } catch (err) {
      console.log("[automation] client PUT error", { url, err });
      setMessage({ type: "error", text: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  }, [formId, rules, router]);

  const addRule = useCallback(() => {
    const r = newRule();
    setRules((prev) => [...prev, r]);
    setEditingId(r.id);
  }, []);

  const updateRule = useCallback((id: string, updates: Partial<AutomationRule>) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  }, []);

  const removeRule = useCallback((id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
    if (editingId === id) setEditingId(null);
  }, [editingId]);

  const triggerLabel = (t: string) => (t === "lead_submitted" ? "Lead submitted" : "Lead moved to stage");
  const actionLabel = (a: string) => (a === "email_lead" ? "Email lead" : "Email admin");

  return (
    <div className="space-y-6">
      {!canUseAutomation && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40 p-4 sm:p-5" role="alert">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Email automation is available on Pro and Business plans. Upgrade to create and run automation rules.
            </p>
            <button
              type="button"
              onClick={() =>
                showUpgradeModal(
                  "Upgrade to use email automation",
                  "Email automation is available on Pro and Business plans. Create trigger-based rules to email leads or admins."
                )
              }
              className="shrink-0 rounded-lg border border-amber-600 bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
            >
              Upgrade
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--background-elevated)] p-4 shadow-[var(--shadow-sm)] sm:p-5">
        <p className="text-sm text-[var(--foreground-muted)]">
          When a trigger happens, an email is sent using your SMTP settings. Use placeholders: <code className="rounded bg-[var(--neutral-100)] px-1 py-0.5 text-xs">{"{{name}}"}</code>, <code className="rounded bg-[var(--neutral-100)] px-1 py-0.5 text-xs">{"{{email}}"}</code>, <code className="rounded bg-[var(--neutral-100)] px-1 py-0.5 text-xs">{"{{formName}}"}</code>, <code className="rounded bg-[var(--neutral-100)] px-1 py-0.5 text-xs">{"{{stageName}}"}</code>.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={addRule}
            disabled={!canUseAutomation}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-accent)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add rule
          </button>
          {rules.length > 0 && (
            <button
              type="button"
              onClick={save}
              disabled={saving || !canUseAutomation}
              className="inline-flex items-center rounded-lg border border-[var(--border-default)] bg-[var(--background-elevated)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--neutral-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save rules"}
            </button>
          )}
        </div>
      </div>

      {message && (
        <p className={`text-sm ${message.type === "success" ? "text-emerald-600" : "text-red-600"}`}>
          {message.text}
        </p>
      )}

      {loading && rules.length === 0 ? (
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--background-elevated)] p-8 text-center">
          <p className="text-[var(--foreground-muted)]">Loading rules…</p>
        </div>
      ) : rules.length === 0 ? (
        <div className="rounded-xl border border-[var(--border-default)] border-dashed bg-[var(--background-elevated)]/50 p-8 text-center">
          <p className="text-[var(--foreground-muted)]">No automation rules yet.</p>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">Add a rule to send emails when a lead is submitted or moved to a stage.</p>
          <button
            type="button"
            onClick={addRule}
            disabled={!canUseAutomation}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[var(--color-accent)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add rule
          </button>
        </div>
      ) : null}

      <ul className="space-y-4">
        {rules.map((rule) => (
          <li
            key={rule.id}
            className="rounded-xl border border-[var(--border-default)] bg-[var(--background-elevated)] p-4 shadow-[var(--shadow-sm)]"
          >
            {editingId === rule.id ? (
              <RuleEditor
                rule={rule}
                onUpdate={(updates) => updateRule(rule.id, updates)}
                onClose={() => setEditingId(null)}
                onRemove={() => removeRule(rule.id)}
                onSaveAndClose={async () => {
                  await save();
                  setEditingId(null);
                }}
                saving={saving}
                locked={!canUseAutomation}
              />
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-[var(--foreground)]">
                      {rule.name || "Unnamed rule"}
                    </span>
                    {!rule.enabled && (
                      <span className="rounded bg-[var(--neutral-200)] px-2 py-0.5 text-xs text-[var(--foreground-muted)]">Disabled</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                    When: {triggerLabel(rule.trigger)}
                    {rule.trigger === "lead_stage_changed" && rule.triggerStageName && ` → "${rule.triggerStageName}"`}
                    {" · "}
                    Then: {actionLabel(rule.action)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className={`flex items-center gap-2 text-sm text-[var(--foreground-muted)] ${!canUseAutomation ? "pointer-events-none opacity-60" : ""}`}>
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={(e) => updateRule(rule.id, { enabled: e.target.checked })}
                      disabled={!canUseAutomation}
                      className="rounded border-[var(--border-default)]"
                    />
                    Enabled
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditingId(rule.id)}
                    disabled={!canUseAutomation}
                    className="text-sm font-medium text-[var(--color-accent)] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => removeRule(rule.id)}
                    disabled={!canUseAutomation}
                    className="text-sm font-medium text-[var(--color-danger)] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RuleEditor({
  rule,
  onUpdate,
  onClose,
  onRemove,
  onSaveAndClose,
  saving = false,
  locked = false,
}: {
  rule: AutomationRule;
  onUpdate: (u: Partial<AutomationRule>) => void;
  onClose: () => void;
  onRemove: () => void;
  onSaveAndClose?: () => Promise<void>;
  saving?: boolean;
  locked?: boolean;
}) {
  const disabled = locked;
  const handleDone = async () => {
    if (onSaveAndClose) {
      await onSaveAndClose();
    } else {
      onClose();
    }
  };
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-muted)]">Name (optional)</label>
        <input
          type="text"
          value={rule.name ?? ""}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="e.g. Welcome when Won"
          disabled={disabled}
          className="mt-1 w-full rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] disabled:opacity-50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-muted)]">Trigger</label>
        <select
          value={rule.trigger}
          onChange={(e) => onUpdate({ trigger: e.target.value as AutomationRule["trigger"] })}
          disabled={disabled}
          className="mt-1 w-full rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] disabled:opacity-50"
        >
          <option value="lead_submitted">Lead submitted</option>
          <option value="lead_stage_changed">Lead moved to stage</option>
        </select>
        {rule.trigger === "lead_stage_changed" && (
          <input
            type="text"
            value={rule.triggerStageName ?? ""}
            onChange={(e) => onUpdate({ triggerStageName: e.target.value || undefined })}
            placeholder='Stage name (e.g. "Won" or "Contacted")'
            disabled={disabled}
            className="mt-2 w-full rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] disabled:opacity-50"
          />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-muted)]">Action</label>
        <select
          value={rule.action}
          onChange={(e) => onUpdate({ action: e.target.value as AutomationRule["action"] })}
          disabled={disabled}
          className="mt-1 w-full rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] disabled:opacity-50"
        >
          <option value="email_lead">Email lead</option>
          <option value="email_admin">Email admin</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-muted)]">Subject</label>
        <input
          type="text"
          value={rule.subject}
          onChange={(e) => onUpdate({ subject: e.target.value })}
          disabled={disabled}
          className="mt-1 w-full rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] disabled:opacity-50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-muted)]">Body (plain text, use new lines)</label>
        <textarea
          value={rule.body}
          onChange={(e) => onUpdate({ body: e.target.value })}
          rows={5}
          disabled={disabled}
          className="mt-1 w-full rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] disabled:opacity-50"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleDone}
          disabled={disabled || saving}
          className="rounded-lg border border-[var(--border-default)] bg-[var(--background-elevated)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--neutral-50)] disabled:opacity-50"
        >
          {onSaveAndClose && saving ? "Saving…" : "Done"}
        </button>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="rounded-lg border border-[var(--color-danger)]/30 px-4 py-2 text-sm font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 disabled:opacity-50"
        >
          Delete rule
        </button>
      </div>
    </div>
  );
}
