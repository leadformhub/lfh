"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "auto";
  /** "default" = hard modal; "soft" = tooltip-like, lighter overlay, gentle fade */
  variant?: "default" | "soft";
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
  /** Tooltip-like: as small as content, capped at max-w-md */
  auto: "w-max min-w-[280px] max-w-md",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
  size = "md",
  variant = "default",
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!open) return null;

  const isSoft = variant === "soft";

  const content = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={description ? "modal-desc" : undefined}
    >
      <div
        className={cn(
          "absolute inset-0",
          isSoft
            ? "bg-[var(--foreground)]/8 backdrop-blur-[1px] animate-soft-overlay"
            : "bg-[var(--foreground)]/40 backdrop-blur-sm"
        )}
        aria-hidden
      />
      <div
        className={cn(
          "relative flex flex-col rounded-[var(--radius-xl)] border bg-[var(--background-elevated)]",
          size === "auto" ? "max-h-[85dvh] overflow-hidden" : "w-full max-h-[90dvh] sm:max-h-[85vh]",
          sizeClasses[size],
          isSoft
            ? "border-[var(--border-subtle)]/70 shadow-[var(--shadow-md)] animate-soft-pop"
            : "border-[var(--border-subtle)] shadow-[var(--shadow-xl)]",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || description) && (
          <div
            className={cn(
              "shrink-0 border-b border-[var(--border-subtle)]",
              size === "auto" ? "px-3 py-2.5" : "p-4 sm:p-6 sm:pb-4"
            )}
          >
            {title && (
              <h2
                id="modal-title"
                className={cn(
                  "font-heading font-semibold text-[var(--foreground-heading)]",
                  size === "auto" ? "text-sm" : "text-xl sm:text-2xl"
                )}
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                id="modal-desc"
                className={cn("text-[var(--foreground-muted)]", size === "auto" ? "mt-0.5 text-xs" : "mt-1 text-sm")}
              >
                {description}
              </p>
            )}
          </div>
        )}
        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto",
            size === "auto" ? "p-3" : "p-4 sm:p-6"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(content, document.body)
    : null;
}

export interface ModalCloseButtonProps {
  onClose: () => void;
  className?: string;
}

export function ModalCloseButton({ onClose, className }: ModalCloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClose}
      className={cn(
        "absolute right-3 top-3 sm:right-4 sm:top-4 flex min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:size-8 items-center justify-center rounded-lg text-[var(--foreground-muted)] transition-colors hover:bg-[var(--neutral-100)] hover:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2",
        className
      )}
      aria-label="Close"
    >
      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}
