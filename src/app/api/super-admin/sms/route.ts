import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSuperAdminSession } from "@/lib/super-admin-auth";
import {
  getSuperAdminSmsSettings,
  saveSuperAdminSmsSettings,
} from "@/lib/super-admin-sms-store";

const saveSchema = z.object({
  fast2smsQuickApiKey: z.string().min(1),
  enabled: z.boolean().optional(),
});

function getFriendlySmsSaveError(error: unknown): string {
  const message = error instanceof Error ? error.message : "Unknown error";
  const lower = message.toLowerCase();
  if (lower.includes("unknown table") || lower.includes("doesn't exist")) {
    return "SMS settings table is missing. Run Prisma schema sync/migration for the latest schema.";
  }
  if (lower.includes("unknown column")) {
    return "SMS settings table is outdated. Run Prisma schema sync/migration for the latest schema.";
  }
  if (lower.includes("data too long")) {
    return "Fast2SMS API key is too long for the database column.";
  }
  return `Failed to save SMS settings. ${message}`;
}

export async function GET() {
  const session = await getSuperAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const sms = await getSuperAdminSmsSettings();
    return NextResponse.json({ sms });
  } catch (error) {
    console.error("[api/super-admin/sms][GET] Failed to load SMS settings", error);
    return NextResponse.json({ error: "Failed to load SMS settings." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSuperAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const parsed = saveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid SMS settings payload" }, { status: 400 });
    }
    await saveSuperAdminSmsSettings(parsed.data);
    return NextResponse.json({ ok: true, message: "SMS settings saved." });
  } catch (error) {
    const friendlyError = getFriendlySmsSaveError(error);
    console.error("[api/super-admin/sms][POST] Failed to save SMS settings", error);
    return NextResponse.json({ error: friendlyError }, { status: 500 });
  }
}
