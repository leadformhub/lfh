import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import {
  createSuperAdminToken,
  getSuperAdminCredentials,
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
    const envCreds = getSuperAdminCredentials();
    if (envCreds && envCreds.email === email) {
      const envPasswordOk = await bcrypt.compare(password, envCreds.password).catch(() => false);
      const plainPasswordOk = password === envCreds.password;
      if (!envPasswordOk && !plainPasswordOk) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }
    } else {
      let superAdmin: { email: string; password: string } | null = null;
      try {
        superAdmin = await prisma.user.findFirst({
          where: {
            email,
            OR: [{ role: "super_admin" }, { username: "superadmin" }],
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
      if (!superAdmin.password) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }
      const hashedPasswordOk = await bcrypt.compare(password, superAdmin.password).catch(() => false);
      const plainPasswordOk = password === superAdmin.password;
      if (!hashedPasswordOk && !plainPasswordOk) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }
    }

    const token = await createSuperAdminToken(email);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(getSuperAdminCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: getSuperAdminSessionMaxAge(),
      path: "/",
    });
    return res;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("Can't reach database server")) {
      return NextResponse.json(
        { error: "Database is offline. Start MySQL and try again." },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
