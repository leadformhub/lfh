import { prisma } from "@/lib/db";

type SmtpSettingsRow = {
  host: string;
  port: number;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string | null;
  supportEmail: string | null;
  secure: number;
};

async function ensureSmtpSettingsTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS super_admin_smtp_settings (
      id TINYINT NOT NULL PRIMARY KEY,
      host VARCHAR(255) NOT NULL,
      port INT NOT NULL,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      from_email VARCHAR(255) NOT NULL,
      from_name VARCHAR(255) NULL,
      support_email VARCHAR(255) NULL,
      secure TINYINT(1) NOT NULL DEFAULT 0,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE super_admin_smtp_settings
      ADD COLUMN support_email VARCHAR(255) NULL
    `);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (!message.toLowerCase().includes("duplicate column")) throw error;
  }
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
  await ensureSmtpSettingsTable();
  await prisma.$executeRawUnsafe(
    `
      INSERT INTO super_admin_smtp_settings
        (id, host, port, username, password, from_email, from_name, support_email, secure)
      VALUES
        (1, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        host = VALUES(host),
        port = VALUES(port),
        username = VALUES(username),
        password = VALUES(password),
        from_email = VALUES(from_email),
        from_name = VALUES(from_name),
        support_email = VALUES(support_email),
        secure = VALUES(secure)
    `,
    input.host,
    input.port,
    input.username,
    input.password,
    input.fromEmail,
    input.fromName || null,
    input.supportEmail || null,
    input.secure ? 1 : 0
  );
}

export async function getSuperAdminSmtpSettings() {
  await ensureSmtpSettingsTable();
  const rows = await prisma.$queryRawUnsafe<SmtpSettingsRow[]>(
    `
      SELECT host, port, username, password, from_email AS fromEmail, from_name AS fromName, support_email AS supportEmail, secure
      FROM super_admin_smtp_settings
      WHERE id = 1
      LIMIT 1
    `
  );
  const row = rows[0];
  if (!row) return null;
  return {
    host: row.host,
    port: row.port,
    username: row.username,
    password: row.password,
    fromEmail: row.fromEmail,
    fromName: row.fromName ?? "",
    supportEmail: row.supportEmail ?? "",
    secure: Boolean(row.secure),
  };
}
