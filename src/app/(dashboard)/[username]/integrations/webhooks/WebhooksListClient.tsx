"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

type WebhookItem = {
  id: string;
  name: string;
  url: string;
  triggerEvent: string;
  active: boolean;
  createdAt: string;
};

export function WebhooksListClient({
  username,
  initialWebhooks,
}: {
  username: string;
  initialWebhooks: WebhookItem[];
}) {
  const router = useRouter();
  const { addToast } = useToast();
  const [webhooks, setWebhooks] = useState(initialWebhooks);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const base = `/${username}/integrations/webhooks`;

  const handleToggle = async (id: string, currentActive: boolean) => {
    setTogglingId(id);
    try {
      const res = await fetch(`/api/webhooks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentActive }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setWebhooks((prev) =>
          prev.map((w) => (w.id === id ? { ...w, active: !currentActive } : w))
        );
        addToast({
          title: currentActive ? "Webhook disabled" : "Webhook enabled",
          variant: "success",
        });
      } else {
        addToast({
          title: "Failed to update",
          description: (data.error as string) || "Please try again.",
          variant: "danger",
        });
      }
    } catch {
      addToast({
        title: "Failed to update",
        description: "Network error. Please try again.",
        variant: "danger",
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete webhook "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/webhooks/${id}`, { method: "DELETE" });
      if (res.ok) {
        setWebhooks((prev) => prev.filter((w) => w.id !== id));
        addToast({ title: "Webhook deleted", variant: "success" });
      } else {
        const data = await res.json().catch(() => ({}));
        addToast({
          title: "Failed to delete",
          description: (data.error as string) || "Please try again.",
          variant: "danger",
        });
      }
    } catch {
      addToast({
        title: "Failed to delete",
        description: "Network error. Please try again.",
        variant: "danger",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatEvent = (e: string) => {
    if (e === "lead.created") return "Lead created";
    if (e === "lead.stage_changed") return "Stage changed";
    if (e === "lead.won") return "Lead won";
    return e;
  };

  if (webhooks.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border-default)] bg-white p-8 text-center shadow-[var(--shadow-sm)]">
        <p className="text-[var(--foreground-muted)]">No webhooks yet.</p>
        <Link
          href={`${base}/new`}
          className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[var(--color-accent)] px-4 text-sm font-medium text-white transition-colors hover:opacity-90"
        >
          Add Your First Webhook
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border-default)] bg-white shadow-[var(--shadow-sm)]">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[600px]" role="grid">
          <thead>
            <tr className="border-b border-[var(--border-default)] bg-[var(--background-alt)]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                URL
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                Event
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-default)]">
            {webhooks.map((w) => (
              <tr key={w.id} className="hover:bg-[var(--background-alt)]/50">
                <td className="px-4 py-3 font-medium text-[var(--foreground)]">{w.name}</td>
                <td className="px-4 py-3 text-sm text-[var(--foreground-muted)] truncate max-w-[200px]" title={w.url}>
                  {w.url}
                </td>
                <td className="px-4 py-3 text-sm text-[var(--foreground)]">{formatEvent(w.triggerEvent)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      w.active
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                        : "bg-[var(--neutral-200)] text-[var(--foreground-muted)]"
                    }`}
                  >
                    {w.active ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Link
                      href={`${base}/${w.id}`}
                      className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleToggle(w.id, w.active)}
                      disabled={togglingId === w.id}
                      className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--foreground-muted)] hover:bg-[var(--background-alt)] disabled:opacity-50 transition-colors"
                    >
                      {togglingId === w.id ? "…" : w.active ? "Disable" : "Enable"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(w.id, w.name)}
                      disabled={deletingId === w.id}
                      className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 disabled:opacity-50 transition-colors"
                    >
                      {deletingId === w.id ? "…" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-[var(--border-default)]">
        {webhooks.map((w) => (
          <div key={w.id} className="p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <span className="font-medium text-[var(--foreground)]">{w.name}</span>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  w.active
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                    : "bg-[var(--neutral-200)] text-[var(--foreground-muted)]"
                }`}
              >
                {w.active ? "Active" : "Disabled"}
              </span>
            </div>
            <p className="text-sm text-[var(--foreground-muted)] break-all">{w.url}</p>
            <p className="text-sm text-[var(--foreground)]">{formatEvent(w.triggerEvent)}</p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`${base}/${w.id}`}
                className="flex-1 min-w-[100px] inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[var(--border-default)] bg-white px-3 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background-alt)]"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => handleToggle(w.id, w.active)}
                disabled={togglingId === w.id}
                className="flex-1 min-w-[100px] min-h-[44px] rounded-lg border border-[var(--border-default)] bg-white px-3 text-sm font-medium text-[var(--foreground-muted)] hover:bg-[var(--background-alt)] disabled:opacity-50"
              >
                {togglingId === w.id ? "…" : w.active ? "Disable" : "Enable"}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(w.id, w.name)}
                disabled={deletingId === w.id}
                className="flex-1 min-w-[100px] min-h-[44px] rounded-lg border border-red-200 bg-white px-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30 disabled:opacity-50"
              >
                {deletingId === w.id ? "…" : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
