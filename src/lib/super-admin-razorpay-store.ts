import { prisma } from "@/lib/db";

type LegacyPrismaWithRazorpayDelegate = typeof prisma & {
  superAdminRazorpaySetting?: {
    upsert: (args: unknown) => Promise<unknown>;
    findUnique: (args: unknown) => Promise<unknown>;
  };
};

function getRazorpayDelegate() {
  return (prisma as LegacyPrismaWithRazorpayDelegate).superAdminRazorpaySetting;
}

export async function saveSuperAdminRazorpaySettings(input: {
  keyId: string;
  keySecret: string;
  enabled?: boolean;
}) {
  const delegate = getRazorpayDelegate();
  if (delegate?.upsert) {
    await delegate.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        keyId: input.keyId,
        keySecret: input.keySecret,
        enabled: input.enabled !== false,
      },
      update: {
        keyId: input.keyId,
        keySecret: input.keySecret,
        enabled: input.enabled !== false,
      },
    });
    return;
  }

  await prisma.$executeRaw`
    INSERT INTO super_admin_razorpay_settings
      (id, key_id, key_secret, enabled, updated_at)
    VALUES
      (1, ${input.keyId}, ${input.keySecret}, ${input.enabled !== false}, NOW())
    ON DUPLICATE KEY UPDATE
      key_id = VALUES(key_id),
      key_secret = VALUES(key_secret),
      enabled = VALUES(enabled),
      updated_at = NOW()
  `;
}

export async function getSuperAdminRazorpaySettings() {
  const delegate = getRazorpayDelegate();
  if (delegate?.findUnique) {
    const row = (await delegate.findUnique({ where: { id: 1 } })) as
      | {
          keyId: string;
          keySecret: string;
          enabled: boolean;
        }
      | null;
    if (!row) return null;
    return {
      keyId: row.keyId,
      keySecret: row.keySecret,
      enabled: Boolean(row.enabled),
    };
  }

  const rows = (await prisma.$queryRaw`
    SELECT key_id, key_secret, enabled
    FROM super_admin_razorpay_settings
    WHERE id = 1
    LIMIT 1
  `) as Array<{
    key_id: string;
    key_secret: string;
    enabled: number | boolean;
  }>;

  const row = rows[0];
  if (!row) return null;
  return {
    keyId: row.key_id,
    keySecret: row.key_secret,
    enabled: Boolean(row.enabled),
  };
}
