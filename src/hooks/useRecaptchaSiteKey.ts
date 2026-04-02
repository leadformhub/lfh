"use client";

import { useEffect, useState } from "react";

export function useRecaptchaSiteKey() {
  const [siteKey, setSiteKey] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/recaptcha/site-key", { method: "GET" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || cancelled) return;
        const key = typeof data?.siteKey === "string" ? data.siteKey.trim() : "";
        setSiteKey(key || null);
      } catch {
        // Keep recaptcha disabled if key cannot be loaded.
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return siteKey;
}
