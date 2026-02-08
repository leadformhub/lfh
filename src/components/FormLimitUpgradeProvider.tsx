"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { UpgradeModal } from "@/components/UpgradeModal";

type FormLimitUpgradeContextValue = {
  showFormLimitModal: () => void;
};

const FormLimitUpgradeContext = createContext<FormLimitUpgradeContextValue | null>(null);

export function useFormLimitUpgrade() {
  const ctx = useContext(FormLimitUpgradeContext);
  return ctx;
}

export function FormLimitUpgradeProvider({
  children,
  currentPlan,
  razorpayKeyId,
}: {
  children: React.ReactNode;
  currentPlan: string;
  razorpayKeyId: string | null;
}) {
  const [open, setOpen] = useState(false);
  const showFormLimitModal = useCallback(() => {
    console.log("[FormLimitUpgradeProvider] showFormLimitModal called, setting open=true");
    setOpen(true);
  }, []);

  useEffect(() => {
    console.log("[FormLimitUpgradeProvider] modal open state:", open);
  }, [open]);

  return (
    <FormLimitUpgradeContext.Provider value={{ showFormLimitModal }}>
      {children}
      <UpgradeModal
        open={open}
        onClose={() => setOpen(false)}
        currentPlan={currentPlan}
        razorpayKeyId={razorpayKeyId}
        title="Form limit reached"
        description="Upgrade to Pro or Business to create more forms. Free plan includes 3 forms."
      />
    </FormLimitUpgradeContext.Provider>
  );
}
