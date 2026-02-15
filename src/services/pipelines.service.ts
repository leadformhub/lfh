import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { createLeadActivity } from "@/services/lead-activity.service";
import { runFormAutomation } from "@/services/automation.service";
import { dispatchWebhooksForEvent } from "@/services/webhook.service";

const FREE_PLAN_LEADS_CAP = 50;

/** Trim lead dataJson to first N keys for board list payload (card shows primary + 2 secondary). */
export function trimLeadDataForBoard(dataJson: string, maxKeys = 5): string {
  try {
    const obj = JSON.parse(dataJson) as Record<string, unknown>;
    const entries = Object.entries(obj).slice(0, maxKeys);
    return JSON.stringify(Object.fromEntries(entries));
  } catch {
    return dataJson;
  }
}

/** Serialize getLeadsByPipelineStages result to the public board API shape (trimmed lead data). */
export function serializeBoardForApi(board: {
  pipeline: { id: string; name: string; formId: string | null };
  stages: { id: string; name: string; order: number; leads: LeadInStage[] }[];
  unassignedLeads: LeadInStage[];
}): {
  pipeline: { id: string; name: string; formId: string | null };
  stages: { id: string; name: string; order: number }[];
  unassignedLeads: { id: string; formId: string | null; stageId: string | null; data: string; createdAt: string; formName: string | null; followUpBy: string | null }[];
  leadsByStage: { stageId: string; stageName: string; order: number; leads: { id: string; formId: string | null; stageId: string | null; data: string; createdAt: string; formName: string | null; followUpBy: string | null }[] }[];
} {
  return {
    pipeline: board.pipeline,
    stages: board.stages,
    unassignedLeads: board.unassignedLeads.map((l) => ({
      id: l.id,
      formId: l.formId,
      stageId: l.stageId,
      data: l.dataJson,
      createdAt: l.createdAt.toISOString(),
      formName: l.form?.name ?? null,
      followUpBy: l.followUpBy?.toISOString() ?? null,
    })),
    leadsByStage: board.stages.map((s) => ({
      stageId: s.id,
      stageName: s.name,
      order: s.order,
      leads: s.leads.map((l) => ({
        id: l.id,
        formId: l.formId,
        stageId: l.stageId,
        data: l.dataJson,
        createdAt: l.createdAt.toISOString(),
        formName: l.form?.name ?? null,
        followUpBy: l.followUpBy?.toISOString() ?? null,
      })),
    })),
  };
}

