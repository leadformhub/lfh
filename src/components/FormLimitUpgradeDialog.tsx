"use client";

import { useEffect, useRef } from "react";
import { UpgradePlanCard } from "./UpgradePlanCard";

export function FormLimitUpgradeDialog({
  open,
  onClose,
  currentPlan,
  razorpayKeyId,
}: {
  open: boolean;
  onClose: () => void;
  currentPlan: string;
  razorpayKeyId: string | null;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-[9999] m-auto max-h-[90vh] w-full max-w-2xl rounded-xl border border-[var(--border-default)] bg-[var(--background-elevated)] p-0 shadow-xl backdrop:bg-black/40"
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className="p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-semibold text-[var(--foreground)]">
              Form limit reached
            </h2>
            <p className="mt-1 text-base text-[var(--foreground-muted)]">
              Upgrade to Pro or Business to create more forms. Free plan includes 3 forms.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-[var(--foreground-muted)] hover:bg-[var(--neutral-100)] hover:text-[var(--foreground)]"
            aria-label="Close"
          >
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-6">
          <UpgradePlanCard currentPlan={currentPlan} razorpayKeyId={razorpayKeyId} />
        </div>
      </div>
    </dialog>
  );
}
