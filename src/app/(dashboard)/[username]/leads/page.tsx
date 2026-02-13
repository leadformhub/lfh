import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getLeadsByUserId } from "@/services/leads.service";
import { getFormsWithSchemaByUserId, getFormById } from "@/services/forms.service";
import { canUseBoard } from "@/lib/plan-features";
import type { PlanKey } from "@/lib/plans";
import {
  getPipelineByFormId,
  createPipeline,
  createDefaultStagesForPipeline,
  getLeadsByPipelineStages,
  serializeBoardForApi,
} from "@/services/pipelines.service";
import { getRazorpayKeyId } from "@/lib/razorpay";
import { LeadsPageView } from "@/components/LeadsPageView";
import { SITE_URL } from "@/lib/seo";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const url = `${SITE_URL}/${username}/leads`;
  return {
    title: "Lead Capture Software to Manage and Track Leads | LeadFormHub",
    description:
      "View, filter, export, and manage all your captured leads in one powerful lead management dashboard.",
    alternates: { canonical: url },
    openGraph: { title: "Lead Capture Software to Manage and Track Leads | LeadFormHub", description: "View, filter, export, and manage all your captured leads in one powerful lead management dashboard.", url, siteName: "LeadFormHub", type: "website" },
    twitter: { card: "summary_large_image", title: "Lead Capture Software to Manage and Track Leads | LeadFormHub", description: "View, filter, export, and manage all your captured leads in one powerful lead management dashboard." },
    robots: { index: false, follow: false },
  };
}

export const dynamic = "force-dynamic";

export default async function LeadsPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ page?: string; formId?: string; search?: string; view?: string }>;
}) {
  const session = await getSession();
  const { username } = await params;
  if (!session) redirect("/login");
  if (session.username.toLowerCase() !== username.toLowerCase()) redirect(`/${session.username}/leads`);
  const { page, formId, search, view } = await searchParams;
  const pageNum = Math.max(1, parseInt(String(page || "1"), 10) || 1);
  const searchClean = typeof search === "string" && search.trim() ? search.trim() : undefined;
  const formsWithSchema = await getFormsWithSchemaByUserId(session.userId);
  const formsForSelect = formsWithSchema.map((f) => ({ id: f.id, name: f.name }));
  const formIdRaw = typeof formId === "string" && formId.trim() && formId !== "undefined" && formId !== "null" ? formId.trim() : undefined;
  let formIdClean = formIdRaw ?? "";
  const plan = (session.plan ?? "free") as PlanKey;
  const allowBoard = canUseBoard(plan);
  const razorpayKeyId = getRazorpayKeyId();
  // Default to latest form when none selected (forms are ordered by createdAt desc)
  if (!formIdClean && formsForSelect.length > 0) {
    const latestFormId = formsForSelect[0].id;
    redirect(`/${username}/leads?formId=${encodeURIComponent(latestFormId)}`);
  }

  // Fetch leads and form ONLY when a form is selected (one form → many leads).
  let leadsData: { id: string; formName: string; formId: string; data: string; createdAt: string; stageId?: string | null; stageName?: string }[] = [];
  let total = 0;
  let perPage = 25;
  let initialForm: { id: string; name: string; schema_json: { fields: unknown[] } } | null = null;
  let initialStages: { id: string; name: string }[] = [];
  let initialBoard: {
    pipeline: { id: string; name: string; formId: string | null };
    stages: { id: string; name: string; order: number }[];
    unassignedLeads: { id: string; formId: string | null; stageId: string | null; data: string; createdAt: string; formName: string | null }[];
    leadsByStage: { stageId: string; stageName: string; order: number; leads: { id: string; formId: string | null; stageId: string | null; data: string; createdAt: string; formName: string | null }[] }[];
  } | null = null;

  if (formIdClean) {
    const [formRow, pipelineExisting] = await Promise.all([
      getFormById(formIdClean, session.userId),
      getPipelineByFormId(session.userId, formIdClean),
    ]);
    let pipeline = pipelineExisting;
    // Only create pipeline when the form exists and belongs to the user (avoids FK / unique errors)
    if (!pipeline && formRow) {
      try {
        const created = await createPipeline(session.userId, { formId: formIdClean, name: "Default" });
        await createDefaultStagesForPipeline(created.id);
        pipeline = await getPipelineByFormId(session.userId, formIdClean);
      } catch {
        pipeline = null;
      }
    }
    if (pipeline?.stages?.length) {
      initialStages = pipeline.stages.map((s) => ({ id: s.id, name: s.name }));
    }
    if (formRow) {
      initialForm = {
        id: formRow.id,
        name: formRow.name,
        schema_json: formRow.schema ?? { fields: [] },
      };
    }
    const [leadsResult, boardForView] = await Promise.all([
      getLeadsByUserId(session.userId, {
        page: pageNum,
        perPage: 25,
        formId: formIdClean,
        search: searchClean,
        plan,
      }),
      allowBoard && pipeline
        ? getLeadsByPipelineStages(session.userId, pipeline.id, plan).then(serializeBoardForApi)
        : Promise.resolve(null),
    ]);
    const { leads, total: t, perPage: pp } = leadsResult;
    total = t;
    perPage = pp;
    leadsData = leads.map((l) => ({
      id: l.id,
      formName: l.form?.name ?? "Form Deleted",
      formId: l.formId ?? "",
      data: l.dataJson,
      createdAt: l.createdAt.toISOString(),
      stageId: l.stageId ?? null,
      stageName: l.stage?.name ?? "New",
    }));
    if (boardForView) initialBoard = boardForView;
  }

  return (
    <div className="max-w-full overflow-x-hidden p-4 sm:p-6 lg:p-8">
      <h1 className="font-heading mb-5 text-lg font-semibold tracking-tight text-[var(--foreground-heading)] sm:mb-6 sm:text-xl">Lead management dashboard</h1>
      <Suspense
        fallback={
          <div className="min-w-0 space-y-5">
            <div className="flex flex-wrap gap-3">
              <div className="skeleton h-11 w-52" />
              <div className="skeleton h-11 w-24" />
              <div className="skeleton h-11 w-40" />
            </div>
            <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--background-elevated)]">
              <div className="skeleton h-64 w-full" />
            </div>
          </div>
        }
      >
        <LeadsPageView
          username={username}
          initialLeads={leadsData}
          initialTotal={total}
          initialPage={pageNum}
          perPage={perPage}
          forms={formsForSelect}
          initialFormId={formIdClean ?? ""}
          initialForm={initialForm}
          initialStages={initialStages}
          currentSearch={searchClean ?? ""}
          initialBoard={initialBoard}
          canUseBoard={allowBoard}
          currentPlan={session.plan ?? "free"}
          razorpayKeyId={razorpayKeyId ?? null}
        />
      </Suspense>
    </div>
  );
}
