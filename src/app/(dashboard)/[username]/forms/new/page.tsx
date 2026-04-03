import { getVerifiedSessionCached } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getRazorpayKeyId } from "@/lib/razorpay";
import { NewFormClient } from "@/components/NewFormClient";
import type { PlanKey } from "@/lib/plans";
import { canCreateFormWithEffectiveLimits } from "@/lib/super-admin-plan-pricing";
import { prisma } from "@/lib/db";

export default async function NewFormPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const session = await getVerifiedSessionCached();
  if (!session) redirect("/login");
  const { username } = await params;
  if (username.toLowerCase() !== session.username.toLowerCase()) {
    redirect(`/${session.username}/forms/new`);
  }

  const accountOwnerId = session.accountOwnerId ?? session.userId;
  const formsCount = await prisma.form.count({ where: { userId: accountOwnerId } });
  const plan = (session.plan ?? "free") as PlanKey;
  if (!(await canCreateFormWithEffectiveLimits(plan, formsCount))) {
    redirect(`/${username}/pricing?reason=form_limit`);
  }

  const razorpayKeyId = await getRazorpayKeyId();

  return (
    <NewFormClient plan={session.plan} razorpayKeyId={razorpayKeyId ?? null} />
  );
}
