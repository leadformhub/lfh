"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Modal, ModalCloseButton } from "@/components/ui/Modal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";

type LeadForModal = {
  id: string;
  formName: string | null;
  formId: string;
  data: string;
  createdAt: string;
  stageId?: string | null;
  stageName?: string;
  followUpBy?: string | null;
};

type ApiForm = {
  id: string;
  name: string;
  schema_json?: { fields?: unknown[] };
} | null;

type ActivityItem = {
  id: string;
  type: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

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

function resolveDataKey(field: { id?: string; name?: string; type?: string }): string {
  if (field.name != null && String(field.name).trim() !== "") return String(field.name).trim();
  const t = (field.type ?? "").toLowerCase();
  if (t === "phone") return "phone_number";
  if (t === "email") return "email";
  return field.id ?? "";
}

function buildKeyToLabelMap(form: ApiForm): Map<string, string> {
  const map = new Map<string, string>();
  if (!form?.schema_json || typeof form.schema_json !== "object") return map;
  const raw = form.schema_json as { fields?: Array<{ id?: string; name?: string; label?: string; type?: string }> };
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

function humanizeKey(key: string): string {
  if (!key) return "Field";
  const withoutPrefix = key.replace(/^field_/i, "").trim();
  if (!withoutPrefix) return "Field";
  if (/^\d+$/.test(withoutPrefix)) return "Field";
  return withoutPrefix.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDisplayValue(val: string): string {
  if (val === "-" || val === "—") return "-";
  if (val === "true") return "Yes";
  if (val === "false" || val === "") return "-";
  return val;
}

function truncateNoteBody(body: string, maxLen: number): string {
  const s = String(body).trim();
  if (s.length <= maxLen) return s;
  return s.slice(0, maxLen) + "…";
}

function getActivityLabel(activity: ActivityItem): string {
  if (activity.type === "created") return "Lead created";
  if (activity.type === "deleted") return "Lead deleted";
  if (activity.type === "note" && activity.metadata?.body != null) {
    const body = String(activity.metadata.body);
    const preview = truncateNoteBody(body, 80);
    return preview ? `Note: ${preview}` : "Follow-up note added";
  }
  if (activity.type === "stage_changed" && activity.metadata) {
    const m = activity.metadata;
    const toName = (m.stageName as string) ?? "New";
    const fromName = m.fromStageName as string | undefined;
    if (fromName) return `Moved from ${fromName} to ${toName}`;
    return `Moved to ${toName}`;
  }
  return "Activity";
}

export function LeadDetailsModal({
  open,
  onClose,
  lead,
  form,
}: {
  open: boolean;
  onClose: () => void;
  lead: LeadForModal | null;
  form: ApiForm;
}) {
  const [activeTab, setActiveTab] = useState<"details" | "timeline">("details");
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [followUpBy, setFollowUpBy] = useState<string | null>(lead?.followUpBy ?? null);
  const [followUpDateInput, setFollowUpDateInput] = useState("");
  const [savingFollowUp, setSavingFollowUp] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const keyToLabelMap = React.useMemo(() => buildKeyToLabelMap(form), [form]);
  const data = React.useMemo(() => (lead ? parseData(lead.data) : {}), [lead?.data]);

  useEffect(() => {
    if (lead?.followUpBy != null) setFollowUpBy(lead.followUpBy);
    else setFollowUpBy(null);
    setFollowUpDateInput("");
  }, [lead?.id, lead?.followUpBy]);

  // Fetch activities when modal opens so notes show in Details and Timeline
  useEffect(() => {
    if (!open || !lead?.id) return;
    setActivitiesLoading(true);
    fetch(`/api/leads/${lead.id}/activities`, { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : { activities: [] }))
      .then((body: { activities?: ActivityItem[] }) => setActivities(body.activities ?? []))
      .catch(() => setActivities([]))
      .finally(() => setActivitiesLoading(false));
  }, [open, lead?.id]);

  if (!lead) return null;

  const title = `Lead ${lead.id.slice(0, 8)}`;
  const subtitle = lead.formName ?? "Form";

  return (
    <Modal open={open} onClose={onClose} title={title} description={subtitle} size="lg" variant="soft">
      <div className="relative">
        <ModalCloseButton onClose={onClose} />
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "details" | "timeline")} className="mt-2">
          <TabsList className="flex w-full sm:w-auto">
            <TabsTrigger value="details" className="flex-1 sm:flex-initial min-h-[44px] sm:min-h-0">
              Details
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex-1 sm:flex-initial min-h-[44px] sm:min-h-0">
              Timeline
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-4 space-y-4">
            <div className="space-y-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--neutral-50)]/50 p-4">
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div>
                  <span className="font-medium text-[var(--foreground-muted)]">Form</span>
                  <span className="ml-2 text-[var(--foreground)]">{lead.formName || "—"}</span>
                </div>
                <div>
                  <span className="font-medium text-[var(--foreground-muted)]">Status</span>
                  <span className="ml-2 text-[var(--foreground)]">{lead.stageName === "New" ? "To Contact" : lead.stageName ?? "New"}</span>
                </div>
                <div>
                  <span className="font-medium text-[var(--foreground-muted)]">Submitted</span>
                  <span className="ml-2 text-[var(--foreground)]" suppressHydrationWarning>
                    {new Date(lead.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--neutral-50)]/50 p-4">
              <p className="text-sm font-medium text-[var(--foreground-muted)]">Follow-up</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <span className="text-sm text-[var(--foreground)]">
                  Follow up by: {followUpBy ? new Date(followUpBy).toLocaleDateString() : "Not set."}
                </span>
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:flex-initial">
                  <input
                    type="date"
                    value={followUpDateInput}
                    onChange={(e) => setFollowUpDateInput(e.target.value)}
                    className="form-input-base min-h-[44px] min-w-0 flex-1 rounded-[var(--radius-md)] px-2.5 sm:min-h-9 sm:flex-initial sm:min-w-[140px]"
                    aria-label="Follow up by date"
                  />
                  <button
                    type="button"
                    disabled={savingFollowUp || !followUpDateInput.trim()}
                    onClick={async () => {
                      if (!lead?.id || !followUpDateInput.trim()) return;
                      setSavingFollowUp(true);
                      try {
                        const res = await fetch(`/api/leads/${lead.id}/follow-up`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          credentials: "same-origin",
                          body: JSON.stringify({ followUpBy: new Date(followUpDateInput).toISOString() }),
                        });
                        if (res.ok) {
                          const body = await res.json().catch(() => ({}));
                          const next = (body as { followUpBy?: string | null }).followUpBy ?? new Date(followUpDateInput).toISOString();
                          setFollowUpBy(next);
                          setFollowUpDateInput("");
                        } else {
                          const data = await res.json().catch(() => ({}));
                          alert(data.error ?? "Failed to set follow-up date.");
                        }
                      } catch {
                        alert("Failed to set follow-up date. Please try again.");
                      } finally {
                        setSavingFollowUp(false);
                      }
                    }}
                    className="btn-base min-h-[44px] min-w-[44px] shrink-0 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--background-elevated)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--neutral-100)] disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                  >
                    {savingFollowUp ? "…" : "Set"}
                  </button>
                  <button
                    type="button"
                    disabled={savingFollowUp}
                    onClick={async () => {
                      if (!lead?.id) return;
                      setSavingFollowUp(true);
                      try {
                        const res = await fetch(`/api/leads/${lead.id}/follow-up`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          credentials: "same-origin",
                          body: JSON.stringify({ followUpBy: null }),
                        });
                        if (res.ok) {
                          setFollowUpBy(null);
                          setFollowUpDateInput("");
                        } else {
                          const data = await res.json().catch(() => ({}));
                          alert(data.error ?? "Failed to clear follow-up date.");
                        }
                      } catch {
                        alert("Failed to clear follow-up date. Please try again.");
                      } finally {
                        setSavingFollowUp(false);
                      }
                    }}
                    className="btn-base min-h-[44px] min-w-[44px] shrink-0 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--background-elevated)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--neutral-100)] disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
            <div>
              <p className="mb-3 text-base font-semibold text-[var(--foreground-heading)]">All submitted fields</p>
              <ul className="space-y-3">
                {Object.entries(data)
                  .filter(([, v]) => v != null && String(v).trim() !== "")
                  .map(([key, val]) => {
                    const displayLabel = keyToLabelMap.get(key) ?? humanizeKey(key);
                    return (
                      <li
                        key={key}
                        className="flex flex-col gap-1 border-b border-[var(--border-subtle)] pb-3 last:border-0 last:pb-0 sm:flex-row sm:gap-3"
                      >
                        <span className="min-w-[100px] shrink-0 font-medium text-[var(--foreground-muted)] sm:min-w-[120px] text-sm">
                          {displayLabel}
                        </span>
                        <span className="min-w-0 break-words text-sm text-[var(--foreground)] sm:text-base">
                          {formatDisplayValue(String(val))}
                        </span>
                      </li>
                    );
                  })}
              </ul>
              {Object.keys(data).filter((k) => {
                const v = data[k];
                return v != null && String(v).trim() !== "";
              }).length === 0 && (
                <p className="text-sm text-[var(--foreground-muted)]">No data</p>
              )}
            </div>
            <div className="space-y-3">
              <p className="text-base font-semibold text-[var(--foreground-heading)]">Follow-up notes</p>
              {activitiesLoading ? (
                <div className="flex items-center justify-center py-6">
                  <div className="size-6 animate-spin rounded-full border-2 border-[var(--border-default)] border-t-[var(--color-accent)]" />
                </div>
              ) : (() => {
                const notes = activities.filter((a) => a.type === "note");
                return notes.length === 0 ? (
                  <p className="text-sm text-[var(--foreground-muted)]">No notes yet. Add one below.</p>
                ) : (
                  <ul className="space-y-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--neutral-50)]/50 p-4">
                    {notes.map((activity) => {
                      const body = activity.metadata?.body != null ? String(activity.metadata.body).trim() : "";
                      return (
                        <li
                          key={activity.id}
                          className="flex flex-col gap-1 border-b border-[var(--border-subtle)] pb-3 last:border-0 last:pb-0 last:pt-0"
                        >
                          <p className="min-w-0 break-words text-sm text-[var(--foreground)]">{body || "—"}</p>
                          <p className="text-xs text-[var(--foreground-muted)]" suppressHydrationWarning>
                            {new Date(activity.createdAt).toLocaleString()}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                );
              })()}
            </div>
            <div className="space-y-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--neutral-50)]/50 p-4">
              <p className="text-base font-semibold text-[var(--foreground-heading)]">Add follow-up note</p>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note…"
                rows={3}
                maxLength={2000}
                className="form-input-base min-h-[80px] w-full min-w-0 resize-y rounded-[var(--radius-md)] px-2.5 py-2 text-sm"
                aria-label="Follow-up note"
              />
              <button
                type="button"
                disabled={savingNote || !noteText.trim()}
                onClick={async () => {
                  if (!lead?.id || !noteText.trim()) return;
                  setSavingNote(true);
                  try {
                    const res = await fetch(`/api/leads/${lead.id}/activities`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      credentials: "same-origin",
                      body: JSON.stringify({ type: "note", body: noteText.trim() }),
                    });
                    if (res.ok) {
                      const created = (await res.json()) as ActivityItem;
                      setActivities((prev) => [created, ...prev]);
                      setNoteText("");
                    } else {
                      const data = await res.json().catch(() => ({}));
                      alert(data.error ?? "Failed to save note.");
                    }
                  } catch {
                    alert("Failed to save note. Please try again.");
                  } finally {
                    setSavingNote(false);
                  }
                }}
                className="btn-base min-h-[44px] w-full shrink-0 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] sm:w-auto"
              >
                {savingNote ? "Saving…" : "Save note"}
              </button>
            </div>
          </TabsContent>
          <TabsContent value="timeline" className="mt-4">
            {activitiesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="size-8 animate-spin rounded-full border-2 border-[var(--border-default)] border-t-[var(--color-accent)]" />
              </div>
            ) : activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-[var(--neutral-100)] text-[var(--foreground-muted)]">
                  <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-[var(--foreground-muted)]">No activities yet</p>
                <p className="mt-1 text-xs text-[var(--foreground-muted)]">Stage changes will appear here</p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-[var(--border-default)]" aria-hidden />
                <ul className="space-y-0">
                  {activities.map((activity) => (
                    <li key={activity.id} className="relative flex gap-4 py-3 first:pt-0">
                      <div
                        className={cn(
                          "relative z-10 mt-1.5 size-6 shrink-0 rounded-full border-2",
                          activity.type === "created"
                            ? "border-[var(--color-accent)] bg-[var(--color-accent-subtle)]"
                            : "border-[var(--border-default)] bg-[var(--neutral-50)]"
                        )}
                      >
                        {activity.type === "created" && (
                          <svg
                            className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 text-[var(--color-accent)]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        {activity.type === "stage_changed" && (
                          <svg
                            className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        )}
                        {activity.type === "note" && (
                          <svg
                            className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-medium text-[var(--foreground)] sm:text-base">{getActivityLabel(activity)}</p>
                        <p className="mt-0.5 text-xs text-[var(--foreground-muted)]" suppressHydrationWarning>
                          {new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Modal>
  );
}
