import { NextResponse } from "next/server";
import { getRecaptchaSiteKey } from "@/lib/recaptcha";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const siteKey = await getRecaptchaSiteKey();
    return NextResponse.json({ siteKey });
  } catch (error) {
    console.error("[api/recaptcha/site-key][GET] Failed to load site key", error);
    return NextResponse.json({ siteKey: null }, { status: 200 });
  }
}
