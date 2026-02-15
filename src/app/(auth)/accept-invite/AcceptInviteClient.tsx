"use client";

import { useState } from "react";

export function AcceptInviteClient({ token }: { token: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAccept() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/team/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to accept invitation.");
        return;
      }
      window.location.href = `/${data.ownerUsername}/dashboard`;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handleAccept}
        disabled={loading}
        className="inline-flex h-12 w-full min-h-[48px] items-center justify-center rounded-xl border border-[#333] bg-[#262626] px-4 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-[#333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 disabled:cursor-not-allowed disabled:opacity-50 sm:h-14"
        aria-busy={loading}
      >
        {loading ? "Accepting…" : "Accept invitation"}
      </button>
      {error && (
        <p className="mt-3 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
