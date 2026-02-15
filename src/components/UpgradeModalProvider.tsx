"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { UpgradeModal } from "@/components/UpgradeModal";

type UpgradeModalContextValue = {
  showUpgradeModal: (title: string, description: string) => void;
};

const UpgradeModalContext = createContext<UpgradeModalContextValue | null>(null);

export function useUpgradeModal(): UpgradeModalContextValue {
  const ctx = useContext(UpgradeModalContext);
  if (!ctx) throw new Error("useUpgradeModal must be used within UpgradeModalProvider");
  return ctx;
}

export function UpgradeModalProvider({
  children,
  currentPlan,
  razorpayKeyId,
}: {
  children: React.ReactNode;
  currentPlan: string;
  razorpayKeyId: string | null;
}) {
  const [modal, setModal] = useState<{ title: string; description: string } | null>(null);

  const showUpgradeModal = useCallback((title: string, description: string) => {
    setModal({ title, description });
  }, []);

  const close = useCallback(() => setModal(null), []);

  return (
    <UpgradeModalContext.Provider value={{ showUpgradeModal }}>
      {children}
      {modal && (
        <UpgradeModal
          open={!!modal}
          onClose={close}
          currentPlan={currentPlan}
          razorpayKeyId={razorpayKeyId}
          title={modal.title}
          description={modal.description}
        />
      )}
    </UpgradeModalContext.Provider>
  );
}
