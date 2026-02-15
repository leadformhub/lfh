import { NextRequest, NextResponse } from "next/server";
import { getInviteByToken } from "@/services/team.service";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")?.trim();
  if (!token) {
    return NextResponse.json({ error: "Missing token." }, { status: 400 });
  }

  const invite = await getInviteByToken(token);
  if (!invite) {
    return NextResponse.json({ error: "Invalid or expired invite link." }, { status: 404 });
  }

  return NextResponse.json({
    email: invite.email,
    ownerName: invite.ownerName,
    ownerUsername: invite.ownerUsername,
    inviterName: invite.inviterName,
    expired: invite.expired,
  });
}
