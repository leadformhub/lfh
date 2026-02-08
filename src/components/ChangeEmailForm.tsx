"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ChangeEmailForm() {
  const [newEmail, setNewEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/auth/change-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail: newEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
        return;
      }
      setStatus("success");
      setMessage(data.message || "Verification email sent. Check your new email inbox.");
      setNewEmail("");
    } catch {
      setStatus("error");
      setMessage("Failed to send verification email.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="change-email-input" className="sr-only">
          New email address
        </label>
        <Input
          id="change-email-input"
          type="email"
          placeholder="New email address"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          disabled={status === "loading"}
          className="w-full"
          required
        />
      </div>
      <Button type="submit" variant="secondary" size="md" loading={status === "loading"} disabled={!newEmail.trim()}>
        Send verification email
      </Button>
      {status === "success" && (
        <p className="text-base text-emerald-600" role="status">
          {message}
        </p>
      )}
      {status === "error" && (
        <p className="text-base text-[var(--color-danger)]" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}
