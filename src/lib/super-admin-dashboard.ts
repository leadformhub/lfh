import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export type DashboardDetailType =
  | "today_forms"
  | "today_users"
  | "free_users"
  | "premium_users";

/** UTC calendar day bounds for “today” (stable on typical Node/server deployments). */
export function getUtcTodayBounds(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0),
  );
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

/** Exclude super_admin rows when the role column exists (matches users API behavior). */
async function tenantUsersOnly(): Promise<Prisma.UserWhereInput> {
  try {
    await prisma.user.findFirst({ select: { role: true } });
    return { role: "user" };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2022"
    ) {
      return {};
    }
    throw error;
  }
}

export type SuperAdminDashboardStats = {
  todayFormsCreated: number;
  todayUsersCreated: number;
  totalFreeUsers: number;
  totalPremiumUsers: number;
};

export async function getSuperAdminDashboardStats(): Promise<SuperAdminDashboardStats> {
  const { start, end } = getUtcTodayBounds();
  const tenant = await tenantUsersOnly();

  const [
    todayFormsCreated,
    todayUsersCreated,
    totalFreeUsers,
    totalPremiumUsers,
  ] = await Promise.all([
    prisma.form.count({
      where: { createdAt: { gte: start, lt: end } },
    }),
    prisma.user.count({
      where: { ...tenant, createdAt: { gte: start, lt: end } },
    }),
    prisma.user.count({
      where: { ...tenant, plan: "free" },
    }),
    prisma.user.count({
      where: { ...tenant, plan: { in: ["pro", "business"] } },
    }),
  ]);

  return {
    todayFormsCreated,
    todayUsersCreated,
    totalFreeUsers,
    totalPremiumUsers,
  };
}

export type TodayFormDetail = {
  id: string;
  name: string;
  createdAt: string;
  ownerUsername: string;
  ownerEmail: string;
  ownerName: string;
};

export type UserListDetail = {
  id: string;
  name: string;
  username: string;
  email: string;
  plan: "free" | "pro" | "business";
  status: "active" | "banned";
  createdAt: string;
};

const DETAIL_LIMIT = 150;

export async function getSuperAdminDashboardDetails(type: DashboardDetailType): Promise<
  | { type: "today_forms"; items: TodayFormDetail[]; totalCount: number }
  | { type: "today_users"; items: UserListDetail[]; totalCount: number }
  | { type: "free_users"; items: UserListDetail[]; totalCount: number }
  | { type: "premium_users"; items: UserListDetail[]; totalCount: number }
> {
  const { start, end } = getUtcTodayBounds();
  const tenant = await tenantUsersOnly();

  if (type === "today_forms") {
    const where = { createdAt: { gte: start, lt: end } as const };
    const [totalCount, forms] = await Promise.all([
      prisma.form.count({ where }),
      prisma.form.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: DETAIL_LIMIT,
        select: {
          id: true,
          name: true,
          createdAt: true,
          user: { select: { username: true, email: true, name: true } },
        },
      }),
    ]);
    return {
      type: "today_forms",
      totalCount,
      items: forms.map((f) => ({
        id: f.id,
        name: f.name,
        createdAt: f.createdAt.toISOString(),
        ownerUsername: f.user.username,
        ownerEmail: f.user.email,
        ownerName: f.user.name,
      })),
    };
  }

  const userSelect = {
    id: true,
    name: true,
    username: true,
    email: true,
    plan: true,
    status: true,
    createdAt: true,
  } as const;

  if (type === "today_users") {
    const where = { ...tenant, createdAt: { gte: start, lt: end } };
    const [totalCount, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: DETAIL_LIMIT,
        select: userSelect,
      }),
    ]);
    return {
      type: "today_users",
      totalCount,
      items: users.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
      })),
    };
  }

  if (type === "free_users") {
    const where = { ...tenant, plan: "free" as const };
    const [totalCount, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: DETAIL_LIMIT,
        select: userSelect,
      }),
    ]);
    return {
      type: "free_users",
      totalCount,
      items: users.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
      })),
    };
  }

  const where = { ...tenant, plan: { in: ["pro", "business"] } };
  const [totalCount, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: DETAIL_LIMIT,
      select: userSelect,
    }),
  ]);
  return {
    type: "premium_users",
    totalCount,
    items: users.map((u) => ({
      ...u,
      createdAt: u.createdAt.toISOString(),
    })),
  };
}
