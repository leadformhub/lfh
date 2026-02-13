"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { LeadsTable } from "@/components/LeadsTable";
import { KanbanBoard } from "@/components/KanbanBoard";
import { UpgradeModal } from "@/components/UpgradeModal";

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
  schema_json: { fields: unknown[] };
} | null;

type BoardData = {
  pipeline: { id: string; name: string; formId: string | null };
  stages: { id: string; name: string; order: number }[];
  unassignedLeads: { id: string; formId: string | null; stageId: string | null; data: string; createdAt: string; formName: string | null; followUpBy?: string | null }[];
  leadsByStage: { stageId: string; stageName: string; order: number; leads: { id: string; formId: string | null; stageId: string | null; data: string; createdAt: string; formName: string | null; followUpBy?: string | null }[] }[];
};

export function LeadsPageView({
  username,
  initialLeads,
  initialTotal,
  initialPage,
  perPage,
  forms,
  initialFormId,
  initialForm,
  initialStages,
  currentSearch,
  initialBoard = null,
  canUseBoard = false,
  currentPlan = "free",
  razorpayKeyId = null,
}: {
  username: string;
  initialLeads: LeadRow[];
  initialTotal: number;
  initialPage: number;
  perPage: number;
  forms: { id: string; name: string }[];
  initialFormId: string;
  initialForm: ApiForm;
  initialStages: { id: string; name: string }[];
  currentSearch: string;
  initialBoard?: BoardData | null;
  canUseBoard?: boolean;
  currentPlan?: string;
  razorpayKeyId?: string | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewParam = searchParams.get("view");
  const initialTab = viewParam === "board" ? "board" : "leads";
  const [activeTab, setActiveTab] = useState<"leads" | "board">(initialTab);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    const v = searchParams.get("view");
    setActiveTab(v === "board" ? "board" : "leads");
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    const tab = value === "board" ? "board" : "leads";
    if (tab === "board" && !canUseBoard) {
      setShowUpgradeModal(true);
      return;
    }
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "board") params.set("view", "board");
    else params.delete("view");
    const q = params.toString();
    router.push(q ? `/${username}/leads?${q}` : `/${username}/leads`, { scroll: false });
  };

  return (
    <div className="min-w-0 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="leads" className="min-h-[44px] min-w-[44px] px-4 py-2 sm:min-h-0">
              Leads
            </TabsTrigger>
            <TabsTrigger value="board" className="min-h-[44px] min-w-[44px] px-4 py-2 sm:min-h-0 inline-flex items-center gap-1.5">
              Board
              {!canUseBoard && (
                <svg className="size-4 text-[var(--foreground-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {activeTab === "leads" && (
        <LeadsTable
          username={username}
          initialLeads={initialLeads}
          initialTotal={initialTotal}
          initialPage={initialPage}
          perPage={perPage}
          forms={forms}
          initialFormId={initialFormId}
          initialForm={initialForm}
          initialStages={initialStages}
          currentSearch={currentSearch}
        />
      )}
      {activeTab === "board" && canUseBoard && (
        <KanbanBoard
          formId={initialFormId}
          forms={forms}
          username={username}
          initialForm={initialForm}
          initialBoard={initialBoard}
        />
      )}
      {activeTab === "board" && !canUseBoard && (
        <div
          className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--neutral-50)]/80 p-8 text-center"
          aria-hidden
        >
          <div className="flex size-14 items-center justify-center rounded-full bg-[var(--neutral-200)] text-[var(--foreground-muted)]">
            <svg className="size-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="font-heading mt-4 text-lg font-semibold text-[var(--foreground-heading)]">
            Board is a paid feature
          </h3>
          <p className="mt-2 max-w-sm text-sm text-[var(--foreground-muted)]">
            The pipeline board is available on Pro and Business plans. Upgrade to drag leads across stages and manage your pipeline.
          </p>
          <button
            type="button"
            onClick={() => setShowUpgradeModal(true)}
            className="btn-base mt-6 inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            Upgrade to unlock
          </button>
        </div>
      )}
      <UpgradeModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPlan={currentPlan}
        razorpayKeyId={razorpayKeyId}
        title="Board is a paid feature"
        description="The pipeline board is available on Pro and Business plans. Upgrade to drag leads across stages and manage your pipeline."
      />
    </div>
  );
}
