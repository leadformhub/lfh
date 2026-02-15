import { prisma } from "@/lib/db";

export async function recordEvent(formId: string, type: "view" | "submission", metadata?: Record<string, unknown>) {
  return prisma.analyticsEvent.create({
    data: {
      formId,
      type,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });
}

export async function getFormStats(formId: string, userId: string) {
  const form = await prisma.form.findFirst({ where: { id: formId, userId } });
  if (!form) return null;

  const [views, submissions] = await Promise.all([
    prisma.analyticsEvent.count({ where: { formId, type: "view" } }),
    prisma.analyticsEvent.count({ where: { formId, type: "submission" } }),
  ]);

  return { formId, views, submissions, conversionRate: views > 0 ? (submissions / views) * 100 : 0 };
}

export async function getDailyStats(formId: string, userId: string, days = 30) {
  const form = await prisma.form.findFirst({ where: { id: formId, userId } });
  if (!form) return null;

  const since = new Date();
  since.setDate(since.getDate() - days);

  const events = await prisma.analyticsEvent.findMany({
    where: { formId, createdAt: { gte: since } },
    select: { type: true, createdAt: true },
  });

  const byDay: Record<string, { views: number; submissions: number }> = {};
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const key = d.toISOString().slice(0, 10);
    byDay[key] = { views: 0, submissions: 0 };
  }
  for (const e of events) {
    const key = e.createdAt.toISOString().slice(0, 10);
    if (!byDay[key]) byDay[key] = { views: 0, submissions: 0 };
    if (e.type === "view") byDay[key].views++;
    else if (e.type === "submission") byDay[key].submissions++;
  }
  return Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, data]) => ({ date, ...data }));
}

export async function getDashboardStats(userId: string) {
  const [formCount, leadCount] = await Promise.all([
    prisma.form.count({ where: { userId } }),
    prisma.lead.count({ where: { userId } }),
  ]);
  return {
    totalForms: formCount,
    totalSubmissions: leadCount,
    automationEnabled: 0,
  };
}

