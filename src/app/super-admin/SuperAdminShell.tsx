"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type NavItem = "dashboard" | "tickets" | "setting";

type TicketRow = {
  id: string;
  ticketNumber: string | null;
  category: string;
  subject: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
  lastActivityAt: string | null;
  replyCount: number;
  user: { name: string | null; email: string; username: string };
};

type TicketReply = {
  id: string;
  body: string;
  isFromStaff: boolean;
  createdAt: string;
};

type TicketThread = {
  request: {
    id: string;
    ticketNumber: string | null;
    category: string;
    subject: string;
    message: string;
    status: "open" | "in_progress" | "resolved";
    createdAt: string;
    user: { name: string | null; email: string; username: string };
  };
  replies: TicketReply[];
};

export function SuperAdminShell({ usersCount }: { usersCount: number }) {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState<NavItem>("dashboard");
  const [loggingOut, setLoggingOut] = useState(false);
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUsername, setSmtpUsername] = useState("");
  const [smtpPassword, setSmtpPassword] = useState("");
  const [smtpFromEmail, setSmtpFromEmail] = useState("");
  const [smtpFromName, setSmtpFromName] = useState("");
  const [smtpSupportEmail, setSmtpSupportEmail] = useState("");
  const [smtpSecure, setSmtpSecure] = useState(false);
  const [smtpTestToEmail, setSmtpTestToEmail] = useState("");
  const [smtpTestLoading, setSmtpTestLoading] = useState(false);
  const [smtpTestMessage, setSmtpTestMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [smtpSaveLoading, setSmtpSaveLoading] = useState(false);
  const [smtpSaveMessage, setSmtpSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketsError, setTicketsError] = useState<string | null>(null);
  const [ticketsNotice, setTicketsNotice] = useState<string | null>(null);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [ticketThread, setTicketThread] = useState<TicketThread | null>(null);
  const [threadLoading, setThreadLoading] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [updatingTicketStatus, setUpdatingTicketStatus] = useState(false);
  const [ticketStatusFilter, setTicketStatusFilter] = useState<
    "all" | "open" | "in_progress" | "resolved"
  >("all");

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/super-admin/logout", { method: "POST" });
      router.push("/super-admin/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  useEffect(() => {
    if (activeItem !== "setting") return;
    let cancelled = false;

    async function loadSmtpSettings() {
      try {
        const res = await fetch("/api/super-admin/smtp", { method: "GET" });
        const data = await res.json();
        if (!res.ok || !data.smtp || cancelled) return;
        setSmtpHost(data.smtp.host || "");
        setSmtpPort(String(data.smtp.port || "587"));
        setSmtpUsername(data.smtp.username || "");
        setSmtpPassword(data.smtp.password || "");
        setSmtpFromEmail(data.smtp.fromEmail || "");
        setSmtpFromName(data.smtp.fromName || "");
        setSmtpSupportEmail(data.smtp.supportEmail || "");
        setSmtpSecure(Boolean(data.smtp.secure));
      } catch {
        // Keep UI usable even if saved settings fail to load.
      }
    }

    void loadSmtpSettings();
    return () => {
      cancelled = true;
    };
  }, [activeItem]);

  useEffect(() => {
    if (activeItem !== "tickets") return;
    void fetchTickets();
  }, [activeItem]);

  async function fetchTickets() {
    setTicketsLoading(true);
    setTicketsError(null);
    try {
      const res = await fetch("/api/super-admin/tickets", { method: "GET" });
      const data = await res.json();
      if (!res.ok) {
        setTicketsError(data.error || "Failed to load tickets.");
        return;
      }
      setTickets(data.requests || []);
    } catch {
      setTicketsError("Something went wrong while loading tickets.");
    } finally {
      setTicketsLoading(false);
    }
  }

  async function fetchTicketThread(ticketId: string) {
    setThreadLoading(true);
    setTicketThread(null);
    setTicketsError(null);
    try {
      const res = await fetch(`/api/super-admin/tickets/${ticketId}/replies`, { method: "GET" });
      const data = await res.json();
      if (!res.ok) {
        setTicketsError(data.error || "Failed to load ticket thread.");
        return;
      }
      setTicketThread(data);
    } catch {
      setTicketsError("Something went wrong while loading the ticket thread.");
    } finally {
      setThreadLoading(false);
    }
  }

  async function handleSelectTicket(ticketId: string) {
    if (activeTicketId === ticketId) {
      setActiveTicketId(null);
      setTicketThread(null);
      setReplyMessage("");
      return;
    }
    setActiveTicketId(ticketId);
    await fetchTicketThread(ticketId);
  }

  async function handleTicketStatusChange(ticketId: string, status: "open" | "in_progress" | "resolved") {
    setUpdatingTicketStatus(true);
    setTicketsError(null);
    try {
      const res = await fetch(`/api/super-admin/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTicketsError(data.error || "Failed to update ticket status.");
        return;
      }
      setTickets((prev) => prev.map((ticket) => (ticket.id === ticketId ? { ...ticket, status: data.status } : ticket)));
      setTicketThread((prev) =>
        prev && prev.request.id === ticketId
          ? { ...prev, request: { ...prev.request, status: data.status } }
          : prev
      );
    } catch {
      setTicketsError("Something went wrong while updating ticket status.");
    } finally {
      setUpdatingTicketStatus(false);
    }
  }

  async function handleSendTicketReply(ticketId: string) {
    if (!replyMessage.trim()) return;
    setSendingReply(true);
    setTicketsError(null);
    setTicketsNotice(null);
    try {
      const res = await fetch(`/api/super-admin/tickets/${ticketId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyMessage.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTicketsError(data.error || "Failed to send reply.");
        return;
      }
      setReplyMessage("");
      if (data?.email?.sent === false) {
        setTicketsNotice(
          `Reply saved, but email delivery to the user failed. ${
            data?.email?.error || "Please verify SMTP configuration."
          }`
        );
      }
      await fetchTicketThread(ticketId);
      await fetchTickets();
    } catch {
      setTicketsError("Something went wrong while sending ticket reply.");
    } finally {
      setSendingReply(false);
    }
  }

  function formatDate(dateString: string | null) {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  }

  function getStatusBadgeClass(status: TicketRow["status"]) {
    if (status === "open") return "border border-amber-200 bg-amber-50 text-amber-800";
    if (status === "in_progress") return "border border-blue-200 bg-blue-50 text-blue-800";
    return "border border-green-200 bg-green-50 text-green-800";
  }

  function getStatusLabel(status: TicketRow["status"]) {
    if (status === "in_progress") return "In progress";
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  const filteredTickets = tickets.filter((ticket) => {
    if (ticketStatusFilter === "all") return true;
    return ticket.status === ticketStatusFilter;
  });
  const openCount = tickets.filter((ticket) => ticket.status === "open").length;
  const inProgressCount = tickets.filter((ticket) => ticket.status === "in_progress").length;
  const resolvedCount = tickets.filter((ticket) => ticket.status === "resolved").length;

  async function handleSaveSmtpSettings() {
    setSmtpSaveMessage(null);
    if (
      !smtpHost.trim() ||
      !smtpPort.trim() ||
      !smtpUsername.trim() ||
      !smtpPassword.trim() ||
      !smtpFromEmail.trim()
    ) {
      setSmtpSaveMessage({
        type: "error",
        text: "Please fill all required SMTP fields before saving.",
      });
      return;
    }

    setSmtpSaveLoading(true);
    try {
      const res = await fetch("/api/super-admin/smtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: smtpHost.trim(),
          port: Number(smtpPort),
          username: smtpUsername.trim(),
          password: smtpPassword,
          fromEmail: smtpFromEmail.trim(),
          fromName: smtpFromName.trim() || "",
          supportEmail: smtpSupportEmail.trim() || "",
          secure: smtpSecure,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSmtpSaveMessage({ type: "error", text: data.error || "Failed to save SMTP settings." });
        return;
      }
      setSmtpSaveMessage({ type: "success", text: data.message || "SMTP settings saved." });
    } catch {
      setSmtpSaveMessage({ type: "error", text: "Something went wrong while saving SMTP settings." });
    } finally {
      setSmtpSaveLoading(false);
    }
  }

  async function handleSendTestEmail() {
    setSmtpTestMessage(null);

    if (!smtpTestToEmail.trim()) {
      setSmtpTestMessage({
        type: "error",
        text: "Please enter Test To Email.",
      });
      return;
    }

    setSmtpTestLoading(true);
    try {
      const res = await fetch("/api/super-admin/smtp/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: smtpHost.trim(),
          port: Number(smtpPort),
          username: smtpUsername.trim(),
          password: smtpPassword,
          fromEmail: smtpFromEmail.trim(),
          fromName: smtpFromName.trim() || undefined,
          secure: smtpSecure,
          testToEmail: smtpTestToEmail.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSmtpTestMessage({ type: "error", text: data.error || "Failed to send test email." });
        return;
      }

      setSmtpTestMessage({
        type: "success",
        text: data.message || "Test email sent successfully.",
      });
    } catch {
      setSmtpTestMessage({
        type: "error",
        text: "Something went wrong while sending test email.",
      });
    } finally {
      setSmtpTestLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl">
        <aside className="w-64 border-r border-gray-200 bg-white p-4">
          <h1 className="mb-6 text-lg font-semibold text-gray-900">Super Admin</h1>
          <button
            type="button"
            onClick={() => setActiveItem("dashboard")}
            className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition ${
              activeItem === "dashboard"
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => setActiveItem("tickets")}
            className={`mt-2 w-full rounded-md px-3 py-2 text-left text-sm font-medium transition ${
              activeItem === "tickets"
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Tickets
          </button>
          <button
            type="button"
            onClick={() => setActiveItem("setting")}
            className={`mt-2 w-full rounded-md px-3 py-2 text-left text-sm font-medium transition ${
              activeItem === "setting"
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Setting
          </button>
        </aside>

        <section className="flex-1">
          <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
            <p className="text-base font-semibold text-gray-900">
              {activeItem === "dashboard"
                ? "Dashboard"
                : activeItem === "tickets"
                ? "Tickets"
                : "Setting"}
            </p>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </header>

          <div className="p-6">
            {activeItem === "dashboard" ? (
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Users Count</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{usersCount}</p>
              </div>
            ) : null}
            {activeItem === "setting" ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm text-gray-500">Settings Item 1</p>
                  <h2 className="mt-1 text-lg font-semibold text-gray-900">
                    SMTP Email Configuration
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Configure SMTP provider details for outgoing emails.
                  </p>

                  <form className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-800">
                        SMTP Host
                      </label>
                      <input
                        type="text"
                        value={smtpHost}
                        onChange={(e) => setSmtpHost(e.target.value)}
                        placeholder="smtp.example.com"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-800">
                        SMTP Port
                      </label>
                      <input
                        type="number"
                        value={smtpPort}
                        onChange={(e) => setSmtpPort(e.target.value)}
                        placeholder="587"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-800">
                        Username
                      </label>
                      <input
                        type="text"
                        value={smtpUsername}
                        onChange={(e) => setSmtpUsername(e.target.value)}
                        placeholder="smtp-user"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-800">
                        Password
                      </label>
                      <input
                        type="password"
                        value={smtpPassword}
                        onChange={(e) => setSmtpPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-800">
                        From Email
                      </label>
                      <input
                        type="email"
                        value={smtpFromEmail}
                        onChange={(e) => setSmtpFromEmail(e.target.value)}
                        placeholder="noreply@example.com"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-800">
                        From Name
                      </label>
                      <input
                        type="text"
                        value={smtpFromName}
                        onChange={(e) => setSmtpFromName(e.target.value)}
                        placeholder="LeadFormHub"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-800">
                        Support Email
                      </label>
                      <input
                        type="email"
                        value={smtpSupportEmail}
                        onChange={(e) => setSmtpSupportEmail(e.target.value)}
                        placeholder="support@example.com"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-800">
                        <input
                          type="checkbox"
                          checked={smtpSecure}
                          onChange={(e) => setSmtpSecure(e.target.checked)}
                          className="size-4 rounded border-gray-300"
                        />
                        Use SSL/TLS (secure connection)
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <button
                        type="button"
                        onClick={handleSaveSmtpSettings}
                        disabled={smtpSaveLoading}
                        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
                      >
                        {smtpSaveLoading ? "Saving..." : "Save SMTP Settings"}
                      </button>
                    </div>

                    {smtpSaveMessage ? (
                      <div
                        className={`md:col-span-2 rounded-md px-3 py-2 text-sm ${
                          smtpSaveMessage.type === "success"
                            ? "border border-green-200 bg-green-50 text-green-700"
                            : "border border-red-200 bg-red-50 text-red-700"
                        }`}
                      >
                        {smtpSaveMessage.text}
                      </div>
                    ) : null}

                    <div className="md:col-span-2 mt-2 border-t border-gray-200 pt-4">
                      <p className="text-sm font-medium text-gray-800">Test Email</p>
                      <p className="mt-1 text-xs text-gray-600">
                        Send a test email using the current SMTP values above.
                      </p>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-800">
                        Test To Email
                      </label>
                      <input
                        type="email"
                        value={smtpTestToEmail}
                        onChange={(e) => setSmtpTestToEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleSendTestEmail}
                        disabled={smtpTestLoading}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {smtpTestLoading ? "Sending..." : "Send Test Email"}
                      </button>
                    </div>

                    {smtpTestMessage ? (
                      <div
                        className={`md:col-span-2 rounded-md px-3 py-2 text-sm ${
                          smtpTestMessage.type === "success"
                            ? "border border-green-200 bg-green-50 text-green-700"
                            : "border border-red-200 bg-red-50 text-red-700"
                        }`}
                      >
                        {smtpTestMessage.text}
                      </div>
                    ) : null}
                  </form>
                </div>
              </div>
            ) : null}
            {activeItem === "tickets" ? (
              <div className="space-y-5">
                <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm">
                  <div className="flex flex-wrap items-end justify-between gap-5">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Ticket Handling Desk</h2>
                      <p className="mt-1 text-sm text-gray-600">
                        Manage user conversations, send support replies, and keep statuses updated.
                      </p>
                    </div>
                    <div className="min-w-[180px]">
                      <label
                        htmlFor="ticket-status-filter"
                        className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-600"
                      >
                        Filter by status
                      </label>
                      <select
                        id="ticket-status-filter"
                        value={ticketStatusFilter}
                        onChange={(e) =>
                          setTicketStatusFilter(
                            e.target.value as "all" | "open" | "in_progress" | "resolved"
                          )
                        }
                        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-gray-500 focus:outline-none"
                      >
                        <option value="all">All</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-amber-700">Open</p>
                    <p className="mt-2 text-2xl font-semibold text-amber-900">{openCount}</p>
                  </div>
                  <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-blue-700">In Progress</p>
                    <p className="mt-2 text-2xl font-semibold text-blue-900">{inProgressCount}</p>
                  </div>
                  <div className="rounded-xl border border-green-200 bg-green-50/80 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-green-700">Resolved</p>
                    <p className="mt-2 text-2xl font-semibold text-green-900">{resolvedCount}</p>
                  </div>
                </div>

                {ticketsError ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {ticketsError}
                  </div>
                ) : null}
                {ticketsNotice ? (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    {ticketsNotice}
                  </div>
                ) : null}

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  {ticketsLoading ? (
                    <div className="p-8 text-sm text-gray-600">Loading tickets...</div>
                  ) : filteredTickets.length === 0 ? (
                    <div className="p-8 text-sm text-gray-600">No tickets found for the selected status.</div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {filteredTickets.map((ticket) => (
                        <div key={ticket.id} className="p-5 transition hover:bg-gray-50/70">
                          <button
                            type="button"
                            onClick={() => handleSelectTicket(ticket.id)}
                            className="flex w-full flex-wrap items-start gap-3 text-left"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-xs font-semibold tracking-wide text-gray-900">
                                  {ticket.ticketNumber ? `#${ticket.ticketNumber}` : `#REF-${ticket.id.slice(-6)}`}
                                </span>
                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeClass(ticket.status)}`}>
                                  {getStatusLabel(ticket.status)}
                                </span>
                                <span className="text-xs text-gray-500">{ticket.category.toUpperCase()}</span>
                              </div>
                              <p className="mt-2 truncate text-sm font-semibold text-gray-900">{ticket.subject}</p>
                              <p className="mt-1 text-xs text-gray-500">
                                {ticket.user.name || ticket.user.username} · {ticket.user.email}
                              </p>
                            </div>
                            <div className="ml-auto text-right">
                              <p className="text-xs font-medium text-gray-500">
                                {ticket.replyCount} {ticket.replyCount === 1 ? "reply" : "replies"}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                Updated {formatDate(ticket.lastActivityAt)}
                              </p>
                            </div>
                          </button>

                          {activeTicketId === ticket.id ? (
                            <div className="mt-4 rounded-xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white p-4 sm:p-5">
                              {threadLoading ? (
                                <p className="text-sm text-gray-600">Loading thread...</p>
                              ) : ticketThread ? (
                                <div className="space-y-4">
                                  <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
                                    <label className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                      Ticket status
                                    </label>
                                    <select
                                      value={ticketThread.request.status}
                                      onChange={(e) =>
                                        handleTicketStatusChange(
                                          ticket.id,
                                          e.target.value as "open" | "in_progress" | "resolved"
                                        )
                                      }
                                      disabled={updatingTicketStatus}
                                      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 focus:border-gray-500 focus:outline-none"
                                    >
                                      <option value="open">Open</option>
                                      <option value="in_progress">In progress</option>
                                      <option value="resolved">Resolved</option>
                                    </select>
                                    <span className="text-xs text-gray-500">
                                      Last activity: {formatDate(ticket.lastActivityAt)}
                                    </span>
                                  </div>

                                  <div className="rounded-lg border border-gray-200 bg-white p-4">
                                    <p className="text-xs font-medium text-gray-500">
                                      Initial message - {formatDate(ticketThread.request.createdAt)}
                                    </p>
                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-800">
                                      {ticketThread.request.message}
                                    </p>
                                  </div>

                                  {ticketThread.replies.map((reply) => (
                                    <div
                                      key={reply.id}
                                      className={`rounded-lg border p-4 ${
                                        reply.isFromStaff
                                          ? "border-blue-200 bg-blue-50/80"
                                          : "border-gray-200 bg-white"
                                      }`}
                                    >
                                      <p className="text-xs font-medium text-gray-500">
                                        {reply.isFromStaff ? "Support" : "User"} -{" "}
                                        {formatDate(reply.createdAt)}
                                      </p>
                                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-800">
                                        {reply.body}
                                      </p>
                                    </div>
                                  ))}

                                  <div className="rounded-lg border border-gray-200 bg-white p-4">
                                    <label className="mb-1.5 block text-sm font-semibold text-gray-800">
                                      Reply to user
                                    </label>
                                    <textarea
                                      rows={3}
                                      value={replyMessage}
                                      onChange={(e) => setReplyMessage(e.target.value)}
                                      placeholder="Write a clear, helpful response..."
                                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 focus:border-gray-500 focus:outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleSendTicketReply(ticket.id)}
                                      disabled={sendingReply || !replyMessage.trim()}
                                      className="mt-3 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                      {sendingReply ? "Sending..." : "Send Reply"}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-600">Could not load ticket thread.</p>
                              )}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
