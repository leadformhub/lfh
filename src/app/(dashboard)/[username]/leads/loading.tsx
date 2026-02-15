import { Skeleton } from "@/components/ui/Skeleton";

export default function LeadsLoading() {
  return (
    <div className="max-w-full overflow-x-hidden p-4 sm:p-6 lg:p-8">
      <h1 className="font-heading mb-5 text-lg font-semibold tracking-tight text-[var(--foreground-heading)] sm:mb-6 sm:text-xl">
        Lead Management Dashboard
      </h1>
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-11 w-52 rounded-[var(--radius-md)]" />
          <Skeleton className="h-11 w-24 rounded-[var(--radius-md)]" />
          <Skeleton className="h-11 w-40 rounded-[var(--radius-md)]" />
        </div>
        <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--background-elevated)]">
          <Skeleton className="h-64 w-full rounded-none" />
        </div>
      </div>
    </div>
  );
}