/** Start of today UTC (for lead counts). */
function startOfTodayUTC(): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/** Start of current month UTC. */
function startOfMonthUTC(): Date {
  const d = new Date();
  d.setUTCDate(1);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/** Leads submitted today (lightweight count). Optional assignedToUserId for Sales. */
export async function getLeadsToday(userId: string, assignedToUserId?: string): Promise<number> {
  const where: { userId: string; createdAt: { gte: Date }; assignedToUserId?: string } = {
    userId,
    createdAt: { gte: startOfTodayUTC() },
  };
  if (assignedToUserId) where.assignedToUserId = assignedToUserId;
  return prisma.lead.count({ where });
}

/** Leads submitted this month (lightweight count). Optional assignedToUserId for Sales. */
export async function getLeadsThisMonth(userId: string, assignedToUserId?: string): Promise<number> {
  const where: { userId: string; createdAt: { gte: Date }; assignedToUserId?: string } = {
    userId,
    createdAt: { gte: startOfMonthUTC() },
  };
  if (assignedToUserId) where.assignedToUserId = assignedToUserId;
  return prisma.lead.count({ where });
}

/** Overall conversion rate (submissions / views * 100). Returns 0 if no views. Optional assignedToUserId for Sales. */
export async function getConversionRate(userId: string, assignedToUserId?: string): Promise<number> {
  const leadWhere: { userId: string; assignedToUserId?: string } = { userId };
  if (assignedToUserId) leadWhere.assignedToUserId = assignedToUserId;
  const [views, submissions] = await Promise.all([
    prisma.analyticsEvent.count({
      where: { type: "view", form: { userId } },
    }),
    prisma.lead.count({ where: leadWhere }),
  ]);
  if (views === 0) return 0;
  return Math.round((submissions / views) * 100 * 10) / 10;
}

/** Single top-performing form by submission count (lightweight). Optional assignedToUserId for Sales. */
export async function getTopPerformingForm(
  userId: string,
  assignedToUserId?: string
): Promise<{ id: string; name: string; submissions: number } | null> {
  if (assignedToUserId) {
    const byForm = await prisma.lead.groupBy({
      by: ["formId"],
      where: { userId, assignedToUserId, formId: { not: null } },
      _count: { id: true },
    });
    if (byForm.length === 0) return null;
    const top = byForm.reduce((a, b) => (a._count.id >= b._count.id ? a : b));
    const form = await prisma.form.findFirst({
      where: { id: top.formId!, userId },
      select: { id: true, name: true },
    });
    return form ? { id: form.id, name: form.name, submissions: top._count.id } : null;
  }
  const forms = await prisma.form.findMany({
    where: { userId },
    select: { id: true, name: true, _count: { select: { leads: true } } },
  });
  if (forms.length === 0) return null;
  const top = forms.reduce((a, b) => (a._count.leads >= b._count.leads ? a : b));
  return { id: top.id, name: top.name, submissions: top._count.leads };
}

export async function getTopForms(userId: string, limit = 5, assignedToUserId?: string) {
  if (assignedToUserId) {
    const byForm = await prisma.lead.groupBy({
      by: ["formId"],
      where: { userId, assignedToUserId, formId: { not: null } },
      _count: { id: true },
    });
    byForm.sort((a, b) => b._count.id - a._count.id);
    const topSlice = byForm.slice(0, limit);
    const formIds = topSlice.map((r) => r.formId!).filter(Boolean);
    const forms = await prisma.form.findMany({
      where: { id: { in: formIds }, userId },
      select: { id: true, name: true },
    });
    const formMap = new Map(forms.map((f) => [f.id, f]));
    const views = await prisma.analyticsEvent.groupBy({
      by: ["formId"],
      where: { formId: { in: formIds }, type: "view" },
      _count: true,
    });
    const viewMap = Object.fromEntries(views.map((v) => [v.formId, v._count]));
    return topSlice.map((r) => {
      const form = formMap.get(r.formId!);
      return {
        id: r.formId!,
        name: form?.name ?? "Form",
        submissions: r._count.id,
        views: viewMap[r.formId!] ?? 0,
      };
    });
  }
  const forms = await prisma.form.findMany({
    where: { userId },
    include: { _count: { select: { leads: true } } },
  });
  forms.sort((a, b) => b._count.leads - a._count.leads);
  const top = forms.slice(0, limit);
  const formIds = top.map((f) => f.id);
  const views = await prisma.analyticsEvent.groupBy({
    by: ["formId"],
    where: { formId: { in: formIds }, type: "view" },
    _count: true,
  });
  const viewMap = Object.fromEntries(views.map((v) => [v.formId, v._count]));
  return top.map((f) => ({
    id: f.id,
    name: f.name,
    submissions: f._count.leads,
    views: viewMap[f.id] ?? 0,
  }));
}

/** Submissions per day for last N days (from Lead table). Optional assignedToUserId for Sales. */
export async function getSubmissionsOverTime(userId: string, days = 30, assignedToUserId?: string) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);

  const where: { userId: string; createdAt: { gte: Date }; assignedToUserId?: string } = {
    userId,
    createdAt: { gte: since },
  };
  if (assignedToUserId) where.assignedToUserId = assignedToUserId;

  const leads = await prisma.lead.findMany({
    where,
    select: { createdAt: true },
  });
  const byDay: Record<string, number> = {};
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    byDay[d.toISOString().slice(0, 10)] = 0;
  }
  for (const l of leads) {
    const key = l.createdAt.toISOString().slice(0, 10);
    if (byDay[key] != null) byDay[key]++;
  }
  return Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, submissions]) => ({ date, submissions }));
}

/** Views per day for last N days (from AnalyticsEvent) across all user forms */
export async function getViewsOverTime(userId: string, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);

  const events = await prisma.analyticsEvent.findMany({
    where: {
      type: "view",
      createdAt: { gte: since },
      form: { userId },
    },
    select: { createdAt: true },
  });

  const byDay: Record<string, number> = {};
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    byDay[d.toISOString().slice(0, 10)] = 0;
  }
  for (const e of events) {
    const key = e.createdAt.toISOString().slice(0, 10);
    if (byDay[key] != null) byDay[key]++;
  }
  return Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, views: count }));
}

/** All forms with views, submissions, conversion rate for charts */
export async function getAllFormsWithStats(userId: string) {
  const forms = await prisma.form.findMany({
    where: { userId },
    include: { _count: { select: { leads: true } } },
  });
  const formIds = forms.map((f) => f.id);
  const views = await prisma.analyticsEvent.groupBy({
    by: ["formId"],
    where: { formId: { in: formIds }, type: "view" },
    _count: true,
  });
  const viewMap = Object.fromEntries(views.map((v) => [v.formId, v._count]));
  return forms.map((f) => {
    const v = viewMap[f.id] ?? 0;
    const s = f._count.leads;
    return {
      id: f.id,
      name: f.name,
      views: v,
      submissions: s,
      conversionRate: v > 0 ? (s / v) * 100 : 0,
    };
  });
}

/** Total views across all user forms */
export async function getTotalViews(userId: string) {
  return prisma.analyticsEvent.count({
    where: { type: "view", form: { userId } },
  });
}

