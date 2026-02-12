"use client";

import { useEffect } from "react";

const RECAPTCHA_SCRIPT_URL = (siteKey: string) =>
  `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;

/**
 * Loads reCAPTCHA v3 script at app root so the badge appears on first paint
 * and is ready before any form (login, feedback, support, public form) submits.
 * Other components only use grecaptcha.execute(); they don't inject the script again.
 */
export function RecaptchaScript() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const siteKey =
      typeof process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY === "string"
        ? process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY.trim() || null
        : null;
    if (!siteKey) return;
    if (document.querySelector('script[src^="https://www.google.com/recaptcha/api.js"]')) return;
    const script = document.createElement("script");
    script.src = RECAPTCHA_SCRIPT_URL(siteKey);
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  return null;
}
