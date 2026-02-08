"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/** One column per form field: id, name (storage key), label (header). Order = form design order. */
type SchemaColumn = { id: string; name: string; label: string };

type LeadRow = {
  id: string;
  formName: string;
  formId: string;
  data: string;
  createdAt: string;
};

type ApiForm = {
  id: string;
  name: string;
  schema_json: { fields?: { id: string; name?: string; label?: string; type?: string }[] };
} | null;

function parseData(data: string | Record<string, unknown> | null | undefined): Record<string, unknown> {
  if (data == null) return {};
  if (typeof data === "object" && !Array.isArray(data)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data)) {
      if (v != null) out[k] = v;
    }
    return out;
  }
  if (typeof data !== "string") return {};
  try {
    const parsed = JSON.parse(data) as unknown;
    if (parsed != null && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // ignore
  }
  return {};
}

/**
 * Resolve the key to read from leads.data_json (must match submit route's inferSemanticKey).
 * - If field.name exists → use field.name
 * - Else if field.type == "phone" → use "phone_number"
 * - Else if field.type == "email" → use "email"
 * - Else use field.id
 */
function resolveDataKey(field: { id?: string; name?: string; type?: string }): string {
  if (field.name != null && String(field.name).trim() !== "") return String(field.name).trim();
  const t = (field.type ?? "").toLowerCase();
  if (t === "phone") return "phone_number";
  if (t === "email") return "email";
  return field.id ?? "";
}

/** Ordered columns from form schema (form design order). Excludes hidden and recaptcha. */
function getOrderedSchemaColumns(form: ApiForm): SchemaColumn[] {
  if (!form?.schema_json || typeof form.schema_json !== "object") return [];
  const raw = form.schema_json as { fields?: { id?: string; name?: string; label?: string; type?: string }[] };
  const fields = Array.isArray(raw.fields) ? raw.fields : [];
  return fields
    .filter((f) => {
      const t = (f.type ?? "").toLowerCase();
      return t !== "recaptcha" && t !== "hidden";
    })
    .map((f) => ({
      id: f.id ?? "",
      name: resolveDataKey(f),
      label: (f.label && String(f.label).trim()) ? String(f.label) : f.name || f.id || "Field",
    }))
    .filter((f) => f.id);
}

/** Build a map from data key (resolved from schema) to display label for "All submitted fields" detail view. */
function buildKeyToLabelMap(form: ApiForm): Map<string, string> {
  const map = new Map<string, string>();
  if (!form?.schema_json || typeof form.schema_json !== "object") return map;
  const raw = form.schema_json as { fields?: { id?: string; name?: string; label?: string; type?: string }[] };
  const fields = Array.isArray(raw.fields) ? raw.fields : [];
  for (const f of fields) {
    const label = (f.label && String(f.label).trim()) || f.name || f.id || "";
    if (!label) continue;
    const dataKey = resolveDataKey(f);
    if (dataKey) map.set(dataKey, label);
    const id = f.id ?? "";
    if (id && id !== dataKey) map.set(id, label);
  }
  return map;
}

/** Humanize a raw key for display when no schema label is available (e.g. "field_123" → "Field 123"). */
function humanizeKey(key: string): string {
  if (!key) return "Field";
  const withoutPrefix = key.replace(/^field_/i, "").trim();
  if (!withoutPrefix) return "Field";
  if (/^\d+$/.test(withoutPrefix)) return "Field";
  return withoutPrefix.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Cell value from lead data for one schema column: data[field.name] or data[field.id], or "-" if missing. */
function getCellValue(data: Record<string, unknown>, field: SchemaColumn): string {
  const v = data[field.name] ?? data[field.id];
  if (v == null || (typeof v === "string" && !v.trim())) return "-";
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean).join(", ");
  return String(v).trim();
}

