import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import {
  createSuperAdminToken,
  getSuperAdminCookieName,
  getSuperAdminSessionMaxAge,
} from "@/lib/super-admin-auth";
import { prisma } from "@/lib/db";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid credentials format" }, { status: 400 });
    }

    const email = parsed.data.email.trim().toLowerCase();
    const password = parsed.data.password;
    let superAdmin: { email: string; password: string } | null = null;
    try {
      superAdmin = await prisma.user.findFirst({
        where: {
          email,
          role: "super_admin",
          authProvider: "email",
          status: "active",
        },
        select: {
          email: true,
          password: true,
        },
      });
    } catch {
      // Backward compatibility before role migration is applied.
      superAdmin = await prisma.user.findFirst({
        where: {
          email,
          username: "superadmin",
          authProvider: "email",
          status: "active",
        },
        select: {
          email: true,
          password: true,
        },
      });
    }
    if (!superAdmin) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    const passwordOk = await bcrypt.compare(password, superAdmin.password);
    if (!passwordOk) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await createSuperAdminToken(superAdmin.email);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(getSuperAdminCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: getSuperAdminSessionMaxAge(),
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
