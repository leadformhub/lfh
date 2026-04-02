import { prisma } from "@/lib/db";

type LegacyPrismaWithGoogleDelegate = typeof prisma & {
  superAdminGoogleSetting?: {
    upsert: (args: unknown) => Promise<unknown>;
    findUnique: (args: unknown) => Promise<unknown>;
  };
};

function getGoogleDelegate() {
  return (prisma as LegacyPrismaWithGoogleDelegate).superAdminGoogleSetting;
}

export async function saveSuperAdminGoogleSettings(input: {
  clientId: string;
  clientSecret: string;
  enabled?: boolean;
}) {
  const delegate = getGoogleDelegate();
  if (delegate?.upsert) {
    await delegate.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        clientId: input.clientId,
        clientSecret: input.clientSecret,
        enabled: input.enabled !== false,
      },
      update: {
        clientId: input.clientId,
        clientSecret: input.clientSecret,
        enabled: input.enabled !== false,
      },
    });
    return;
  }

  await prisma.$executeRaw`
    INSERT INTO super_admin_google_settings
      (id, client_id, client_secret, enabled, updated_at)
    VALUES
      (1, ${input.clientId}, ${input.clientSecret}, ${input.enabled !== false}, NOW())
    ON DUPLICATE KEY UPDATE
      client_id = VALUES(client_id),
      client_secret = VALUES(client_secret),
      enabled = VALUES(enabled),
      updated_at = NOW()
  `;
}

export async function getSuperAdminGoogleSettings() {
  const delegate = getGoogleDelegate();
  if (delegate?.findUnique) {
    const row = (await delegate.findUnique({ where: { id: 1 } })) as
      | {
          clientId: string;
          clientSecret: string;
          enabled: boolean;
        }
      | null;
    if (!row) return null;
    return {
      clientId: row.clientId,
      clientSecret: row.clientSecret,
      enabled: Boolean(row.enabled),
    };
  }

  const rows = (await prisma.$queryRaw`
    SELECT client_id, client_secret, enabled
    FROM super_admin_google_settings
    WHERE id = 1
    LIMIT 1
  `) as Array<{
    client_id: string;
    client_secret: string;
    enabled: number | boolean;
  }>;

  const row = rows[0];
  if (!row) return null;
  return {
    clientId: row.client_id,
    clientSecret: row.client_secret,
    enabled: Boolean(row.enabled),
  };
}
