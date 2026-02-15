import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { canManageTeam } from "@/lib/team";
import { updateMemberStatus, updateMemberRole, removeMember } from "@/services/team.service";
import type { TeamMemberStatus, TeamMemberRole } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;

  if (!canManageTeam(session)) {
    return NextResponse.json({ error: "You don't have permission to manage team members." }, { status: 403 });
  }

  const accountOwnerId = session.accountOwnerId ?? session.userId;
  const { memberId } = await params;

  const body = await req.json().catch(() => ({}));
  const status = body.status as TeamMemberStatus | undefined;
  const role = body.role as TeamMemberRole | undefined;

  if (role === "admin" || role === "sales") {
    const updateResult = await updateMemberRole(memberId, accountOwnerId, role);
    if (!updateResult.ok) {
      return NextResponse.json({ error: updateResult.error }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  }

  if (status === "active" || status === "inactive") {
    const updateResult = await updateMemberStatus(memberId, accountOwnerId, status);
    if (!updateResult.ok) {
      return NextResponse.json({ error: updateResult.error }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid status or role." }, { status: 400 });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;

  if (!canManageTeam(session)) {
    return NextResponse.json({ error: "You don't have permission to remove team members." }, { status: 403 });
  }

  const accountOwnerId = session.accountOwnerId ?? session.userId;
  const { memberId } = await params;

  const removeResult = await removeMember(memberId, accountOwnerId);
  if (!removeResult.ok) {
    return NextResponse.json({ error: removeResult.error }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
