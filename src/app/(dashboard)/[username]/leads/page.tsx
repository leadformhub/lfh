import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getLeadsByUserId } from "@/services/leads.service";
import { getFormsWithSchemaByUserId, getFormById } from "@/services/forms.service";
import { LeadsTable } from "@/components/LeadsTable";
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
  searchParams: Promise<{ page?: string; formId?: string; search?: string }>;
}) {
  const session = await getSession();
  const { username } = await params;
  if (!session) redirect("/login");
  if (session.username.toLowerCase() !== username.toLowerCase()) redirect(`/${session.username}/leads`);
  const { page, formId, search } = await searchParams;
  const pageNum = Math.max(1, parseInt(String(page || "1"), 10) || 1);
  const searchClean = typeof search === "string" && search.trim() ? search.trim() : undefined;
  const formsWithSchema = await getFormsWithSchemaByUserId(session.userId);
  const formsForSelect = formsWithSchema.map((f) => ({ id: f.id, name: f.name }));
  const formIdRaw = typeof formId === "string" && formId.trim() && formId !== "undefined" && formId !== "null" ? formId.trim() : undefined;
  let formIdClean = formIdRaw ?? "";
  // Default to latest form when none selected (forms are ordered by createdAt desc)
  if (!formIdClean && formsForSelect.length > 0) {
    const latestFormId = formsForSelect[0].id;
    redirect(`/${username}/leads?formId=${encodeURIComponent(latestFormId)}`);
  }

  // Fetch leads and form ONLY when a form is selected (one form → many leads).
  let leadsData: { id: string; formName: string; formId: string; data: string; createdAt: string }[] = [];
  let total = 0;
  let perPage = 25;
  let initialForm: { id: string; name: string; schema_json: { fields: unknown[] } } | null = null;

  if (formIdClean) {
    const formRow = await getFormById(formIdClean, session.userId);
    if (formRow) {
      initialForm = {
        id: formRow.id,
        name: formRow.name,
        schema_json: formRow.schema ?? { fields: [] },
      };
    }
    const { leads, total: t, perPage: pp } = await getLeadsByUserId(session.userId, {
      page: pageNum,
      perPage: 25,
      formId: formIdClean,
      search: searchClean,
    });
    total = t;
    perPage = pp;
    leadsData = leads.map((l) => ({
      id: l.id,
      formName: l.form?.name ?? "Form Deleted",
      formId: l.formId ?? "",
      data: l.dataJson,
      createdAt: l.createdAt.toISOString(),
    }));
  }

  return (
    <div className="max-w-full overflow-x-hidden p-4 sm:p-6 lg:p-8">
      <h1 className="font-heading mb-5 text-xl font-semibold tracking-tight text-[var(--foreground-heading)] sm:mb-6 sm:text-2xl">Lead management dashboard</h1>
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
      <LeadsTable
        username={username}
        initialLeads={leadsData}
        initialTotal={total}
        initialPage={pageNum}
        perPage={perPage}
        forms={formsForSelect}
        initialFormId={formIdClean ?? ""}
        initialForm={initialForm}
        currentSearch={searchClean ?? ""}
      />
      </Suspense>
    </div>
  );
}
