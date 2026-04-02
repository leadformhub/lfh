import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSuperAdminSession } from "@/lib/super-admin-auth";

const patchSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  username: z
    .string()
    .trim()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphen, underscore")
    .optional(),
  email: z.string().trim().email().optional(),
  plan: z.enum(["free", "pro", "business"]).optional(),
  status: z.enum(["active", "banned"]).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await getSuperAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { userId } = await params;
  if (!userId) return NextResponse.json({ error: "Missing user id." }, { status: 400 });

  try {
    let existingUser:
      | {
          email: string;
          username: string;
          role: "user" | "super_admin";
        }
      | {
          email: string;
          username: string;
          role: "user";
        }
      | null = null;
    try {
      existingUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, username: true, role: true },
      });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2022") {
        throw error;
      }
      existingUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, username: true },
      });
      existingUser = existingUser ? { ...existingUser, role: "user" } : null;
    }
    if (!existingUser) return NextResponse.json({ error: "User not found." }, { status: 404 });

    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase() || "";
    const isProtectedSuperAdminByRole = existingUser.role === "super_admin";
    const isProtectedSuperAdmin =
      isProtectedSuperAdminByRole ||
      existingUser.username.toLowerCase() === "superadmin" ||
      Boolean(superAdminEmail && existingUser.email.toLowerCase() === superAdminEmail);
    if (isProtectedSuperAdmin) {
      return NextResponse.json(
        { error: "Super admin account is protected and cannot be modified here." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const payload = {
      ...parsed.data,
      ...(parsed.data.email ? { email: parsed.data.email.toLowerCase() } : {}),
      ...(parsed.data.username ? { username: parsed.data.username.toLowerCase() } : {}),
    };
    if (Object.keys(payload).length === 0) {
      return NextResponse.json({ error: "No fields to update." }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: payload,
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
    });

    return NextResponse.json({ user: updated, message: "User updated successfully." });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "Email or username already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
  }
}
