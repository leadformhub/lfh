import { cn } from "@/lib/utils";

export type BlogCompareTableProps = {
  title?: string;
  headers: string[];
  rows: { feature: string; values: string[] }[];
  className?: string;
};

export function BlogCompareTable({ title, headers, rows, className }: BlogCompareTableProps) {
  return (
    <div className={cn("mt-6 overflow-x-auto", className)}>
      {title ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">{title}</p>
      ) : null}
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--border-subtle)] bg-[var(--neutral-50)]/80">
            {headers.map((h) => (
              <th
                key={h}
                className="py-3 px-3 text-left font-heading font-semibold text-[var(--foreground-heading)] first:pl-0"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-[var(--foreground-muted)]">
          {rows.map((row) => (
            <tr key={row.feature} className="border-b border-[var(--border-subtle)]">
              <td className="py-3 pr-4 font-medium text-[var(--foreground-heading)]">{row.feature}</td>
              {row.values.map((val, i) => (
                <td key={`${row.feature}-${i}`} className="px-3 py-3">
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
