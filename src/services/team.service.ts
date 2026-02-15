import { prisma } from "@/lib/db";
import { sendTeamInvite } from "@/lib/email";
import { getBaseUrlForEmail } from "@/lib/app-url";
import type { TeamMemberRole, TeamMemberStatus } from "@prisma/client";
import crypto from "crypto";

const INVITE_TOKEN_BYTES = 32;
const INVITE_EXPIRY_DAYS = 7;

export type TeamMemberRow = {
  id: string;
  email: string;
  role: TeamMemberRole;
  status: TeamMemberStatus;
  memberUserId: string | null;
  invitedAt: Date;
  inviteToken: string | null;
};

export async function listMembers(accountOwnerId: string): Promise<TeamMemberRow[]> {
  const rows = await prisma.teamMember.findMany({
    where: { accountOwnerId },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      memberUserId: true,
      invitedAt: true,
      inviteToken: true,
    },
    orderBy: [{ status: "asc" }, { invitedAt: "desc" }],
  });
  return rows;
}

export async function countMembers(accountOwnerId: string): Promise<number> {
  return prisma.teamMember.count({
    where: { accountOwnerId },
  });
}

export type TeamForMemberRow = { ownerId: string; ownerUsername: string; ownerName: string | null };

export async function listTeamsForMember(memberUserId: string): Promise<TeamForMemberRow[]> {
  const rows = await prisma.teamMember.findMany({
    where: { memberUserId, status: "active" },
    select: {
      accountOwnerId: true,
      accountOwner: { select: { username: true, name: true } },
    },
    orderBy: { invitedAt: "desc" },
  });
  return rows.map((r) => ({
    ownerId: r.accountOwnerId,
    ownerUsername: r.accountOwner.username,
    ownerName: r.accountOwner.name ?? null,
  }));
}

export async function inviteMember(
  accountOwnerId: string,
  params: { email: string; role: TeamMemberRole; invitedById: string }
): Promise<{ ok: true; member: TeamMemberRow } | { ok: false; error: string }> {
  const email = params.email.trim().toLowerCase();
  if (!email) return { ok: false, error: "Email is required." };

  const owner = await prisma.user.findUnique({
    where: { id: accountOwnerId },
    select: { id: true, email: true, name: true, username: true },
  });
  if (!owner) return { ok: false, error: "Account not found." };
  if (owner.email.toLowerCase() === email) {
    return { ok: false, error: "You cannot invite yourself." };
  }

  const existing = await prisma.teamMember.findFirst({
    where: { accountOwnerId, email },
  });
  if (existing) {
    if (existing.status === "pending") return { ok: false, error: "An invite is already pending for this email." };
    return { ok: false, error: "This user is already a team member." };
  }

  const inviteToken = crypto.randomBytes(INVITE_TOKEN_BYTES).toString("hex");
  const inviteTokenExpiresAt = new Date();
  inviteTokenExpiresAt.setDate(inviteTokenExpiresAt.getDate() + INVITE_EXPIRY_DAYS);

  const member = await prisma.teamMember.create({
    data: {
      accountOwnerId,
      email,
      role: params.role,
      status: "pending",
      inviteToken,
      inviteTokenExpiresAt,
      invitedById: params.invitedById,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      memberUserId: true,
      invitedAt: true,
      inviteToken: true,
    },
  });

  const ownerDisplayName = owner.name || owner.username;
  const isOwnerInviting = params.invitedById === accountOwnerId;
  let inviterDisplayName = ownerDisplayName;
  if (!isOwnerInviting) {
    const inviter = await prisma.user.findUnique({
      where: { id: params.invitedById },
      select: { name: true, username: true },
    });
    inviterDisplayName = inviter ? inviter.name || inviter.username : ownerDisplayName;
  }

  const baseUrl = getBaseUrlForEmail();
  const inviteLink = `${baseUrl}/accept-invite?token=${encodeURIComponent(inviteToken)}`;
  try {
    await sendTeamInvite(
      email,
      inviterDisplayName,
      inviteLink,
      isOwnerInviting ? undefined : ownerDisplayName
    );
  } catch (e) {
    console.error("[team] Failed to send invite email:", e);
    // Invite is created; still return success so the UI updates
  }

  return { ok: true, member };
}

