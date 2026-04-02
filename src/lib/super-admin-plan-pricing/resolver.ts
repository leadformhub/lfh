import { prisma } from "@/lib/db";
import type { PlanFeatureRow } from "@/lib/plan-features";
import { PLAN_FEATURES } from "@/lib/plan-features";
import type { PlanKey } from "@/lib/plans";
import { PLAN_UNLIMITED_SENTINEL } from "./constants";
import { getDefaultFeatureComparison, getDefaultPlanPricingConfig } from "./defaults";
import { getPlanPricingConfigCached, savePlanPricingConfig } from "./store";
import { planPricingFullConfigSchema, type PlanPricingFullConfig, type PublicPlanPricingPayload } from "./types";

export type EffectivePlanLimits = {
  maxForms: number;
  maxLeadsPerMonth: number | null;
  otpLimit: number | null;
  maxTeamMembers: number;
};

function jsonLimitsToEffective(slice: PlanPricingFullConfig["limits"]["free"]): EffectivePlanLimits {
  return {
    maxForms: slice.maxForms >= PLAN_UNLIMITED_SENTINEL ? Infinity : slice.maxForms,
    maxLeadsPerMonth: slice.maxLeadsPerMonth,
    otpLimit: slice.otpLimit,
    maxTeamMembers: slice.maxTeamMembers >= PLAN_UNLIMITED_SENTINEL ? Infinity : slice.maxTeamMembers,
  };
}

export async function getEffectivePlanLimits(plan: PlanKey): Promise<EffectivePlanLimits> {
  const cfg = await getPlanPricingConfigCached();
  return jsonLimitsToEffective(cfg.limits[plan]);
}

export async function getCheckoutAmountPaise(plan: "pro" | "business"): Promise<number> {
  const cfg = await getPlanPricingConfigCached();
  return cfg.checkoutAmountsPaise[plan];
}

export async function getPlanValidityDaysResolved(): Promise<number> {
  const cfg = await getPlanPricingConfigCached();
  if (cfg.planValidityDays != null) return cfg.planValidityDays;
  return Math.max(1, parseInt(process.env.PLAN_VALIDITY_DAYS ?? "30", 10) || 30);
}

function getFeatureRows(cfg: PlanPricingFullConfig): PlanFeatureRow[] {
  if (cfg.useCustomFeatureComparison && cfg.customFeatureComparison.length > 0) {
    return cfg.customFeatureComparison;
  }
  return PLAN_FEATURES;
}

export async function getPublicPlanPricingPayload(): Promise<PublicPlanPricingPayload> {
  const cfg = await getPlanPricingConfigCached();
  return {
    marketingCards: cfg.marketingCards,
    upgradeBullets: {
      pro: cfg.marketingCards.pro.bullets,
      business: cfg.marketingCards.business.bullets,
    },
    featureComparison: getFeatureRows(cfg),
    schemaOfferPricesInr: {
      pro: Math.round(cfg.checkoutAmountsPaise.pro / 100),
      business: Math.round(cfg.checkoutAmountsPaise.business / 100),
    },
  };
}

async function syncPrismaPlanRows(cfg: PlanPricingFullConfig) {
  const names: PlanKey[] = ["free", "pro", "business"];
  for (const name of names) {
    const L = cfg.limits[name];
    const maxForms = L.maxForms >= PLAN_UNLIMITED_SENTINEL ? 9999 : L.maxForms;
    await prisma.plan.upsert({
      where: { name },
      create: { name, maxForms, otpLimit: L.otpLimit },
      update: { maxForms, otpLimit: L.otpLimit },
    });
  }
}

export async function persistPlanPricingConfigFromSuperAdmin(
  body: unknown,
): Promise<{ ok: true; config: PlanPricingFullConfig } | { ok: false; error: string }> {
  let candidate: PlanPricingFullConfig;
  if (body && typeof body === "object" && "config" in body) {
    const raw = (body as { config: unknown }).config;
    const parsed = planPricingFullConfigSchema.safeParse(raw);
    if (!parsed.success) {
      return { ok: false, error: "Invalid plan pricing configuration." };
    }
    candidate = parsed.data;
  } else {
    const parsed = planPricingFullConfigSchema.safeParse(body);
    if (!parsed.success) {
      return { ok: false, error: "Invalid plan pricing configuration." };
    }
    candidate = parsed.data;
  }

  try {
    await savePlanPricingConfig(candidate);
    await syncPrismaPlanRows(candidate);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: msg };
  }

  return { ok: true, config: candidate };
}

export function buildInitialEditorState(): PlanPricingFullConfig {
  return getDefaultPlanPricingConfig();
}

export { getDefaultFeatureComparison };
