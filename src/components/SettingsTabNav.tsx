"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

type Tab = "account" | "plan-limits" | "usage" | "team";

export function SettingsTabNav({
  pathname,
  showTeamTab = true,
  showPlanLimitsTab = true,
}: {
  pathname: string;
  showTeamTab?: boolean;
  showPlanLimitsTab?: boolean;
}) {
  const searchParams = useSearchParams();
  const tab = (searchParams.get("tab") ?? "account") as Tab;
  const isAccount = tab === "account";
  const isPlanLimits = tab === "plan-limits";
  const isUsage = tab === "usage";
  const isTeam = tab === "team";

  const tabClass = (active: boolean) =>
    cn(
      "inline-flex items-center justify-center rounded-lg px-6 py-3.5 text-base font-medium transition-colors min-h-[52px] sm:min-h-[56px]",
      active
        ? "bg-white text-[var(--foreground-heading)] shadow-[var(--shadow-xs)]"
        : "bg-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-alt)]"
    );

  return (
    <nav
      role="tablist"
      aria-label="Settings sections"
      className="flex flex-wrap gap-1 rounded-xl bg-[var(--background-alt)] p-1.5 w-fit"
    >
      <Link
        href={pathname}
        role="tab"
        aria-selected={isAccount}
        className={tabClass(isAccount)}
      >
        Account
      </Link>
      {showPlanLimitsTab && (
        <Link
          href={`${pathname}?tab=plan-limits`}
          role="tab"
          aria-selected={isPlanLimits}
          className={tabClass(isPlanLimits)}
        >
          Plan & Limits
        </Link>
      )}
      <Link
        href={`${pathname}?tab=usage`}
        role="tab"
        aria-selected={isUsage}
        className={tabClass(isUsage)}
      >
        Usage
      </Link>
      {showTeamTab && (
        <Link
          href={`${pathname}?tab=team`}
          role="tab"
          aria-selected={isTeam}
          className={tabClass(isTeam)}
        >
          Team
        </Link>
      )}
    </nav>
  );
}
