import { prisma } from "@/lib/db";

type LegacyPrismaWithSmtpDelegate = typeof prisma & {
  superAdminSmtpSetting?: {
    upsert: (args: unknown) => Promise<unknown>;
    findUnique: (args: unknown) => Promise<unknown>;
  };
};

function getSmtpDelegate() {
  return (prisma as LegacyPrismaWithSmtpDelegate).superAdminSmtpSetting;
}

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
  const delegate = getSmtpDelegate();
  if (delegate?.upsert) {
    await delegate.upsert({
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
    return;
  }

  // Fallback for environments where Prisma Client is stale and this model
  // delegate is missing, while table exists in DB.
  await prisma.$executeRaw`
    INSERT INTO super_admin_smtp_settings
      (id, host, port, username, password, from_email, from_name, support_email, secure, updated_at)
    VALUES
      (1, ${input.host}, ${input.port}, ${input.username}, ${input.password}, ${input.fromEmail}, ${input.fromName || null}, ${input.supportEmail || null}, ${Boolean(input.secure)}, NOW())
    ON DUPLICATE KEY UPDATE
      host = VALUES(host),
      port = VALUES(port),
      username = VALUES(username),
      password = VALUES(password),
      from_email = VALUES(from_email),
      from_name = VALUES(from_name),
      support_email = VALUES(support_email),
      secure = VALUES(secure),
      updated_at = NOW()
  `;
}

export async function getSuperAdminSmtpSettings() {
  const delegate = getSmtpDelegate();
  if (delegate?.findUnique) {
    const row = (await delegate.findUnique({ where: { id: 1 } })) as
      | {
          host: string;
          port: number;
          username: string;
          password: string;
          fromEmail: string;
          fromName: string | null;
          supportEmail: string | null;
          secure: boolean;
        }
      | null;
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

  const rows = (await prisma.$queryRaw`
    SELECT host, port, username, password, from_email, from_name, support_email, secure
    FROM super_admin_smtp_settings
    WHERE id = 1
    LIMIT 1
  `) as Array<{
    host: string;
    port: number;
    username: string;
    password: string;
    from_email: string;
    from_name: string | null;
    support_email: string | null;
    secure: number | boolean;
  }>;

  const row = rows[0];
  if (!row) return null;
  return {
    host: row.host,
    port: Number(row.port),
    username: row.username,
    password: row.password,
    fromEmail: row.from_email,
    fromName: row.from_name ?? "",
    supportEmail: row.support_email ?? "",
    secure: Boolean(row.secure),
  };
}
