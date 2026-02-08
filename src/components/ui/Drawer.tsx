"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type DrawerSide = "left" | "right";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  side?: DrawerSide;
  className?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  side = "right",
  className,
}: DrawerProps) {
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

  if (!open) return null;

  const content = (
    <div
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "drawer-title" : undefined}
      aria-describedby={description ? "drawer-desc" : undefined}
    >
      <div
        className="absolute inset-0 bg-[var(--foreground)]/40 backdrop-blur-sm transition-opacity"
        aria-hidden
        onClick={onClose}
      />
      <aside
        className={cn(
          "relative flex w-full max-w-sm flex-col border-[var(--border-subtle)] bg-[var(--background-elevated)] shadow-[var(--shadow-xl)] transition-transform duration-200 ease-out",
          side === "right" ? "ml-auto border-l" : "mr-auto border-r",
          "transition-transform duration-200 ease-out",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] p-4">
          <div>
            {title && (
              <h2 id="drawer-title" className="font-heading text-lg font-semibold text-[var(--foreground)]">
                {title}
              </h2>
            )}
            {description && (
              <p id="drawer-desc" className="mt-0.5 text-sm text-[var(--foreground-muted)]">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-[var(--foreground-muted)] hover:bg-[var(--neutral-100)] hover:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            aria-label="Close"
          >
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </aside>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(content, document.body)
    : null;
}
