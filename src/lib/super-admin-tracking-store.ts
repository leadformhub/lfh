import { prisma } from "@/lib/db";

type LegacyPrismaWithTrackingDelegate = typeof prisma & {
  superAdminTrackingSetting?: {
    upsert: (args: unknown) => Promise<unknown>;
    findUnique: (args: unknown) => Promise<unknown>;
  };
};

function getTrackingDelegate() {
  return (prisma as LegacyPrismaWithTrackingDelegate).superAdminTrackingSetting;
}

export type SuperAdminTrackingSettings = {
  gaMeasurementId: string;
  fbPixelId: string;
  enabled: boolean;
};

export async function saveSuperAdminTrackingSettings(input: {
  gaMeasurementId: string;
  fbPixelId: string;
  enabled?: boolean;
}) {
  const delegate = getTrackingDelegate();
  const normalizedGaId = input.gaMeasurementId.trim();
  const normalizedFbId = input.fbPixelId.trim();

  if (delegate?.upsert) {
    await delegate.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        gaMeasurementId: normalizedGaId,
        fbPixelId: normalizedFbId,
        enabled: input.enabled !== false,
      },
      update: {
        gaMeasurementId: normalizedGaId,
        fbPixelId: normalizedFbId,
        enabled: input.enabled !== false,
      },
    });
    return;
  }

  await prisma.$executeRaw`
    INSERT INTO super_admin_tracking_settings
      (id, ga_measurement_id, fb_pixel_id, enabled, updated_at)
    VALUES
      (1, ${normalizedGaId}, ${normalizedFbId}, ${input.enabled !== false}, NOW())
    ON DUPLICATE KEY UPDATE
      ga_measurement_id = VALUES(ga_measurement_id),
      fb_pixel_id = VALUES(fb_pixel_id),
      enabled = VALUES(enabled),
      updated_at = NOW()
  `;
}

export async function getSuperAdminTrackingSettings(): Promise<SuperAdminTrackingSettings | null> {
  const delegate = getTrackingDelegate();
  if (delegate?.findUnique) {
    const row = (await delegate.findUnique({ where: { id: 1 } })) as
      | {
          gaMeasurementId: string | null;
          fbPixelId: string | null;
          enabled: boolean;
        }
      | null;
    if (!row) return null;
    return {
      gaMeasurementId: row.gaMeasurementId?.trim() || "",
      fbPixelId: row.fbPixelId?.trim() || "",
      enabled: Boolean(row.enabled),
    };
  }

  const rows = (await prisma.$queryRaw`
    SELECT ga_measurement_id, fb_pixel_id, enabled
    FROM super_admin_tracking_settings
    WHERE id = 1
    LIMIT 1
  `) as Array<{
    ga_measurement_id: string | null;
    fb_pixel_id: string | null;
    enabled: number | boolean;
  }>;

  const row = rows[0];
  if (!row) return null;
  return {
    gaMeasurementId: row.ga_measurement_id?.trim() || "",
    fbPixelId: row.fb_pixel_id?.trim() || "",
    enabled: Boolean(row.enabled),
  };
}

export async function getPublicTrackingIds() {
  const fallback = {
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "",
    fbPixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID?.trim() || "",
  };

  try {
    const saved = await getSuperAdminTrackingSettings();
    if (!saved?.enabled) return fallback;
    return {
      gaMeasurementId: saved.gaMeasurementId || fallback.gaMeasurementId,
      fbPixelId: saved.fbPixelId || fallback.fbPixelId,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : "";
    if (message.includes("unknown table") || message.includes("doesn't exist") || message.includes("unknown column")) {
      return fallback;
    }
    throw error;
  }
}
