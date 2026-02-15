"use client";

import { useState, useEffect } from "react";
type Member = {
  id: string;
  email: string;
  role: string;
  status: string;
  invitedAt: string;
};

export function TeamManagement({
  username,
  plan,
  maxMembers,
  initialMembers = [],
}: {
  username: string;
  plan: string;
  maxMembers: number;
  initialMembers?: Member[];
}) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [loading, setLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "sales">("sales");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const atLimit = maxMembers !== Infinity && members.length >= maxMembers - 1;

  function fetchMembers() {
    setLoading(true);
    fetch("/api/team")
      .then((r) => r.json())
      .then((data) => {
        if (data.members) setMembers(data.members);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviteError("");
    const email = inviteEmail.trim().toLowerCase();
    if (!email) return;
    setInviteLoading(true);
    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: inviteRole }),
      });
      let data: { member?: Member & { invitedAt: string }; error?: string | Record<string, string[]> } = {};
      try {
        data = await res.json();
      } catch {
        setInviteError("Something went wrong. Please try again.");
        return;
      }
      if (!res.ok) {
        const err = data.error;
        const message =
          typeof err === "string"
            ? err
            : err && typeof err === "object"
              ? Object.values(err).flat().filter(Boolean)[0] || "Failed to send invite."
              : "Failed to send invite.";
        setInviteError(message);
        return;
      }
      setInviteEmail("");
      setMembers((prev) => [...prev, { ...data.member!, invitedAt: data.member!.invitedAt || new Date().toISOString() }]);
    } catch {
      setInviteError("Something went wrong. Please try again.");
    } finally {
      setInviteLoading(false);
    }
  }

  async function handleToggleStatus(member: Member) {
    if (member.status === "pending") return;
    const next = member.status === "active" ? "inactive" : "active";
    setActionLoading(member.id);
    try {
      const res = await fetch(`/api/team/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (res.ok) {
        setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, status: next } : m)));
      }
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRemove(member: Member) {
    if (!confirm(`Remove ${member.email} from the team?`)) return;
    setActionLoading(member.id);
    try {
      const res = await fetch(`/api/team/${member.id}`, { method: "DELETE" });
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== member.id));
      }
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCancelInvite(member: Member) {
    if (!confirm("Cancel this invitation? They will need to be invited again to join.")) return;
    setActionLoading(member.id);
    try {
      const res = await fetch(`/api/team/${member.id}`, { method: "DELETE" });
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== member.id));
      }
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRoleChange(member: Member, newRole: "admin" | "sales") {
    if (newRole === member.role) return;
    setActionLoading(member.id);
    try {
      const res = await fetch(`/api/team/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, role: newRole } : m)));
      }
    } finally {
      setActionLoading(null);
    }
  }

  const roleBadgeClass = (role: string) => {
    if (role === "owner") return "bg-[var(--color-accent)]/15 text-[var(--color-accent)] font-medium";
    if (role === "admin") return "bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-medium";
    return "bg-[var(--neutral-100)] text-[var(--foreground-muted)]";
  };

  const statusBadgeClass = (status: string) => {
    if (status === "active") return "bg-emerald-500/10 text-emerald-700";
    if (status === "pending") return "bg-amber-500/10 text-amber-700";
    return "bg-[var(--neutral-100)] text-[var(--foreground-muted)]";
  };

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Account owner row */}
      <section className="min-w-0 rounded-xl border border-[var(--border-default)] bg-white shadow-[var(--shadow-sm)] overflow-hidden">
        <div className="flex items-center gap-3 px-4 sm:px-5 md:px-6 py-3 sm:py-4 border-b border-[var(--border-default)] bg-[var(--background-alt)]">
          <h2 className="text-base sm:text-lg font-semibold text-[var(--foreground-heading)]">Account owner</h2>
        </div>
        <div className="px-4 sm:px-5 md:px-6 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[var(--foreground)] font-medium">You</span>
            <span className={["rounded-md px-2 py-0.5 text-xs font-medium", roleBadgeClass("owner")].join(" ")}>
              Owner
            </span>
          </div>
        </div>
      </section>

      {/* Invite form */}
      <section className="min-w-0 rounded-xl border border-[var(--border-default)] bg-white shadow-[var(--shadow-sm)] overflow-hidden">
        <div className="flex items-center gap-3 px-4 sm:px-5 md:px-6 py-3 sm:py-4 border-b border-[var(--border-default)] bg-[var(--background-alt)]">
          <h2 className="text-base sm:text-lg font-semibold text-[var(--foreground-heading)]">Invite team member</h2>
        </div>
        <div className="px-4 sm:px-5 md:px-6 py-4">
          {atLimit && (
            <p className="mb-4 text-sm text-[var(--foreground-muted)]">
              Team limit reached. Upgrade to Agency for unlimited members.
            </p>
          )}
          <form onSubmit={handleInvite} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 min-w-0">
              <label htmlFor="team-invite-email" className="sr-only">Email</label>
              <input
                id="team-invite-email"
                type="email"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                disabled={atLimit}
                className="w-full min-h-[44px] rounded-lg border border-[var(--border-default)] bg-white px-3 py-2.5 text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:opacity-50"
              />
            </div>
            <div className="w-full sm:w-40">
              <label htmlFor="team-invite-role" className="sr-only">Role</label>
              <select
                id="team-invite-role"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as "admin" | "sales")}
                disabled={atLimit}
                className="w-full min-h-[44px] rounded-lg border border-[var(--border-default)] bg-white px-3 py-2.5 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:opacity-50"
              >
                <option value="admin">Admin</option>
                <option value="sales">Sales</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={atLimit || inviteLoading || !inviteEmail.trim()}
              className="w-full sm:w-auto min-h-[44px] rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
            >
              {inviteLoading ? "Sending…" : "Send invite"}
            </button>
          </form>
          {inviteError && <p className="mt-2 text-sm text-red-600">{inviteError}</p>}
        </div>
      </section>

      {/* Team members list */}
      <section className="min-w-0 rounded-xl border border-[var(--border-default)] bg-white shadow-[var(--shadow-sm)] overflow-hidden">
        <div className="flex items-center gap-3 px-4 sm:px-5 md:px-6 py-3 sm:py-4 border-b border-[var(--border-default)] bg-[var(--background-alt)]">
          <h2 className="text-base sm:text-lg font-semibold text-[var(--foreground-heading)]">Team members</h2>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="px-4 sm:px-5 md:px-6 py-8 text-center text-[var(--foreground-muted)]">Loading…</div>
          ) : members.length === 0 ? (
            <div className="px-4 sm:px-5 md:px-6 py-8 text-center text-[var(--foreground-muted)]">No team members yet. Send an invite above.</div>
          ) : (
            <>
              {/* Desktop table */}
              <table className="hidden sm:table w-full" aria-label="Team members">
                <thead>
                  <tr className="border-b border-[var(--border-default)]">
                    <th className="text-left px-4 sm:px-5 md:px-6 py-3 text-xs font-medium text-[var(--foreground-muted)]">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-[var(--foreground-muted)]">Role</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-[var(--foreground-muted)]">Status</th>
                    <th className="text-right px-4 sm:px-5 md:px-6 py-3 text-xs font-medium text-[var(--foreground-muted)]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m.id} className="border-b border-[var(--border-default)] last:border-0">
                      <td className="px-4 sm:px-5 md:px-6 py-3 text-[var(--foreground)]">{m.email}</td>
                      <td className="px-4 py-3">
                        <select
                          value={m.role}
                          onChange={(e) => handleRoleChange(m, e.target.value as "admin" | "sales")}
                          disabled={actionLoading === m.id}
                          className="rounded-md border border-[var(--border-default)] bg-white px-2 py-1 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:opacity-50"
                          aria-label={`Change role for ${m.email}`}
                        >
                          <option value="admin">Admin</option>
                          <option value="sales">Sales</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span className={["inline-block rounded-md px-2 py-0.5 text-xs font-medium", statusBadgeClass(m.status)].join(" ")}>
                          {m.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-5 md:px-6 py-3 text-right">
                        {m.status === "pending" ? (
                          <button
                            type="button"
                            onClick={() => handleCancelInvite(m)}
                            disabled={actionLoading === m.id}
                            className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
                          >
                            Cancel invite
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(m)}
                              disabled={actionLoading === m.id}
                              className="mr-2 text-sm font-medium text-[var(--color-accent)] hover:underline disabled:opacity-50"
                            >
                              {m.status === "active" ? "Deactivate" : "Activate"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemove(m)}
                              disabled={actionLoading === m.id}
                              className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
                            >
                              Remove
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Mobile cards */}
              <div className="sm:hidden divide-y divide-[var(--border-default)]">
                {members.map((m) => (
                  <div key={m.id} className="px-4 py-4">
                    <p className="font-medium text-[var(--foreground)]">{m.email}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <label className="text-xs text-[var(--foreground-muted)]">Role</label>
                      <select
                        value={m.role}
                        onChange={(e) => handleRoleChange(m, e.target.value as "admin" | "sales")}
                        disabled={actionLoading === m.id}
                        className="min-h-[44px] flex-1 rounded-lg border border-[var(--border-default)] bg-white px-3 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:opacity-50"
                        aria-label={`Change role for ${m.email}`}
                      >
                        <option value="admin">Admin</option>
                        <option value="sales">Sales</option>
                      </select>
                      <span className={["rounded-md px-2 py-0.5 text-xs font-medium", statusBadgeClass(m.status)].join(" ")}>{m.status}</span>
                    </div>
                    <div className="mt-3 flex flex-col gap-2">
                      {m.status === "pending" ? (
                        <button
                          type="button"
                          onClick={() => handleCancelInvite(m)}
                          disabled={actionLoading === m.id}
                          className="w-full min-h-[44px] rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 disabled:opacity-50"
                        >
                          Cancel invite
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(m)}
                            disabled={actionLoading === m.id}
                            className="w-full min-h-[44px] rounded-lg border border-[var(--border-default)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] disabled:opacity-50"
                          >
                            {m.status === "active" ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemove(m)}
                            disabled={actionLoading === m.id}
                            className="w-full min-h-[44px] rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 disabled:opacity-50"
                          >
                            Remove
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
