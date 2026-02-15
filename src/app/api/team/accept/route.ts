import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getVerifiedSessionOrResponse, CURRENT_ACCOUNT_COOKIE } from "@/lib/auth";
import { getSessionMaxAge } from "@/lib/jwt";
import { acceptInvite } from "@/services/team.service";

const bodySchema = z.object({
  token: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;

  const body = await req.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid or expired invite link." }, { status: 400 });
  }

  const acceptResult = await acceptInvite(parsed.data.token, session.userId);

  if (!acceptResult.ok) {
    return NextResponse.json({ error: acceptResult.error }, { status: 400 });
  }

  const res = NextResponse.json({ ownerUsername: acceptResult.ownerUsername });
  res.cookies.set(CURRENT_ACCOUNT_COOKIE, acceptResult.ownerId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: getSessionMaxAge(),
    path: "/",
  });
  return res;
}
