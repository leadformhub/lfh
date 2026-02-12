import { prisma } from "@/lib/db";

/**
 * All lead submission data is stored in leads.data_json.
 * Metadata only: form_id, user_id, ip_address, user_agent, created_at.
 * No DB column mapping for form fields.
 */

export async function createLead(
  formId: string,
  userId: string,
  data: Record<string, unknown>,
  options?: { ipAddress?: string | null; userAgent?: string | null }
) {
  return prisma.lead.create({
    data: {
      formId,
      userId,
      dataJson: JSON.stringify(data),
      ipAddress: options?.ipAddress ?? null,
      userAgent: options?.userAgent ?? null,
    },
  });
}

const FREE_PLAN_LEADS_CAP = 50;

export async function getLeadsByUserId(
  userId: string,
  options: { page?: number; perPage?: number; formId?: string; search?: string; plan?: string } = {}
) {
  const page = Math.max(1, options.page ?? 1);
  const perPage = Math.min(100, Math.max(1, options.perPage ?? 25));
  const skip = (page - 1) * perPage;

  const where: { userId: string; formId?: string; dataJson?: { contains: string } } = { userId };
  const formId = options.formId?.trim();
  if (formId && formId !== "undefined" && formId !== "null") {
    where.formId = formId;
  }
  const search = options.search?.trim();
  if (search) {
    where.dataJson = { contains: search };
  }

  const isFree = options.plan === "free";

  if (isFree) {
    const topIds = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: FREE_PLAN_LEADS_CAP,
      select: { id: true },
    });
    const ids = topIds.map((r) => r.id);
    if (ids.length === 0) return { leads: [], total: 0, page, perPage };
    const total = ids.length;
    const paginatedIds = ids.slice(skip, skip + perPage);
    const leads = await prisma.lead.findMany({
      where: { id: { in: paginatedIds } },
      include: {
        form: { select: { id: true, name: true } },
        stage: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
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

export async function getLeadById(leadId: string, userId: string, plan?: string) {
  const lead = await prisma.lead.findFirst({
    where: { id: leadId, userId },
    include: { form: true },
  });
  if (!lead) return null;
  if (plan === "free") {
    const topIds = await prisma.lead.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: FREE_PLAN_LEADS_CAP,
      select: { id: true },
    });
    const allowed = new Set(topIds.map((r) => r.id));
    if (!allowed.has(lead.id)) return null;
  }
  return lead;
}

export async function deleteLead(leadId: string, userId: string) {
  return prisma.lead.deleteMany({
    where: { id: leadId, userId },
  });
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

export async function getLeadsForExport(userId: string, formId?: string, plan?: string) {
  const where: { userId: string; formId?: string } = { userId };
  if (formId) where.formId = formId;
  const take = plan === "free" ? FREE_PLAN_LEADS_CAP : undefined;
  return prisma.lead.findMany({
    where,
    include: { form: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    ...(take != null ? { take } : {}),
  });
}
