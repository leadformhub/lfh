"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ProcessingBar } from "@/components/ui/ProcessingBar";

const NAV_BAR_DURATION_MS = 400;

type ProcessingContextValue = {
  setProcessing: (value: boolean) => void;
  isProcessing: boolean;
};

const ProcessingContext = createContext<ProcessingContextValue | null>(null);

export function useProcessing() {
  const ctx = useContext(ProcessingContext);
  if (!ctx) {
    return {
      setProcessing: () => {},
      isProcessing: false,
    };
  }
  return ctx;
}

export function ProcessingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showBar, setShowBar] = useState(false);
  const [manualProcessing, setManualProcessing] = useState(false);
  const prevPathname = useRef<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setProcessing = useCallback((value: boolean) => {
    setManualProcessing(value);
  }, []);

  // Show bar when pathname has changed (navigation completed or in progress)
  useEffect(() => {
    if (prevPathname.current !== null && prevPathname.current !== pathname) {
      setShowBar(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowBar(false);
        timeoutRef.current = null;
      }, NAV_BAR_DURATION_MS);
    }
    prevPathname.current = pathname;
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pathname]);

  // Show bar immediately on internal link click (before route resolves)
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as Element).closest("a");
      if (!target?.href) return;
      try {
        const url = new URL(target.href);
        if (url.origin === window.location.origin && url.pathname !== pathname) {
          setShowBar(true);
        }
      } catch {
        // ignore
      }
    }
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname]);

  const visible = showBar || manualProcessing;

  return (
    <ProcessingContext.Provider
      value={{
        setProcessing,
        isProcessing: visible,
      }}
    >
      <ProcessingBar show={visible} fixed />
      {children}
    </ProcessingContext.Provider>
  );
}
