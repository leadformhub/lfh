import { Skeleton } from "@/components/ui/Skeleton";

/** Shown while planQuota and otherTeams load so the dashboard shell streams instead of blocking for 7s. */
export function DashboardShellSkeleton() {
  return (
    <div className="flex h-screen min-h-screen overflow-hidden bg-[var(--dashboard-main-bg)]">
      {/* Sidebar placeholder */}
      <div className="hidden w-0 shrink-0 flex-col bg-[var(--dashboard-sidebar-bg)] lg:flex lg:w-64">
        <div className="flex h-16 items-center border-b border-white/10 px-4">
          <Skeleton className="h-8 w-32 bg-white/20" />
        </div>
        <nav className="flex-1 space-y-1 px-3 py-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-10 w-full bg-white/10" />
          ))}
        </nav>
      </div>
      {/* Main: topbar + content */}
      <div className="flex min-w-0 flex-1 flex-col min-h-0">
        <header className="h-14 shrink-0 border-b border-white/10 bg-[var(--color-primary)] lg:h-16">
          <div className="flex h-full items-center px-4 lg:px-8">
            <Skeleton className="h-6 w-24 bg-white/20" />
          </div>
        </header>
        <main className="flex min-h-0 flex-1 flex-col overflow-auto">
          <div className="p-4 lg:p-8">
            <div className="mx-auto max-w-7xl">
              <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
