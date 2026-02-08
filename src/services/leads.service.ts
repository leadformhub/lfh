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

export async function getLeadsByUserId(
  userId: string,
  options: { page?: number; perPage?: number; formId?: string; search?: string } = {}
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

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: { form: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
    }),
    prisma.lead.count({ where }),
  ]);

  return { leads, total, page, perPage };
}

export async function getLeadById(leadId: string, userId: string) {
  return prisma.lead.findFirst({
    where: { id: leadId, userId },
    include: { form: true },
  });
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

export async function getLeadsForExport(userId: string, formId?: string) {
  const where: { userId: string; formId?: string } = { userId };
  if (formId) where.formId = formId;
  return prisma.lead.findMany({
    where,
    include: { form: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
}
