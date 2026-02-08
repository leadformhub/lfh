"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  indeterminate?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, indeterminate, id: idProp, disabled, ...props }, ref) => {
    const id = idProp ?? `checkbox-${Math.random().toString(36).slice(2, 9)}`;
    return (
      <div className="flex items-start gap-3">
        <div className="relative flex h-5 shrink-0 items-center">
          <input
            ref={(el) => {
              if (typeof ref === "function") ref(el);
              else if (ref) ref.current = el;
              if (el && indeterminate) el.indeterminate = true;
            }}
            id={id}
            type="checkbox"
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={cn(
              "peer size-5 shrink-0 rounded-[var(--radius-sm)] border-2 border-[var(--border-default)] bg-[var(--background)] transition-colors duration-[var(--transition-base)]",
              "hover:border-[var(--border-strong)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--background)]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "checked:border-[var(--color-accent)] checked:bg-[var(--color-accent)]",
              "indeterminate:border-[var(--color-accent)] indeterminate:bg-[var(--color-accent)]",
              className
            )}
            {...props}
          />
          <svg
            className="pointer-events-none absolute left-0.5 top-0.5 hidden size-4 text-white peer-checked:block"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          {label && (
            <label
              htmlFor={id}
              className="cursor-pointer text-sm font-medium text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {label}
            </label>
          )}
          {error && (
            <p id={`${id}-error`} className="mt-1 text-sm text-[var(--color-danger)]" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
