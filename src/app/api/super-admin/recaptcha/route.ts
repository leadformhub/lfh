import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSuperAdminSession } from "@/lib/super-admin-auth";
import {
  getSuperAdminRecaptchaSettings,
  saveSuperAdminRecaptchaSettings,
} from "@/lib/super-admin-recaptcha-store";

const saveSchema = z.object({
  siteKey: z.string().min(1),
  secretKey: z.string().min(1),
  enabled: z.boolean().optional(),
});

function getFriendlyRecaptchaSaveError(error: unknown): string {
  const message = error instanceof Error ? error.message : "Unknown error";
  const lower = message.toLowerCase();
  if (lower.includes("unknown table") || lower.includes("doesn't exist")) {
    return "reCAPTCHA settings table is missing. Run Prisma schema sync/migration for the latest schema.";
  }
  if (lower.includes("unknown column")) {
    return "reCAPTCHA settings table is outdated. Run Prisma schema sync/migration for the latest schema.";
  }
  if (lower.includes("data too long")) {
    return "One of the reCAPTCHA fields is too long for the database column.";
  }
  return `Failed to save reCAPTCHA settings. ${message}`;
}

export async function GET() {
  const session = await getSuperAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const recaptcha = await getSuperAdminRecaptchaSettings();
    return NextResponse.json({ recaptcha });
  } catch (error) {
    console.error("[api/super-admin/recaptcha][GET] Failed to load reCAPTCHA settings", error);
    return NextResponse.json({ error: "Failed to load reCAPTCHA settings." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSuperAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const parsed = saveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid reCAPTCHA settings payload" }, { status: 400 });
    }
    await saveSuperAdminRecaptchaSettings(parsed.data);
    return NextResponse.json({ ok: true, message: "reCAPTCHA settings saved." });
  } catch (error) {
    const friendlyError = getFriendlyRecaptchaSaveError(error);
    console.error("[api/super-admin/recaptcha][POST] Failed to save reCAPTCHA settings", error);
    return NextResponse.json({ error: friendlyError }, { status: 500 });
  }
}