export function LeadsTable({
  username,
  initialLeads,
  initialTotal,
  initialPage,
  perPage,
  forms,
  initialFormId,
  initialForm,
  currentSearch,
}: {
  username: string;
  initialLeads: LeadRow[];
  initialTotal: number;
  initialPage: number;
  perPage: number;
  forms: { id: string; name: string }[];
  initialFormId: string;
  initialForm: { id: string; name: string; schema_json: { fields: unknown[] } } | null;
  currentSearch: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentSearch);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);

  const [form, setForm] = useState<ApiForm>(initialFormId && initialForm ? initialForm : null);
  const [leads, setLeads] = useState<LeadRow[]>(initialLeads);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const currentFormId = initialFormId;

  const schemaColumns = React.useMemo(() => getOrderedSchemaColumns(form), [form]);
  const schemaLoaded = form != null && form.schema_json != null;
  const showTable = schemaLoaded;

  // DEBUG: Log schema, sample lead data, and resolved keys before rendering
  useEffect(() => {
    if (form?.schema_json) {
      console.log("[LeadsTable] parsed schema_json:", form.schema_json);
    }
    if (leads.length > 0) {
      const firstLead = leads[0];
      const parsed = parseData(firstLead.data);
      console.log("[LeadsTable] leads.data_json (first lead, raw):", firstLead.data);
      console.log("[LeadsTable] leads.data_json (first lead, parsed):", parsed);
    }
    if (schemaColumns.length > 0) {
      console.log(
        "[LeadsTable] resolved key per field:",
        schemaColumns.map((c) => ({ id: c.id, label: c.label, dataKey: c.name }))
      );
    }
  }, [form?.schema_json, leads, schemaColumns]);

  const refetch = useCallback(() => {
    if (!currentFormId) {
      setForm(null);
      setLeads([]);
      setTotal(0);
      setPage(1);
      setLoading(false);
      setLoadError(null);
      return;
    }
    setLoadError(null);
    const alreadyHaveForm = form?.id === currentFormId;
    if (!alreadyHaveForm) setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(initialPage));
    params.set("formId", currentFormId);
    if (search) params.set("search", search);
    fetch(`/api/leads?${params.toString()}`, { credentials: "same-origin" })
      .then((r) => {
        if (!r.ok) {
          setLoadError(r.status === 401 ? "Please log in again." : "Could not load leads. Try refreshing.");
          return null;
        }
        return r.json();
      })
      .then((body: { form?: ApiForm; leads?: LeadRow[]; total?: number; page?: number } | null) => {
        if (body == null) return;
        if (body.form !== undefined) setForm(body.form ?? null);
        if (body.leads !== undefined) setLeads(body.leads ?? []);
        if (body.total !== undefined) setTotal(body.total ?? 0);
        if (body.page !== undefined) setPage(body.page ?? 1);
      })
      .catch(() => setLoadError("Could not load leads. Try refreshing."))
      .finally(() => setLoading(false));
  }, [currentFormId, initialPage, search]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const totalPages = Math.ceil(total / perPage);
  const base = `/${username}/leads`;
  const colCount = 1 + schemaColumns.length + 1 + 1; // Id + schema columns + Submitted + Actions

  function formatDisplayValue(val: string): string {
    if (val === "-" || val === "—") return "-";
    if (val === "true") return "Yes";
    if (val === "false" || val === "") return "-";
    return val;
  }

  const keyToLabelMap = React.useMemo(() => buildKeyToLabelMap(form), [form]);

  function AllFieldsList({ data }: { data: Record<string, unknown> }) {
    const entries = Object.entries(data).filter(([, v]) => v != null && String(v).trim() !== "");
    if (entries.length === 0) return <p className="text-base text-[var(--foreground-muted)]">No data</p>;
    return (
      <ul className="space-y-2 text-sm">
        {entries.map(([key, val]) => {
          const displayLabel = keyToLabelMap.get(key) ?? humanizeKey(key);
          return (
            <li key={key} className="flex gap-3 border-b border-[var(--border-subtle)] pb-2 last:border-0 last:pb-0">
              <span className="min-w-[120px] shrink-0 font-medium text-[var(--foreground-muted)]">{displayLabel}</span>
              <span className="min-w-0 break-words text-[var(--foreground)]">{formatDisplayValue(String(val))}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  async function handleDeleteLead(leadId: string) {
    if (!confirm("Delete this lead? This cannot be undone.")) return;
    setDeletingLeadId(leadId);
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (res.ok) {
        setExpandedId((id) => (id === leadId ? null : id));
        router.refresh();
        refetch();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to delete lead.");
      }
    } catch {
      alert("Failed to delete lead. Please try again.");
    } finally {
      setDeletingLeadId(null);
    }
  }

  function applyFilters() {
    const p = new URLSearchParams(searchParams.toString());
    p.set("page", "1");
    if (search) p.set("search", search);
    else p.delete("search");
    if (currentFormId) p.set("formId", currentFormId);
    router.push(`${base}?${p.toString()}`);
  }

  function setFormFilter(formId: string) {
    const p = new URLSearchParams(searchParams.toString());
    p.set("page", "1");
    if (formId) p.set("formId", formId);
    else p.delete("formId");
    router.push(`${base}?${p.toString()}`);
  }

  if (loadError) {
    return (
      <div className="min-w-0 space-y-5">
        <div className="rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {loadError}
          <button type="button" onClick={() => refetch()} className="ml-2 font-medium underline focus:outline-none">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-5">
      <div className="flex min-w-0 flex-nowrap items-center gap-1.5 sm:gap-2 md:gap-3">
        <input
          type="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          className="form-input-base min-h-10 min-w-0 flex-1 rounded-[var(--radius-md)] px-2.5 sm:min-h-11 sm:min-w-[6rem] sm:px-3"
          aria-label="Search leads"
        />
        <button
          type="button"
          onClick={applyFilters}
          className="btn-base min-h-10 shrink-0 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--background-elevated)] px-2.5 py-1.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--neutral-100)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] sm:min-h-11 sm:px-3"
        >
          Search
        </button>
        <select
          value={currentFormId}
          onChange={(e) => setFormFilter(e.target.value)}
          className="form-input-base min-h-10 min-w-0 max-w-[6rem] shrink rounded-[var(--radius-md)] px-2 py-1.5 text-sm sm:min-h-11 sm:max-w-[8rem] sm:px-2.5 md:max-w-[10rem]"
          aria-label="Select form to view leads"
        >
          <option value="">Select a form...</option>
          {forms.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        <div className="flex shrink-0 gap-1.5 sm:gap-2">
          <a
            href={currentFormId ? `/api/leads/export?formId=${currentFormId}` : undefined}
            className={`btn-base min-h-10 shrink-0 inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-md)] px-2.5 py-1.5 text-sm font-medium sm:min-h-11 sm:px-3 ${currentFormId ? "bg-[var(--color-success)] text-white transition-colors hover:bg-[var(--color-success-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-success)]" : "cursor-not-allowed bg-[var(--neutral-200)] text-[var(--foreground-muted)]"}`}
            title={currentFormId ? "Export CSV" : "Select a form to export leads"}
            aria-disabled={!currentFormId}
            onClick={!currentFormId ? (e) => e.preventDefault() : undefined}
          >
            <span className="hidden sm:inline">Export </span>CSV
          </a>
          <a
            href={currentFormId ? `/api/leads/export?format=xlsx&formId=${currentFormId}` : undefined}
            className={`btn-base min-h-10 shrink-0 inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-md)] px-2.5 py-1.5 text-sm font-medium sm:min-h-11 sm:px-3 ${currentFormId ? "bg-[var(--color-success)] text-white transition-colors hover:bg-[var(--color-success-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-success)]" : "cursor-not-allowed bg-[var(--neutral-200)] text-[var(--foreground-muted)]"}`}
            title={currentFormId ? "Export Excel" : "Select a form to export leads"}
            aria-disabled={!currentFormId}
            onClick={!currentFormId ? (e) => e.preventDefault() : undefined}
          >
            <span className="hidden sm:inline">Export </span>Excel
          </a>
        </div>
      </div>
      <div className="min-w-0 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--background-elevated)] shadow-[var(--shadow-sm)]">
        <div className="-mx-px overflow-x-auto">
          {!currentFormId ? (
            <div className="px-4 py-8 text-center text-sm text-[var(--foreground-muted)]">
              Please select a form to view leads.
            </div>
          ) : loading || !schemaLoaded ? (
            <div className="px-4 py-8 text-center text-sm text-[var(--foreground-muted)]">
              Loading form and leads…
            </div>
          ) : (
            <table className="w-full min-w-[400px] text-sm">
              <thead className="border-b border-[var(--border-default)] bg-[var(--neutral-50)]">
                <tr>
                  <th className="w-24 whitespace-nowrap px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                    Id
                  </th>
                  {schemaColumns.map((col) => (
                    <th
                      key={col.id}
                      className="min-w-[100px] px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]"
                    >
                      {col.label}
                    </th>
                  ))}
                  <th className="min-w-[120px] whitespace-nowrap px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                    Submitted
                  </th>
                  <th className="w-24 whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-[var(--foreground-muted)]" aria-label="Row actions" />
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={colCount} className="px-4 py-8 text-center text-sm text-[var(--foreground-muted)]">
                      No leads yet. Submissions from your public form will appear here.
                    </td>
                  </tr>
                ) : (
                  leads.map((l) => {
                    const data = parseData(l.data);
                    const isExpanded = expandedId === l.id;
                    return (
                      <React.Fragment key={l.id}>
                        <tr className="border-b border-[var(--border-subtle)] transition-colors hover:bg-[var(--neutral-50)]/50">
                          <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-[var(--foreground-muted)]" title={l.id}>
                            {l.id.slice(0, 8)}
                          </td>
                          {schemaColumns.map((col) => {
                            const cellVal = getCellValue(data, col);
                            return (
                              <td key={col.id} className="max-w-[200px] min-w-0 px-4 py-3 text-[var(--foreground)]">
                                <div className="truncate" title={cellVal}>
                                  {formatDisplayValue(cellVal)}
                                </div>
                              </td>
                            );
                          })}
                          <td className="whitespace-nowrap px-4 py-3 text-xs text-[var(--foreground-muted)]" suppressHydrationWarning>
                            {new Date(l.createdAt).toLocaleString()}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <button
                              type="button"
                              onClick={() => setExpandedId(expandedId === l.id ? null : l.id)}
                              className="text-sm font-medium text-[var(--color-accent)] transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-accent)]"
                            >
                              {isExpanded ? "Hide" : "View"}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteLead(l.id);
                              }}
                              disabled={deletingLeadId === l.id}
                              className="ml-2 text-sm font-medium text-[var(--color-danger)] transition-colors hover:underline disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-danger)]"
                            >
                              {deletingLeadId === l.id ? "Deleting…" : "Delete"}
                            </button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr key={`${l.id}-detail`} className="bg-[var(--neutral-50)]/80">
                            <td colSpan={colCount} className="px-4 py-4 text-sm">
                              <div className="flex flex-wrap items-start gap-4">
                                <div className="min-w-0 flex-1">
                                  <p className="mb-2 text-base font-medium text-[var(--foreground)]">All submitted fields</p>
                                  <AllFieldsList data={data} />
                                </div>
                                <div className="w-full border-t border-[var(--border-subtle)] pt-3 mt-1">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLead(l.id)}
                                    disabled={deletingLeadId === l.id}
                                    className="text-sm font-medium text-[var(--color-danger)] transition-colors hover:underline disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-danger)]"
                                  >
                                    {deletingLeadId === l.id ? "Deleting…" : "Delete Lead"}
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
        {showTable && (
          <div className="divide-y divide-[var(--border-subtle)] border-t border-[var(--border-subtle)] sm:hidden">
            {leads.map((l) => {
              const data = parseData(l.data);
              const isExpanded = expandedId === l.id;
              return (
                <div key={l.id} className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between gap-2 text-sm">
                      <span className="font-medium text-[var(--foreground-muted)]">Id</span>
                      <span className="font-mono text-xs text-[var(--foreground)]" title={l.id}>{l.id.slice(0, 8)}</span>
                    </div>
                    {schemaColumns.map((col) => {
                      const cellVal = getCellValue(data, col);
                      return (
                        <div key={col.id} className="flex justify-between gap-2 text-sm">
                          <span className="font-medium text-[var(--foreground-muted)]">{col.label}</span>
                          <span className="text-[var(--foreground)]">{formatDisplayValue(cellVal)}</span>
                        </div>
                      );
                    })}
                    <div className="flex justify-between gap-2 text-sm">
                      <span className="font-medium text-[var(--foreground-muted)]">Submitted</span>
                      <span className="text-[var(--foreground)]" suppressHydrationWarning>{new Date(l.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : l.id)}
                      className="text-sm font-medium text-[var(--color-accent)] transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-accent)]"
                    >
                      {isExpanded ? "Hide Details" : "View All Fields"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLead(l.id)}
                      disabled={deletingLeadId === l.id}
                      className="text-sm font-medium text-[var(--color-danger)] transition-colors hover:underline disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-danger)]"
                    >
                      {deletingLeadId === l.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-neutral-200">
                      <AllFieldsList data={data} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {totalPages > 1 && showTable && (
          <div className="flex flex-col items-stretch justify-between gap-3 border-t border-[var(--border-subtle)] px-4 py-3 sm:flex-row sm:items-center text-sm">
            <span className="text-center text-[var(--foreground-muted)] sm:text-left">
              {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}
            </span>
            <div className="flex justify-center gap-4">
              {page > 1 && (
                <a
                  href={`${base}?page=${page - 1}${currentFormId ? `&formId=${currentFormId}` : ""}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                  className="min-h-11 inline-flex items-center font-medium text-[var(--color-accent)] transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                >
                  Previous
                </a>
              )}
              {page < totalPages && (
                <a
                  href={`${base}?page=${page + 1}${currentFormId ? `&formId=${currentFormId}` : ""}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                  className="min-h-11 inline-flex items-center font-medium text-[var(--color-accent)] transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                >
                  Next
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
