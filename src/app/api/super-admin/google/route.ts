import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSuperAdminSession } from "@/lib/super-admin-auth";
import {
  getSuperAdminGoogleSettings,
  saveSuperAdminGoogleSettings,
} from "@/lib/super-admin-google-store";

const saveSchema = z.object({
  clientId: z.string().min(1),
  clientSecret: z.string().min(1),
  enabled: z.boolean().optional(),
});

function getFriendlyGoogleSaveError(error: unknown): string {
  const message = error instanceof Error ? error.message : "Unknown error";
  const lower = message.toLowerCase();
  if (lower.includes("unknown table") || lower.includes("doesn't exist")) {
    return "Google settings table is missing. Run Prisma schema sync/migration for the latest schema.";
  }
  if (lower.includes("unknown column")) {
    return "Google settings table is outdated. Run Prisma schema sync/migration for the latest schema.";
  }
  if (lower.includes("data too long")) {
    return "One of the Google OAuth fields is too long for the database column.";
  }
  return `Failed to save Google OAuth settings. ${message}`;
}

export async function GET() {
  const session = await getSuperAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const google = await getSuperAdminGoogleSettings();
    return NextResponse.json({ google });
  } catch (error) {
    console.error("[api/super-admin/google][GET] Failed to load Google OAuth settings", error);
    return NextResponse.json({ error: "Failed to load Google OAuth settings." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSuperAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const parsed = saveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid Google OAuth settings payload" }, { status: 400 });
    }
    await saveSuperAdminGoogleSettings(parsed.data);
    return NextResponse.json({ ok: true, message: "Google OAuth settings saved." });
  } catch (error) {
    const friendlyError = getFriendlyGoogleSaveError(error);
    console.error("[api/super-admin/google][POST] Failed to save Google OAuth settings", error);
    return NextResponse.json({ error: friendlyError }, { status: 500 });
  }
}
