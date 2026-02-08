"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ChangeUsernameForm({ currentUsername }: { currentUsername: string }) {
  const [newUsername, setNewUsername] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newUsername.trim()) return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/auth/change-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newUsername: newUsername.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
        return;
      }
      setStatus("success");
      setMessage(data.message || "Username updated.");
      setNewUsername("");
      // Redirect to new username's settings so URL reflects the change; refresh to pick up new session
      if (data.username) {
        router.push(`/${data.username}/settings`);
        router.refresh();
      }
    } catch {
      setStatus("error");
      setMessage("Failed to update username.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="change-username-input" className="sr-only">
          New username
        </label>
        <Input
          id="change-username-input"
          type="text"
          placeholder={`Current: @${currentUsername}`}
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          disabled={status === "loading"}
          className="w-full"
          autoComplete="username"
          minLength={2}
          maxLength={30}
          required
        />
        <p className="mt-1 text-xs text-[var(--foreground-muted)]">
          Letters, numbers, _ and - only. 2–30 characters.
        </p>
      </div>
      <Button type="submit" variant="secondary" size="md" loading={status === "loading"} disabled={!newUsername.trim()}>
        Change username
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
