"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, Suspense } from "react";

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Sends a PageView to Facebook Pixel when the route changes (client-side navigation).
 * Only runs when fbq is available and pixel ID is set.
 */
function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!FB_PIXEL_ID || typeof window === "undefined") return;
    const fbq = window.fbq;
    if (typeof fbq !== "function") return;
    fbq("track", "PageView");
  }, [pathname]);

  return null;
}

/**
 * Facebook Pixel. Loads the base code and tracks page views.
 * Set NEXT_PUBLIC_FB_PIXEL_ID (your Pixel ID from Meta Events Manager) in .env to enable.
 *
 * To track custom events (e.g. Lead), use the trackFacebookEvent helper from @/lib/facebook-pixel.
 */
export function FacebookPixel() {
  if (!FB_PIXEL_ID || typeof FB_PIXEL_ID !== "string" || !FB_PIXEL_ID.trim()) {
    return null;
  }

  return (
    <>
      <Script id="fb-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${FB_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}
