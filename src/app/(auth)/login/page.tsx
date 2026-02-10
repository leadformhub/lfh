"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastLoginMethod, setLastLoginMethod] = useState<"google" | "email" | null>(null);
  const [resendEmail, setResendEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");
  const signup = searchParams.get("signup");
  const errorParam = searchParams.get("error");
  const emailChanged = searchParams.get("email_changed");
  const messageParam = searchParams.get("message");

  const showResendVerification = (errorParam === "verify_email" || signup === "1") && verified !== "1";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("leadformhub_last_login_method");
      if (stored === "google" || stored === "email") setLastLoginMethod(stored);
    }
  }, []);

  useEffect(() => {
    if (verified === "1" || signup === "1") setError("");
    if (emailChanged === "1" && messageParam) setError("");
    if (errorParam === "verify_email") setError("Please verify your email to access the dashboard. Check your inbox for the verification link.");
    if (errorParam === "invalid_token") setError("Verification link expired or invalid.");
    if (errorParam === "missing_token") setError("Invalid verification link.");
    if (errorParam === "invalid_or_expired_token") setError("Email change link expired or invalid.");
    if (errorParam === "access_denied") setError("Google sign-in was cancelled.");
    if (errorParam === "google_not_configured") setError("Google sign-in is not available.");
    if (errorParam === "invalid_state" || errorParam === "invalid_callback") setError("Sign-in expired or invalid. Please try again.");
    if (errorParam === "token_exchange_failed" || errorParam === "userinfo_failed" || errorParam === "no_access_token") setError("Google sign-in failed. Please try again.");
    if (errorParam === "no_user") setError("Could not create or find your account. Please try again.");
    if (errorParam && !["verify_email", "invalid_token", "missing_token", "invalid_or_expired_token", "access_denied", "google_not_configured", "invalid_state", "invalid_callback", "token_exchange_failed", "userinfo_failed", "no_access_token", "no_user"].includes(errorParam)) setError(decodeURIComponent(errorParam));
  }, [verified, signup, errorParam, emailChanged, messageParam]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      if (typeof window !== "undefined") window.localStorage.setItem("leadformhub_last_login_method", "email");
      const username = data.user?.username;
      router.push(username ? `/${username}/dashboard` : "/");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendVerification(e: React.FormEvent) {
    e.preventDefault();
    setResendMessage(null);
    const toSend = resendEmail.trim() || email.trim();
    if (!toSend) {
      setResendMessage({ type: "error", text: "Enter your email address." });
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
        setResendMessage({ type: "success", text: data.message || "Verification email sent. Check your inbox and spam folder." });
        setResendEmail("");
      } else {
        setResendMessage({ type: "error", text: data.error || "Failed to send." });
      }
    } catch {
      setResendMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setResendLoading(false);
    }
  }

  const canSubmit = email && password;

  return (
    <article className="w-full max-w-full overflow-x-hidden" aria-label="Login form">
      <div className="mx-auto mb-6 flex h-12 shrink-0 items-center justify-center sm:mb-8 sm:h-14">
        <Image src="/logo-w.png" alt="LeadFormHub" width={240} height={60} className="h-full w-auto object-contain object-center" unoptimized />
      </div>
      <h1 className="mt-6 text-center text-2xl font-bold leading-tight tracking-tight text-white sm:mt-8 sm:text-3xl md:text-[2.25rem] lg:text-[2.75rem]" style={{ color: "#ffffff" }}>
        Log in to LeadFormHub
      </h1>

      <p className="mt-2.5 text-center text-base font-normal text-white/80 sm:mt-3">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-white underline-offset-4 transition-colors hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
        >
          Sign up
        </Link>
      </p>

      {signup === "1" && (
        <p className="mt-2.5 text-base text-emerald-400 sm:mt-3" role="status">
          Check your email to verify your account. You can sign in after verification.
        </p>
      )}
      {verified === "1" && (
        <p className="mt-2.5 text-base text-emerald-400 sm:mt-3" role="status">
          Email verified. You can log in now.
        </p>
      )}
      {emailChanged === "1" && messageParam && (
        <p className="mt-2.5 text-base text-emerald-400 sm:mt-3" role="status">
          {decodeURIComponent(messageParam)}
        </p>
      )}
      {error && (
        <p className="mt-2.5 break-words text-base text-red-400 sm:mt-3" role="alert">
          {error}
        </p>
      )}

      {showResendVerification && (
        <div className="mt-4 rounded-xl border border-[#333] bg-[#1a1a1a] p-4 sm:p-5" role="region" aria-label="Resend verification email">
          <p className="text-sm font-medium text-white/90">Didn&apos;t receive the email?</p>
          <p className="mt-1 text-sm text-white/60">Check spam, or request a new verification link below.</p>
          <form onSubmit={handleResendVerification} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="resend-email" className="sr-only">
                Email for resend
              </label>
              <input
                id="resend-email"
                type="email"
                placeholder="Enter your email"
                value={resendEmail || (showResendVerification ? email : "")}
                onChange={(e) => setResendEmail(e.target.value)}
                className="h-11 w-full rounded-lg border border-[#333] bg-[#262626] px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
                disabled={resendLoading}
                aria-describedby="resend-helper resend-status"
              />
            </div>
            <button
              type="submit"
              disabled={resendLoading}
              className="h-11 shrink-0 rounded-lg border border-[#333] bg-[#333] px-4 text-sm font-medium text-white/90 transition-colors hover:bg-[#404040] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white/50 disabled:opacity-50"
              aria-busy={resendLoading}
            >
              {resendLoading ? "Sending…" : "Resend link"}
            </button>
          </form>
          <p id="resend-helper" className="mt-2 text-xs text-white/50">
            Link expires in 24 hours. Wait 2 minutes between requests.
          </p>
          {resendMessage && (
            <p
              id="resend-status"
              className={`mt-2 text-sm ${resendMessage.type === "success" ? "text-emerald-400" : "text-red-400"}`}
              role="status"
            >
              {resendMessage.text}
            </p>
          )}
        </div>
      )}

      <div className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">
        {/* "Last used" tag + social buttons row */}
        <div className="relative">
          {lastLoginMethod === "google" && (
            <span
              className="absolute -top-6 left-0 rounded-md bg-[#262626] px-2.5 py-1 text-sm font-medium text-white/80"
              aria-hidden
            >
              Last used
            </span>
          )}
          <a
            href="/api/auth/google"
            onClick={() => typeof window !== "undefined" && window.localStorage.setItem("leadformhub_last_login_method", "google")}
            className="inline-flex h-12 min-h-[48px] w-full items-center justify-center gap-2.5 rounded-xl border border-[#333] bg-[#262626] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 sm:h-14 sm:min-h-[56px] sm:gap-3 sm:px-5 sm:py-4 sm:text-base"
            aria-label="Log in with Google"
          >
            <svg className="size-5 shrink-0 sm:size-6" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Login with Google
          </a>
        </div>

        {/* "or" separator */}
        <div className="relative" aria-hidden>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#333]" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#0a0a0a] px-3 text-sm font-medium text-white/50">
              or
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative space-y-4 sm:space-y-5">
          {lastLoginMethod === "email" && (
            <span
              className="absolute -top-6 left-0 rounded-md bg-[#262626] px-2.5 py-1 text-xs font-medium text-white/80 sm:text-sm"
              aria-hidden
            >
              Last used
            </span>
          )}
          <div className="space-y-2">
            <label htmlFor="login-email" className="block text-sm font-medium text-white sm:text-base">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="leadformhub@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-xl border border-[#333] bg-[#262626] px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40 sm:h-14 sm:px-5 sm:py-4 [font-size:16px]"
              required
              aria-required="true"
              aria-invalid={!!error}
            />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <label htmlFor="login-password" className="block text-sm font-medium text-white sm:text-base">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-white/60 underline-offset-4 transition-colors hover:text-white/80 hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 sm:text-sm"
              >
                Forgot your password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full rounded-xl border border-[#333] bg-[#262626] py-3 pl-4 pr-12 text-base text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40 sm:h-14 sm:py-4 sm:pl-5 sm:pr-14 [font-size:16px]"
                required
                aria-required="true"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white/50 sm:right-4"
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

          <button
            type="submit"
            disabled={loading || !canSubmit}
            className="h-12 w-full rounded-xl border border-[#333] bg-[#262626] px-4 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-[#333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:px-5 sm:py-4 sm:text-base"
            aria-busy={loading}
            aria-live="polite"
          >
            {loading ? "Signing in…" : "Log In"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-base text-white/50 sm:mt-8">
        By signing in, you agree to our{" "}
        <Link href="/terms-and-conditions" className="underline underline-offset-2 hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white/50">
          Terms
        </Link>
        {" and "}
        <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white/50">
          Privacy Policy
        </Link>
        .
      </p>
    </article>
  );
}

export default function LoginPage() {
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
      <LoginForm />
    </Suspense>
  );
}
