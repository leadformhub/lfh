"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { LeadsTable } from "@/components/LeadsTable";
import { KanbanBoard } from "@/components/KanbanBoard";

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
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewParam = searchParams.get("view");
  const initialTab = viewParam === "board" ? "board" : "leads";
  const [activeTab, setActiveTab] = useState<"leads" | "board">(initialTab);

  useEffect(() => {
    const v = searchParams.get("view");
    setActiveTab(v === "board" ? "board" : "leads");
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    const tab = value === "board" ? "board" : "leads";
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
            <TabsTrigger value="board" className="min-h-[44px] min-w-[44px] px-4 py-2 sm:min-h-0">
              Board
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
      {activeTab === "board" && (
        <KanbanBoard
          formId={initialFormId}
          forms={forms}
          username={username}
          initialForm={initialForm}
        />
      )}
    </div>
  );
}
