import { NextRequest, NextResponse } from "next/server";
import { lookup } from "node:dns/promises";
import nodemailer from "nodemailer";
import { z } from "zod";
import { getSuperAdminSession } from "@/lib/super-admin-auth";
import { getSuperAdminSmtpSettings } from "@/lib/super-admin-smtp-store";

const bodySchema = z.object({
  host: z.string().optional(),
  port: z.coerce.number().int().min(1).max(65535).optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  fromEmail: z.string().email().optional(),
  fromName: z.string().optional(),
  secure: z.boolean().optional(),
  testToEmail: z.string().email(),
});

export async function POST(req: NextRequest) {
  const session = await getSuperAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid SMTP test payload" }, { status: 400 });
    }

    const saved = await getSuperAdminSmtpSettings();
    const merged = {
      host: parsed.data.host?.trim() || saved?.host || "",
      port: parsed.data.port ?? saved?.port ?? 587,
      username: parsed.data.username?.trim() || saved?.username || "",
      password: parsed.data.password || saved?.password || "",
      fromEmail: parsed.data.fromEmail?.trim() || saved?.fromEmail || "",
      fromName: parsed.data.fromName?.trim() || saved?.fromName || "",
      secure: parsed.data.secure ?? saved?.secure ?? false,
      testToEmail: parsed.data.testToEmail.trim(),
    };

    if (
      !merged.host ||
      !merged.port ||
      !merged.username ||
      !merged.password ||
      !merged.fromEmail
    ) {
      return NextResponse.json(
        { error: "SMTP settings are incomplete. Fill fields or save SMTP settings first." },
        { status: 400 }
      );
    }

    const ipv4ResolvedHost = await lookup(merged.host, { family: 4 }).then((r) => r.address).catch(() => merged.host);

    async function sendWithSecureMode(secureMode: boolean) {
      const transporter = nodemailer.createTransport({
        host: ipv4ResolvedHost,
        port: merged.port,
        secure: secureMode,
        tls: {
          servername: merged.host,
        },
        auth: {
          user: merged.username,
          pass: merged.password,
        },
      });

      await transporter.verify();
      await transporter.sendMail({
        from,
        to: merged.testToEmail,
        subject: "SMTP test email from Super Admin",
        text: "SMTP test successful. Your Super Admin SMTP configuration can send emails.",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2 style="margin: 0 0 12px;">SMTP Test Email</h2>
            <p style="margin: 0 0 8px;">This confirms your SMTP configuration is working.</p>
            <p style="margin: 0;">Sent from Super Admin panel.</p>
          </div>
        `,
      });
      return secureMode;
    }

    const from = merged.fromName
      ? `${merged.fromName} <${merged.fromEmail}>`
      : merged.fromEmail;
    let usedSecure = Boolean(merged.secure);
    try {
      usedSecure = await sendWithSecureMode(Boolean(merged.secure));
    } catch (firstError) {
      const msg = firstError instanceof Error ? firstError.message.toLowerCase() : "";
      const isTlsVersionMismatch =
        msg.includes("wrong version number") ||
        msg.includes("ssl3_get_record") ||
        msg.includes("ssl routines");

      if (!isTlsVersionMismatch) throw firstError;
      usedSecure = await sendWithSecureMode(!Boolean(merged.secure));
    }

    return NextResponse.json({
      ok: true,
      message:
        merged.port === 465 || merged.port === 587
          ? `Test email sent successfully. Working mode: ${usedSecure ? "SSL/TLS (secure=true)" : "STARTTLS/plain upgrade (secure=false)"} on port ${merged.port}.`
          : "Test email sent successfully.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send test email.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
