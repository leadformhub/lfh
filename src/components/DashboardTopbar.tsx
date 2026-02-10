"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSidebar } from "@/components/DashboardSidebarContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const FeedbackTrigger = dynamic(
  () => import("@/components/FeedbackModal").then((m) => ({ default: m.FeedbackTrigger })),
  { ssr: false }
);

function getTitle(pathname: string): string {
  const segment = pathname.split("/").filter(Boolean)[1] ?? "dashboard";
  const labels: Record<string, string> = {
    dashboard: "Dashboard",
    forms: "Forms",
    leads: "Leads",
    analytics: "Analytics",
    settings: "Settings",
  };
  if (segment === "new" || pathname.includes("/forms/")) return "Forms";
  return labels[segment] ?? "Dashboard";
}

export function DashboardTopbar({ username, email }: { username: string; email: string }) {
  const pathname = usePathname();
  const { setOpen } = useSidebar();
  const title = getTitle(pathname);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-[var(--color-primary)] px-4 lg:h-16 lg:px-8"
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <button
          type="button"
          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 lg:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="min-w-0 truncate font-heading text-lg font-semibold tracking-tight !text-white lg:text-xl lg:text-2xl">
          {title}
        </h1>
      </div>

      {/* Feedback + Profile - top right */}
      <div className="flex shrink-0 items-center gap-2">
        <FeedbackTrigger className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/15 px-2 py-2 text-slate-200 shadow-sm transition-all hover:scale-[1.02] hover:border-white/30 hover:bg-white/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 sm:px-3 sm:py-2 sm:text-sm sm:font-medium">
          <span className="flex size-8 items-center justify-center sm:size-auto sm:contents" aria-hidden>
            <svg className="size-5 sm:mr-1 sm:size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </span>
          <span className="hidden sm:inline">Feedback</span>
        </FeedbackTrigger>
        <div className="relative">
        <button
          type="button"
          onClick={() => setUserMenuOpen((o) => !o)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
          aria-expanded={userMenuOpen}
          aria-haspopup="true"
        >
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/20 font-heading text-sm font-semibold text-white"
            aria-hidden
          >
            {username.slice(0, 1).toUpperCase()}
          </span>
          <span className="hidden truncate text-sm text-white sm:inline max-w-[140px]">
            {email}
          </span>
          <svg
            className={cn("size-4 shrink-0 text-slate-400 transition-transform", userMenuOpen && "rotate-180")}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {userMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              aria-hidden
              onClick={() => setUserMenuOpen(false)}
            />
            <div
              className="absolute right-0 top-full z-20 mt-2 min-w-[220px] rounded-xl border border-[var(--border-default)] bg-[var(--background-elevated)] py-1 shadow-[var(--shadow-lg)]"
              role="menu"
            >
              <div className="border-b border-[var(--border-subtle)] px-4 py-2.5">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">Profile</p>
                <p className="mt-0.5 truncate text-sm text-[var(--foreground)]">{email}</p>
              </div>
              <div className="border-b border-[var(--border-subtle)] px-2 py-1.5">
                <ThemeToggle className="w-full rounded-lg px-3 py-2 text-left text-[var(--foreground)] transition-colors hover:bg-[var(--neutral-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[var(--color-accent)]" />
              </div>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="w-full px-4 py-2.5 text-left text-sm font-medium text-[var(--color-danger)] transition-colors hover:bg-[var(--neutral-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[var(--color-accent)]"
                  role="menuitem"
                >
                  Log out
                </button>
              </form>
            </div>
          </>
        )}
        </div>
      </div>
    </header>
  );
}
