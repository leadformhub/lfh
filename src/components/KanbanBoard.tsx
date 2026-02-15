"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef, startTransition } from "react";
import { LeadDetailsModal } from "@/components/LeadDetailsModal";
import {
  DndContext,
  type DragEndEvent,
  useDraggable,
  useDroppable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

const UNASSIGNED_ID = "unassigned";

type BoardLead = {
  id: string;
  formId: string | null;
  stageId: string | null;
  data: string;
  createdAt: string;
  formName: string | null;
  followUpBy?: string | null;
};

type BoardData = {
  pipeline: { id: string; name: string; formId: string | null };
  unassignedLeads: BoardLead[];
  leadsByStage: { stageId: string; stageName: string; order: number; leads: BoardLead[] }[];
};

/** Accepts same shape as leads page initialForm (schema_json.fields may be unknown[]). */
type ApiForm = {
  id: string;
  name: string;
  schema_json?: { fields?: unknown[] };
} | null;

function resolveDataKey(field: { id?: string; name?: string; type?: string }): string {
  return field.id ?? "";
}

function buildKeyToLabelMap(form: ApiForm): Map<string, string> {
  const map = new Map<string, string>();
  if (!form?.schema_json || typeof form.schema_json !== "object") return map;
  const raw = form.schema_json as { fields?: { id?: string; name?: string; label?: string }[] };
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

function DroppableColumn({
  id,
  title,
  children,
  count,
  className,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  count: number;
  className?: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`flex w-full shrink-0 flex-col rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--neutral-50)] md:min-w-0 md:flex-1 md:max-w-[320px] ${className ?? ""} ${isOver ? "ring-2 ring-[var(--color-accent)]/50" : ""}`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-[var(--border-default)] px-3 py-2.5 sm:px-4 sm:py-3">
        <span className="truncate text-sm font-semibold text-[var(--foreground-heading)]">{title}</span>
        <span className="shrink-0 rounded-full bg-[var(--neutral-200)] px-2 py-0.5 text-xs font-medium text-[var(--foreground-muted)]">
          {count}
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2 sm:gap-3 sm:p-3">
        {children}
      </div>
    </div>
  );
}

function DraggableCard({
  lead,
  stageName,
  keyToLabel,
  onViewLead,
}: {
  lead: BoardLead;
  stageName: string;
  keyToLabel: Map<string, string>;
  onViewLead: (lead: BoardLead & { stageName: string }) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: lead.id });
  const { primary, secondary } = useMemo(() => {
    let parsed: Record<string, unknown> = {};
    try {
      parsed = typeof lead.data === "string" ? JSON.parse(lead.data) : {};
    } catch {
      parsed = {};
    }
    const entries = Object.entries(parsed).filter(([, v]) => v != null && String(v).trim() !== "");
    return { primary: entries[0], secondary: entries.slice(1, 3) };
  }, [lead.id, lead.data]);
  const label = (key: string) => keyToLabel.get(key) ?? humanizeKey(key);

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onViewLead({ ...lead, stageName });
  };

  return (
    <div
      ref={setNodeRef}
      className={`rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--background-elevated)] p-2.5 shadow-[var(--shadow-xs)] transition-shadow sm:p-3 ${isDragging ? "opacity-60 shadow-[var(--shadow-md)]" : "hover:shadow-[var(--shadow-sm)]"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          className="shrink-0 touch-none cursor-grab active:cursor-grabbing rounded p-1 text-[var(--foreground-muted)] hover:bg-[var(--neutral-100)] hover:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-inset"
          aria-label="Drag to move lead"
          {...listeners}
          {...attributes}
        >
          <svg className="size-4" fill="currentColor" viewBox="0 0 16 16" aria-hidden>
            <path d="M2 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm6-8a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm6-8a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
          </svg>
        </button>
        <div className="min-w-0 flex-1">
          {primary && (
            <p className="truncate text-sm font-medium text-[var(--foreground)]">
              {String(primary[1])}
            </p>
          )}
          {secondary.length > 0 && (
            <div className="mt-1.5 space-y-0.5">
              {secondary.map(([k, v]) => (
                <div key={k} className="flex gap-1.5 text-xs">
                  <span className="shrink-0 text-[var(--foreground-muted)]">{label(k)}:</span>
                  <span className="min-w-0 truncate text-[var(--foreground)]">{String(v)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleViewClick}
          className="shrink-0 rounded p-1.5 text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-1"
          aria-label="View lead details"
        >
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

const MemoizedDraggableCard = React.memo(DraggableCard) as typeof DraggableCard;

const BoardColumn = React.memo(function BoardColumn({
  id,
  title,
  count,
  leads,
  stageName,
  keyToLabel,
  onViewLead,
}: {
  id: string;
  title: string;
  count: number;
  leads: BoardLead[];
  stageName: string;
  keyToLabel: Map<string, string>;
  onViewLead: (lead: BoardLead & { stageName: string }) => void;
}) {
  return (
    <DroppableColumn id={id} title={title} count={count}>
      {leads.map((lead) => (
        <MemoizedDraggableCard
          key={lead.id}
          lead={lead}
          stageName={stageName}
          keyToLabel={keyToLabel}
          onViewLead={onViewLead}
        />
      ))}
    </DroppableColumn>
  );
});

export function KanbanBoard({
  formId,
  forms,
  username,
  initialForm,
  initialBoard: initialBoardProp = null,
  canAssignLeads = false,
}: {
  formId: string;
  forms: { id: string; name: string }[];
  username: string;
  initialForm: ApiForm;
  initialBoard?: BoardData | null;
  canAssignLeads?: boolean;
}) {
  const initialBoard = initialBoardProp && initialBoardProp.pipeline.id ? initialBoardProp : null;
  const initialBoardAppliedForFormIdRef = useRef<string | undefined>(undefined);
  const [board, setBoard] = useState<BoardData | null>(() =>
    initialBoard && formId ? initialBoard : null
  );
  const [error, setError] = useState<string | null>(null);
  const [selectedFormId, setSelectedFormId] = useState(formId);
  const [viewLead, setViewLead] = useState<(BoardLead & { stageName: string }) | null>(null);

  const handleViewLead = useCallback((lead: BoardLead & { stageName: string }) => {
    setViewLead(lead);
  }, []);

  const handleFollowUpUpdated = useCallback((leadId: string, followUpBy: string | null) => {
    setBoard((prev) => {
      if (!prev) return prev;
      const updateLead = (l: BoardLead) => (l.id === leadId ? { ...l, followUpBy } : l);
      return {
        ...prev,
        unassignedLeads: prev.unassignedLeads.map(updateLead),
        leadsByStage: prev.leadsByStage.map((stage) => ({
          ...stage,
          leads: stage.leads.map(updateLead),
        })),
      };
    });
    setViewLead((prev) => (prev?.id === leadId ? { ...prev, followUpBy } : prev));
  }, []);

  const keyToLabel = useMemo(() => buildKeyToLabelMap(initialForm), [initialForm]);

  const fetchBoard = useCallback(async (fId: string) => {
    setError(null);
    if (!fId) {
      setBoard(null);
      return;
    }
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), 25000);
    const clear = () => {
      if (timeoutId != null) clearTimeout(timeoutId);
      timeoutId = null;
    };
    try {
      const res = await fetch(`/api/pipelines/board?formId=${encodeURIComponent(fId)}`, {
        credentials: "same-origin",
        signal: controller.signal,
      });
      clear();
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const message =
          res.status === 401
            ? "Please log in again."
            : (errBody as { error?: string })?.error ?? "Failed to load board";
        setError(message);
        setBoard(null);
        return;
      }
      const data = (await res.json()) as BoardData;
      setBoard(data);
    } catch (e) {
      clear();
      if (e instanceof Error && e.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
      setBoard(null);
    }
  }, []);

  useEffect(() => {
    setSelectedFormId(formId);
  }, [formId]);

  useEffect(() => {
    if (!selectedFormId) return;
    if (selectedFormId !== formId) {
      initialBoardAppliedForFormIdRef.current = undefined;
      fetchBoard(selectedFormId);
      return;
    }
    if (initialBoard && initialBoardAppliedForFormIdRef.current !== formId) {
      setBoard(initialBoard);
      initialBoardAppliedForFormIdRef.current = formId;
      return;
    }
    fetchBoard(selectedFormId);
  }, [selectedFormId, fetchBoard, formId]);

  const moveLeadOptimistic = useCallback((leadId: string, toStageId: string | null) => {
    setBoard((prev) => {
      if (!prev) return prev;
      let lead: BoardLead | null = null;
      const fromUnassigned = prev.unassignedLeads.some((l) => l.id === leadId);
      if (fromUnassigned) {
        const found = prev.unassignedLeads.find((l) => l.id === leadId);
        if (found) lead = found;
      }
      if (!lead) {
        for (const stage of prev.leadsByStage) {
          const found = stage.leads.find((l) => l.id === leadId);
          if (found) {
            lead = found;
            break;
          }
        }
      }
      if (!lead) return prev;
      const updatedLead: BoardLead = {
        ...lead,
        stageId: toStageId === null || toStageId === UNASSIGNED_ID ? null : toStageId,
      };
      const toUnassigned = toStageId === null || toStageId === UNASSIGNED_ID;

      let newUnassigned: BoardLead[];
      if (fromUnassigned) {
        newUnassigned = prev.unassignedLeads.filter((l) => l.id !== leadId);
      } else if (toUnassigned) {
        newUnassigned = [...prev.unassignedLeads, updatedLead];
      } else {
        newUnassigned = prev.unassignedLeads;
      }

      const newLeadsByStage = prev.leadsByStage.map((stage) => {
        const isFromStage = stage.leads.some((l) => l.id === leadId);
        const isToStage = stage.stageId === toStageId;
        if (isFromStage && isToStage) {
          const filtered = stage.leads.filter((l) => l.id !== leadId);
          return { ...stage, leads: [...filtered, updatedLead] };
        }
        if (isFromStage) return { ...stage, leads: stage.leads.filter((l) => l.id !== leadId) };
        if (isToStage) return { ...stage, leads: [...stage.leads, updatedLead] };
        return stage;
      });

      return {
        ...prev,
        unassignedLeads: newUnassigned,
        leadsByStage: newLeadsByStage,
      };
    });
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || !board) return;
      const leadId = active.id as string;
      const toId = over.id as string;
      const newStageId = toId === UNASSIGNED_ID ? null : toId;

      const currentInStage = board.leadsByStage.find((s) => s.leads.some((l) => l.id === leadId));
      const fromId = currentInStage ? currentInStage.stageId : UNASSIGNED_ID;
      if (fromId === toId) return;

      const boardForRollback = board;
      startTransition(() => {
        moveLeadOptimistic(leadId, newStageId);
      });

      fetch(`/api/leads/${leadId}/stage`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ stageId: newStageId }),
      })
        .then((res) => {
          if (!res.ok) {
            setBoard(boardForRollback);
            return res.json().catch(() => ({})).then((err: { error?: string }) => {
              setError(err?.error ?? "Failed to update stage");
            });
          }
        })
        .catch(() => {
          setBoard(boardForRollback);
          setError("Failed to update stage");
        });
    },
    [board, moveLeadOptimistic]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  );

  const formSelector = (
    <select
      value={selectedFormId}
      onChange={(e) => setSelectedFormId(e.target.value)}
      className="min-h-10 min-w-0 max-w-[280px] rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
      aria-label="Select form"
    >
      <option value="">Select a form...</option>
      {forms.map((f) => (
        <option key={f.id} value={f.id}>
          {f.name}
        </option>
      ))}
    </select>
  );

  const columnsContent = board ? (
    <>
      <BoardColumn
        id={UNASSIGNED_ID}
        title="New"
        count={board.unassignedLeads.length}
        leads={board.unassignedLeads}
        stageName="New"
        keyToLabel={keyToLabel}
        onViewLead={handleViewLead}
      />
      {board.leadsByStage.map((stage, idx) => (
        <BoardColumn
          key={stage.stageId}
          id={stage.stageId}
          title={idx === 0 && stage.stageName === "New" ? "To Contact" : stage.stageName}
          count={stage.leads.length}
          leads={stage.leads}
          stageName={idx === 0 && stage.stageName === "New" ? "To Contact" : stage.stageName}
          keyToLabel={keyToLabel}
          onViewLead={handleViewLead}
        />
      ))}
    </>
  ) : null;

  return (
    <div className="min-w-0 space-y-4 sm:space-y-5">
      {error && (
        <div className="flex flex-wrap items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/5 px-3 py-2.5 text-sm text-[var(--color-danger)] sm:px-4 sm:py-3">
          <span className="flex-1">{error}</span>
          {selectedFormId && (
            <button
              type="button"
              onClick={() => fetchBoard(selectedFormId)}
              className="shrink-0 font-medium underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
            >
              Retry
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
        <label className="text-sm font-medium text-[var(--foreground-muted)]">Form</label>
        {formSelector}
      </div>
      {!board ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--background-elevated)] text-[var(--foreground-muted)]">
          {error && selectedFormId ? "Couldn't load board." : selectedFormId ? "Loading board…" : "Select a form"}
        </div>
      ) : (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="min-w-0 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--background-elevated)] shadow-[var(--shadow-sm)]">
            {/* Mobile: vertical stack (scroll down for all stages). md+: horizontal columns. */}
            <div
              className="flex min-h-0 flex-col gap-3 p-3 sm:gap-4 sm:p-4 md:min-h-[480px] md:flex-row md:flex-nowrap md:min-w-0"
              tabIndex={0}
              aria-label="Board columns"
            >
              {columnsContent}
            </div>
          </div>
        </DndContext>
      )}
      <LeadDetailsModal
        open={Boolean(viewLead)}
        onClose={() => setViewLead(null)}
        lead={viewLead ? { ...viewLead, formId: viewLead.formId ?? "", formName: viewLead.formName } : null}
        form={initialForm}
        canAssignLeads={canAssignLeads}
        onFollowUpUpdated={handleFollowUpUpdated}
        onAssignUpdated={() => selectedFormId && fetchBoard(selectedFormId)}
      />
    </div>
  );
}
