"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";

export function DeleteAccountForm({ authProvider }: { authProvider?: string | null }) {
  const [password, setPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "linkSent">("idle");
  const [message, setMessage] = useState("");

  const isGoogleUser = authProvider === "google";
  const canSubmit = password.trim().length > 0 && confirmed && status !== "loading";

  async function handleRequestDeleteLink(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/account/request-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Failed to send confirmation link");
        return;
      }
      setStatus("linkSent");
      setMessage("Check your email for a confirmation link. Click it to permanently delete your account.");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Failed to delete account");
        return;
      }
      if (data.redirect) {
        window.location.href = data.redirect;
        return;
      }
      window.location.href = "/login";
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (isGoogleUser) {
    return (
      <div className="space-y-4">
        <p className="text-base text-[var(--foreground-muted)]">
          Your login will be removed. Forms and subscription will be deleted. Leads are kept but unmapped from your account; if you sign up again with the same email, you will not see previous data.
        </p>
        <p className="text-base text-[var(--foreground-muted)]">
          Since you signed up with Google, we&apos;ll send a confirmation link to your email. Click it to permanently delete your account.
        </p>
        {status === "linkSent" && (
          <p className="text-base text-green-600" role="status">
            {message}
          </p>
        )}
        {status === "error" && (
          <p className="text-base text-[var(--color-danger)]" role="alert">
            {message}
          </p>
        )}
        <form onSubmit={handleRequestDeleteLink}>
          <Button
            type="submit"
            variant="danger"
            size="md"
            loading={status === "loading"}
            disabled={status === "loading" || status === "linkSent"}
          >
            Send delete confirmation link
          </Button>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-base text-[var(--foreground-muted)]">
        Your login will be removed. Forms and subscription will be deleted. Leads are kept but unmapped from your account; if you sign up again with the same email, you will not see previous data.
      </p>
      <div>
        <label htmlFor="delete-account-password" className="mb-1.5 block text-sm font-medium text-[var(--foreground-heading)]">
          Enter your password to confirm
        </label>
        <Input
          id="delete-account-password"
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={status === "loading"}
          className="w-full max-w-xs"
          required
          autoComplete="current-password"
        />
      </div>
      <Checkbox
        id="delete-account-confirm"
        checked={confirmed}
        onChange={(e) => setConfirmed(e.target.checked)}
        disabled={status === "loading"}
        label="I understand this cannot be undone and I will lose access to my account and forms"
      />
      <Button
        type="submit"
        variant="danger"
        size="md"
        loading={status === "loading"}
        disabled={!canSubmit}
      >
        Delete my account
      </Button>
      {status === "error" && (
        <p className="text-base text-[var(--color-danger)]" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}
