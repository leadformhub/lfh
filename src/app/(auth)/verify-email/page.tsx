"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";
  const [email, setEmail] = useState(emailParam);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const toSend = email.trim();
    if (!toSend) {
      setMessage({ type: "error", text: "Enter your email address." });
      return;
    }
    setResendLoading(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: toSend }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: "success",
          text: data.message || "Verification email sent. Check your inbox and spam folder.",
        });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to send." });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <article className="w-full max-w-full overflow-x-hidden" aria-label="Verify your email">
      <div className="mx-auto mb-6 flex h-12 shrink-0 items-center justify-center sm:mb-8 sm:h-14">
        <Image
          src="/logo-w.png"
          alt="LeadFormHub"
          width={240}
          height={60}
          className="h-full w-auto object-contain object-center"
          unoptimized
          loading="eager"
        />
      </div>
      <h1 className="mt-6 text-center text-2xl font-bold leading-tight tracking-tight text-white sm:mt-8 sm:text-3xl md:text-[2.25rem] lg:text-[2.75rem]" style={{ color: "#ffffff" }}>
        Verify your email
      </h1>
      <p className="mt-2.5 text-center text-base text-white/80 sm:mt-3">
        Your account exists but your email isn&apos;t verified yet. We can send you a verification link so you can sign in.
      </p>

      <div className="mt-6 rounded-xl border border-[#333] bg-[#1a1a1a] p-4 sm:mt-8 sm:p-5" role="region" aria-label="Send verification email">
        <p className="text-sm font-medium text-white/90">Enter your email and we&apos;ll send a verification link.</p>
        <p className="mt-1 text-sm text-white/60">Check your inbox (and spam folder) after sending.</p>
        <form onSubmit={handleResend} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="verify-email-input" className="sr-only">
              Your email
            </label>
            <input
              id="verify-email-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-lg border border-[#333] bg-[#262626] px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
              disabled={resendLoading}
              aria-describedby="verify-helper verify-status"
            />
          </div>
          <button
            type="submit"
            disabled={resendLoading}
            className="h-11 shrink-0 rounded-lg border border-[#333] bg-[#333] px-4 text-sm font-medium text-white/90 transition-colors hover:bg-[#404040] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white/50 disabled:opacity-50"
            aria-busy={resendLoading}
          >
            {resendLoading ? "Sending…" : "Send verification email"}
          </button>
        </form>
        <p id="verify-helper" className="mt-2 text-xs text-white/50">
          Link expires in 24 hours. Wait 2 minutes between requests.
        </p>
        {message && (
          <p
            id="verify-status"
            className={`mt-2 text-sm ${message.type === "success" ? "text-emerald-400" : "text-red-400"}`}
            role="status"
          >
            {message.text}
          </p>
        )}
      </div>

      <p className="mt-6 text-center text-base text-white/80 sm:mt-8">
        <Link
          href="/login"
          className="font-medium text-white underline-offset-4 transition-colors hover:text-white focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
        >
          Back to login
        </Link>
      </p>
    </article>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <article className="w-full" aria-hidden>
          <div className="mx-auto h-11 w-11 animate-pulse rounded-xl bg-white/10" />
          <div className="mt-6 h-8 w-48 animate-pulse rounded bg-white/10" />
          <div className="mt-4 h-4 w-64 animate-pulse rounded bg-white/10" />
          <div className="mt-8 h-24 w-full animate-pulse rounded-xl bg-white/10" />
        </article>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
