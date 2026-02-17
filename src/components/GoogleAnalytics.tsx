"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, Suspense } from "react";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Sends a page_view to GA4 when the route changes (client-side navigation).
 * Only runs when gtag is available and measurement ID is set.
 */
function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || typeof window === "undefined") return;
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag !== "function") return;
    gtag("config", GA_MEASUREMENT_ID, {
      page_path: pathname ?? window.location.pathname,
    });
  }, [pathname]);

  return null;
}

/**
 * Google Analytics (GA4). Loads gtag.js and tracks page views.
 * Set NEXT_PUBLIC_GA_MEASUREMENT_ID (e.g. G-XXXXXXXXXX) in .env to enable.
 */
export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID || typeof GA_MEASUREMENT_ID !== "string" || !GA_MEASUREMENT_ID.trim()) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}
