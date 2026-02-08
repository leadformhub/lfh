"use client";

import { Modal, ModalCloseButton } from "@/components/ui/Modal";
import { UpgradePlanCard } from "./UpgradePlanCard";

export function UpgradeModal({
  open,
  onClose,
  currentPlan,
  razorpayKeyId,
  title = "Upgrade to unlock",
  description = "Mobile OTP verification is available on Pro and Business plans.",
}: {
  open: boolean;
  onClose: () => void;
  currentPlan: string;
  razorpayKeyId: string | null;
  title?: string;
  description?: string;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} description={description} size="lg">
      <div className="relative">
        <ModalCloseButton onClose={onClose} />
        <UpgradePlanCard currentPlan={currentPlan} razorpayKeyId={razorpayKeyId} />
      </div>
    </Modal>
  );
}
