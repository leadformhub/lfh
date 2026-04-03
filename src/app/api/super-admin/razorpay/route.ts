import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSuperAdminSession } from "@/lib/super-admin-auth";
import {
  getSuperAdminRazorpaySettings,
  saveSuperAdminRazorpaySettings,
} from "@/lib/super-admin-razorpay-store";

const saveSchema = z.object({
  keyId: z.string().min(1),
  keySecret: z.string().min(1),
  enabled: z.boolean().optional(),
});

function getFriendlyRazorpaySaveError(error: unknown): string {
  const message = error instanceof Error ? error.message : "Unknown error";
  const lower = message.toLowerCase();
  if (lower.includes("unknown table") || lower.includes("doesn't exist")) {
    return "Razorpay settings table is missing. Run Prisma schema sync/migration for the latest schema.";
  }
  if (lower.includes("unknown column")) {
    return "Razorpay settings table is outdated. Run Prisma schema sync/migration for the latest schema.";
  }
  if (lower.includes("data too long")) {
    return "Razorpay key values are too long for the database column.";
  }
  return `Failed to save Razorpay settings. ${message}`;
}

export async function GET() {
  const session = await getSuperAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const razorpay = await getSuperAdminRazorpaySettings();
    return NextResponse.json({ razorpay });
  } catch (error) {
    console.error("[api/super-admin/razorpay][GET] Failed to load Razorpay settings", error);
    return NextResponse.json({ error: "Failed to load Razorpay settings." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSuperAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const parsed = saveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid Razorpay settings payload" }, { status: 400 });
    }
    await saveSuperAdminRazorpaySettings(parsed.data);
    return NextResponse.json({ ok: true, message: "Razorpay settings saved." });
  } catch (error) {
    const friendlyError = getFriendlyRazorpaySaveError(error);
    console.error("[api/super-admin/razorpay][POST] Failed to save Razorpay settings", error);
    return NextResponse.json({ error: friendlyError }, { status: 500 });
  }
}
