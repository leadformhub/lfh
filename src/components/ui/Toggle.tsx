"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, checked, onCheckedChange, label, disabled, ...props }, ref) => {
    return (
      <label className={cn("inline-flex cursor-pointer items-center gap-3", disabled && "cursor-not-allowed opacity-50")}>
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onCheckedChange(!checked)}
          className={cn(
            "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--background)] disabled:cursor-not-allowed",
            checked ? "bg-[var(--color-accent)]" : "bg-[var(--neutral-300)]",
            className
          )}
          {...props}
        >
          <span
            className={cn(
              "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-[var(--shadow-sm)] transition-transform duration-200",
              checked ? "translate-x-5" : "translate-x-0.5"
            )}
            aria-hidden
          />
        </button>
        {label && (
          <span className="text-sm font-medium text-[var(--foreground)]">{label}</span>
        )}
      </label>
    );
  }
);

Toggle.displayName = "Toggle";

export { Toggle };
