import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn(
          "w-full border-collapse text-sm",
          className
        )}
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("border-b border-[var(--border-default)]", className)} {...props} />;
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("divide-y divide-[var(--border-subtle)]", className)} {...props} />;
}

export function TableRow({
  className,
  header,
  ...props
}: HTMLAttributes<HTMLTableRowElement> & { header?: boolean }) {
  return (
    <tr
      className={cn(
        "transition-colors duration-150",
        !header && "hover:bg-[var(--neutral-50)] [&:nth-child(even)]:bg-[var(--neutral-50)]/50",
        className
      )}
      {...props}
    />
  );
}

export function TableHead({
  className,
  ...props
}: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "sticky top-0 z-10 border-b border-[var(--border-default)] bg-[var(--background-elevated)] px-4 py-3 text-left font-heading text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]",
        className
      )}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        "px-4 py-3 text-[var(--foreground)]",
        className
      )}
      {...props}
    />
  );
}
