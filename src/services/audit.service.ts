import { prisma } from "@/lib/db";

export type AuditAction = "lead_export";

export async function createAuditLog(
  userId: string,
  action: AuditAction,
  metadata?: Record<string, unknown>
) {
  return prisma.auditLog.create({
    data: {
      userId,
      action,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });
}
