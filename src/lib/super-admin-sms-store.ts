import { prisma } from "@/lib/db";

type LegacyPrismaWithSmsDelegate = typeof prisma & {
  superAdminSmsSetting?: {
    upsert: (args: unknown) => Promise<unknown>;
    findUnique: (args: unknown) => Promise<unknown>;
  };
};

function getSmsDelegate() {
  return (prisma as LegacyPrismaWithSmsDelegate).superAdminSmsSetting;
}

export async function saveSuperAdminSmsSettings(input: {
  fast2smsQuickApiKey: string;
  enabled?: boolean;
}) {
  const delegate = getSmsDelegate();
  if (delegate?.upsert) {
    await delegate.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        fast2smsQuickApiKey: input.fast2smsQuickApiKey,
        enabled: input.enabled !== false,
      },
      update: {
        fast2smsQuickApiKey: input.fast2smsQuickApiKey,
        enabled: input.enabled !== false,
      },
    });
    return;
  }

  await prisma.$executeRaw`
    INSERT INTO super_admin_sms_settings
      (id, fast2sms_quick_api_key, enabled, updated_at)
    VALUES
      (1, ${input.fast2smsQuickApiKey}, ${input.enabled !== false}, NOW())
    ON DUPLICATE KEY UPDATE
      fast2sms_quick_api_key = VALUES(fast2sms_quick_api_key),
      enabled = VALUES(enabled),
      updated_at = NOW()
  `;
}

export async function getSuperAdminSmsSettings() {
  const delegate = getSmsDelegate();
  if (delegate?.findUnique) {
    const row = (await delegate.findUnique({ where: { id: 1 } })) as
      | {
          fast2smsQuickApiKey: string;
          enabled: boolean;
        }
      | null;
    if (!row) return null;
    return {
      fast2smsQuickApiKey: row.fast2smsQuickApiKey,
      enabled: Boolean(row.enabled),
    };
  }

  const rows = (await prisma.$queryRaw`
    SELECT fast2sms_quick_api_key, enabled
    FROM super_admin_sms_settings
    WHERE id = 1
    LIMIT 1
  `) as Array<{
    fast2sms_quick_api_key: string;
    enabled: number | boolean;
  }>;

  const row = rows[0];
  if (!row) return null;
  return {
    fast2smsQuickApiKey: row.fast2sms_quick_api_key,
    enabled: Boolean(row.enabled),
  };
}
