import { Fragment } from "react";
import { getSession } from "@/lib/auth";
import { getRazorpayKeyId } from "@/lib/razorpay";
import { redirect } from "next/navigation";
import { UpgradePlanCard } from "@/components/UpgradePlanCard";
import {
  PLAN_FEATURES,
  PLAN_FEATURE_CATEGORIES,
  formatFeatureValue,
} from "@/lib/plan-features";

export const metadata = {
  title: "Upgrade plan | LeadFormHub",
  description: "Upgrade your plan for more forms, leads, and OTP.",
};

export default async function DashboardPricingPage({
  params,
}: { params: Promise<{ username: string }> }) {
  const session = await getSession();
  const { username } = await params;
  if (!session || session.username.toLowerCase() !== username.toLowerCase()) redirect("/login");

  const razorpayKeyId = getRazorpayKeyId();
  const planLabel = session.plan.charAt(0).toUpperCase() + session.plan.slice(1);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--foreground-heading)] tracking-tight">
          Upgrade plan
        </h1>
        <p className="mt-1 text-[var(--foreground-muted)] text-base">
          You&apos;re on <span className="font-medium text-[var(--foreground)]">{planLabel}</span>. Upgrade for more forms, leads, and OTP verification.
        </p>
      </header>

      <section className="rounded-xl border border-[var(--border-default)] bg-white shadow-[var(--shadow-sm)] p-4 sm:p-6">
        <UpgradePlanCard currentPlan={session.plan} razorpayKeyId={razorpayKeyId} />
      </section>

      {/* Full feature comparison for all plans */}
      <section className="mt-10">
        <h2 className="font-heading text-xl font-bold text-[var(--foreground-heading)] mb-4">
          All plan features
        </h2>
        <div className="rounded-xl border border-[var(--border-default)] bg-white shadow-[var(--shadow-sm)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-[var(--border-default)] bg-[var(--background-alt)]">
                  <th className="text-left px-4 py-3 font-semibold text-[var(--foreground-heading)]">
                    Feature
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-[var(--foreground-heading)] w-[22%]">
                    Free
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-[var(--foreground-heading)] w-[22%]">
                    Pro
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-[var(--foreground-heading)] w-[22%]">
                    Business
                  </th>
                </tr>
              </thead>
              <tbody>
                {PLAN_FEATURE_CATEGORIES.map((category) => {
                  const rows = PLAN_FEATURES.filter((r) => r.category === category);
                  if (rows.length === 0) return null;
                  return (
                    <Fragment key={category}>
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-2 font-medium text-[var(--foreground-muted)] bg-[var(--neutral-50)] text-xs uppercase tracking-wider"
                        >
                          {category}
                        </td>
                      </tr>
                      {rows.map((row) => (
                        <tr
                          key={row.label}
                          className="border-b border-[var(--border-default)] last:border-b-0 hover:bg-[var(--neutral-50)]/50"
                        >
                          <td className="px-4 py-2.5 text-[var(--foreground)]">
                            {row.label}
                          </td>
                          <td className="px-4 py-2.5 text-center text-[var(--foreground-muted)]">
                            {formatFeatureValue(row.free) === "✓" ? (
                              <span className="text-emerald-600 font-medium">✓</span>
                            ) : (
                              formatFeatureValue(row.free)
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-center text-[var(--foreground-muted)]">
                            {formatFeatureValue(row.pro) === "✓" ? (
                              <span className="text-emerald-600 font-medium">✓</span>
                            ) : (
                              formatFeatureValue(row.pro)
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-center text-[var(--foreground-muted)]">
                            {formatFeatureValue(row.business) === "✓" ? (
                              <span className="text-emerald-600 font-medium">✓</span>
                            ) : (
                              formatFeatureValue(row.business)
                            )}
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
