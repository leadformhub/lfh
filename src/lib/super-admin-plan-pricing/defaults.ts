import { getPlanFeatureBullets } from "@/lib/plan-features";
import { PLAN_LIMITS, type PlanKey } from "@/lib/plans";
import { PLAN_FEATURES } from "@/lib/plan-features";
import { PLAN_UNLIMITED_SENTINEL } from "./constants";
import type { PlanPricingFullConfig } from "./types";

function limitToJson(plan: PlanKey) {
  const L = PLAN_LIMITS[plan];
  return {
    maxForms: L.maxForms === Infinity ? PLAN_UNLIMITED_SENTINEL : L.maxForms,
    maxLeadsPerMonth: L.maxLeadsPerMonth,
    otpLimit: L.otpLimit,
    maxTeamMembers: L.maxTeamMembers === Infinity ? PLAN_UNLIMITED_SENTINEL : L.maxTeamMembers,
  };
}

/** Baseline config (code defaults). Merged with DB row on read. */
export function getDefaultPlanPricingConfig(): PlanPricingFullConfig {
  return {
    version: 1,
    checkoutAmountsPaise: {
      pro: 29_900,
      business: 99_900,
    },
    planValidityDays: null,
    limits: {
      free: limitToJson("free"),
      pro: limitToJson("pro"),
      business: limitToJson("business"),
    },
    marketingCards: {
      free: {
        name: "Free",
        priceLabel: "₹0",
        strikethroughLabel: null,
        period: "(Forever)",
        description: "Ideal for testing and early use",
        cta: "Start Free",
        highlighted: false,
        bullets: getPlanFeatureBullets("free"),
      },
      pro: {
        name: "Pro",
        priceLabel: "₹299",
        strikethroughLabel: "₹2,999",
        period: "/month",
        description: "For growing teams",
        cta: "Start Free, Upgrade Later",
        highlighted: true,
        bullets: getPlanFeatureBullets("pro"),
      },
      business: {
        name: "Business",
        priceLabel: "₹999",
        strikethroughLabel: "₹9,999",
        period: "/month",
        description: "For agencies & scale",
        cta: "Start Free, Upgrade Later",
        highlighted: false,
        bullets: getPlanFeatureBullets("business"),
      },
    },
    useCustomFeatureComparison: false,
    customFeatureComparison: [],
  };
}

export function getDefaultFeatureComparison() {
  return PLAN_FEATURES.map((row) => ({ ...row }));
}
