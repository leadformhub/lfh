"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/DashboardSidebarContext";
import { canUseAnalytics } from "@/lib/plan-features";
import type { PlanKey } from "@/lib/plans";

const navItems = [
  { href: "dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "forms", label: "Forms", icon: FormsIcon },
  { href: "leads", label: "Leads", icon: LeadsIcon },
  { href: "analytics", label: "Analytics", icon: AnalyticsIcon },
  { href: "raise-request", label: "Raise request", icon: RaiseRequestIcon },
  { href: "settings", label: "Settings", icon: SettingsIcon },
];

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  );
}
function FormsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
function LeadsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}
function AnalyticsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}
function RaiseRequestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

type PlanQuota = {
  plan: string;
  formsUsed: number;
  formsLimit: number;
  leadsUsed: number;
  leadsLimit: number | null;
  otpUsed: number;
  otpLimit: number | null;
};

export function DashboardSidebar({
  username,
  planQuota,
}: { username: string; planQuota: PlanQuota }) {
  const pathname = usePathname();
  const { open, setOpen } = useSidebar();

  const base = `/${username}`;
  const plan = planQuota.plan as PlanKey;
  const analyticsUnlocked = canUseAnalytics(plan);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden",
          open ? "block" : "hidden"
        )}
        aria-hidden
        onClick={() => setOpen(false)}
      />

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-white/10 bg-[var(--color-primary)] transition-transform duration-[var(--transition-base)] ease-out lg:static lg:min-h-screen lg:translate-x-0 lg:h-full",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo + mobile close */}
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-4 lg:h-16">
          <Link
            href={`${base}/dashboard`}
            className="flex items-center transition-opacity hover:opacity-90"
            onClick={() => setOpen(false)}
          >
            <Image src="/logo-w.png" alt="LeadFormHub" width={240} height={60} className="h-8 w-auto object-contain lg:h-10" />
          </Link>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close Menu"
          >
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Main">
          <ul className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isAnalyticsLocked = href === "analytics" && !analyticsUnlocked;
              const path = isAnalyticsLocked ? `${base}/pricing` : `${base}/${href}`;
              const active =
                !isAnalyticsLocked &&
                (pathname === `${base}/${href}` || (href !== "dashboard" && pathname.startsWith(`${base}/${href}`)));
              return (
                <li key={href}>
                  <Link
                    href={path}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60",
                      active
                        ? "bg-white/15 !text-white"
                        : isAnalyticsLocked
                          ? "text-slate-400 hover:bg-white/10 hover:text-slate-200"
                          : label === "Dashboard"
                            ? "!text-white hover:bg-white/10"
                            : "text-slate-300 hover:bg-white/10 hover:text-white"
                    )}
                    title={isAnalyticsLocked ? "Upgrade to access Analytics" : undefined}
                  >
                    <Icon className="size-5 shrink-0 opacity-90" />
                    {label}
                    {isAnalyticsLocked && (
                      <LockIcon className="ml-auto size-4 shrink-0 opacity-80" aria-hidden />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Plan card with usage and progress bars */}
        <div className="border-t border-white/10 px-3 py-2">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            Plan
          </p>
          <div className="mt-1.5 rounded-md border border-white/10 bg-white/5 p-2">
            <p className="font-heading text-xs font-semibold capitalize text-white">
              {planQuota.plan}
            </p>
            <div className="mt-2 space-y-2">
              {/* Forms */}
              <div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Forms</span>
                  <span className="text-white">
                    {planQuota.formsUsed}
                    {planQuota.formsLimit === Infinity ? " / ∞" : ` / ${planQuota.formsLimit}`}
                  </span>
                </div>
                {planQuota.formsLimit !== Infinity && (
                  <div className="mt-0.5 h-0.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        planQuota.formsUsed / planQuota.formsLimit >= 0.8 ? "bg-amber-500" : "bg-emerald-500"
                      )}
                      style={{ width: `${Math.min(100, (planQuota.formsUsed / planQuota.formsLimit) * 100)}%` }}
                    />
                  </div>
                )}
              </div>
              {/* Leads */}
              <div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Leads this month</span>
                  <span className="text-white">
                    {planQuota.leadsUsed}
                    {planQuota.leadsLimit === null ? " / ∞" : ` / ${planQuota.leadsLimit}`}
                  </span>
                </div>
                {planQuota.leadsLimit !== null && (
                  <div className="mt-0.5 h-0.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        planQuota.leadsUsed / planQuota.leadsLimit >= 0.8 ? "bg-amber-500" : "bg-emerald-500"
                      )}
                      style={{ width: `${Math.min(100, (planQuota.leadsUsed / planQuota.leadsLimit) * 100)}%` }}
                    />
                  </div>
                )}
              </div>
              {/* OTP */}
              <div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">OTP</span>
                  <span className="text-white">
                    {planQuota.otpLimit === null
                      ? "Not available"
                      : `${planQuota.otpUsed} / ${planQuota.otpLimit} per month`}
                  </span>
                </div>
                {planQuota.otpLimit !== null && (
                  <div className="mt-0.5 h-0.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        planQuota.otpUsed / planQuota.otpLimit >= 0.8 ? "bg-amber-500" : "bg-emerald-500"
                      )}
                      style={{ width: `${Math.min(100, (planQuota.otpUsed / planQuota.otpLimit) * 100)}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
            <Link
              href={`${base}/pricing`}
              className="mt-2 flex w-full items-center justify-center gap-1 rounded-md py-1.5 text-[11px] font-medium text-blue-400 transition-colors hover:bg-white/5 hover:text-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
            >
              <LockIcon className="size-3 shrink-0" />
              Upgrade Plan
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
