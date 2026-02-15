import { NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { canManageTeam } from "@/lib/team";
import { listMembers } from "@/services/team.service";

export async function GET() {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;

  if (!canManageTeam(session)) {
    return NextResponse.json({ error: "You don't have permission to view the team." }, { status: 403 });
  }

  const accountOwnerId = session.accountOwnerId ?? session.userId;
  const members = await listMembers(accountOwnerId);

  return NextResponse.json({
    members: members.map((m) => ({
      id: m.id,
      email: m.email,
      role: m.role,
      status: m.status,
      memberUserId: m.memberUserId,
      invitedAt: m.invitedAt.toISOString(),
    })),
  });
}
