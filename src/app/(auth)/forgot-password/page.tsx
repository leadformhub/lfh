"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setSent(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="w-full" aria-label="Forgot password form">
      <div className="flex justify-center">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#262626] text-2xl font-semibold text-white"
          aria-hidden
        >
          L
        </div>
      </div>

      <h1 className="mt-8 text-center text-[2.25rem] font-bold leading-tight tracking-tight text-white sm:text-[2.75rem]">
        Forgot your password?
      </h1>

      <p className="mt-3 text-center text-base font-normal text-white/80">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      {error && (
        <p className="mt-3 text-base text-red-400" role="alert">
          {error}
        </p>
      )}

      {sent ? (
        <div className="mt-10 rounded-xl border border-[#333] bg-[#262626] px-5 py-6">
          <p className="text-center text-base text-white/90">
            If an account exists for that email, you will receive a reset link shortly.
          </p>
          <p className="mt-2 text-center text-base text-white/60">
            Check your inbox and spam folder.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div className="space-y-2.5">
            <label htmlFor="forgot-email" className="block text-base font-medium text-white">
              Email
            </label>
            <input
              id="forgot-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="leadformhub@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 w-full rounded-xl border border-[#333] bg-[#262626] px-5 py-4 text-base text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
              required
              aria-required="true"
              aria-invalid={!!error}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-14 w-full rounded-xl border border-[#333] bg-[#262626] px-5 py-4 text-base font-medium text-white/90 transition-colors hover:bg-[#333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 disabled:cursor-not-allowed disabled:opacity-50"
            aria-busy={loading}
            aria-live="polite"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}

      <p className="mt-8 text-center text-base text-white/50">
        <Link
          href="/login"
          className="font-medium text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
        >
          Back to login
        </Link>
      </p>
    </article>
  );
}
