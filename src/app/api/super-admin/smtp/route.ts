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

export async function GET() {
  const session = await getSuperAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const smtp = await getSuperAdminSmtpSettings();
    return NextResponse.json({ smtp });
  } catch {
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
  } catch {
    return NextResponse.json({ error: "Failed to save SMTP settings." }, { status: 500 });
  }
}
