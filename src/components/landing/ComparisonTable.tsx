"use client";

import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

/**
 * Reusable comparison table for positioning LeadFormHub vs competitors.
 * Used on: Homepage, /typeform-alternative, /google-forms-alternative, /zoho-forms-alternative.
 * Rows: OTP verification, Branded hub, Lead dashboard, Pricing model, India-first payments, Setup speed.
 */
export type ComparisonRow = {
  feature: string;
  leadFormHub: string | React.ReactNode;
  competitor: string | React.ReactNode;
};

/** Serializable competitor values — use this when passing from Server Components. */
export type ComparisonCompetitorCells = {
  otp: string;
  brandedHub: string;
  leadDashboard: string;
  pricingModel: string;
  indiaPayments: string;
  setupSpeed: string;
};

type ComparisonTableProps = {
  competitorLabel: string;
  /** Pre-built rows (client-only). Use when you have custom rows. */
  rows?: ComparisonRow[];
  /** Competitor cell values. When provided, rows are built on the client. Use from Server Components. */
  competitorCells?: ComparisonCompetitorCells;
  className?: string;
};

function Check() {
  return (
    <span className="inline-flex size-6 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-bold text-white" aria-hidden>
      ✓
    </span>
  );
}

function Cross() {
  return (
    <span className="inline-flex size-6 items-center justify-center rounded-full bg-[var(--neutral-200)] text-xs text-[var(--foreground-muted)]" aria-hidden>
      —
    </span>
  );
}

export function ComparisonTable({
  competitorLabel,
  rows: rowsProp,
  competitorCells,
  className,
}: ComparisonTableProps) {
  const rows =
    rowsProp ?? (competitorCells ? getDefaultComparisonRows(competitorCells) : []);
  if (rows.length === 0) return null;
  return (
    <Container size="default" className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[480px] border-collapse text-left">
        <thead>
          <tr className="border-b border-[var(--border-subtle)]">
            <th className="py-4 pr-4 font-heading text-sm font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
              Feature
            </th>
            <th className="px-4 py-4 font-heading text-sm font-semibold text-[var(--foreground)]">
              LeadFormHub
            </th>
            <th className="px-4 py-4 font-heading text-sm font-semibold text-[var(--foreground-muted)]">
              {competitorLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.feature} className="border-b border-[var(--border-subtle)]">
              <td className="py-4 pr-4 text-sm font-medium text-[var(--foreground)]">{row.feature}</td>
              <td className="px-4 py-4 text-sm text-[var(--foreground)]">{row.leadFormHub}</td>
              <td className="px-4 py-4 text-sm text-[var(--foreground-muted)]">{row.competitor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
}

/** Default rows for LeadFormHub vs any competitor — pass competitor-specific values. Call only on the client. */
export function getDefaultComparisonRows(competitorCells: {
  otp: string | React.ReactNode;
  brandedHub: string | React.ReactNode;
  leadDashboard: string | React.ReactNode;
  pricingModel: string | React.ReactNode;
  indiaPayments: string | React.ReactNode;
  setupSpeed: string | React.ReactNode;
}): ComparisonRow[] {
  return [
    { feature: "OTP verification", leadFormHub: <Check />, competitor: competitorCells.otp },
    { feature: "Branded hub (yourbrand.leadformhub.com)", leadFormHub: <Check />, competitor: competitorCells.brandedHub },
    { feature: "Centralized lead dashboard", leadFormHub: <Check />, competitor: competitorCells.leadDashboard },
    { feature: "Pricing model", leadFormHub: "Monthly (INR)", competitor: competitorCells.pricingModel },
    { feature: "India-first payments (UPI, cards)", leadFormHub: <Check />, competitor: competitorCells.indiaPayments },
    { feature: "Setup speed", leadFormHub: "Minutes", competitor: competitorCells.setupSpeed },
  ];
}