/** View counts per form (for forms list / per-form analytics). Returns formId -> view count. */
export async function getViewCountsForFormIds(formIds: string[]): Promise<Record<string, number>> {
  if (formIds.length === 0) return {};
  const rows = await prisma.analyticsEvent.groupBy({
    by: ["formId"],
    where: { formId: { in: formIds }, type: "view" },
    _count: true,
  });
  return Object.fromEntries(rows.map((r) => [r.formId, r._count]));
}

export async function getRecentLeads(userId: string, limit = 5, assignedToUserId?: string) {
  const where: { userId: string; assignedToUserId?: string } = { userId };
  if (assignedToUserId) where.assignedToUserId = assignedToUserId;
  const leads = await prisma.lead.findMany({
    where,
    include: { form: { select: { name: true, id: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return leads.map((l) => {
    let preview = "New submission";
    try {
      const data = JSON.parse(l.dataJson) as Record<string, string>;
      const parts = Object.entries(data)
        .filter(([, v]) => v && typeof v === "string")
        .slice(0, 2)
        .map(([, v]) => (v.length > 20 ? v.slice(0, 20) + "…" : v));
      if (parts.length) preview = parts.join(" · ");
    } catch {
      // ignore
    }
    return {
      id: l.id,
      formTitle: l.form?.name ?? "Form Deleted",
      formId: l.form?.id ?? "",
      preview,
      submittedAt: l.createdAt,
    };
  });
}

/** Referrers from our own app (localhost or site host) are treated as no referrer, so source = Direct. */
function isOwnSiteReferrer(referrerUrl: string | null): boolean {
  if (!referrerUrl?.trim()) return false;
  try {
    const ref = new URL(referrerUrl);
    const host = ref.hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1") return true;
    const siteUrl = process.env.NEXTAUTH_URL || process.env.SITE_URL || "";
    if (siteUrl) {
      const siteHost = new URL(siteUrl).hostname.toLowerCase();
      if (host === siteHost) return true;
    }
    if (host.endsWith("leadformhub.com")) return true;
    return false;
  } catch {
    return false;
  }
}

function normalizeSource(utmSource: string | null, referrerUrl: string | null): string {
  const src = utmSource?.trim();
  if (src) return src;
  const ref = referrerUrl?.trim();
  if (!ref) return "Direct";
  if (isOwnSiteReferrer(referrerUrl)) return "Direct";
  return "Organic";
}

/** Leads grouped by normalized source (utm_source, or Direct/Organic). Won = stage name "Won" (case-insensitive). */
export async function getLeadsBySource(userId: string): Promise<{ source: string; leads: number; won: number }[]> {
  const leads = await prisma.lead.findMany({
    where: { userId },
    select: { utmSource: true, referrerUrl: true, stage: { select: { name: true } } },
  });
  const bySource = new Map<string, { leads: number; won: number }>();
  for (const l of leads) {
    const source = normalizeSource(l.utmSource, l.referrerUrl);
    const cur = bySource.get(source) ?? { leads: 0, won: 0 };
    cur.leads += 1;
    if (l.stage?.name?.toLowerCase() === "won") cur.won += 1;
    bySource.set(source, cur);
  }
  return Array.from(bySource.entries())
    .map(([source, counts]) => ({ source, leads: counts.leads, won: counts.won }))
    .sort((a, b) => b.leads - a.leads);
}

/** Leads grouped by utm_campaign. Won = stage name "Won" (case-insensitive). */
export async function getLeadsByCampaign(userId: string): Promise<{ campaign: string; source?: string; leads: number; won: number }[]> {
  const leads = await prisma.lead.findMany({
    where: { userId },
    select: { utmCampaign: true, utmSource: true, referrerUrl: true, stage: { select: { name: true } } },
  });
  const byCampaign = new Map<string, { leads: number; won: number; sourceSample: string | null }>();
  for (const l of leads) {
    const campaign = l.utmCampaign?.trim() || "(none)";
    const cur = byCampaign.get(campaign) ?? { leads: 0, won: 0, sourceSample: null };
    cur.leads += 1;
    if (l.stage?.name?.toLowerCase() === "won") cur.won += 1;
    if (!cur.sourceSample && (l.utmSource?.trim() || l.referrerUrl?.trim()))
      cur.sourceSample = normalizeSource(l.utmSource, l.referrerUrl);
    byCampaign.set(campaign, cur);
  }
  return Array.from(byCampaign.entries())
    .map(([campaign, counts]) => ({
      campaign,
      source: counts.sourceSample ?? undefined,
      leads: counts.leads,
      won: counts.won,
    }))
    .sort((a, b) => b.leads - a.leads);
}
