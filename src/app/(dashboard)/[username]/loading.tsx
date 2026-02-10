import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Shown while the [username] layout is resolving (auth + quota).
 * Mirrors the dashboard shell so users see a responsive skeleton immediately on mobile.
 */
export default function DashboardShellLoading() {
  return (
    <div className="flex h-screen min-h-screen overflow-hidden bg-[var(--dashboard-main-bg)]">
      {/* Sidebar placeholder - hidden on mobile (layout sidebar is also hidden until open) */}
      <div className="hidden w-0 shrink-0 flex-col lg:flex lg:w-64 border-r border-white/10 bg-[var(--dashboard-sidebar-bg)]">
        <div className="flex h-16 items-center border-b border-white/10 px-4">
          <Skeleton className="h-8 w-32 bg-white/20" />
        </div>
        <nav className="flex-1 px-3 py-5 space-y-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-10 w-full bg-white/10" />
          ))}
        </nav>
        <div className="border-t border-white/10 px-3 py-2">
          <Skeleton className="h-16 w-full rounded-md bg-white/10" />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col min-h-0">
        {/* Topbar skeleton */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-[var(--color-primary)] px-4 lg:h-16 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <Skeleton className="size-10 shrink-0 rounded-lg bg-white/20 lg:hidden" />
            <Skeleton className="h-6 w-28 bg-white/20 lg:h-7 lg:w-36" />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Skeleton className="h-10 w-20 rounded-lg bg-white/20 sm:w-24" />
            <Skeleton className="size-10 rounded-full bg-white/20" />
          </div>
        </header>

        {/* Main content area - generic skeleton */}
        <main
          className="flex min-h-0 flex-1 flex-col overflow-auto"
          style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom, 0px))" }}
        >
          <div className="p-4 lg:p-8 flex min-h-0 flex-1 flex-col">
            <div className="mx-auto max-w-7xl w-full space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-2 h-8 w-48 sm:w-64" />
                </div>
                <div className="flex gap-3">
                  <Skeleton className="h-11 w-32" />
                  <Skeleton className="h-11 w-28" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-24 sm:h-28 rounded-xl" />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
