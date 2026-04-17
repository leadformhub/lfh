"use client";

import { useEffect, useState } from "react";

let cachedSiteKey: string | null | undefined;
let siteKeyPromise: Promise<string | null> | null = null;

async function fetchRecaptchaSiteKey(): Promise<string | null> {
  try {
    const res = await fetch("/api/recaptcha/site-key", { method: "GET" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return null;
    const key = typeof data?.siteKey === "string" ? data.siteKey.trim() : "";
    return key || null;
  } catch {
    return null;
  }
}

function getRecaptchaSiteKeyCached(): Promise<string | null> {
  if (cachedSiteKey !== undefined) return Promise.resolve(cachedSiteKey);
  if (!siteKeyPromise) {
    siteKeyPromise = fetchRecaptchaSiteKey().then((key) => {
      cachedSiteKey = key;
      siteKeyPromise = null;
      return key;
    });
  }
  return siteKeyPromise;
}

export function useRecaptchaSiteKey() {
  const [siteKey, setSiteKey] = useState<string | null>(cachedSiteKey ?? null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const key = await getRecaptchaSiteKeyCached();
      if (cancelled) return;
      setSiteKey(key);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return siteKey;
}
