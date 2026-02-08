"use client";

import { createContext, useContext, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const DropdownCloseContext = createContext<(() => void) | null>(null);

export interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  closeOnClick?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "end";
  className?: string;
}

export function Dropdown({ trigger, children, align = "end", className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        panelRef.current?.contains(e.target as Node)
      )
        return;
      setOpen(false);
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const [position, setPosition] = useState({ top: 0, left: 0 });
  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 4,
      left: align === "end" ? rect.right : rect.left,
    });
  }, [open, align]);

  const portal =
    open &&
    typeof document !== "undefined" &&
    createPortal(
      <DropdownCloseContext.Provider value={close}>
        <div
          ref={panelRef}
          className="fixed z-50 min-w-[10rem] rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)] py-1 shadow-[var(--shadow-lg)]"
          style={{
            top: position.top,
            left: align === "end" ? undefined : position.left,
            right: align === "end" ? window.innerWidth - position.left : undefined,
          }}
          role="menu"
        >
          {children}
        </div>
      </DropdownCloseContext.Provider>,
      document.body
    );

  return (
    <div className={cn("relative inline-block", className)}>
      <div
        ref={triggerRef}
        role="button"
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((o) => !o);
          }
        }}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {trigger}
      </div>
      {portal}
    </div>
  );
}

export function DropdownItem({
  children,
  onClick,
  disabled,
  className,
  closeOnClick = true,
}: DropdownItemProps) {
  const onClose = useContext(DropdownCloseContext);
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      className={cn(
        "flex w-full items-center px-4 py-2 text-left text-sm text-[var(--foreground)] transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[var(--neutral-100)]",
        className
      )}
      onClick={() => {
        onClick?.();
        if (closeOnClick && onClose) onClose();
      }}
    >
      {children}
    </button>
  );
}

export function DropdownSeparator() {
  return <div className="my-1 h-px bg-[var(--border-subtle)]" role="separator" />;
}
