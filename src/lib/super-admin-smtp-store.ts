import { prisma } from "@/lib/db";

export async function saveSuperAdminSmtpSettings(input: {
  host: string;
  port: number;
  username: string;
  password: string;
  fromEmail: string;
  fromName?: string;
  supportEmail?: string;
  secure?: boolean;
}) {
  await prisma.superAdminSmtpSetting.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      host: input.host,
      port: input.port,
      username: input.username,
      password: input.password,
      fromEmail: input.fromEmail,
      fromName: input.fromName || null,
      supportEmail: input.supportEmail || null,
      secure: Boolean(input.secure),
    },
    update: {
      host: input.host,
      port: input.port,
      username: input.username,
      password: input.password,
      fromEmail: input.fromEmail,
      fromName: input.fromName || null,
      supportEmail: input.supportEmail || null,
      secure: Boolean(input.secure),
    },
  });
}

export async function getSuperAdminSmtpSettings() {
  const row = await prisma.superAdminSmtpSetting.findUnique({ where: { id: 1 } });
  if (!row) return null;
  return {
    host: row.host,
    port: row.port,
    username: row.username,
    password: row.password,
    fromEmail: row.fromEmail,
    fromName: row.fromName ?? "",
    supportEmail: row.supportEmail ?? "",
    secure: row.secure,
  };
}
