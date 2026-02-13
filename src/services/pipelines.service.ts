import { prisma } from "@/lib/db";
import { createLeadActivity } from "@/services/lead-activity.service";
import { runFormAutomation } from "@/services/automation.service";

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
      data: trimLeadDataForBoard(l.dataJson),
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
        data: trimLeadDataForBoard(l.dataJson),
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

/**
 * Returns pipeline with stages and leads grouped by stage.
 * Leads with stageId = null are included in the first stage (or "unassigned").
 * Respects free plan cap (50 leads). Paid plans capped at BOARD_LEADS_CAP for performance.
 * Uses a single leads query and minimal select to reduce DB time and payload.
 */
export async function getLeadsByPipelineStages(
  userId: string,
  pipelineId: string,
  plan?: string
): Promise<{
  pipeline: { id: string; name: string; formId: string | null };
  stages: { id: string; name: string; order: number; leads: LeadInStage[] }[];
  unassignedLeads: LeadInStage[];
}> {
  const pipeline = await prisma.pipeline.findFirst({
    where: { id: pipelineId, userId },
    include: { stages: { orderBy: { order: "asc" } } },
  });
  if (!pipeline) {
    return {
      pipeline: { id: "", name: "", formId: null },
      stages: [],
      unassignedLeads: [],
    };
  }

  const leadWhere: { userId: string; formId: string | null } = {
    userId,
    formId: pipeline.formId,
  };

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
      dataJson: lead.dataJson,
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
 */
export async function updateLeadStage(
  leadId: string,
  userId: string,
  stageId: string | null
): Promise<{ ok: boolean; error?: string }> {
  const lead = await prisma.lead.findFirst({
    where: { id: leadId, userId },
    select: { id: true, stageId: true, stage: { select: { id: true, name: true } } },
  });
  if (!lead) return { ok: false, error: "Lead not found" };

  const fromStageId = lead.stageId ?? null;
  const fromStageName = lead.stage?.name ?? "New";

  if (stageId === null) {
    await prisma.lead.update({
      where: { id: leadId },
      data: { stageId: null },
    });
    await createLeadActivity(leadId, "stage_changed", {
      stageId: null,
      stageName: "New",
      fromStageId,
      fromStageName,
    }).catch((err) =>
      console.error("[pipelines] Failed to log stage change activity:", err)
    );
    runAutomationForStageChange(leadId, "New").catch((err) =>
      console.error("[pipelines] Automation failed:", err)
    );
    return { ok: true };
  }

  const stage = await prisma.pipelineStage.findFirst({
    where: { id: stageId },
    include: { pipeline: { select: { userId: true } } },
  });
  if (!stage || stage.pipeline.userId !== userId) return { ok: false, error: "Stage not found" };

  await prisma.lead.update({
    where: { id: leadId },
    data: { stageId },
  });
  const newStageName = stage.name === "New" ? "To Contact" : stage.name;
  await createLeadActivity(leadId, "stage_changed", {
    stageId,
    stageName: newStageName,
    fromStageId,
    fromStageName,
  }).catch((err) =>
    console.error("[pipelines] Failed to log stage change activity:", err)
  );
  runAutomationForStageChange(leadId, newStageName).catch((err) =>
    console.error("[pipelines] Automation failed:", err)
  );
  return { ok: true };
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
