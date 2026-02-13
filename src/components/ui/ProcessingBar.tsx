"use client";

import { cn } from "@/lib/utils";

/**
 * LeadFormHub processing indicator: a thin rectangle bar at the top of the viewport.
 * Uses theme tokens (--color-accent, --neutral-*) so it matches light/dark and brand.
 * Use for page transitions or any "in progress" state.
 */
export interface ProcessingBarProps {
  /** When true, the bar is visible and animating */
  show?: boolean;
  /** Optional: fix to top of viewport (default true). Set false to use inline. */
  fixed?: boolean;
  className?: string;
}

export function ProcessingBar({ show = true, fixed = true, className }: ProcessingBarProps) {
  if (!show) return null;

  return (
    <div
      role="progressbar"
      aria-valuenow={undefined}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading"
      className={cn(
        "processing-bar z-[9999] h-1 w-full rounded-none",
        "bg-[var(--neutral-200)]",
        "overflow-hidden",
        fixed && "fixed left-0 right-0 top-0",
        className
     )}
    >
      <div
        className="processing-bar-shine h-full min-w-[40%] rounded-none"
        style={{
          background: `linear-gradient(
            90deg,
            transparent 0%,
            var(--color-accent) 40%,
            var(--color-accent-hover) 50%,
            var(--color-accent) 60%,
            transparent 100%
          )`,
        }}
      />
    </div>
  );
}
