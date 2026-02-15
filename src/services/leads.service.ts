import { prisma } from "@/lib/db";

/**
 * All lead submission data is stored in leads.data_json.
 * Metadata only: form_id, user_id, ip_address, user_agent, created_at.
 * No DB column mapping for form fields.
 */

export type CreateLeadSourceOptions = {
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  referrerUrl?: string | null;
  landingPageUrl?: string | null;
};

export async function createLead(
  formId: string,
  userId: string,
  data: Record<string, unknown>,
  options?: {
    ipAddress?: string | null;
    userAgent?: string | null;
  } & Partial<CreateLeadSourceOptions>
) {
  return prisma.lead.create({
    data: {
      formId,
      userId,
      dataJson: JSON.stringify(data),
      ipAddress: options?.ipAddress ?? null,
      userAgent: options?.userAgent ?? null,
      utmSource: options?.utmSource ?? null,
      utmMedium: options?.utmMedium ?? null,
      utmCampaign: options?.utmCampaign ?? null,
      utmTerm: options?.utmTerm ?? null,
      utmContent: options?.utmContent ?? null,
      referrerUrl: options?.referrerUrl ?? null,
      landingPageUrl: options?.landingPageUrl ?? null,
    },
  });
}

const FREE_PLAN_LEADS_CAP = 50;

export async function getLeadsByUserId(
  userId: string,
  options: {
    page?: number;
    perPage?: number;
    formId?: string;
    search?: string;
    plan?: string;
    followUpDue?: boolean;
    /** When set (e.g. Sales role), only return leads assigned to this user. */
    assignedToUserId?: string;
  } = {}
) {
  const page = Math.max(1, options.page ?? 1);
  const perPage = Math.min(100, Math.max(1, options.perPage ?? 25));
  const skip = (page - 1) * perPage;

  const where: {
    userId: string;
    formId?: string;
    dataJson?: { contains: string };
    followUpBy?: { not: null };
    assignedToUserId?: string;
  } = { userId };
  const formId = options.formId?.trim();
  if (formId && formId !== "undefined" && formId !== "null") {
    where.formId = formId;
  }
  const search = options.search?.trim();
  if (search) {
    where.dataJson = { contains: search };
  }
  if (options.followUpDue) {
    where.followUpBy = { not: null };
  }
  if (options.assignedToUserId) {
    where.assignedToUserId = options.assignedToUserId;
  }

  const isFree = options.plan === "free";

  if (isFree) {
    const allLeads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: FREE_PLAN_LEADS_CAP,
      include: {
        form: { select: { id: true, name: true } },
        stage: { select: { id: true, name: true } },
      },
    });
    const total = allLeads.length;
    const leads = allLeads.slice(skip, skip + perPage);
    return { leads, total, page, perPage };
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: {
        form: { select: { id: true, name: true } },
        stage: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
    }),
    prisma.lead.count({ where }),
  ]);

  return { leads, total, page, perPage };
}

export async function getLeadById(
  leadId: string,
  userId: string,
  options?: { plan?: string; /** When set (Sales), lead must be assigned to this user. */ assignedToUserId?: string }
) {
  const plan = options?.plan;
  const assignedToUserId = options?.assignedToUserId;
  const where: { id: string; userId: string; assignedToUserId?: string } = { id: leadId, userId };
  if (assignedToUserId) {
    where.assignedToUserId = assignedToUserId;
  }
  const lead = await prisma.lead.findFirst({
    where,
    include: { form: true },
  });
  if (!lead) return null;
  if (plan === "free") {
    const capWhere: { userId: string; assignedToUserId?: string } = { userId };
    if (assignedToUserId) capWhere.assignedToUserId = assignedToUserId;
    const topIds = await prisma.lead.findMany({
      where: capWhere,
      orderBy: { createdAt: "desc" },
      take: FREE_PLAN_LEADS_CAP,
      select: { id: true },
    });
    const allowed = new Set(topIds.map((r) => r.id));
    if (!allowed.has(lead.id)) return null;
  }
  return lead;
}

export async function updateLeadFollowUpBy(
  leadId: string,
  userId: string,
  followUpBy: Date | null,
  options?: { assignedToUserId?: string }
) {
  const where: { id: string; userId: string; assignedToUserId?: string } = { id: leadId, userId };
  if (options?.assignedToUserId) where.assignedToUserId = options.assignedToUserId;
  const updated = await prisma.lead.updateMany({
    where,
    data: { followUpBy },
  });
  if (updated.count === 0) return null;
  return prisma.lead.findFirst({
    where: { id: leadId, userId },
    include: { form: { select: { id: true, name: true } }, stage: { select: { id: true, name: true } } },
  });
}

export async function deleteLead(leadId: string, userId: string, options?: { assignedToUserId?: string }) {
  const where: { id: string; userId: string; assignedToUserId?: string } = { id: leadId, userId };
  if (options?.assignedToUserId) where.assignedToUserId = options.assignedToUserId;
  return prisma.lead.deleteMany({ where });
}

export async function updateLeadAssignment(leadId: string, accountOwnerId: string, assignedToUserId: string | null) {
  const updated = await prisma.lead.updateMany({
    where: { id: leadId, userId: accountOwnerId },
    data: { assignedToUserId },
  });
  return updated.count > 0;
}

export function parseLeadData(dataJson: string | null | undefined): Record<string, unknown> {
  if (dataJson == null || dataJson === "") return {};
  try {
    const parsed = JSON.parse(dataJson) as unknown;
    if (parsed != null && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // ignore
  }
  return {};
}

export async function getLeadsForExport(
  userId: string,
  formId?: string,
  plan?: string,
  options?: { assignedToUserId?: string }
) {
  const where: { userId: string; formId?: string; assignedToUserId?: string } = { userId };
  if (formId) where.formId = formId;
  if (options?.assignedToUserId) where.assignedToUserId = options.assignedToUserId;
  const take = plan === "free" ? FREE_PLAN_LEADS_CAP : undefined;
  return prisma.lead.findMany({
    where,
    include: { form: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    ...(take != null ? { take } : {}),
  });
}
