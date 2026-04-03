import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSuperAdminSession } from "@/lib/super-admin-auth";
import {
  getSuperAdminTrackingSettings,
  saveSuperAdminTrackingSettings,
} from "@/lib/super-admin-tracking-store";

const saveSchema = z.object({
  gaMeasurementId: z.string().min(1),
  fbPixelId: z.string().min(1),
  enabled: z.boolean().optional(),
});

function getFriendlyTrackingSaveError(error: unknown): string {
  const message = error instanceof Error ? error.message : "Unknown error";
  const lower = message.toLowerCase();
  if (lower.includes("unknown table") || lower.includes("doesn't exist")) {
    return "Tracking settings table is missing. Run Prisma schema sync/migration for the latest schema.";
  }
  if (lower.includes("unknown column")) {
    return "Tracking settings table is outdated. Run Prisma schema sync/migration for the latest schema.";
  }
  if (lower.includes("data too long")) {
    return "One of the tracking IDs is too long for the database column.";
  }
  return `Failed to save tracking settings. ${message}`;
}

export async function GET() {
  const session = await getSuperAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const tracking = await getSuperAdminTrackingSettings();
    return NextResponse.json({ tracking });
  } catch (error) {
    console.error("[api/super-admin/tracking][GET] Failed to load tracking settings", error);
    return NextResponse.json({ error: "Failed to load tracking settings." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSuperAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const parsed = saveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid tracking settings payload" }, { status: 400 });
    }
    await saveSuperAdminTrackingSettings(parsed.data);
    return NextResponse.json({ ok: true, message: "Tracking settings saved." });
  } catch (error) {
    const friendlyError = getFriendlyTrackingSaveError(error);
    console.error("[api/super-admin/tracking][POST] Failed to save tracking settings", error);
    return NextResponse.json({ error: friendlyError }, { status: 500 });
  }
}
