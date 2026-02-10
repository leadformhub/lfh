"use client";

import { useState } from "react";
import { Modal, ModalCloseButton } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

export function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) {
      setError("Please enter your feedback.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSuccess(true);
      setMessage("");
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setMessage("");
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Feedback" description="Share your feedback with us. We read every message." size="md">
      <ModalCloseButton onClose={handleClose} />
      {success ? (
        <p className="text-center py-4 text-[var(--foreground)] font-medium">Thank you! Your feedback has been submitted.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="feedback-message" className="mb-1.5 block text-sm font-medium text-[var(--foreground-heading)]">
              Your feedback
            </label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you think, report a bug, or suggest an improvement..."
              rows={4}
              maxLength={10000}
              disabled={submitting}
              className={cn(
                "form-input-base w-full resize-y min-h-[100px]",
                error && "form-input-error"
              )}
              aria-invalid={!!error}
              aria-describedby={error ? "feedback-error" : undefined}
            />
            {error && (
              <p id="feedback-error" className="mt-1.5 text-sm text-[var(--color-danger)]" role="alert">
                {error}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <Button type="button" variant="secondary" onClick={handleClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting} disabled={submitting}>
              Submit feedback
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

export interface FeedbackTriggerProps {
  children: React.ReactNode;
  className?: string;
  /** Optional: called when the trigger is clicked (before opening modal). Use to close mobile nav etc. */
  onOpen?: () => void;
}

export function FeedbackTrigger({ children, className, onOpen }: FeedbackTriggerProps) {
  const [open, setOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpen?.();
    setOpen(true);
  };

  return (
    <>
      <button type="button" onClick={handleClick} className={className} aria-label="Open feedback form">
        {children}
      </button>
      <FeedbackModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
