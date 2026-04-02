import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSuperAdminSession } from "@/lib/super-admin-auth";

export async function GET(req: NextRequest) {
  const session = await getSuperAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";
    const statusRaw = searchParams.get("status")?.trim() || "all";
    const planRaw = searchParams.get("plan")?.trim() || "all";
    const status = statusRaw === "active" || statusRaw === "banned" ? statusRaw : "all";
    const plan =
      planRaw === "free" || planRaw === "pro" || planRaw === "business" ? planRaw : "all";

    const whereClause: Prisma.UserWhereInput = {};
    if (q) {
      whereClause.OR = [
        { name: { contains: q } },
        { email: { contains: q } },
        { username: { contains: q } },
      ];
    }
    if (status !== "all") {
      whereClause.status = status;
    }
    if (plan !== "all") {
      whereClause.plan = plan;
    }

    let usersWithRole: Array<{
      id: string;
      name: string;
      username: string;
      email: string;
      role: "user" | "super_admin";
      plan: "free" | "pro" | "business";
      status: "active" | "banned";
      createdAt: Date;
      updatedAt: Date;
    }> = [];

    try {
      usersWithRole = await prisma.user.findMany({
        where: whereClause,
        orderBy: [{ createdAt: "desc" }],
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          role: true,
          plan: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
        take: 200,
      });
    } catch (error) {
      if (
        !(error instanceof Prisma.PrismaClientKnownRequestError) ||
        error.code !== "P2022"
      ) {
        throw error;
      }
      // Backward compatibility before role migration is applied.
      const usersWithoutRole = await prisma.user.findMany({
        where: whereClause,
        orderBy: [{ createdAt: "desc" }],
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          plan: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
        take: 200,
      });
      usersWithRole = usersWithoutRole.map((user) => ({ ...user, role: "user" as const }));
    }

    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase() || "";
    const decoratedUsers = usersWithRole.map((user) => ({
      ...user,
      isProtectedSuperAdmin:
        user.role === "super_admin" ||
        user.username.toLowerCase() === "superadmin" ||
        Boolean(superAdminEmail && user.email.toLowerCase() === superAdminEmail),
    }));

    return NextResponse.json({ users: decoratedUsers });
  } catch {
    return NextResponse.json({ error: "Failed to load users." }, { status: 500 });
  }
}
