import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variants = {
  default:
    "bg-[var(--neutral-100)] text-[var(--foreground)] border border-[var(--border-subtle)]",
  primary: "bg-[var(--color-accent-subtle)] text-[var(--color-accent)]",
  success: "bg-[var(--color-success)]/10 text-[var(--color-success)]",
  warning: "bg-[var(--color-warning)]/10 text-[var(--color-warning)]",
  danger: "bg-[var(--color-danger)]/10 text-[var(--color-danger)]",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-md)] px-2 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
