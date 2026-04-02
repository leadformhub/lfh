import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { getDefaultPlanPricingConfig } from "./defaults";
import { planPricingFullConfigSchema, type PlanPricingFullConfig } from "./types";

const SETTINGS_ROW_ID = 1;
const CACHE_TAG = "super-admin-plan-pricing";

function deepMergePlanConfig(
  base: PlanPricingFullConfig,
  patch: Partial<PlanPricingFullConfig>,
): PlanPricingFullConfig {
  return {
    ...base,
    ...patch,
    checkoutAmountsPaise: { ...base.checkoutAmountsPaise, ...patch.checkoutAmountsPaise },
    limits: {
      free: { ...base.limits.free, ...patch.limits?.free },
      pro: { ...base.limits.pro, ...patch.limits?.pro },
      business: { ...base.limits.business, ...patch.limits?.business },
    },
    marketingCards: {
      free: { ...base.marketingCards.free, ...patch.marketingCards?.free },
      pro: { ...base.marketingCards.pro, ...patch.marketingCards?.pro },
      business: { ...base.marketingCards.business, ...patch.marketingCards?.business },
    },
    customFeatureComparison: patch.customFeatureComparison ?? base.customFeatureComparison,
    useCustomFeatureComparison:
      patch.useCustomFeatureComparison ?? base.useCustomFeatureComparison,
  };
}

async function loadRawConfigFromDb(): Promise<PlanPricingFullConfig> {
  const base = getDefaultPlanPricingConfig();
  const row = await prisma.superAdminPlanPricingSetting.findUnique({
    where: { id: SETTINGS_ROW_ID },
  });
  if (!row?.configJson?.trim()) return base;
  try {
    const parsed = JSON.parse(row.configJson) as unknown;
    if (!parsed || typeof parsed !== "object") return base;
    const merged = deepMergePlanConfig(base, parsed as Partial<PlanPricingFullConfig>);
    const checked = planPricingFullConfigSchema.safeParse(merged);
    return checked.success ? checked.data : base;
  } catch {
    return base;
  }
}

export const getPlanPricingConfigCached = unstable_cache(
  () => loadRawConfigFromDb(),
  ["super-admin-plan-pricing-config"],
  { tags: [CACHE_TAG], revalidate: 120 },
);

export async function savePlanPricingConfig(config: PlanPricingFullConfig): Promise<void> {
  await prisma.superAdminPlanPricingSetting.upsert({
    where: { id: SETTINGS_ROW_ID },
    create: { id: SETTINGS_ROW_ID, configJson: JSON.stringify(config) },
    update: { configJson: JSON.stringify(config) },
  });
}

export { CACHE_TAG as PLAN_PRICING_CACHE_TAG };
