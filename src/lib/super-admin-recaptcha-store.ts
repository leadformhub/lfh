import { prisma } from "@/lib/db";

type LegacyPrismaWithRecaptchaDelegate = typeof prisma & {
  superAdminRecaptchaSetting?: {
    upsert: (args: unknown) => Promise<unknown>;
    findUnique: (args: unknown) => Promise<unknown>;
  };
};

function getRecaptchaDelegate() {
  return (prisma as LegacyPrismaWithRecaptchaDelegate).superAdminRecaptchaSetting;
}

export async function saveSuperAdminRecaptchaSettings(input: {
  siteKey: string;
  secretKey: string;
  enabled?: boolean;
}) {
  const delegate = getRecaptchaDelegate();
  if (delegate?.upsert) {
    await delegate.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        siteKey: input.siteKey,
        secretKey: input.secretKey,
        enabled: input.enabled !== false,
      },
      update: {
        siteKey: input.siteKey,
        secretKey: input.secretKey,
        enabled: input.enabled !== false,
      },
    });
    return;
  }

  await prisma.$executeRaw`
    INSERT INTO super_admin_recaptcha_settings
      (id, site_key, secret_key, enabled, updated_at)
    VALUES
      (1, ${input.siteKey}, ${input.secretKey}, ${input.enabled !== false}, NOW())
    ON DUPLICATE KEY UPDATE
      site_key = VALUES(site_key),
      secret_key = VALUES(secret_key),
      enabled = VALUES(enabled),
      updated_at = NOW()
  `;
}

export async function getSuperAdminRecaptchaSettings() {
  const delegate = getRecaptchaDelegate();
  if (delegate?.findUnique) {
    const row = (await delegate.findUnique({ where: { id: 1 } })) as
      | {
          siteKey: string;
          secretKey: string;
          enabled: boolean;
        }
      | null;
    if (!row) return null;
    return {
      siteKey: row.siteKey,
      secretKey: row.secretKey,
      enabled: Boolean(row.enabled),
    };
  }

  const rows = (await prisma.$queryRaw`
    SELECT site_key, secret_key, enabled
    FROM super_admin_recaptcha_settings
    WHERE id = 1
    LIMIT 1
  `) as Array<{
    site_key: string;
    secret_key: string;
    enabled: number | boolean;
  }>;

  const row = rows[0];
  if (!row) return null;
  return {
    siteKey: row.site_key,
    secretKey: row.secret_key,
    enabled: Boolean(row.enabled),
  };
}
