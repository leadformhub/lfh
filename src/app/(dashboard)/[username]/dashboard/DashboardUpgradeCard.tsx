"use client";

import { useUpgradeModal } from "@/components/UpgradeModalProvider";
import { Card, CardContent } from "@/components/ui/Card";

export function DashboardUpgradeCard() {
  const { showUpgradeModal } = useUpgradeModal();

  return (
    <Card className="mt-6 border-[var(--border-default)] bg-[var(--background-alt)]">
      <CardContent className="p-8 text-center">
        <p className="font-medium text-[var(--foreground-heading)]">Analytics on Pro & Business</p>
        <p className="mt-1 text-base text-[var(--foreground-muted)]">
          Submissions over time, recent activity, and top forms are available when you upgrade.
        </p>
        <button
          type="button"
          onClick={() =>
            showUpgradeModal(
              "Upgrade your plan",
              "Submissions over time, recent activity, and top forms are available on Pro and Business plans."
            )
          }
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        >
          Upgrade Plan
        </button>
      </CardContent>
    </Card>
  );
}
