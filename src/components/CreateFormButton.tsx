"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { FormLimitUpgradeDialog } from "@/components/FormLimitUpgradeDialog";

function prefetchFormDesigner() {
  void import("@/components/FormBuilder");
}

const buttonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]";

export function CreateFormButton({
  username,
  canCreate,
  currentPlan,
  razorpayKeyId,
  formsCount,
  formsLimit,
}: {
  username: string;
  canCreate: boolean;
  currentPlan: string;
  razorpayKeyId: string | null;
  formsCount?: number;
  formsLimit?: number;
}) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (canCreate) {
        router.push(`/${username}/forms/new`);
      } else {
        e.preventDefault();
        e.stopPropagation();
        setDialogOpen(true);
      }
    },
    [canCreate, username, router, formsCount, formsLimit]
  );

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={canCreate ? prefetchFormDesigner : undefined}
        className={buttonClass}
        data-debug-can-create={String(canCreate)}
        data-debug-forms-count={formsCount}
        data-debug-forms-limit={formsLimit}
      >
        + Create Form
      </button>
      <FormLimitUpgradeDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        currentPlan={currentPlan}
        razorpayKeyId={razorpayKeyId}
      />
    </>
  );
}
