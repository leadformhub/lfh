import { prisma } from "@/lib/db";

export type LeadActivityType = "created" | "stage_changed" | "deleted" | "note";

export type StageChangedMetadata = {
  stageId?: string | null;
  stageName?: string;
  fromStageId?: string | null;
  fromStageName?: string;
};

export async function createLeadActivity(
  leadId: string,
  type: LeadActivityType,
  metadata?: Record<string, unknown> | null
) {
  return prisma.leadActivity.create({
    data: {
      leadId,
      type,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });
}

export async function getLeadActivities(leadId: string, limit = 100) {
  return prisma.leadActivity.findMany({
    where: { leadId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      type: true,
      metadata: true,
      createdAt: true,
    },
  });
}
