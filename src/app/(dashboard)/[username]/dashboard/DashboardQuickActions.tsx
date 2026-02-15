import dynamic from "next/dynamic";
import Link from "next/link";
import { getDashboardPlanQuotaCached } from "@/lib/dashboard-quota";
import { canCreateForm, type PlanKey } from "@/lib/plans";

const CreateFormButton = dynamic(
  () => import("@/components/CreateFormButton").then((m) => ({ default: m.CreateFormButton })),
  { ssr: true }
);

type Props = {
  username: string;
  accountOwnerId: string;
  plan: PlanKey;
  razorpayKeyId: string | undefined;
};

export async function DashboardQuickActions({
  username,
  accountOwnerId,
  plan,
  razorpayKeyId,
}: Props) {
  const planQuota = await getDashboardPlanQuotaCached(accountOwnerId, plan);
  const canCreate = canCreateForm(plan, planQuota.formsUsed);

  return (
    <div className="flex flex-wrap gap-3">
      <CreateFormButton
        username={username}
        canCreate={canCreate}
        currentPlan={plan}
        razorpayKeyId={razorpayKeyId ?? null}
      />
      <Link
        href={`/${username}/leads`}
        className="inline-flex min-h-11 flex-1 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-default)] bg-white px-4 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--neutral-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] sm:flex-initial"
      >
        View Leads
      </Link>
    </div>
  );
}
