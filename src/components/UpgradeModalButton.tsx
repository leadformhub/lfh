"use client";

import { useUpgradeModal } from "@/components/UpgradeModalProvider";

type Props = {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
};

const DEFAULT_TITLE = "Upgrade your plan";
const DEFAULT_DESCRIPTION =
  "Choose Pro or Business for more forms, OTP, analytics, and integrations.";

/** Renders a button that opens the upgrade modal (no navigation). Use in dashboard. */
export function UpgradeModalButton({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  className,
  children,
}: Props) {
  const { showUpgradeModal } = useUpgradeModal();
  return (
    <button
      type="button"
      onClick={() => showUpgradeModal(title, description)}
      className={className}
    >
      {children}
    </button>
  );
}
