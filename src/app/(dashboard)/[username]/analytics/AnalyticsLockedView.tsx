"use client";

import { useUpgradeModal } from "@/components/UpgradeModalProvider";

export function AnalyticsLockedView() {
  const { showUpgradeModal } = useUpgradeModal();

  return (
    <div className="min-h-0 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-xl rounded-xl border border-[var(--border-default)] bg-white p-8 text-center shadow-[var(--shadow-sm)]">
        <h1 className="font-heading text-xl font-bold text-[var(--foreground-heading)] sm:text-2xl">
          Analytics
        </h1>
        <p className="mt-2 text-base text-[var(--foreground-muted)]">
          Views, submissions over time, and conversion metrics are available on Pro and Business plans.
        </p>
        <button
          type="button"
          onClick={() =>
            showUpgradeModal(
              "Upgrade to access Analytics",
              "Views, submissions over time, and conversion metrics are available on Pro and Business plans."
            )
          }
          className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#2563EB] px-4 text-sm font-medium text-white hover:bg-[#1D4ED8]"
        >
          Upgrade plan
        </button>
      </div>
    </div>
  );
}
