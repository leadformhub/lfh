import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getFormsByUserId } from "@/services/forms.service";
import { getViewCountsForFormIds } from "@/services/analytics.service";
import { FormsList } from "@/components/FormsList";
import { CreateFormButton } from "@/components/CreateFormButton";
import { canCreateForm, getPlanLimits, type PlanKey } from "@/lib/plans";
import { prisma } from "@/lib/db";
import { getRazorpayKeyId } from "@/lib/razorpay";
import { SITE_URL } from "@/lib/seo";

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

export default async function FormsPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await getSession();
  const { username } = await params;
  if (!session || session.username.toLowerCase() !== username.toLowerCase()) return null;
  const { page } = await searchParams;
  const { forms, total, page: currentPage, perPage } = await getFormsByUserId(
    session.userId,
    parseInt(page || "1", 10),
    25
  );
  const formIds = forms.map((f) => f.id);
  const viewCounts = await getViewCountsForFormIds(formIds);

  const [formsCount] = await Promise.all([
    prisma.form.count({ where: { userId: session.userId } }),
  ]);
  const plan = (session.plan ?? "free") as PlanKey;
  const limits = getPlanLimits(plan);
  const canCreate = canCreateForm(plan, formsCount);
  const razorpayKeyId = getRazorpayKeyId();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-lg font-semibold tracking-tight text-[var(--foreground-heading)] sm:text-xl">Create and manage lead forms</h1>
          <Link
            href={`/${username}/analytics`}
            className="text-sm font-medium text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            Form analytics
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
            formType: "contact",
            submissionsCount: f._count.leads,
            viewsCount: viewCounts[f.id] ?? 0,
            createdAtFormatted: f.createdAt.toLocaleDateString("en-GB", {
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
    </div>
  );
}
