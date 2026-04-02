import { z } from "zod";
import { PLAN_FEATURE_CATEGORIES } from "@/lib/plan-features";
import { PLAN_UNLIMITED_SENTINEL } from "./constants";

const categoryEnum = z.enum(PLAN_FEATURE_CATEGORIES);

const planLimitsJsonSchema = z.object({
  maxForms: z.number().int().min(0).max(PLAN_UNLIMITED_SENTINEL),
  maxLeadsPerMonth: z.number().int().min(0).nullable(),
  otpLimit: z.number().int().min(0).nullable(),
  maxTeamMembers: z.number().int().min(0).max(PLAN_UNLIMITED_SENTINEL),
});

const marketingCardSchema = z.object({
  name: z.string().min(1).max(120),
  priceLabel: z.string().min(1).max(64),
  strikethroughLabel: z.string().max(64).nullable(),
  period: z.string().min(1).max(64),
  description: z.string().min(1).max(500),
  cta: z.string().min(1).max(120),
  highlighted: z.boolean(),
  bullets: z.array(z.string().min(1).max(500)).max(40),
});

const featureRowSchema = z.object({
  category: categoryEnum.optional(),
  label: z.string().min(1).max(300),
  free: z.union([z.string().max(200), z.boolean()]),
  pro: z.union([z.string().max(200), z.boolean()]),
  business: z.union([z.string().max(200), z.boolean()]),
});

export const planPricingFullConfigSchema = z.object({
  version: z.literal(1),
  checkoutAmountsPaise: z.object({
    pro: z.number().int().min(100).max(100_000_000),
    business: z.number().int().min(100).max(100_000_000),
  }),
  /** Null = use PLAN_VALIDITY_DAYS env default in payment fulfillment. */
  planValidityDays: z.number().int().min(1).max(3650).nullable(),
  limits: z.object({
    free: planLimitsJsonSchema,
    pro: planLimitsJsonSchema,
    business: planLimitsJsonSchema,
  }),
  marketingCards: z.object({
    free: marketingCardSchema,
    pro: marketingCardSchema,
    business: marketingCardSchema,
  }),
  useCustomFeatureComparison: z.boolean(),
  customFeatureComparison: z.array(featureRowSchema).max(200),
});

export type PlanPricingFullConfig = z.infer<typeof planPricingFullConfigSchema>;

export type PublicPlanPricingPayload = {
  marketingCards: PlanPricingFullConfig["marketingCards"];
  upgradeBullets: { pro: string[]; business: string[] };
  featureComparison: import("@/lib/plan-features").PlanFeatureRow[];
  schemaOfferPricesInr: { pro: number; business: number };
};
