/**
 * Canonical base URL for all email links (reset, verify, delete, welcome, team invite, etc.).
 * In development we always use localhost so invite/verify links work locally; in production use APP_URL or default.
 */
export function getBaseUrlForEmail(): string {
  if (process.env.NODE_ENV === "development") {
    return process.env.NEXTAUTH_URL?.replace(/\/$/, "") || "http://localhost:3000";
  }
  const appUrl = process.env.APP_URL?.trim();
  if (appUrl) return appUrl.replace(/\/$/, "");
  return "https://leadformhub.com";
}
