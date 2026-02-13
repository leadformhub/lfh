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

/** Leads submitted today (lightweight count). */
export async function getLeadsToday(userId: string): Promise<number> {
  return prisma.lead.count({
    where: { userId, createdAt: { gte: startOfTodayUTC() } },
  });
}

/** Leads submitted this month (lightweight count). */
export async function getLeadsThisMonth(userId: string): Promise<number> {
  return prisma.lead.count({
    where: { userId, createdAt: { gte: startOfMonthUTC() } },
  });
}

/** Overall conversion rate (submissions / views * 100). Returns 0 if no views. */
export async function getConversionRate(userId: string): Promise<number> {
  const [views, submissions] = await Promise.all([
    prisma.analyticsEvent.count({
      where: { type: "view", form: { userId } },
    }),
    prisma.lead.count({ where: { userId } }),
  ]);
  if (views === 0) return 0;
  return Math.round((submissions / views) * 100 * 10) / 10;
}

/** Single top-performing form by submission count (lightweight). */
export async function getTopPerformingForm(
  userId: string
): Promise<{ id: string; name: string; submissions: number } | null> {
  const forms = await prisma.form.findMany({
    where: { userId },
    select: { id: true, name: true, _count: { select: { leads: true } } },
  });
  if (forms.length === 0) return null;
  const top = forms.reduce((a, b) =>
    a._count.leads >= b._count.leads ? a : b
  );
  return {
    id: top.id,
    name: top.name,
    submissions: top._count.leads,
  };
}

export async function getTopForms(userId: string, limit = 5) {
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

/** Submissions per day for last N days (from Lead table). Uses DB aggregation for scale. */
export async function getSubmissionsOverTime(userId: string, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);

  type Row = { date: Date; submissions: bigint };
  const rows = await prisma.$queryRaw<Row[]>`
    SELECT DATE(created_at) as date, COUNT(*) as submissions
    FROM Lead
    WHERE user_id = ${userId} AND created_at >= ${since}
    GROUP BY DATE(created_at)
    ORDER BY date
  `;

  const byDay: Record<string, number> = {};
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    byDay[d.toISOString().slice(0, 10)] = 0;
  }
  for (const row of rows) {
    const dateKey = row.date instanceof Date ? row.date.toISOString().slice(0, 10) : String(row.date).slice(0, 10);
    if (byDay[dateKey] != null) {
      byDay[dateKey] = Number(row.submissions);
    }
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

export async function getRecentLeads(userId: string, limit = 5) {
  const leads = await prisma.lead.findMany({
    where: { userId },
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
