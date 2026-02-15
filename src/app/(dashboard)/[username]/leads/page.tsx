import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getVerifiedSessionCached } from "@/lib/auth";
import { getRole, canManageTeam } from "@/lib/team";
import { getLeadsByUserId } from "@/services/leads.service";
import { getFormsWithSchemaByUserIdCached, getFormById } from "@/services/forms.service";
import { canUseBoard } from "@/lib/plan-features";
import type { PlanKey } from "@/lib/plans";
import { getOrCreatePipelineForForm, getLeadsByPipelineStages, serializeBoardForApi } from "@/services/pipelines.service";
import { getRazorpayKeyId } from "@/lib/razorpay";
import { LeadsPageView } from "@/components/LeadsPageView";
import { SITE_URL } from "@/lib/seo";
import { Skeleton } from "@/components/ui/Skeleton";
import type { SessionPayload } from "@/lib/jwt";

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

function LeadsSkeleton() {
  return (
    <div className="min-w-0 space-y-4">
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-11 w-52 rounded-[var(--radius-md)]" />
        <Skeleton className="h-11 w-24 rounded-[var(--radius-md)]" />
        <Skeleton className="h-11 w-40 rounded-[var(--radius-md)]" />
      </div>
      <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--background-elevated)]">
        <Skeleton className="h-64 w-full rounded-none" />
      </div>
    </div>
  );
}

async function LeadsContent({
  session,
  username,
  searchParams,
}: {
  session: SessionPayload;
  username: string;
  searchParams: { page?: string; formId?: string; search?: string; view?: string; followUpDue?: string };
}) {
  const accountOwnerId = session.accountOwnerId ?? session.userId;
  const role = getRole(session);
  const assignedToUserId = role === "sales" ? session.userId : undefined;
  const plan = (session.plan ?? "free") as PlanKey;
  const allowBoard = canUseBoard(plan);
  const razorpayKeyId = getRazorpayKeyId();

  const pageNum = Math.max(1, parseInt(String(searchParams.page || "1"), 10) || 1);
  const searchClean = typeof searchParams.search === "string" && searchParams.search.trim() ? searchParams.search.trim() : undefined;
  const followUpDue = searchParams.followUpDue === "1";

  const formsWithSchema = await getFormsWithSchemaByUserIdCached(accountOwnerId);
  const formsForSelect = formsWithSchema.map((f) => ({ id: f.id, name: f.name }));
  const formIdRaw = typeof searchParams.formId === "string" && searchParams.formId.trim() && searchParams.formId !== "undefined" && searchParams.formId !== "null" ? searchParams.formId.trim() : undefined;
  const formIdClean = formIdRaw ?? (formsForSelect.length > 0 ? formsForSelect[0].id : "");

  let leadsData: { id: string; formName: string; formId: string; data: string; createdAt: string; stageId?: string | null; stageName?: string; followUpBy?: string | null }[] = [];
  let total = 0;
  let perPage = 25;
  let initialForm: { id: string; name: string; schema_json: { fields: unknown[] } } | null = null;
  let initialStages: { id: string; name: string }[] = [];
  let initialBoard: {
    pipeline: { id: string; name: string; formId: string | null };
    stages: { id: string; name: string; order: number }[];
    unassignedLeads: { id: string; formId: string | null; stageId: string | null; data: string; createdAt: string; formName: string | null; followUpBy?: string | null }[];
    leadsByStage: { stageId: string; stageName: string; order: number; leads: { id: string; formId: string | null; stageId: string | null; data: string; createdAt: string; formName: string | null; followUpBy?: string | null }[] }[];
  } | null = null;

  if (formIdClean) {
    const [formRow, pipeline] = await Promise.all([
      getFormById(formIdClean, accountOwnerId),
      getOrCreatePipelineForForm(accountOwnerId, formIdClean),
    ]);
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
      getLeadsByUserId(accountOwnerId, {
        page: pageNum,
        perPage: 25,
        formId: formIdClean,
        search: searchClean,
        plan,
        followUpDue: followUpDue || undefined,
        assignedToUserId,
      }),
      allowBoard && pipeline
        ? getLeadsByPipelineStages(accountOwnerId, pipeline.id, plan, assignedToUserId ? { assignedToUserId } : undefined).then(serializeBoardForApi)
        : Promise.resolve(null),
    ]);
    total = leadsResult.total;
    perPage = leadsResult.perPage;
    leadsData = leadsResult.leads.map((l) => ({
      id: l.id,
      formName: l.form?.name ?? "Form Deleted",
      formId: l.formId ?? "",
      data: l.dataJson,
      createdAt: l.createdAt.toISOString(),
      stageId: l.stageId ?? null,
      stageName: l.stage?.name ?? "New",
      followUpBy: l.followUpBy?.toISOString() ?? null,
    }));
    if (boardForView) initialBoard = boardForView;
  }

  return (
    <LeadsPageView
      username={username}
      initialLeads={leadsData}
      initialTotal={total}
      initialPage={pageNum}
      perPage={perPage}
      forms={formsForSelect}
      initialFormId={formIdClean}
      initialForm={initialForm}
      initialStages={initialStages}
      currentSearch={searchClean ?? ""}
      initialBoard={initialBoard}
      canUseBoard={allowBoard}
      canAssignLeads={canManageTeam(session)}
      currentPlan={session.plan ?? "free"}
      razorpayKeyId={razorpayKeyId ?? null}
    />
  );
}

export default async function LeadsPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ page?: string; formId?: string; search?: string; view?: string; followUpDue?: string }>;
}) {
  const session = await getVerifiedSessionCached();
  const { username } = await params;
  if (!session) redirect("/login");
  if (session.username.toLowerCase() !== username.toLowerCase()) redirect(`/${session.username}/leads`);

  const sp = await searchParams;
  return (
    <div className="max-w-full overflow-x-hidden p-4 sm:p-6 lg:p-8">
      <h1 className="font-heading mb-5 text-lg font-semibold tracking-tight text-[var(--foreground-heading)] sm:mb-6 sm:text-xl">
        Lead management dashboard
      </h1>
      <Suspense fallback={<LeadsSkeleton />}>
        <LeadsContent session={session} username={username} searchParams={sp} />
      </Suspense>
    </div>
  );
}
