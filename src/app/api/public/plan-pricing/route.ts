import { NextResponse } from "next/server";
import { getPublicPlanPricingPayload } from "@/lib/super-admin-plan-pricing";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await getPublicPlanPricingPayload();
    return NextResponse.json(payload);
  } catch (e) {
    console.error("[api/public/plan-pricing][GET]", e);
    return NextResponse.json({ error: "Failed to load pricing." }, { status: 500 });
  }
}
