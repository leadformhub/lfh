import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSuperAdminSession } from "@/lib/super-admin-auth";
import {
  getSuperAdminSmtpSettings,
  saveSuperAdminSmtpSettings,
} from "@/lib/super-admin-smtp-store";

const saveSchema = z.object({
  host: z.string().min(1),
  port: z.coerce.number().int().min(1).max(65535),
  username: z.string().min(1),
  password: z.string().min(1),
  fromEmail: z.string().email(),
  fromName: z.string().optional(),
  supportEmail: z.union([z.string().email(), z.literal("")]).optional(),
  secure: z.boolean().optional(),
});

function getFriendlySmtpSaveError(error: unknown): string {
  const message = error instanceof Error ? error.message : "Unknown error";
  const lower = message.toLowerCase();

  if (lower.includes("unknown column") && lower.includes("secure")) {
    return "SMTP settings table is missing the 'secure' column. Run Prisma schema sync/migration for the latest schema.";
  }
  if (lower.includes("unknown column") && lower.includes("support_email")) {
    return "SMTP settings table is missing the 'support_email' column. Run Prisma schema sync/migration for the latest schema.";
  }
  if (lower.includes("data too long")) {
    return "One of the SMTP fields is too long for the database column. Check host/username/password/from values.";
  }
  if (lower.includes("invalid") && lower.includes("port")) {
    return "Invalid SMTP port. Use a number between 1 and 65535.";
  }

  return `Failed to save SMTP settings. ${message}`;
}

export async function GET() {
  const session = await getSuperAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const smtp = await getSuperAdminSmtpSettings();
    return NextResponse.json({ smtp });
  } catch (error) {
    console.error("[api/super-admin/smtp][GET] Failed to load SMTP settings", error);
    return NextResponse.json({ error: "Failed to load SMTP settings." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSuperAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = saveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid SMTP settings payload" }, { status: 400 });
    }

    await saveSuperAdminSmtpSettings(parsed.data);
    return NextResponse.json({ ok: true, message: "SMTP settings saved." });
  } catch (error) {
    const friendlyError = getFriendlySmtpSaveError(error);
    console.error("[api/super-admin/smtp][POST] Failed to save SMTP settings", error);
    return NextResponse.json({ error: friendlyError }, { status: 500 });
  }
}
