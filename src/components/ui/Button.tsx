"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-[var(--color-accent)] text-white shadow-[var(--shadow-cta)] hover:bg-[var(--color-accent-hover)] active:bg-[var(--color-accent-active)] hover:shadow-[var(--shadow-md)]",
  secondary:
    "bg-transparent text-[var(--foreground-heading)] border border-[var(--border-strong)] hover:bg-[var(--neutral-100)] hover:border-[var(--neutral-300)]",
  accent:
    "bg-[var(--color-accent)] text-white shadow-[var(--shadow-cta)] hover:bg-[var(--color-accent-hover)] active:bg-[var(--color-accent-active)] hover:shadow-[var(--shadow-md)]",
  ghost:
    "text-[var(--foreground)] hover:bg-[var(--neutral-100)]",
  danger:
    "bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger-hover)] active:opacity-90",
};

const sizes = {
  sm: "h-8 min-h-[32px] px-3 text-sm rounded-[var(--radius-md)]",
  md: "h-10 min-h-[44px] px-4 text-sm rounded-[var(--radius-md)]",
  lg: "h-12 min-h-[44px] px-6 text-base rounded-[var(--radius-lg)]",
  xl: "h-14 min-h-[44px] px-8 text-base rounded-[var(--radius-lg)]",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "btn-base inline-flex items-center justify-center font-medium disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <span
            className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden
          />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
