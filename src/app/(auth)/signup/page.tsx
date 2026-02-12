"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const RECAPTCHA_SCRIPT_URL = (siteKey: string) =>
  `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const [recaptchaLoading, setRecaptchaLoading] = useState(false);
  const router = useRouter();

  const recaptchaSiteKey =
    typeof process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY === "string"
      ? process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY.trim() || null
      : null;
  const recaptchaEnabled = Boolean(recaptchaSiteKey);

  useEffect(() => {
    if (!recaptchaSiteKey || typeof window === "undefined") return;
    const markReady = () => {
      setRecaptchaReady(true);
      setRecaptchaLoading(false);
    };
    const scriptEl = document.querySelector('script[src^="https://www.google.com/recaptcha/api.js"]');
    if (scriptEl) {
      setRecaptchaLoading(true);
      const g = (window as unknown as { grecaptcha?: { ready: (cb: () => void) => void } }).grecaptcha;
      if (g?.ready) {
        g.ready(markReady);
        return;
      }
      const id = setInterval(() => {
        const gr = (window as unknown as { grecaptcha?: { ready: (cb: () => void) => void } }).grecaptcha;
        if (gr?.ready) {
          clearInterval(id);
          gr.ready(markReady);
        }
      }, 100);
      return () => clearInterval(id);
    }
    setRecaptchaLoading(true);
    const script = document.createElement("script");
    script.src = RECAPTCHA_SCRIPT_URL(recaptchaSiteKey);
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const g = (window as unknown as { grecaptcha?: { ready: (cb: () => void) => void } }).grecaptcha;
      if (g?.ready) g.ready(markReady);
      else markReady();
    };
    script.onerror = () => setRecaptchaLoading(false);
    document.head.appendChild(script);
  }, [recaptchaSiteKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get("error");
    if (errorParam === "access_denied") setError("Google sign-in was cancelled.");
    else if (errorParam === "google_not_configured") setError("Google sign-in is not available.");
    else if (errorParam === "invalid_state" || errorParam === "invalid_callback") setError("Sign-in expired or invalid. Please try again.");
    else if (["token_exchange_failed", "userinfo_failed", "no_access_token", "no_user"].includes(errorParam || "")) setError("Google sign-in failed. Please try again.");
    else if (errorParam) setError(decodeURIComponent(errorParam));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (recaptchaEnabled && recaptchaSiteKey) {
      if (!recaptchaReady) {
        setError("reCAPTCHA is still loading. Please wait a moment and try again.");
        return;
      }
      const g = (window as unknown as { grecaptcha?: { ready: (cb: () => void) => void; execute: (key: string, opts: { action: string }) => Promise<string> } }).grecaptcha;
      if (!g) {
        setError("reCAPTCHA could not run. Please refresh and try again.");
        return;
      }
    }
    setLoading(true);
    try {
      let recaptchaToken: string | undefined;
      if (recaptchaEnabled && recaptchaSiteKey && typeof window !== "undefined") {
        const g = (window as unknown as { grecaptcha?: { ready: (cb: () => void) => void; execute: (key: string, opts: { action: string }) => Promise<string> } }).grecaptcha;
        try {
          recaptchaToken = await new Promise<string>((resolve, reject) => {
            g!.ready(() => {
              g!.execute(recaptchaSiteKey, { action: "signup" }).then(resolve).catch(reject);
            });
          });
        } catch {
          setError("reCAPTCHA could not run. Please refresh and try again.");
          setLoading(false);
          return;
        }
        if (!recaptchaToken?.trim()) {
          setError("reCAPTCHA verification failed. Please try again.");
          setLoading(false);
          return;
        }
      }
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, ...(recaptchaToken ? { recaptchaToken } : {}) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "object" ? Object.values(data.error).flat().join(" ") : data.error || "Signup failed");
        return;
      }
      if (data.requiresVerification) {
        router.push("/login?signup=1");
        router.refresh();
        return;
      }
      const u = data.user?.username;
      router.push(u ? `/${u}/dashboard` : "/");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "h-12 w-full rounded-xl border border-[#333] bg-[#262626] px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40 sm:h-14 sm:px-5 sm:py-4 [font-size:16px]";
  const canSubmit = Boolean(email.trim() && password);

  return (
    <article className="w-full max-w-full overflow-x-hidden" aria-label="Sign up form">
      <div className="mx-auto mb-6 flex h-12 shrink-0 items-center justify-center sm:mb-8 sm:h-14">
        <Image src="/logo-w.png" alt="LeadFormHub" width={240} height={60} className="h-full w-auto object-contain object-center" unoptimized loading="eager" />
      </div>
      <h1 className="mt-6 text-center text-2xl font-bold leading-tight tracking-tight text-white sm:mt-8 sm:text-3xl md:text-[2.25rem] lg:text-[2.75rem]" style={{ color: "#ffffff" }}>
        Create A LeadFormHub Account
      </h1>

      <p className="mt-2.5 text-center text-base font-normal text-white/80 sm:mt-3">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-white underline-offset-4 transition-colors hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
        >
          Log in
        </Link>
      </p>

      {error && (
        <p className="mt-2.5 break-words text-base text-red-400 sm:mt-3" role="alert">
          {error}
        </p>
      )}

      <div className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">
        <a
          href="/api/auth/google?from=signup"
          className="inline-flex h-12 min-h-[48px] w-full items-center justify-center gap-2.5 rounded-xl border border-[#333] bg-[#262626] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 sm:h-14 sm:min-h-[56px] sm:gap-3 sm:px-5 sm:py-4 sm:text-base"
          aria-label="Sign up with Google"
        >
          <svg className="size-5 shrink-0 sm:size-6" viewBox="0 0 24 24" aria-hidden>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign up with Google
        </a>

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

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <label htmlFor="signup-email" className="block text-sm font-medium text-white sm:text-base">
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="leadformhub@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                required
                aria-required="true"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="signup-password" className="block text-sm font-medium text-white sm:text-base">
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                className={inputClass}
                required
                aria-required="true"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !canSubmit}
            className="h-12 w-full rounded-xl border border-[#333] bg-[#262626] px-4 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-[#333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:px-5 sm:py-4 sm:text-base"
            aria-busy={loading}
            aria-live="polite"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>

          {recaptchaEnabled && (
            <p className="text-center text-xs text-white/50" role="status" aria-live="polite">
              {recaptchaLoading && !recaptchaReady ? (
                <>Loading reCAPTCHA…</>
              ) : recaptchaReady ? (
                <>Protected by reCAPTCHA</>
              ) : null}
            </p>
          )}
        </form>
      </div>

      <p className="mt-6 text-center text-base text-white/50 sm:mt-8">
        By signing up, you agree to our{" "}
        <Link href="/terms-and-conditions" className="underline underline-offset-2 hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white/50">
          Terms
        </Link>
        ,{" "}
        <Link href="/terms-and-conditions" className="underline underline-offset-2 hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white/50">
          Acceptable Use
        </Link>
        , and{" "}
        <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white/50">
          Privacy Policy
        </Link>
        .
      </p>
    </article>
  );
}
