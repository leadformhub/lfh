import { NextRequest, NextResponse } from "next/server";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { canAssignLeads } from "@/lib/team";
import { updateLeadAssignment } from "@/services/leads.service";
import { createLeadActivity } from "@/services/lead-activity.service";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;

  if (!canAssignLeads(session)) {
    return NextResponse.json({ error: "You don't have permission to assign leads." }, { status: 403 });
  }

  const accountOwnerId = session.accountOwnerId ?? session.userId;
  const { leadId } = await params;
  if (!leadId) return NextResponse.json({ error: "Lead ID required" }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const assignedToUserId = body.assignedToUserId === null || body.assignedToUserId === "" ? null : (body.assignedToUserId as string | undefined);
  if (assignedToUserId !== null && typeof assignedToUserId !== "string") {
    return NextResponse.json({ error: "Invalid assignedToUserId." }, { status: 400 });
  }

  let assigneeEmail: string | null = null;
  if (assignedToUserId) {
    const member = await prisma.teamMember.findFirst({
      where: { accountOwnerId, memberUserId: assignedToUserId, status: "active" },
      select: { email: true },
    });
    if (!member) {
      return NextResponse.json({ error: "User is not a team member of this account." }, { status: 400 });
    }
    assigneeEmail = member.email;
  }

  const leadBefore = await prisma.lead.findFirst({
    where: { id: leadId, userId: accountOwnerId },
    select: { assignedToUserId: true },
  });
  const fromAssignedToUserId = leadBefore?.assignedToUserId ?? null;

  const updated = await updateLeadAssignment(leadId, accountOwnerId, assignedToUserId ?? null);
  if (!updated) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  let fromAssignedToEmail: string | null = null;
  if (fromAssignedToUserId) {
    const prevMember = await prisma.teamMember.findFirst({
      where: { accountOwnerId, memberUserId: fromAssignedToUserId },
      select: { email: true },
    });
    if (prevMember) fromAssignedToEmail = prevMember.email;
  }

  const assignedByEmail = session.email ?? undefined;
  const assignedByUsername = session.username ?? undefined;
  const metadata: Record<string, unknown> = assignedToUserId
    ? { assignedToUserId, assignedToEmail: assigneeEmail, assignedByEmail, assignedByUsername }
    : { assignedToUserId: null, fromAssignedToEmail, assignedByEmail, assignedByUsername };
  await createLeadActivity(leadId, "assigned", metadata).catch((err) =>
    console.error("[leads/assign] Failed to log assignment activity:", err)
  );

  return NextResponse.json({ ok: true, assignedToEmail: assigneeEmail });
}
