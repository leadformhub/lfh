import type { SessionPayload } from "./jwt";

export function getAccountOwnerId(session: SessionPayload): string {
  return session.accountOwnerId ?? session.userId;
}

export function getRole(session: SessionPayload): SessionPayload["role"] {
  return session.role ?? "owner";
}

export function isOwner(session: SessionPayload): boolean {
  return getRole(session) === "owner";
}

export function canManageTeam(session: SessionPayload): boolean {
  const role = getRole(session);
  return role === "owner" || role === "admin";
}

export function canAccessBilling(session: SessionPayload): boolean {
  return isOwner(session);
}

export function canManageIntegrations(session: SessionPayload): boolean {
  const role = getRole(session);
  return role === "owner" || role === "admin";
}

export function canAssignLeads(session: SessionPayload): boolean {
  return canManageTeam(session);
}

export function canDeleteForms(session: SessionPayload): boolean {
  return isOwner(session) || getRole(session) === "admin";
}
