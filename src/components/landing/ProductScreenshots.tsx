"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

/**
 * 7. Product Experience Preview — tabbed layout.
 * Goal: Show calm, professional UX. Each tab: placeholder image box + short description.
 */
const tabs = [
  { id: "dashboard", label: "Dashboard", description: "Monitor all leads and forms at a glance." },
  { id: "forms", label: "Forms", description: "Design, publish, and update in minutes." },
  { id: "analytics", label: "Analytics", description: "Understand what's working — and what's not." },
] as const;

/* Dashboard mockup: clarity, not clutter — stat cards + recent leads at a glance */
const dashboardMockStats = [
  { label: "Total leads", value: "1,247", sub: "Last 30 days" },
  { label: "Active forms", value: "12", sub: "Published" },
  { label: "Conversion", value: "24%", sub: "Avg. rate" },
];

const dashboardMockLeads = [
  { name: "Priya S.", form: "Contact", time: "2m ago" },
  { name: "Rahul M.", form: "Demo request", time: "15m ago" },
  { name: "Anitha K.", form: "Newsletter", time: "1h ago" },
  { name: "Vikram J.", form: "Contact", time: "2h ago" },
];

const placeholderContent: Record<(typeof tabs)[number]["id"], React.ReactNode> = {
  dashboard: (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-5 shadow-[var(--shadow-xs)]">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-[var(--foreground-heading)]">Overview</span>
        <span className="rounded-md bg-[var(--color-accent)] px-2.5 py-1 text-xs font-medium text-white">Dashboard</span>
      </div>
      <div className="mb-5 grid grid-cols-3 gap-3">
        {dashboardMockStats.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] p-3"
          >
            <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              {s.label}
            </p>
            <p className="mt-0.5 font-semibold text-[var(--foreground-heading)]">{s.value}</p>
            <p className="text-[10px] text-[var(--foreground-muted)]">{s.sub}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background)]">
        <div className="border-b border-[var(--border-subtle)] px-3 py-2">
          <p className="text-xs font-medium text-[var(--foreground-muted)]">Recent leads</p>
        </div>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] text-[var(--foreground-muted)]">
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Form</th>
              <th className="px-3 py-2 font-medium text-right">Time</th>
            </tr>
          </thead>
          <tbody>
            {dashboardMockLeads.map((row) => (
              <tr key={row.name} className="border-b border-[var(--border-subtle)] last:border-0">
                <td className="px-3 py-2 text-[var(--foreground)]">{row.name}</td>
                <td className="px-3 py-2 text-[var(--foreground-muted)]">{row.form}</td>
                <td className="px-3 py-2 text-right text-[var(--foreground-muted)]">{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ),
  forms: (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-5 shadow-[var(--shadow-xs)]">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-[var(--foreground-heading)]">Your forms</span>
        <span className="h-7 w-16 rounded-md bg-[var(--color-accent)]" aria-hidden />
      </div>
      <div className="space-y-2">
        {["Contact us", "Demo request", "Newsletter signup"].map((title, i) => (
          <div
            key={title}
            className="flex items-center gap-3 rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 py-2.5"
          >
            <div className="h-8 w-8 rounded-md bg-[var(--neutral-100)]" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--foreground)]">{title}</p>
              <p className="text-[10px] text-[var(--foreground-muted)]">
                {i === 0 ? "Live · 342 submissions" : i === 1 ? "Draft" : "Live · 1.2k submissions"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
  analytics: (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] p-5 shadow-[var(--shadow-xs)]">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-[var(--foreground-heading)]">Submissions over time</span>
      </div>
      <div className="mb-4 flex gap-3">
        {[
          { label: "Views", value: "4.2k" },
          { label: "Submissions", value: "1.1k" },
        ].map((s) => (
          <div
            key={s.label}
            className="flex-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] p-3"
          >
            <p className="text-[10px] font-medium text-[var(--foreground-muted)]">{s.label}</p>
            <p className="font-semibold text-[var(--foreground-heading)]">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="flex h-24 items-end gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] p-3">
        {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-[var(--color-accent)] opacity-80"
            style={{ height: `${h}%`, minHeight: 4 }}
          />
        ))}
      </div>
    </div>
  ),
};

export function ProductScreenshots() {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("dashboard");

  return (
    <section className="section-padding border-t border-[var(--border-subtle)] bg-[var(--background-elevated)]">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-4xl">
            Built for clarity, not clutter
          </h2>
          <p className="mt-4 text-lg text-[var(--foreground-muted)]">
            Calm, professional UX — not flashy UI.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <div className="flex justify-center gap-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--background)] p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className={cn(
                  "rounded-lg px-5 py-2.5 text-sm font-medium transition-colors",
                  active === tab.id
                    ? "bg-white text-[var(--foreground)] shadow-[var(--shadow-xs)]"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--background)] p-4 shadow-[var(--shadow-sm)]">
            {placeholderContent[active]}
          </div>
          <p className="mt-4 text-center text-base text-[var(--foreground-muted)]">
            {tabs.find((t) => t.id === active)?.description}
          </p>
        </div>
      </Container>
    </section>
  );
}
