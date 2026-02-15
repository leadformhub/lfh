import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import Link from "next/link";
import { Suspense } from "react";
import { getVerifiedSessionCached } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getFormsByUserIdCached } from "@/services/forms.service";
import { getViewCountsForUserForms } from "@/services/analytics.service";
import { FormsList } from "@/components/FormsList";
import { canCreateForm, getPlanLimits, type PlanKey } from "@/lib/plans";
import { canUseAutomation } from "@/lib/plan-features";
import { getRazorpayKeyId } from "@/lib/razorpay";
import { SITE_URL } from "@/lib/seo";
import { Skeleton } from "@/components/ui/Skeleton";
import type { SessionPayload } from "@/lib/jwt";

const CreateFormButton = nextDynamic(
  () => import("@/components/CreateFormButton").then((m) => ({ default: m.CreateFormButton })),
  { ssr: true }
);

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const url = `${SITE_URL}/${username}/forms`;
  return {
    title: "Create Custom Lead Forms with Drag & Drop Builder | LeadFormHub",
    description:
      "Build custom lead capture forms using our drag and drop form builder designed for speed, security, and conversion.",
    alternates: { canonical: url },
    openGraph: { title: "Create Custom Lead Forms with Drag & Drop Builder | LeadFormHub", description: "Build custom lead capture forms using our drag and drop form builder designed for speed, security, and conversion.", url, siteName: "LeadFormHub", type: "website" },
    twitter: { card: "summary_large_image", title: "Create Custom Lead Forms with Drag & Drop Builder | LeadFormHub", description: "Build custom lead capture forms using our drag and drop form builder designed for speed, security, and conversion." },
    robots: { index: false, follow: false },
  };
}

export const dynamic = "force-dynamic";

async function FormsContent({
  session,
  username,
  pageNum,
}: {
  session: SessionPayload;
  username: string;
  pageNum: number;
}) {
  const accountOwnerId = session.accountOwnerId ?? session.userId;
  const plan = (session.plan ?? "free") as PlanKey;
  const razorpayKeyId = getRazorpayKeyId();
  const limits = getPlanLimits(plan);

  const [{ forms, total, page: currentPage, perPage }, viewCounts] = await Promise.all([
    getFormsByUserIdCached(accountOwnerId, pageNum, 25),
    getViewCountsForUserForms(accountOwnerId),
  ]);

  const formsCount = total;
  const canCreate = canCreateForm(plan, formsCount);

  return (
    <>
      <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-lg font-semibold tracking-tight text-[var(--foreground-heading)] sm:text-xl">
            Create And Manage Lead Forms
          </h1>
          <Link
            href={`/${username}/analytics`}
            className="text-sm font-medium text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            Form Analytics
          </Link>
        </div>
        <CreateFormButton
          username={username}
          canCreate={canCreate}
          currentPlan={session.plan ?? "free"}
          razorpayKeyId={razorpayKeyId}
          formsCount={formsCount}
          formsLimit={limits?.maxForms}
        />
      </div>
      <FormsList
        username={username}
        canUseAutomation={canUseAutomation(plan)}
        currentPlan={session.plan ?? "free"}
        razorpayKeyId={razorpayKeyId ?? null}
        forms={forms.map((f) => {
          let status = "PUBLIC";
          try {
            const s = JSON.parse(f.schemaJson) as { settings?: { status?: string } };
            status = s?.settings?.status ?? "PUBLIC";
          } catch {
            // ignore
          }
          return {
            id: f.id,
            name: f.name,
            status,
            locked: !!f.lockedAt,
            formType: "contact",
            submissionsCount: f._count.leads,
            viewsCount: viewCounts[f.id] ?? 0,
            createdAtFormatted: (f.createdAt instanceof Date ? f.createdAt : new Date(f.createdAt)).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          };
        })}
        total={total}
        page={currentPage}
        perPage={perPage}
      />
    </>
  );
}

export default async function FormsPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await getVerifiedSessionCached();
  const { username } = await params;
  if (!session) redirect("/login");
  if (session.username.toLowerCase() !== username.toLowerCase()) return null;

  const { page } = await searchParams;
  const pageNum = Math.max(1, parseInt(page || "1", 10) || 1);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Suspense fallback={<FormsLoadingSkeleton />}>
        <FormsContent session={session} username={username} pageNum={pageNum} />
      </Suspense>
    </div>
  );
}

function FormsLoadingSkeleton() {
  return (
    <>
      <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-8 w-64 sm:w-80" />
        <Skeleton className="h-11 w-32" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    </>
  );
}
