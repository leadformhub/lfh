import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getVerifiedSessionOrResponse } from "@/lib/auth";
import { canManageTeam } from "@/lib/team";
import { getMaxTeamMembers } from "@/lib/plans";
import type { PlanKey } from "@/lib/plans";
import { inviteMember } from "@/services/team.service";
import { countMembers } from "@/services/team.service";

const bodySchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "sales"]),
});

export async function POST(req: NextRequest) {
  const result = await getVerifiedSessionOrResponse();
  if ("response" in result) return result.response;
  const session = result.session;

  if (!canManageTeam(session)) {
    return NextResponse.json({ error: "You don't have permission to invite team members." }, { status: 403 });
  }

  const accountOwnerId = session.accountOwnerId ?? session.userId;
  const planKey = (session.plan ?? "free") as PlanKey;
  const maxMembers = getMaxTeamMembers(planKey);

  if (maxMembers === 0) {
    return NextResponse.json(
      { error: "Upgrade to Pro to invite team members." },
      { status: 403 }
    );
  }

  const currentCount = await countMembers(accountOwnerId);
  const totalSlots = maxMembers === Infinity ? Infinity : maxMembers - 1; // owner counts as 1
  if (currentCount >= totalSlots) {
    return NextResponse.json(
      { error: "Team limit reached. Upgrade to Agency for unlimited members." },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const first = Object.values(fieldErrors).flat().find(Boolean);
    return NextResponse.json(
      { error: first || "Invalid email or role." },
      { status: 400 }
    );
  }

  const inviteResult = await inviteMember(accountOwnerId, {
    email: parsed.data.email,
    role: parsed.data.role,
    invitedById: session.userId,
  });

  if (!inviteResult.ok) {
    return NextResponse.json({ error: inviteResult.error }, { status: 400 });
  }

  return NextResponse.json({
    member: {
      id: inviteResult.member.id,
      email: inviteResult.member.email,
      role: inviteResult.member.role,
      status: inviteResult.member.status,
      invitedAt: inviteResult.member.invitedAt.toISOString(),
    },
  });
}
