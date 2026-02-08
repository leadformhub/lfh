import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getRazorpayKeyId } from "@/lib/razorpay";
import { NewFormClient } from "@/components/NewFormClient";
import { canCreateForm, type PlanKey } from "@/lib/plans";
import { prisma } from "@/lib/db";

export default async function NewFormPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  const { username } = await params;
  if (username.toLowerCase() !== session.username.toLowerCase()) {
    redirect(`/${session.username}/forms/new`);
  }

  const formsCount = await prisma.form.count({ where: { userId: session.userId } });
  const plan = (session.plan ?? "free") as PlanKey;
  if (!canCreateForm(plan, formsCount)) {
    redirect(`/${username}/pricing?reason=form_limit`);
  }

  const razorpayKeyId = getRazorpayKeyId();

  return (
    <NewFormClient plan={session.plan} razorpayKeyId={razorpayKeyId ?? null} />
  );
}
