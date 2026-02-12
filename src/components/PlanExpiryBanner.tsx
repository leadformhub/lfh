import Link from "next/link";

/** Shows when paid plan expires within 3 days. Rendered in dashboard layout. */
export function PlanExpiryBanner({
  plan,
  planValidUntil,
  username,
}: {
  plan: string;
  planValidUntil: string | null | undefined;
  username: string;
}) {
  if (plan !== "pro" && plan !== "business") return null;
  if (!planValidUntil) return null;
  const expiry = new Date(planValidUntil).getTime();
  const inThreeDays = Date.now() + 3 * 24 * 60 * 60 * 1000;
  if (expiry > inThreeDays) return null;

  const dateStr = new Date(planValidUntil).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-2 bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-sm text-amber-900"
      role="banner"
    >
      <span>
        Your plan expires on <strong>{dateStr}</strong>. Upgrade or renew to keep Pro features.
      </span>
      <Link
        href={`/${username}/pricing`}
        className="font-medium text-amber-800 underline underline-offset-2 hover:text-amber-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 rounded"
      >
        Renew or upgrade
      </Link>
    </div>
  );
}
