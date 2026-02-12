/**
 * Canonical base URL for all email links (reset, verify, delete, welcome, etc.).
 * Prefer APP_URL so links always point to the production site, not Vercel preview URLs.
 */
export function getBaseUrlForEmail(): string {
  const appUrl = process.env.APP_URL?.trim();
  if (appUrl) return appUrl.replace(/\/$/, "");
  if (process.env.NODE_ENV === "development") {
    return process.env.NEXTAUTH_URL?.replace(/\/$/, "") || "http://localhost:3000";
  }
  return "https://leadformhub.com";
}