export async function acceptInvite(
  token: string,
  memberUserId: string
): Promise<{ ok: true; ownerUsername: string; ownerId: string } | { ok: false; error: string }> {
  const trimmed = token?.trim();
  if (!trimmed) return { ok: false, error: "Invalid or expired invite link." };

  const member = await prisma.teamMember.findFirst({
    where: { inviteToken: trimmed, status: "pending" },
    include: { accountOwner: { select: { id: true, username: true } } },
  });
  if (!member) return { ok: false, error: "Invalid or expired invite link." };
  if (member.inviteTokenExpiresAt && member.inviteTokenExpiresAt < new Date()) {
    return { ok: false, error: "This invite has expired." };
  }

  const user = await prisma.user.findUnique({
    where: { id: memberUserId },
    select: { email: true },
  });
  if (!user) return { ok: false, error: "User not found." };
  if (user.email.toLowerCase() !== member.email.toLowerCase()) {
    return { ok: false, error: "This invite was sent to a different email address." };
  }

  await prisma.teamMember.update({
    where: { id: member.id },
    data: {
      memberUserId,
      status: "active",
      inviteToken: null,
      inviteTokenExpiresAt: null,
    },
  });

  return { ok: true, ownerUsername: member.accountOwner.username, ownerId: member.accountOwner.id };
}

export async function getInviteByToken(token: string): Promise<{
  email: string;
  ownerName: string;
  ownerUsername: string;
  /** When the inviter is not the account owner (e.g. admin invited), so the UI can show "X has invited you to join Y's team". */
  inviterName: string | null;
  expired: boolean;
} | null> {
  const trimmed = token?.trim();
  if (!trimmed) return null;

  const member = await prisma.teamMember.findFirst({
    where: { inviteToken: trimmed, status: "pending" },
    include: {
      accountOwner: { select: { id: true, name: true, username: true } },
      invitedBy: { select: { id: true, name: true, username: true } },
    },
  });
  if (!member) return null;

  const expired = !!(member.inviteTokenExpiresAt && member.inviteTokenExpiresAt < new Date());
  const ownerName = member.accountOwner.name || member.accountOwner.username;
  const inviterName =
    member.invitedBy && member.invitedBy.id !== member.accountOwner.id
      ? member.invitedBy.name || member.invitedBy.username
      : null;
  return {
    email: member.email,
    ownerName,
    ownerUsername: member.accountOwner.username,
    inviterName,
    expired,
  };
}

export async function updateMemberStatus(
  memberId: string,
  accountOwnerId: string,
  status: TeamMemberStatus
): Promise<{ ok: true } | { ok: false; error: string }> {
  const member = await prisma.teamMember.findFirst({
    where: { id: memberId, accountOwnerId },
  });
  if (!member) return { ok: false, error: "Team member not found." };

  await prisma.teamMember.update({
    where: { id: memberId },
    data: { status },
  });
  return { ok: true };
}

export async function updateMemberRole(
  memberId: string,
  accountOwnerId: string,
  role: TeamMemberRole
): Promise<{ ok: true } | { ok: false; error: string }> {
  const member = await prisma.teamMember.findFirst({
    where: { id: memberId, accountOwnerId },
  });
  if (!member) return { ok: false, error: "Team member not found." };

  await prisma.teamMember.update({
    where: { id: memberId },
    data: { role },
  });
  return { ok: true };
}

export async function removeMember(
  memberId: string,
  accountOwnerId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const member = await prisma.teamMember.findFirst({
    where: { id: memberId, accountOwnerId },
  });
  if (!member) return { ok: false, error: "Team member not found." };

  await prisma.teamMember.delete({
    where: { id: memberId },
  });
  return { ok: true };
}
