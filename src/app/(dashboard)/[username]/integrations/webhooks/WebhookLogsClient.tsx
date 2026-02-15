"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type LogEntry = {
  id: string;
  webhookId: string;
  webhookName: string;
  event: string;
  targetUrl: string;
  status: string;
  httpStatus: number | null;
  responseTimeMs: number | null;
  attemptCount: number;
  errorMessage: string | null;
  createdAt: string;
};

const EVENT_OPTIONS = [
  { value: "", label: "All events" },
  { value: "lead.created", label: "Lead created" },
  { value: "lead.stage_changed", label: "Stage changed" },
  { value: "lead.won", label: "Lead won" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "success", label: "Success" },
  { value: "failed", label: "Failed" },
];

function formatEvent(e: string) {
  if (e === "lead.created") return "Lead created";
  if (e === "lead.stage_changed") return "Stage changed";
  if (e === "lead.won") return "Lead won";
  return e;
}

export function WebhookLogsClient({ username }: { username: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [loading, setLoading] = useState(true);
  const [eventFilter, setEventFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const eventParam = searchParams.get("event") ?? "";
  const statusParam = searchParams.get("status") ?? "";
  const pageParam = parseInt(searchParams.get("page") ?? "1", 10) || 1;

  useEffect(() => {
    setEventFilter(eventParam);
    setStatusFilter(statusParam);
    setPage(pageParam);
  }, [eventParam, statusParam, pageParam]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams();
    if (eventFilter) params.set("event", eventFilter);
    if (statusFilter) params.set("status", statusFilter);
    params.set("page", String(page));
    params.set("perPage", String(perPage));

    fetch(`/api/webhooks/logs?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data.logs)) {
          setLogs(data.logs);
          setTotal(data.total ?? 0);
        }
      })
      .catch(() => {
        if (!cancelled) setLogs([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [eventFilter, statusFilter, page, perPage]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (eventFilter) params.set("event", eventFilter);
    if (statusFilter) params.set("status", statusFilter);
    params.set("page", "1");
    router.push(`/${username}/integrations/webhooks/logs?${params.toString()}`);
  };

  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex flex-wrap gap-2">
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="rounded-lg border border-[var(--border-default)] bg-white px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] min-h-[44px]"
            aria-label="Filter by event"
          >
            {EVENT_OPTIONS.map((o) => (
              <option key={o.value || "all"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-[var(--border-default)] bg-white px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] min-h-[44px]"
            aria-label="Filter by status"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value || "all"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={applyFilters}
            className="min-h-[44px] rounded-lg bg-[var(--color-accent)] px-4 text-sm font-medium text-white hover:opacity-90 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border border-[var(--border-default)] bg-white p-8 text-center text-[var(--foreground-muted)]">
          Loading logs…
        </div>
      ) : logs.length === 0 ? (
        <div className="rounded-xl border border-[var(--border-default)] bg-white p-8 text-center text-[var(--foreground-muted)]">
          No logs match your filters.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--border-default)] bg-white shadow-[var(--shadow-sm)]">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[700px]" role="grid">
              <thead>
                <tr className="border-b border-[var(--border-default)] bg-[var(--background-alt)]">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                    Webhook
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                    Event
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                    URL
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                    HTTP
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                    When
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-default)]">
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-[var(--background-alt)]/50">
                    <td className="px-4 py-3 text-sm font-medium text-[var(--foreground)]">{l.webhookName}</td>
                    <td className="px-4 py-3 text-sm text-[var(--foreground)]">{formatEvent(l.event)}</td>
                    <td className="px-4 py-3 text-sm text-[var(--foreground-muted)] truncate max-w-[180px]" title={l.targetUrl}>
                      {l.targetUrl}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          l.status === "success"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200"
                        }`}
                      >
                        {l.status === "success" ? "Success" : "Failed"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--foreground-muted)]">
                      {l.httpStatus != null ? l.httpStatus : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--foreground-muted)]">
                      {l.responseTimeMs != null ? `${l.responseTimeMs}ms` : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--foreground-muted)]">
                      {new Date(l.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-[var(--border-default)]">
            {logs.map((l) => (
              <div key={l.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium text-[var(--foreground)]">{l.webhookName}</span>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      l.status === "success"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200"
                    }`}
                  >
                    {l.status === "success" ? "Success" : "Failed"}
                  </span>
                </div>
                <p className="text-sm text-[var(--foreground)]">{formatEvent(l.event)}</p>
                <p className="text-sm text-[var(--foreground-muted)] break-all">{l.targetUrl}</p>
                <div className="flex flex-wrap gap-3 text-xs text-[var(--foreground-muted)]">
                  <span>HTTP {l.httpStatus ?? "—"}</span>
                  <span>{l.responseTimeMs != null ? `${l.responseTimeMs}ms` : "—"}</span>
                  <span>Attempt {l.attemptCount}</span>
                </div>
                <p className="text-xs text-[var(--foreground-muted)]">
                  {new Date(l.createdAt).toLocaleString()}
                </p>
                {l.errorMessage && (
                  <p className="text-xs text-red-600 dark:text-red-400">{l.errorMessage}</p>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[var(--border-default)] px-4 py-3">
              <p className="text-sm text-[var(--foreground-muted)]">
                Page {page} of {totalPages} ({total} total)
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    const params = new URLSearchParams();
                    if (eventFilter) params.set("event", eventFilter);
                    if (statusFilter) params.set("status", statusFilter);
                    params.set("page", String(Math.max(1, page - 1)));
                    router.push(`/${username}/integrations/webhooks/logs?${params.toString()}`);
                  }}
                  disabled={!hasPrev}
                  className="min-h-[40px] rounded-lg border border-[var(--border-default)] bg-white px-3 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background-alt)] disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPage((p) => Math.min(totalPages, p + 1));
                    const params = new URLSearchParams();
                    if (eventFilter) params.set("event", eventFilter);
                    if (statusFilter) params.set("status", statusFilter);
                    params.set("page", String(Math.min(totalPages, page + 1)));
                    router.push(`/${username}/integrations/webhooks/logs?${params.toString()}`);
                  }}
                  disabled={!hasNext}
                  className="min-h-[40px] rounded-lg border border-[var(--border-default)] bg-white px-3 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background-alt)] disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
