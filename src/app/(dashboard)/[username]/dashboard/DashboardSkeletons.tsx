import { Skeleton } from "@/components/ui/Skeleton";

export function QuickActionsSkeleton() {
  return (
    <div className="flex flex-wrap gap-3">
      <Skeleton className="h-11 w-32" />
      <Skeleton className="h-11 w-28" />
    </div>
  );
}

export function StatsSectionSkeleton() {
  return (
    <>
      <section className="mb-6 sm:mb-8" aria-label="Enterprise stats">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl sm:h-28" />
          ))}
        </div>
      </section>
      <section className="mb-6 sm:mb-8" aria-label="Account overview">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </section>
    </>
  );
}

export function SubmissionsChartSkeleton() {
  return (
    <section className="lg:col-span-2">
      <Skeleton className="h-52 min-h-[280px] rounded-xl" />
    </section>
  );
}

export function RecentActivitySkeleton() {
  return (
    <section>
      <Skeleton className="h-52 rounded-xl" />
    </section>
  );
}

export function TopFormsSkeleton() {
  return (
    <section className="mt-8">
      <Skeleton className="h-40 rounded-xl" />
    </section>
  );
}
