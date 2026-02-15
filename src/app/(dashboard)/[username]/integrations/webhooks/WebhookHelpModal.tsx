"use client";

import { Modal, ModalCloseButton } from "@/components/ui/Modal";

export type WebhookHelpTopic = "name" | "url" | "trigger" | "secret" | "active";

const HELP_CONTENT: Record<
  WebhookHelpTopic,
  { title: string; steps: string[] }
> = {
  name: {
    title: "Webhook name",
    steps: [
      "A short label that only you see, to identify this webhook in your list.",
      "Examples: My CRM, Slack #leads, Zapier new leads.",
    ],
  },
  url: {
    title: "Webhook URL",
    steps: [
      "Step 1: In your app (Zapier, Make.com, n8n, or your server), create a webhook or get your API endpoint URL.",
      "Step 2: Copy the full URL. It must start with https:// or http:// and accept POST requests.",
      "Step 3: Paste that URL here. We will send the lead data to it when the chosen event happens.",
    ],
  },
  trigger: {
    title: "Trigger event",
    steps: [
      "Lead created — when someone submits a form and a new lead is created.",
      "Lead stage changed — when you move a lead to another stage on the board.",
      "Lead won — when you move a lead into a stage named \"Won\".",
    ],
  },
  secret: {
    title: "Secret key (optional)",
    steps: [
      "Leave blank if you don't need to verify that requests come from LeadFormHub.",
      "If you set a secret, we add an x-webhook-signature header (HMAC SHA256 of the body).",
      "On your server, compute the same hash using this secret and compare it to the header to verify the request.",
    ],
  },
  active: {
    title: "Active",
    steps: [
      "On — we send events to your URL when they happen.",
      "Off — we save the webhook but never call it. Use this to pause without deleting.",
    ],
  },
};

export function WebhookHelpModal({
  topic,
  open,
  onClose,
}: {
  topic: WebhookHelpTopic | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!topic) return null;
  const { title, steps } = HELP_CONTENT[topic];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      variant="soft"
      className="relative"
    >
      <ModalCloseButton onClose={onClose} />
      <ol className="list-decimal list-inside space-y-2 text-sm text-[var(--foreground-muted)]">
        {steps.map((step, i) => (
          <li key={i} className="pl-1">
            {step}
          </li>
        ))}
      </ol>
    </Modal>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden>
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function WebhookHelpTrigger({
  topic,
  onOpen,
}: {
  topic: WebhookHelpTopic;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        onOpen();
      }}
      className="inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[var(--foreground-muted)]/15 text-[var(--foreground-muted)] hover:bg-[var(--color-accent)]/20 hover:text-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-1 transition-colors"
      aria-label={`Help for ${HELP_CONTENT[topic].title}`}
    >
      <InfoIcon className="size-3" />
    </button>
  );
}
