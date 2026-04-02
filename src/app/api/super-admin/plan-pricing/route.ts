import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getSuperAdminSession } from "@/lib/super-admin-auth";
import {
  getPlanPricingConfigCached,
  persistPlanPricingConfigFromSuperAdmin,
  PLAN_PRICING_CACHE_TAG,
} from "@/lib/super-admin-plan-pricing";

export async function GET() {
  const session = await getSuperAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const config = await getPlanPricingConfigCached();
    return NextResponse.json({ config });
  } catch (e) {
    console.error("[api/super-admin/plan-pricing][GET]", e);
    return NextResponse.json({ error: "Failed to load plan pricing settings." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSuperAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const result = await persistPlanPricingConfigFromSuperAdmin(body);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    revalidateTag(PLAN_PRICING_CACHE_TAG, "max");
    return NextResponse.json({ ok: true, message: "Plan pricing saved.", config: result.config });
  } catch (e) {
    console.error("[api/super-admin/plan-pricing][POST]", e);
    return NextResponse.json({ error: "Failed to save plan pricing settings." }, { status: 500 });
  }
}
