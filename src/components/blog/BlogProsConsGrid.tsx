import { cn } from "@/lib/utils";

export type ProsConsEntry = {
  name: string;
  pros: string[];
  cons: string[];
};

type BlogProsConsGridProps = {
  entries: ProsConsEntry[];
  className?: string;
};

export function BlogProsConsGrid({ entries, className }: BlogProsConsGridProps) {
  return (
    <div className={cn("mt-8 grid gap-6 sm:grid-cols-2", className)}>
      {entries.map((entry) => (
        <div
          key={entry.name}
          className="rounded-2xl border border-[var(--border-default)] bg-[var(--neutral-50)]/50 p-6"
        >
          <h3 className="font-heading text-lg font-semibold text-[var(--foreground-heading)]">{entry.name}</h3>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">Pros</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--foreground-muted)]">
            {entry.pros.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">Cons</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--foreground-muted)]">
            {entry.cons.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
