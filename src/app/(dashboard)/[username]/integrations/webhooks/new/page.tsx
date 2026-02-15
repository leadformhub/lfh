"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { WebhookHelpModal, WebhookHelpTrigger, type WebhookHelpTopic } from "../WebhookHelpModal";

const TRIGGER_OPTIONS = [
  { value: "lead.created", label: "Lead created" },
  { value: "lead.stage_changed", label: "Lead stage changed" },
  { value: "lead.won", label: "Lead won" },
];

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function NewWebhookPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const router = useRouter();
  const { addToast } = useToast();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [triggerEvent, setTriggerEvent] = useState("lead.created");
  const [secretKey, setSecretKey] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; url?: string }>({});
  const [helpTopic, setHelpTopic] = useState<WebhookHelpTopic | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameTrim = name.trim();
    const urlTrim = url.trim();
    const newErrors: { name?: string; url?: string } = {};
    if (!nameTrim) newErrors.name = "Webhook name is required.";
    if (!urlTrim) newErrors.url = "Webhook URL is required.";
    else if (!isValidUrl(urlTrim)) newErrors.url = "Please enter a valid URL (e.g. https://example.com/webhook).";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSaving(true);
    try {
      const res = await fetch("/api/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameTrim,
          url: urlTrim,
          triggerEvent,
          secretKey: secretKey.trim() || null,
          active,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        addToast({ title: "Webhook created", variant: "success" });
        router.push(`/${username}/integrations/webhooks`);
        router.refresh();
      } else {
        addToast({
          title: "Failed to create webhook",
          description: (data.error as string) || "Please try again.",
          variant: "danger",
        });
      }
    } catch {
      addToast({
        title: "Failed to create webhook",
        description: "Network error. Please try again.",
        variant: "danger",
      });
    } finally {
      setSaving(false);
    }
  };

  const base = `/${username}/integrations/webhooks`;

  return (
    <div className="max-w-xl space-y-6">
      <WebhookHelpModal topic={helpTopic} open={!!helpTopic} onClose={() => setHelpTopic(null)} />
      <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
        <Link href={base} className="hover:text-[var(--foreground)] transition-colors">
          Webhooks
        </Link>
        <span aria-hidden>/</span>
        <span>New webhook</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-[var(--border-default)] bg-white p-4 shadow-[var(--shadow-sm)] sm:p-6">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <label htmlFor="webhook-name" className="block text-sm font-medium text-[var(--foreground)]">
              Webhook name <span className="text-red-500">*</span>
            </label>
            <WebhookHelpTrigger topic="name" onOpen={() => setHelpTopic("name")} />
          </div>
          <input
            id="webhook-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. My CRM"
            className="w-full rounded-lg border border-[var(--border-default)] bg-white px-3 py-2.5 text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] min-h-[44px]"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <label htmlFor="webhook-url" className="block text-sm font-medium text-[var(--foreground)]">
              Webhook URL <span className="text-red-500">*</span>
            </label>
            <WebhookHelpTrigger topic="url" onOpen={() => setHelpTopic("url")} />
          </div>
          <input
            id="webhook-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/webhook"
            className="w-full rounded-lg border border-[var(--border-default)] bg-white px-3 py-2.5 text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] min-h-[44px]"
            aria-invalid={!!errors.url}
            aria-describedby={errors.url ? "url-error" : undefined}
          />
          {errors.url && (
            <p id="url-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
              {errors.url}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <label htmlFor="webhook-event" className="block text-sm font-medium text-[var(--foreground)]">
              Trigger event
            </label>
            <WebhookHelpTrigger topic="trigger" onOpen={() => setHelpTopic("trigger")} />
          </div>
          <select
            id="webhook-event"
            value={triggerEvent}
            onChange={(e) => setTriggerEvent(e.target.value)}
            className="w-full rounded-lg border border-[var(--border-default)] bg-white px-3 py-2.5 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] min-h-[44px]"
          >
            {TRIGGER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <label htmlFor="webhook-secret" className="block text-sm font-medium text-[var(--foreground)]">
              Secret key <span className="text-[var(--foreground-muted)] font-normal">(optional)</span>
            </label>
            <WebhookHelpTrigger topic="secret" onOpen={() => setHelpTopic("secret")} />
          </div>
          <input
            id="webhook-secret"
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="Leave blank to skip signature header"
            className="w-full rounded-lg border border-[var(--border-default)] bg-white px-3 py-2.5 text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] min-h-[44px]"
            autoComplete="off"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={active}
            onClick={() => setActive(!active)}
            className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 ${
              active ? "bg-[var(--color-accent)] border-transparent" : "bg-[var(--neutral-200)] border-[var(--border-default)]"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                active ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-[var(--foreground)]">Active</span>
            <WebhookHelpTrigger topic="active" onOpen={() => setHelpTopic("active")} />
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
          <Link
            href={base}
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg border border-[var(--border-default)] bg-white px-4 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background-alt)] sm:w-auto"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[var(--color-accent)] px-4 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60 sm:w-auto"
          >
            {saving ? "Creating…" : "Create webhook"}
          </button>
        </div>
      </form>
    </div>
  );
}
