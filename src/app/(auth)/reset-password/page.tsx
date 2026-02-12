"use client";

import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    setToken(searchParams.get("token") || "");
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Reset failed");
        return;
      }
      setDone(true);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <article className="w-full" aria-label="Reset password">
        <div className="mx-auto mb-6 flex h-12 shrink-0 items-center justify-center sm:mb-8 sm:h-14">
          <Image src="/logo-w.png" alt="LeadFormHub" width={240} height={60} className="h-full w-auto object-contain object-center" unoptimized loading="eager" />
        </div>
        <h1 className="mt-6 text-center text-[2.25rem] font-bold leading-tight tracking-tight sm:mt-8 sm:text-[2.75rem]" style={{ color: "#ffffff" }}>
          Invalid reset link
        </h1>
        <p className="mt-3 text-center text-base text-white/80">
          This link is invalid or has expired. Request a new one from the login page.
        </p>
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

  if (done) {
    return (
      <article className="w-full" aria-label="Reset password">
        <div className="mx-auto mb-6 flex h-12 shrink-0 items-center justify-center sm:mb-8 sm:h-14">
          <Image src="/logo-w.png" alt="LeadFormHub" width={240} height={60} className="h-full w-auto object-contain object-center" unoptimized loading="eager" />
        </div>
        <h1 className="mt-6 text-center text-[2.25rem] font-bold leading-tight tracking-tight sm:mt-8 sm:text-[2.75rem]" style={{ color: "#ffffff" }}>
          Password updated
        </h1>
        <p className="mt-3 text-center text-base text-white/80">
          You can now log in with your new password.
        </p>
        <div className="mt-10">
          <Link
            href="/login"
            className="flex h-14 w-full items-center justify-center rounded-xl border border-[#333] bg-[#262626] px-5 py-4 text-base font-medium text-white/90 transition-colors hover:bg-[#333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
          >
            Log in
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="w-full" aria-label="Set new password form">
      <div className="mx-auto mb-6 flex h-12 shrink-0 items-center justify-center sm:mb-8 sm:h-14">
        <Image src="/logo-w.png" alt="LeadFormHub" width={240} height={60} className="h-full w-auto object-contain object-center" unoptimized loading="eager" />
      </div>

      <h1 className="mt-6 text-center text-[2.25rem] font-bold leading-tight tracking-tight sm:mt-8 sm:text-[2.75rem]" style={{ color: "#ffffff" }}>
        Set new password
      </h1>

      <p className="mt-3 text-center text-base font-normal text-white/80">
        Enter your new password below.
      </p>

      {error && (
        <p className="mt-3 text-base text-red-400" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <div className="space-y-2.5">
          <label htmlFor="new-password" className="block text-base font-medium text-white">
            New password
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              autoComplete="new-password"
              placeholder="••••••••••••"
              className="h-14 w-full rounded-xl border border-[#333] bg-[#262626] py-4 pl-5 pr-12 text-base text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
              required
              aria-invalid={!!error}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white/50"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg className="size-5 sm:size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878a4.5 4.5 0 106.262 6.262M4 4l3 3m14 14l3-3M4 20L7 17M20 4l-3 3M20 20l-3-3" />
                </svg>
              ) : (
                <svg className="size-5 sm:size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          <label htmlFor="confirm-password" className="block text-base font-medium text-white">
            Confirm password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            placeholder="••••••••••••"
            className="h-14 w-full rounded-xl border border-[#333] bg-[#262626] px-5 py-4 text-base text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-14 w-full rounded-xl border border-[#333] bg-[#262626] px-5 py-4 text-base font-medium text-white/90 transition-colors hover:bg-[#333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 disabled:cursor-not-allowed disabled:opacity-50"
          aria-busy={loading}
          aria-live="polite"
        >
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>

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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <article className="w-full" aria-hidden>
          <div className="mx-auto h-11 w-11 animate-pulse rounded-xl bg-white/10" />
          <div className="mt-6 h-8 w-48 animate-pulse rounded bg-white/10" />
          <div className="mt-4 h-4 w-64 animate-pulse rounded bg-white/10" />
          <div className="mt-8 h-12 w-full animate-pulse rounded-xl bg-white/10" />
          <div className="mt-4 h-12 w-full animate-pulse rounded-xl bg-white/10" />
          <div className="mt-4 h-12 w-full animate-pulse rounded-xl bg-white/10" />
        </article>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
