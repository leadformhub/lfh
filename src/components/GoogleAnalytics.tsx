"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, Suspense } from "react";

/**
 * Sends a page_view to GA4 when the route changes (client-side navigation).
 * Only runs when gtag is available and measurement ID is set.
 */
function PageViewTracker({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!measurementId || typeof window === "undefined") return;
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag !== "function") return;
    gtag("config", measurementId, {
      page_path: pathname ?? window.location.pathname,
    });
  }, [measurementId, pathname]);

  return null;
}

export function GoogleAnalytics({ measurementId }: { measurementId?: string }) {
  const effectiveMeasurementId = measurementId?.trim() || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "";
  if (!effectiveMeasurementId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${effectiveMeasurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          window.__LFH_GA_MEASUREMENT_ID = '${effectiveMeasurementId}';
          gtag('config', '${effectiveMeasurementId}');
        `}
      </Script>
      <Suspense fallback={null}>
        <PageViewTracker measurementId={effectiveMeasurementId} />
      </Suspense>
    </>
  );
}