export async function getPipelinesByUserId(userId: string, formId?: string | null) {
  const where: { userId: string; formId?: string | null } = { userId };
  if (formId !== undefined && formId !== null) {
    where.formId = formId;
  }
  return prisma.pipeline.findMany({
    where,
    include: {
      stages: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getPipelineById(pipelineId: string, userId: string) {
  return prisma.pipeline.findFirst({
    where: { id: pipelineId, userId },
    include: {
      stages: { orderBy: { order: "asc" } },
      form: { select: { id: true, name: true } },
    },
  });
}

export async function getPipelineByFormId(userId: string, formId: string | null) {
  return prisma.pipeline.findFirst({
    where: { userId, formId },
    include: { stages: { orderBy: { order: "asc" } } },
  });
}

/** Get pipeline for form, or create with default stages in one transaction. Reduces 3 round trips to 1 when creating. */
export async function getOrCreatePipelineForForm(userId: string, formId: string) {
  const existing = await prisma.pipeline.findFirst({
    where: { userId, formId },
    include: { stages: { orderBy: { order: "asc" } } },
  });
  if (existing) return existing;
  const defaults = [
    { name: "To Contact", order: 0 },
    { name: "Contacted", order: 1 },
    { name: "Won", order: 2 },
  ];
  const pipeline = await prisma.$transaction(async (tx) => {
    const created = await tx.pipeline.create({
      data: { userId, formId, name: "Default" },
    });
    await tx.pipelineStage.createMany({
      data: defaults.map((d) => ({ pipelineId: created.id, name: d.name, order: d.order })),
    });
    return tx.pipeline.findUniqueOrThrow({
      where: { id: created.id },
      include: { stages: { orderBy: { order: "asc" } } },
    });
  });
  return pipeline;
}

export async function getStagesByPipelineId(pipelineId: string) {
  return prisma.pipelineStage.findMany({
    where: { pipelineId },
    orderBy: { order: "asc" },
  });
}

export async function createPipeline(
  userId: string,
  data: { formId?: string | null; name?: string }
) {
  const name = data.name?.trim() || "Default";
  return prisma.pipeline.create({
    data: {
      userId,
      formId: data.formId ?? null,
      name,
    },
    include: { stages: true },
  });
}

export async function createDefaultStagesForPipeline(pipelineId: string) {
  // First column in UI is "New" (unassigned); so default stages avoid duplicate "New"
  const defaults = [
    { name: "To Contact", order: 0 },
    { name: "Contacted", order: 1 },
    { name: "Won", order: 2 },
  ];
  await prisma.pipelineStage.createMany({
    data: defaults.map((d) => ({ pipelineId, name: d.name, order: d.order })),
  });
  return getStagesByPipelineId(pipelineId);
}

export async function createStage(pipelineId: string, data: { name: string; order: number }) {
  return prisma.pipelineStage.create({
    data: {
      pipelineId,
      name: data.name.trim() || "Stage",
      order: data.order,
    },
  });
}

export async function updatePipelineName(pipelineId: string, userId: string, name: string) {
  return prisma.pipeline.updateMany({
    where: { id: pipelineId, userId },
    data: { name: name.trim() || "Pipeline" },
  });
}

export async function updateStage(
  stageId: string,
  data: { name?: string; order?: number }
) {
  const update: { name?: string; order?: number } = {};
  if (data.name !== undefined) update.name = data.name.trim() || "Stage";
  if (data.order !== undefined) update.order = data.order;
  if (Object.keys(update).length === 0) return null;
  return prisma.pipelineStage.update({
    where: { id: stageId },
    data: update,
  });
}

/** Max leads returned on board for paid plans (keeps response time bounded in production). */
const BOARD_LEADS_CAP = 1000;

export type LeadInStage = {
  id: string;
  formId: string | null;
  stageId: string | null;
  dataJson: string;
  createdAt: Date;
  followUpBy: Date | null;
  form: { id: string; name: string } | null;
};

const leadSelect = {
  id: true,
  formId: true,
  stageId: true,
  dataJson: true,
  createdAt: true,
  followUpBy: true,
  form: { select: { name: true } as const },
} as const;

/** Pipeline with stages, as returned by getPipelineByFormId. Pass to getLeadsByPipelineStages to skip re-fetching. */
export type PipelineWithStages = Awaited<ReturnType<typeof getPipelineByFormId>>;

/**
 * Returns pipeline with stages and leads grouped by stage.
 * Leads with stageId = null are included in the first stage (or "unassigned").
 * Respects free plan cap (50 leads). Paid plans capped at BOARD_LEADS_CAP for performance.
 * Uses a single leads query and minimal select to reduce DB time and payload.
 * Pass pipelineWithStages when you already have the pipeline to avoid an extra DB round-trip.
 */
export async function getLeadsByPipelineStages(
  userId: string,
  pipelineIdOrPipeline: string | PipelineWithStages,
  plan?: string,
  options?: { assignedToUserId?: string }
): Promise<{
  pipeline: { id: string; name: string; formId: string | null };
  stages: { id: string; name: string; order: number; leads: LeadInStage[] }[];
  unassignedLeads: LeadInStage[];
}> {
  const pipeline: PipelineWithStages | null =
    typeof pipelineIdOrPipeline === "object"
      ? pipelineIdOrPipeline
      : await prisma.pipeline.findFirst({
          where: { id: pipelineIdOrPipeline, userId },
          include: { stages: { orderBy: { order: "asc" } } },
        });
  if (!pipeline) {
    return {
      pipeline: { id: "", name: "", formId: null },
      stages: [],
      unassignedLeads: [],
    };
  }

  const leadWhere: { userId: string; formId: string | null; assignedToUserId?: string } = {
    userId,
    formId: pipeline.formId,
  };
  if (options?.assignedToUserId) {
    leadWhere.assignedToUserId = options.assignedToUserId;
  }

  const take =
    plan === "free" ? FREE_PLAN_LEADS_CAP : BOARD_LEADS_CAP;

  const leads = await prisma.lead.findMany({
    where: leadWhere,
    select: leadSelect,
    orderBy: { createdAt: "desc" },
    take,
  });

  const unassignedLeads: LeadInStage[] = [];
  const byStage = new Map<string, LeadInStage[]>();
  for (const s of pipeline.stages) {
    byStage.set(s.id, []);
  }
  for (const lead of leads) {
    const row: LeadInStage = {
      id: lead.id,
      formId: lead.formId,
      stageId: lead.stageId,
      dataJson: trimLeadDataForBoard(lead.dataJson),
      createdAt: lead.createdAt,
      followUpBy: lead.followUpBy ?? null,
      form: lead.form ? { id: "", name: lead.form.name } : null,
    };
    if (lead.stageId && byStage.has(lead.stageId)) {
      byStage.get(lead.stageId)!.push(row);
    } else {
      unassignedLeads.push(row);
    }
  }

  return {
    pipeline: { id: pipeline.id, name: pipeline.name, formId: pipeline.formId },
    stages: pipeline.stages.map((s) => ({
      id: s.id,
      name: s.name,
      order: s.order,
      leads: byStage.get(s.id) ?? [],
    })),
    unassignedLeads,
  };
}

/**
 * Update a lead's stage. Verifies lead belongs to user and stage belongs to user's pipeline.
 * Pass stageId null to clear the lead's stage (move to "New" / unassigned).
 * When assignedToUserId is set (e.g. Sales role), lead must be assigned to that user.
 */
export async function updateLeadStage(
  leadId: string,
  userId: string,
  stageId: string | null,
  options?: { assignedToUserId?: string }
): Promise<{ ok: boolean; error?: string }> {
  const leadWhere = {
    id: leadId,
    userId,
    ...(options?.assignedToUserId != null && { assignedToUserId: options.assignedToUserId }),
  };

  if (stageId === null) {
    const result = await prisma.lead.updateMany({
      where: leadWhere,
      data: { stageId: null },
    });
    if (result.count === 0) return { ok: false, error: "Lead not found" };
    void createLeadActivity(leadId, "stage_changed", {
      stageId: null,
      stageName: "New",
      fromStageId: null,
      fromStageName: null,
    }).catch((err) =>
      console.error("[pipelines] Failed to log stage change activity:", err)
    );
    void runAutomationForStageChange(leadId, "New").catch((err) =>
      console.error("[pipelines] Automation failed:", err)
    );
    void triggerWebhooksForStageChange(leadId, userId).catch((err) =>
      console.error("[webhooks] stage change failed:", err)
    );
    return { ok: true };
  }

  const assignCondition =
    options?.assignedToUserId != null
      ? Prisma.sql`AND assigned_to_user_id = ${options.assignedToUserId}`
      : Prisma.empty;
  const [updateCount, stage] = await Promise.all([
    prisma.$executeRaw(
      Prisma.sql`
        UPDATE Lead
        SET stage_id = ${stageId}
        WHERE id = ${leadId}
          AND user_id = ${userId}
          ${assignCondition}
          AND (SELECT p.user_id FROM pipeline_stages ps INNER JOIN pipelines p ON p.id = ps.pipeline_id WHERE ps.id = ${stageId}) = ${userId}
      `
    ) as Promise<number>,
    prisma.pipelineStage.findUnique({
      where: { id: stageId },
      select: { name: true },
    }),
  ]);
  if (updateCount === 0) return { ok: false, error: "Lead not found" };
  if (!stage) return { ok: false, error: "Stage not found" };

  const newStageName = stage.name === "New" ? "To Contact" : stage.name;
  void createLeadActivity(leadId, "stage_changed", {
    stageId,
    stageName: newStageName,
    fromStageId: null,
    fromStageName: null,
  }).catch((err) =>
    console.error("[pipelines] Failed to log stage change activity:", err)
  );
  void runAutomationForStageChange(leadId, newStageName).catch((err) =>
    console.error("[pipelines] Automation failed:", err)
  );
  void triggerWebhooksForStageChange(leadId, userId).catch((err) =>
    console.error("[webhooks] stage change failed:", err)
  );
  return { ok: true };
}

async function triggerWebhooksForStageChange(leadId: string, userId: string): Promise<void> {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: {
      id: true,
      dataJson: true,
      createdAt: true,
      utmSource: true,
      stage: { select: { name: true } },
    },
  });
  if (!lead) return;
  await dispatchWebhooksForEvent(userId, "lead.stage_changed", {
    id: lead.id,
    dataJson: lead.dataJson,
    createdAt: lead.createdAt,
    utmSource: lead.utmSource,
    stage: lead.stage,
  });
  if (lead.stage?.name?.toLowerCase() === "won") {
    await dispatchWebhooksForEvent(userId, "lead.won", {
      id: lead.id,
      dataJson: lead.dataJson,
      createdAt: lead.createdAt,
      utmSource: lead.utmSource,
      stage: lead.stage,
    });
  }
}

async function runAutomationForStageChange(leadId: string, stageName: string): Promise<void> {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { form: { include: { user: { select: { email: true } } } } },
  });
  if (!lead?.formId || !lead.form) return;
  let leadData: Record<string, unknown> = {};
  try {
    leadData = (JSON.parse(lead.dataJson) as Record<string, unknown>) ?? {};
  } catch {
    // ignore
  }
  await runFormAutomation(lead.formId, "lead_stage_changed", {
    leadData,
    formName: lead.form.name,
    adminEmail: lead.form.user?.email ?? null,
    stageName,
  });
}
