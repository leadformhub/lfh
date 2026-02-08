"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  delayMs?: number;
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = "top",
  delayMs = 200,
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delayMs);
  };

  const hide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(false);
  };

  useEffect(() => {
    if (!visible || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const gap = 8;
    let top = 0;
    let left = rect.left + rect.width / 2;
    switch (side) {
      case "top":
        top = rect.top - gap;
        break;
      case "bottom":
        top = rect.bottom + gap;
        break;
      case "left":
        top = rect.top + rect.height / 2;
        left = rect.left - gap;
        break;
      case "right":
        top = rect.top + rect.height / 2;
        left = rect.right + gap;
        break;
    }
    setCoords({ top, left });
  }, [visible, side]);

  const positionClasses = {
    top: "translate-y-[-100%] translate-x-[-50%]",
    bottom: "translate-x-[-50%]",
    left: "translate-y-[-50%] translate-x-[-100%]",
    right: "translate-y-[-50%]",
  };

  const contentEl =
    visible &&
    typeof document !== "undefined" &&
    createPortal(
      <div
        role="tooltip"
        className={cn(
          "fixed z-50 max-w-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--color-primary)] px-3 py-2 text-sm text-white shadow-[var(--shadow-lg)]",
          positionClasses[side],
          "animate-[fadeIn_0.15s_ease-out_forwards]"
        )}
        style={{
          left: side === "left" || side === "right" ? coords.left : coords.left,
          top: coords.top,
        }}
      >
        {content}
      </div>,
      document.body
    );

  return (
    <div
      ref={triggerRef}
      className={cn("inline-flex", className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {contentEl}
    </div>
  );
}
