import { cn } from "@/lib/utils";

export type BlogCompareTableProps = {
  title?: string;
  /** Visible table caption (recommended for comparison content). */
  caption?: string;
  id?: string;
  headers: string[];
  rows: { feature: string; values: string[] }[];
  className?: string;
  /** Pin the feature column when scrolling wide multi-vendor tables. */
  stickyFeatureColumn?: boolean;
};

export function BlogCompareTable({
  title,
  caption,
  id,
  headers,
  rows,
  className,
  stickyFeatureColumn = false,
}: BlogCompareTableProps) {
  return (
    <figure className={cn("mt-6", className)}>
      {title ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">{title}</p>
      ) : null}
      <div className="overflow-x-auto rounded-2xl border border-[var(--border-default)] bg-white shadow-[var(--shadow-sm)]">
        <table id={id} className="w-full min-w-[520px] border-collapse text-sm">
          {caption ? (
            <caption className="border-b border-[var(--border-subtle)] bg-[var(--neutral-50)]/80 px-4 py-3 text-left text-sm font-medium text-[var(--foreground-heading)]">
              {caption}
            </caption>
          ) : null}
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--neutral-50)]/80">
              {headers.map((h, colIndex) => (
                <th
                  key={h}
                  scope="col"
                  className={cn(
                    "py-3 px-3 text-left font-heading font-semibold text-[var(--foreground-heading)]",
                    colIndex === 0 && "pl-4",
                    colIndex === 0 && stickyFeatureColumn && "sticky left-0 z-10 bg-[var(--neutral-50)]"
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-[var(--foreground-muted)]">
            {rows.map((row, rowIndex) => (
              <tr
                key={row.feature}
                className={cn(
                  "border-b border-[var(--border-subtle)]",
                  rowIndex % 2 === 1 && "bg-[var(--neutral-50)]/40"
                )}
              >
                <th
                  scope="row"
                  className={cn(
                    "py-3 pl-4 pr-4 text-left font-medium text-[var(--foreground-heading)]",
                    stickyFeatureColumn && "sticky left-0 z-10 bg-white"
                  )}
                >
                  {row.feature}
                </th>
                {row.values.map((val, i) => (
                  <td key={`${row.feature}-${i}`} className="px-3 py-3 align-top">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
