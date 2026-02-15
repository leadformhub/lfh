import { Skeleton } from "@/components/ui/Skeleton";

export default function FormDesignLoading() {
  return (
    <div className="min-h-full bg-[var(--background-alt)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Skeleton className="h-5 w-24" />
        <div>
          <Skeleton className="h-7 w-64 sm:w-80" />
          <div className="mt-2 flex gap-4">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="space-y-8">
          <section className="rounded-xl border border-[var(--border-default)] bg-[var(--background-elevated)] p-4 shadow-[var(--shadow-sm)] sm:p-5">
            <Skeleton className="h-4 w-28 mb-3" />
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
          </section>
          <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--background-elevated)]">
            <div className="flex flex-col items-center gap-3">
              <div className="size-8 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" aria-hidden />
              <span className="text-sm text-[var(--foreground-muted)]">Loading form designer…</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
