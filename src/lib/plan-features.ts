import type { PlanKey } from "./plans";

/** Display value for a feature: string (e.g. "3", "50/month") or boolean (included / not included) */
export type FeatureValue = string | boolean;

export type PlanFeatureRow = {
  /** Feature category for grouping (optional) */
  category?: "Forms & leads" | "Verification" | "Dashboard & export" | "Sharing & embed" | "Integrations & API" | "Support";
  /** Feature label shown in UI */
  label: string;
  /** Value per plan: string for limits, true/false for included/not */
  free: FeatureValue;
  pro: FeatureValue;
  business: FeatureValue;
};

/**
 * Maximum list of features for all plans. Single source of truth for pricing/upgrade UI.
 * Keep in sync with PLAN_LIMITS in plans.ts for numeric limits.
 */
export const PLAN_FEATURES: PlanFeatureRow[] = [
  // Forms & leads
  { category: "Forms & leads", label: "Forms", free: "3", pro: "Unlimited", business: "Unlimited" },
  { category: "Forms & leads", label: "Leads per month", free: "50", pro: "Unlimited", business: "Unlimited" },
  { category: "Forms & leads", label: "Form fields (text, email, phone, dropdown, radio, checkbox, textarea, file)", free: true, pro: true, business: true },
  { category: "Forms & leads", label: "Custom form title & description", free: true, pro: true, business: true },
  { category: "Forms & leads", label: "Required / optional fields", free: true, pro: true, business: true },
  { category: "Forms & leads", label: "Redirect after submit", free: true, pro: true, business: true },
  { category: "Forms & leads", label: "Email alert on new lead", free: false, pro: true, business: true },
  { category: "Forms & leads", label: "Form builder (drag, fields, settings)", free: true, pro: true, business: true },
  // Verification
  { category: "Verification", label: "OTP verification (SMS)", free: false, pro: "100/month", business: "1,000/month" },
  { category: "Verification", label: "Phone verification before submit", free: false, pro: true, business: true },
  // Dashboard & export
  { category: "Dashboard & export", label: "Unified leads dashboard", free: true, pro: true, business: true },
  { category: "Dashboard & export", label: "Filter leads by form", free: true, pro: true, business: true },
  { category: "Dashboard & export", label: "Search leads", free: true, pro: true, business: true },
  { category: "Dashboard & export", label: "Export leads to CSV", free: true, pro: true, business: true },
  { category: "Dashboard & export", label: "Analytics (views, submissions, conversion)", free: false, pro: true, business: true },
  { category: "Dashboard & export", label: "Submissions over time (last 30 days)", free: false, pro: true, business: true },
  { category: "Dashboard & export", label: "Top forms by submissions", free: false, pro: true, business: true },
  { category: "Dashboard & export", label: "Recent activity feed", free: false, pro: true, business: true },
  { category: "Dashboard & export", label: "Column visibility (show/hide fields in table)", free: true, pro: true, business: true },
  // Sharing & embed
  { category: "Sharing & embed", label: "Branded form URL (leadformhub.com/yourbrand)", free: true, pro: true, business: true },
  { category: "Sharing & embed", label: "Form embed (iframe code)", free: true, pro: true, business: true },
  { category: "Sharing & embed", label: "Responsive forms (mobile & desktop)", free: true, pro: true, business: true },
  { category: "Sharing & embed", label: "Remove “Powered by LeadFormHub” branding", free: false, pro: true, business: true },
  // Integrations & API
  { category: "Integrations & API", label: "Razorpay payments (upgrade)", free: true, pro: true, business: true },
  { category: "Integrations & API", label: "CRM integrations", free: false, pro: false, business: true },
  { category: "Integrations & API", label: "API access", free: false, pro: false, business: true },
  { category: "Integrations & API", label: "Webhooks", free: false, pro: false, business: true },
  // Support
  { category: "Support", label: "Help & FAQ", free: true, pro: true, business: true },
  { category: "Support", label: "Email support", free: true, pro: true, business: true },
  { category: "Support", label: "Priority support", free: false, pro: true, business: true },
  { category: "Support", label: "Dedicated support", free: false, pro: false, business: true },
];

export const PLAN_FEATURE_CATEGORIES = [
  "Forms & leads",
  "Verification",
  "Dashboard & export",
  "Sharing & embed",
  "Integrations & API",
  "Support",
] as const;

/** Get feature value for a plan (normalized to string or boolean for display) */
export function getFeatureValue(row: PlanFeatureRow, plan: PlanKey): FeatureValue {
  switch (plan) {
    case "free": return row.free;
    case "pro": return row.pro;
    case "business": return row.business;
    default: return row.free;
  }
}

/** Format feature value for display (checkmark, limit text, or "—") */
export function formatFeatureValue(value: FeatureValue): string {
  if (value === true) return "✓";
  if (value === false) return "—";
  return String(value);
}

/** Analytics (analytics page, submissions-over-time chart, etc.) is Pro/Business only. */
export function canUseAnalytics(plan: PlanKey): boolean {
  return plan === "pro" || plan === "business";
}

/** Email alert on new lead / notify by email is Pro/Business only. */
export function canUseEmailAlertOnLead(plan: PlanKey): boolean {
  return plan === "pro" || plan === "business";
}

/** Short bullet list for pricing cards (e.g. landing page). Key points per plan. Free: no analytics. */
export function getPlanFeatureBullets(plan: PlanKey): string[] {
  switch (plan) {
    case "free":
      return ["3 forms", "50 leads/month", "CSV export", "Dashboard", "Form embed", "Form builder", "Redirect after submit"];
    case "pro":
      return ["Everything in Free", "Unlimited forms", "Unlimited leads", "100 OTP/month", "Analytics", "Remove branding", "Priority support"];
    case "business":
      return ["Everything in Pro", "1,000 OTP/month", "CRM integrations", "API & webhooks", "Dedicated support"];
    default:
      return getPlanFeatureBullets("free");
  }
}
