/**
 * Helpers for Facebook Pixel custom events.
 * Use these from client components after the pixel is loaded (e.g. on form submit success).
 *
 * Requires an active pixel ID (from Super Admin settings or NEXT_PUBLIC_FB_PIXEL_ID).
 */

/** In client components Next inlines NEXT_PUBLIC_* at build time. */
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    __LFH_FB_PIXEL_ID?: string;
  }
}

/**
 * Fire a standard or custom Facebook Pixel event.
 * Common events: 'Lead', 'CompleteRegistration', 'Purchase', 'ViewContent', 'Contact'.
 */
export function trackFacebookEvent(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const activePixelId = window.__LFH_FB_PIXEL_ID?.trim() || FB_PIXEL_ID?.trim();
  if (!activePixelId) return;
  const fbq = window.fbq;
  if (typeof fbq !== "function") return;
  if (params && Object.keys(params).length > 0) {
    fbq("track", eventName, params);
  } else {
    fbq("track", eventName);
  }
}

/**
 * Fire the standard "Lead" event when a lead is captured (e.g. form submission).
 * Call this from the client after a successful form submit.
 */
export function trackFacebookLead(params?: { content_name?: string; value?: number; currency?: string }): void {
  trackFacebookEvent("Lead", params);
}
