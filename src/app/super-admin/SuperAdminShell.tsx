"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { DashboardDetailType, SuperAdminDashboardStats } from "@/lib/super-admin-dashboard";
import { SuperAdminPlansPricingPanel } from "@/components/super-admin/SuperAdminPlansPricingPanel";

type NavItem = "dashboard" | "users" | "tickets" | "plans-pricing" | "setting";

type ManagedUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  plan: "free" | "pro" | "business";
  status: "active" | "banned";
  createdAt: string;
  updatedAt: string;
  isProtectedSuperAdmin?: boolean;
};

type TicketRow = {
  id: string;
  ticketNumber: string | null;
  category: string;
  subject: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
  lastActivityAt: string | null;
  replyCount: number;
  user: { name: string | null; email: string; username: string; plan: "free" | "pro" | "business" };
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

type DashboardDetailsPayload =
  | {
      type: "today_forms";
      totalCount: number;
      items: Array<{
        id: string;
        name: string;
        createdAt: string;
        ownerUsername: string;
        ownerEmail: string;
        ownerName: string;
      }>;
    }
  | {
      type: "today_users" | "free_users" | "premium_users";
      totalCount: number;
      items: Array<{
        id: string;
        name: string;
        username: string;
        email: string;
        plan: "free" | "pro" | "business";
        status: "active" | "banned";
        createdAt: string;
      }>;
    };

export function SuperAdminShell({ dashboardStats }: { dashboardStats: SuperAdminDashboardStats }) {
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
  const [recaptchaSiteKey, setRecaptchaSiteKey] = useState("");
  const [recaptchaSecretKey, setRecaptchaSecretKey] = useState("");
  const [recaptchaEnabled, setRecaptchaEnabled] = useState(true);
  const [googleClientId, setGoogleClientId] = useState("");
  const [googleClientSecret, setGoogleClientSecret] = useState("");
  const [googleEnabled, setGoogleEnabled] = useState(true);
  const [trackingGaMeasurementId, setTrackingGaMeasurementId] = useState("");
  const [trackingFbPixelId, setTrackingFbPixelId] = useState("");
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [razorpayKeyId, setRazorpayKeyId] = useState("");
  const [razorpayKeySecret, setRazorpayKeySecret] = useState("");
  const [razorpayEnabled, setRazorpayEnabled] = useState(true);
  const [fast2smsQuickApiKey, setFast2smsQuickApiKey] = useState("");
  const [smsEnabled, setSmsEnabled] = useState(true);
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
  const [recaptchaSaveLoading, setRecaptchaSaveLoading] = useState(false);
  const [recaptchaSaveMessage, setRecaptchaSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [googleSaveLoading, setGoogleSaveLoading] = useState(false);
  const [googleSaveMessage, setGoogleSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [trackingSaveLoading, setTrackingSaveLoading] = useState(false);
  const [trackingSaveMessage, setTrackingSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [razorpaySaveLoading, setRazorpaySaveLoading] = useState(false);
  const [razorpaySaveMessage, setRazorpaySaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [smsSaveLoading, setSmsSaveLoading] = useState(false);
  const [smsSaveMessage, setSmsSaveMessage] = useState<{
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
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [usersSuccess, setUsersSuccess] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const [userStatusFilter, setUserStatusFilter] = useState<"all" | "active" | "banned">("all");
  const [userPlanFilter, setUserPlanFilter] = useState<"all" | "free" | "pro" | "business">("all");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [savingUser, setSavingUser] = useState(false);
  const [editingUserName, setEditingUserName] = useState("");
  const [editingUserUsername, setEditingUserUsername] = useState("");
  const [editingUserEmail, setEditingUserEmail] = useState("");
  const [editingUserPlan, setEditingUserPlan] = useState<ManagedUser["plan"]>("free");
  const [editingUserStatus, setEditingUserStatus] = useState<ManagedUser["status"]>("active");
  const [dashboardDetailOpen, setDashboardDetailOpen] = useState(false);
  const [dashboardDetailType, setDashboardDetailType] = useState<DashboardDetailType | null>(null);
  const [dashboardDetailLoading, setDashboardDetailLoading] = useState(false);
  const [dashboardDetailError, setDashboardDetailError] = useState<string | null>(null);
  const [dashboardDetailPayload, setDashboardDetailPayload] = useState<DashboardDetailsPayload | null>(
    null,
  );

  async function openDashboardDetail(type: DashboardDetailType) {
    setDashboardDetailType(type);
    setDashboardDetailOpen(true);
    setDashboardDetailLoading(true);
    setDashboardDetailError(null);
    setDashboardDetailPayload(null);
    try {
      const res = await fetch(`/api/super-admin/dashboard-details?type=${encodeURIComponent(type)}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setDashboardDetailError(typeof data.error === "string" ? data.error : "Failed to load details.");
        return;
      }
      setDashboardDetailPayload(data as DashboardDetailsPayload);
    } catch {
      setDashboardDetailError("Something went wrong while loading details.");
    } finally {
      setDashboardDetailLoading(false);
    }
  }

  const closeDashboardDetail = useCallback(() => {
    setDashboardDetailOpen(false);
    setDashboardDetailType(null);
    setDashboardDetailPayload(null);
    setDashboardDetailError(null);
  }, []);

  useEffect(() => {
    if (!dashboardDetailOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeDashboardDetail();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dashboardDetailOpen, closeDashboardDetail]);

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

    async function loadSettings() {
      try {
        const [smtpRes, recaptchaRes, googleRes, trackingRes, razorpayRes, smsRes] = await Promise.all([
          fetch("/api/super-admin/smtp", { method: "GET" }),
          fetch("/api/super-admin/recaptcha", { method: "GET" }),
          fetch("/api/super-admin/google", { method: "GET" }),
          fetch("/api/super-admin/tracking", { method: "GET" }),
          fetch("/api/super-admin/razorpay", { method: "GET" }),
          fetch("/api/super-admin/sms", { method: "GET" }),
        ]);
        const smtpData = await smtpRes.json().catch(() => ({}));
        const recaptchaData = await recaptchaRes.json().catch(() => ({}));
        const googleData = await googleRes.json().catch(() => ({}));
        const trackingData = await trackingRes.json().catch(() => ({}));
        const razorpayData = await razorpayRes.json().catch(() => ({}));
        const smsData = await smsRes.json().catch(() => ({}));
        if (cancelled) return;
        if (smtpRes.ok && smtpData.smtp) {
          setSmtpHost(smtpData.smtp.host || "");
          setSmtpPort(String(smtpData.smtp.port || "587"));
          setSmtpUsername(smtpData.smtp.username || "");
          setSmtpPassword(smtpData.smtp.password || "");
          setSmtpFromEmail(smtpData.smtp.fromEmail || "");
          setSmtpFromName(smtpData.smtp.fromName || "");
          setSmtpSupportEmail(smtpData.smtp.supportEmail || "");
          setSmtpSecure(Boolean(smtpData.smtp.secure));
        }
        if (recaptchaRes.ok && recaptchaData.recaptcha) {
          setRecaptchaSiteKey(recaptchaData.recaptcha.siteKey || "");
          setRecaptchaSecretKey(recaptchaData.recaptcha.secretKey || "");
          setRecaptchaEnabled(recaptchaData.recaptcha.enabled !== false);
        }
        if (googleRes.ok && googleData.google) {
          setGoogleClientId(googleData.google.clientId || "");
          setGoogleClientSecret(googleData.google.clientSecret || "");
          setGoogleEnabled(googleData.google.enabled !== false);
        }
        if (trackingRes.ok && trackingData.tracking) {
          setTrackingGaMeasurementId(trackingData.tracking.gaMeasurementId || "");
          setTrackingFbPixelId(trackingData.tracking.fbPixelId || "");
          setTrackingEnabled(trackingData.tracking.enabled !== false);
        }
        if (razorpayRes.ok && razorpayData.razorpay) {
          setRazorpayKeyId(razorpayData.razorpay.keyId || "");
          setRazorpayKeySecret(razorpayData.razorpay.keySecret || "");
          setRazorpayEnabled(razorpayData.razorpay.enabled !== false);
        }
        if (smsRes.ok && smsData.sms) {
          setFast2smsQuickApiKey(smsData.sms.fast2smsQuickApiKey || "");
          setSmsEnabled(smsData.sms.enabled !== false);
        }
      } catch {
        // Keep UI usable even if saved settings fail to load.
      }
    }

    void loadSettings();
    return () => {
      cancelled = true;
    };
  }, [activeItem]);

  useEffect(() => {
    if (activeItem !== "tickets") return;
    void fetchTickets();
  }, [activeItem]);

  useEffect(() => {
    if (activeItem !== "users") return;
    void fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItem, userStatusFilter, userPlanFilter]);

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

  async function fetchUsers(
    searchValue = userSearch,
    statusValue = userStatusFilter,
    planValue = userPlanFilter
  ) {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const params = new URLSearchParams();
      if (searchValue.trim()) params.set("q", searchValue.trim());
      params.set("status", statusValue);
      params.set("plan", planValue);

      const res = await fetch(`/api/super-admin/users?${params.toString()}`, { method: "GET" });
      const data = await res.json();
      if (!res.ok) {
        setUsersError(data.error || "Failed to load users.");
        return;
      }
      setUsers(data.users || []);
    } catch {
      setUsersError("Something went wrong while loading users.");
    } finally {
      setUsersLoading(false);
    }
  }

  function startEditingUser(user: ManagedUser) {
    if (user.isProtectedSuperAdmin) {
      setUsersError("Super admin account is protected and cannot be edited here.");
      setUsersSuccess(null);
      return;
    }
    setSelectedUserId(user.id);
    setEditingUserName(user.name);
    setEditingUserUsername(user.username);
    setEditingUserEmail(user.email);
    setEditingUserPlan(user.plan);
    setEditingUserStatus(user.status);
    setUsersError(null);
    setUsersSuccess(null);
  }

  async function saveUserChanges() {
    if (!selectedUserId) return;
    setSavingUser(true);
    setUsersError(null);
    setUsersSuccess(null);
    try {
      const res = await fetch(`/api/super-admin/users/${selectedUserId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingUserName.trim(),
          username: editingUserUsername.trim(),
          email: editingUserEmail.trim(),
          plan: editingUserPlan,
          status: editingUserStatus,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setUsersError(data.error || "Failed to update user.");
        return;
      }
      setUsersSuccess(data.message || "User updated.");
      setSelectedUserId(null);
      await fetchUsers();
    } catch {
      setUsersError("Something went wrong while updating user.");
    } finally {
      setSavingUser(false);
    }
  }

  async function toggleBanUser(user: ManagedUser) {
    if (user.isProtectedSuperAdmin) {
      setUsersError("Super admin account is protected and cannot be banned.");
      setUsersSuccess(null);
      return;
    }
    setUsersError(null);
    setUsersSuccess(null);
    try {
      const nextStatus: ManagedUser["status"] = user.status === "active" ? "banned" : "active";
      const res = await fetch(`/api/super-admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        setUsersError(data.error || "Failed to update user status.");
        return;
      }
      setUsersSuccess(`User ${nextStatus === "banned" ? "banned" : "unbanned"} successfully.`);
      await fetchUsers();
    } catch {
      setUsersError("Something went wrong while updating user status.");
    }
  }

  async function deleteUser(user: ManagedUser) {
    if (user.isProtectedSuperAdmin) {
      setUsersError("Super admin account is protected and cannot be deleted.");
      setUsersSuccess(null);
      return;
    }

    const confirmed = window.confirm(
      `Delete user "${user.username}"? This action is permanent and cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingUserId(user.id);
    setUsersError(null);
    setUsersSuccess(null);
    try {
      const res = await fetch(`/api/super-admin/users/${user.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setUsersError(data.error || "Failed to delete user.");
        return;
      }
      setUsersSuccess(data.message || "User deleted.");
      if (selectedUserId === user.id) {
        setSelectedUserId(null);
      }
      await fetchUsers();
    } catch {
      setUsersError("Something went wrong while deleting user.");
    } finally {
      setDeletingUserId(null);
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

  function getPlanLabel(plan: TicketRow["user"]["plan"]) {
    return plan.charAt(0).toUpperCase() + plan.slice(1);
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

  async function handleSaveRecaptchaSettings() {
    setRecaptchaSaveMessage(null);
    if (!recaptchaSiteKey.trim() || !recaptchaSecretKey.trim()) {
      setRecaptchaSaveMessage({
        type: "error",
        text: "Please fill both site key and secret key before saving.",
      });
      return;
    }

    setRecaptchaSaveLoading(true);
    try {
      const res = await fetch("/api/super-admin/recaptcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteKey: recaptchaSiteKey.trim(),
          secretKey: recaptchaSecretKey.trim(),
          enabled: recaptchaEnabled,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRecaptchaSaveMessage({ type: "error", text: data.error || "Failed to save reCAPTCHA settings." });
        return;
      }
      setRecaptchaSaveMessage({ type: "success", text: data.message || "reCAPTCHA settings saved." });
    } catch {
      setRecaptchaSaveMessage({ type: "error", text: "Something went wrong while saving reCAPTCHA settings." });
    } finally {
      setRecaptchaSaveLoading(false);
    }
  }

  async function handleSaveGoogleSettings() {
    setGoogleSaveMessage(null);
    if (!googleClientId.trim() || !googleClientSecret.trim()) {
      setGoogleSaveMessage({
        type: "error",
        text: "Please fill both client ID and client secret before saving.",
      });
      return;
    }

    setGoogleSaveLoading(true);
    try {
      const res = await fetch("/api/super-admin/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: googleClientId.trim(),
          clientSecret: googleClientSecret.trim(),
          enabled: googleEnabled,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGoogleSaveMessage({ type: "error", text: data.error || "Failed to save Google OAuth settings." });
        return;
      }
      setGoogleSaveMessage({ type: "success", text: data.message || "Google OAuth settings saved." });
    } catch {
      setGoogleSaveMessage({ type: "error", text: "Something went wrong while saving Google OAuth settings." });
    } finally {
      setGoogleSaveLoading(false);
    }
  }

  async function handleSaveRazorpaySettings() {
    setRazorpaySaveMessage(null);
    if (!razorpayKeyId.trim() || !razorpayKeySecret.trim()) {
      setRazorpaySaveMessage({
        type: "error",
        text: "Please fill both Razorpay Key ID and Key Secret before saving.",
      });
      return;
    }

    setRazorpaySaveLoading(true);
    try {
      const res = await fetch("/api/super-admin/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyId: razorpayKeyId.trim(),
          keySecret: razorpayKeySecret.trim(),
          enabled: razorpayEnabled,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRazorpaySaveMessage({ type: "error", text: data.error || "Failed to save Razorpay settings." });
        return;
      }
      setRazorpaySaveMessage({ type: "success", text: data.message || "Razorpay settings saved." });
    } catch {
      setRazorpaySaveMessage({ type: "error", text: "Something went wrong while saving Razorpay settings." });
    } finally {
      setRazorpaySaveLoading(false);
    }
  }

  async function handleSaveTrackingSettings() {
    setTrackingSaveMessage(null);
    if (!trackingGaMeasurementId.trim() || !trackingFbPixelId.trim()) {
      setTrackingSaveMessage({
        type: "error",
        text: "Please fill both GA Measurement ID and Facebook Pixel ID before saving.",
      });
      return;
    }

    setTrackingSaveLoading(true);
    try {
      const res = await fetch("/api/super-admin/tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gaMeasurementId: trackingGaMeasurementId.trim(),
          fbPixelId: trackingFbPixelId.trim(),
          enabled: trackingEnabled,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTrackingSaveMessage({ type: "error", text: data.error || "Failed to save tracking settings." });
        return;
      }
      setTrackingSaveMessage({ type: "success", text: data.message || "Tracking settings saved." });
    } catch {
      setTrackingSaveMessage({ type: "error", text: "Something went wrong while saving tracking settings." });
    } finally {
      setTrackingSaveLoading(false);
    }
  }

  async function handleSaveSmsSettings() {
    setSmsSaveMessage(null);
    if (!fast2smsQuickApiKey.trim()) {
      setSmsSaveMessage({
        type: "error",
        text: "Please enter Fast2SMS Quick API key before saving.",
      });
      return;
    }

    setSmsSaveLoading(true);
    try {
      const res = await fetch("/api/super-admin/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fast2smsQuickApiKey: fast2smsQuickApiKey.trim(),
          enabled: smsEnabled,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSmsSaveMessage({ type: "error", text: data.error || "Failed to save SMS settings." });
        return;
      }
      setSmsSaveMessage({ type: "success", text: data.message || "SMS settings saved." });
    } catch {
      setSmsSaveMessage({ type: "error", text: "Something went wrong while saving SMS settings." });
    } finally {
      setSmsSaveLoading(false);
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
            onClick={() => setActiveItem("users")}
            className={`mt-2 w-full rounded-md px-3 py-2 text-left text-sm font-medium transition ${
              activeItem === "users" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Users
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
            onClick={() => setActiveItem("plans-pricing")}
            className={`mt-2 w-full rounded-md px-3 py-2 text-left text-sm font-medium transition ${
              activeItem === "plans-pricing"
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Plans and Pricing
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
                : activeItem === "users"
                ? "Users"
                : activeItem === "tickets"
                ? "Tickets"
                : activeItem === "plans-pricing"
                ? "Plans and Pricing"
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
              <>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                    Platform overview
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Today is based on UTC. Click a card for a detailed list.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <button
                    type="button"
                    onClick={() => void openDashboardDetail("today_forms")}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-6 text-left shadow-sm ring-1 ring-black/[0.03] transition hover:border-teal-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500" aria-hidden />
                    <div className="flex items-start justify-between gap-3">
                      <div className="rounded-xl bg-teal-50 p-2.5 text-teal-700">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.75}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-teal-600 opacity-0 transition group-hover:opacity-100">
                        View →
                      </span>
                    </div>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Forms created today
                    </p>
                    <p className="mt-2 font-mono text-3xl font-semibold tabular-nums text-gray-900">
                      {dashboardStats.todayFormsCreated}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => void openDashboardDetail("today_users")}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-6 text-left shadow-sm ring-1 ring-black/[0.03] transition hover:border-sky-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 to-blue-600" aria-hidden />
                    <div className="flex items-start justify-between gap-3">
                      <div className="rounded-xl bg-sky-50 p-2.5 text-sky-700">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.75}
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                          />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-sky-600 opacity-0 transition group-hover:opacity-100">
                        View →
                      </span>
                    </div>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Users registered today
                    </p>
                    <p className="mt-2 font-mono text-3xl font-semibold tabular-nums text-gray-900">
                      {dashboardStats.todayUsersCreated}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => void openDashboardDetail("free_users")}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-6 text-left shadow-sm ring-1 ring-black/[0.03] transition hover:border-slate-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-400 to-slate-600" aria-hidden />
                    <div className="flex items-start justify-between gap-3">
                      <div className="rounded-xl bg-slate-100 p-2.5 text-slate-700">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.75}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-slate-600 opacity-0 transition group-hover:opacity-100">
                        View →
                      </span>
                    </div>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Total free users
                    </p>
                    <p className="mt-2 font-mono text-3xl font-semibold tabular-nums text-gray-900">
                      {dashboardStats.totalFreeUsers}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => void openDashboardDetail("premium_users")}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-6 text-left shadow-sm ring-1 ring-black/[0.03] transition hover:border-violet-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 to-violet-600" aria-hidden />
                    <div className="flex items-start justify-between gap-3">
                      <div className="rounded-xl bg-violet-50 p-2.5 text-violet-700">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.75}
                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                          />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-violet-600 opacity-0 transition group-hover:opacity-100">
                        View →
                      </span>
                    </div>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Total premium users
                    </p>
                    <p className="mt-2 font-mono text-3xl font-semibold tabular-nums text-gray-900">
                      {dashboardStats.totalPremiumUsers}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">Pro &amp; Business plans</p>
                  </button>
                </div>

                {dashboardDetailOpen ? (
                  <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-gray-900/40 p-4 sm:items-center"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="dashboard-detail-title"
                  >
                    <button
                      type="button"
                      className="absolute inset-0 cursor-default"
                      aria-label="Close"
                      onClick={closeDashboardDetail}
                    />
                    <div className="relative z-10 flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
                      <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-4">
                        <div>
                          <h3 id="dashboard-detail-title" className="text-lg font-semibold text-gray-900">
                            {dashboardDetailType === "today_forms"
                              ? "Forms created today"
                              : dashboardDetailType === "today_users"
                                ? "Users registered today"
                                : dashboardDetailType === "free_users"
                                  ? "Free plan users"
                                  : dashboardDetailType === "premium_users"
                                    ? "Premium users (Pro & Business)"
                                    : "Details"}
                          </h3>
                          {dashboardDetailPayload ? (
                            <p className="mt-1 text-sm tabular-nums text-gray-500">
                              {dashboardDetailPayload.totalCount} total
                              {dashboardDetailPayload.items.length < dashboardDetailPayload.totalCount
                                ? ` — showing latest ${dashboardDetailPayload.items.length}`
                                : ""}
                            </p>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={closeDashboardDetail}
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                        >
                          <span className="sr-only">Close</span>
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
                        {dashboardDetailLoading ? (
                          <p className="text-sm text-gray-500">Loading…</p>
                        ) : dashboardDetailError ? (
                          <p className="text-sm text-red-600">{dashboardDetailError}</p>
                        ) : dashboardDetailPayload?.type === "today_forms" ? (
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                              <thead>
                                <tr className="border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                  <th className="px-3 py-2">Form</th>
                                  <th className="px-3 py-2">Owner</th>
                                  <th className="px-3 py-2">Email</th>
                                  <th className="px-3 py-2">Created</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {dashboardDetailPayload.items.length === 0 ? (
                                  <tr>
                                    <td colSpan={4} className="px-3 py-8 text-center text-gray-500">
                                      No forms created today.
                                    </td>
                                  </tr>
                                ) : (
                                  dashboardDetailPayload.items.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                      <td className="px-3 py-2.5 font-medium text-gray-900">{row.name}</td>
                                      <td className="px-3 py-2.5 text-gray-700">{row.ownerUsername}</td>
                                      <td className="px-3 py-2.5 text-gray-600">{row.ownerEmail}</td>
                                      <td className="px-3 py-2.5 whitespace-nowrap text-gray-600">
                                        {new Date(row.createdAt).toLocaleString()}
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        ) : dashboardDetailPayload &&
                          (dashboardDetailPayload.type === "today_users" ||
                            dashboardDetailPayload.type === "free_users" ||
                            dashboardDetailPayload.type === "premium_users") ? (
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                              <thead>
                                <tr className="border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                  <th className="px-3 py-2">Name</th>
                                  <th className="px-3 py-2">Username</th>
                                  <th className="px-3 py-2">Email</th>
                                  <th className="px-3 py-2">Plan</th>
                                  <th className="px-3 py-2">Status</th>
                                  <th className="px-3 py-2">Joined</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {dashboardDetailPayload.items.length === 0 ? (
                                  <tr>
                                    <td colSpan={6} className="px-3 py-8 text-center text-gray-500">
                                      No records to show.
                                    </td>
                                  </tr>
                                ) : (
                                  dashboardDetailPayload.items.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                      <td className="px-3 py-2.5 font-medium text-gray-900">{row.name}</td>
                                      <td className="px-3 py-2.5 text-gray-700">{row.username}</td>
                                      <td className="px-3 py-2.5 text-gray-600">{row.email}</td>
                                      <td className="px-3 py-2.5 capitalize text-gray-700">{row.plan}</td>
                                      <td className="px-3 py-2.5 capitalize text-gray-700">{row.status}</td>
                                      <td className="px-3 py-2.5 whitespace-nowrap text-gray-600">
                                        {new Date(row.createdAt).toLocaleString()}
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No data.</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : null}
              </>
            ) : null}
            {activeItem === "plans-pricing" ? <SuperAdminPlansPricingPanel /> : null}
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

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm text-gray-500">Settings Item 2</p>
                  <h2 className="mt-1 text-lg font-semibold text-gray-900">
                    reCAPTCHA Configuration
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Save Google reCAPTCHA site/secret keys for the full application.
                  </p>

                  <form className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-800">
                        Site Key
                      </label>
                      <input
                        type="text"
                        value={recaptchaSiteKey}
                        onChange={(e) => setRecaptchaSiteKey(e.target.value)}
                        placeholder="6Lc... (public site key)"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-800">
                        Secret Key
                      </label>
                      <input
                        type="password"
                        value={recaptchaSecretKey}
                        onChange={(e) => setRecaptchaSecretKey(e.target.value)}
                        placeholder="6Lc... (secret key)"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-800">
                        <input
                          type="checkbox"
                          checked={recaptchaEnabled}
                          onChange={(e) => setRecaptchaEnabled(e.target.checked)}
                          className="size-4 rounded border-gray-300"
                        />
                        Enable reCAPTCHA checks globally
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <button
                        type="button"
                        onClick={handleSaveRecaptchaSettings}
                        disabled={recaptchaSaveLoading}
                        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
                      >
                        {recaptchaSaveLoading ? "Saving..." : "Save reCAPTCHA Settings"}
                      </button>
                    </div>

                    {recaptchaSaveMessage ? (
                      <div
                        className={`md:col-span-2 rounded-md px-3 py-2 text-sm ${
                          recaptchaSaveMessage.type === "success"
                            ? "border border-green-200 bg-green-50 text-green-700"
                            : "border border-red-200 bg-red-50 text-red-700"
                        }`}
                      >
                        {recaptchaSaveMessage.text}
                      </div>
                    ) : null}
                  </form>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm text-gray-500">Settings Item 3</p>
                  <h2 className="mt-1 text-lg font-semibold text-gray-900">
                    Google OAuth Configuration
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Save Google OAuth client credentials for Login/Signup with Google.
                  </p>

                  <form className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-800">
                        Client ID
                      </label>
                      <input
                        type="text"
                        value={googleClientId}
                        onChange={(e) => setGoogleClientId(e.target.value)}
                        placeholder="Google OAuth Client ID"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-800">
                        Client Secret
                      </label>
                      <input
                        type="password"
                        value={googleClientSecret}
                        onChange={(e) => setGoogleClientSecret(e.target.value)}
                        placeholder="Google OAuth Client Secret"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-800">
                        <input
                          type="checkbox"
                          checked={googleEnabled}
                          onChange={(e) => setGoogleEnabled(e.target.checked)}
                          className="size-4 rounded border-gray-300"
                        />
                        Enable Google sign-in globally
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <button
                        type="button"
                        onClick={handleSaveGoogleSettings}
                        disabled={googleSaveLoading}
                        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
                      >
                        {googleSaveLoading ? "Saving..." : "Save Google OAuth Settings"}
                      </button>
                    </div>

                    {googleSaveMessage ? (
                      <div
                        className={`md:col-span-2 rounded-md px-3 py-2 text-sm ${
                          googleSaveMessage.type === "success"
                            ? "border border-green-200 bg-green-50 text-green-700"
                            : "border border-red-200 bg-red-50 text-red-700"
                        }`}
                      >
                        {googleSaveMessage.text}
                      </div>
                    ) : null}
                  </form>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm text-gray-500">Settings Item 4</p>
                  <h2 className="mt-1 text-lg font-semibold text-gray-900">
                    Razorpay Configuration
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Save Razorpay key ID/secret used for checkout and payment verification.
                  </p>

                  <form className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-800">
                        Razorpay Key ID
                      </label>
                      <input
                        type="text"
                        value={razorpayKeyId}
                        onChange={(e) => setRazorpayKeyId(e.target.value)}
                        placeholder="rzp_live_xxxxxxxxxx"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-800">
                        Razorpay Key Secret
                      </label>
                      <input
                        type="password"
                        value={razorpayKeySecret}
                        onChange={(e) => setRazorpayKeySecret(e.target.value)}
                        placeholder="Paste Razorpay secret key"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-800">
                        <input
                          type="checkbox"
                          checked={razorpayEnabled}
                          onChange={(e) => setRazorpayEnabled(e.target.checked)}
                          className="size-4 rounded border-gray-300"
                        />
                        Enable Razorpay checkout globally
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <button
                        type="button"
                        onClick={handleSaveRazorpaySettings}
                        disabled={razorpaySaveLoading}
                        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
                      >
                        {razorpaySaveLoading ? "Saving..." : "Save Razorpay Settings"}
                      </button>
                    </div>

                    {razorpaySaveMessage ? (
                      <div
                        className={`md:col-span-2 rounded-md px-3 py-2 text-sm ${
                          razorpaySaveMessage.type === "success"
                            ? "border border-green-200 bg-green-50 text-green-700"
                            : "border border-red-200 bg-red-50 text-red-700"
                        }`}
                      >
                        {razorpaySaveMessage.text}
                      </div>
                    ) : null}
                  </form>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm text-gray-500">Settings Item 5</p>
                  <h2 className="mt-1 text-lg font-semibold text-gray-900">
                    Fast2SMS Configuration
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Save Fast2SMS Quick API key for mobile OTP delivery across all forms.
                  </p>

                  <form className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-gray-800">
                        Fast2SMS Quick API Key
                      </label>
                      <input
                        type="password"
                        value={fast2smsQuickApiKey}
                        onChange={(e) => setFast2smsQuickApiKey(e.target.value)}
                        placeholder="Paste Fast2SMS Quick API key"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-800">
                        <input
                          type="checkbox"
                          checked={smsEnabled}
                          onChange={(e) => setSmsEnabled(e.target.checked)}
                          className="size-4 rounded border-gray-300"
                        />
                        Enable mobile OTP SMS globally
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <button
                        type="button"
                        onClick={handleSaveSmsSettings}
                        disabled={smsSaveLoading}
                        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
                      >
                        {smsSaveLoading ? "Saving..." : "Save Fast2SMS Settings"}
                      </button>
                    </div>

                    {smsSaveMessage ? (
                      <div
                        className={`md:col-span-2 rounded-md px-3 py-2 text-sm ${
                          smsSaveMessage.type === "success"
                            ? "border border-green-200 bg-green-50 text-green-700"
                            : "border border-red-200 bg-red-50 text-red-700"
                        }`}
                      >
                        {smsSaveMessage.text}
                      </div>
                    ) : null}
                  </form>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm text-gray-500">Settings Item 6</p>
                  <h2 className="mt-1 text-lg font-semibold text-gray-900">
                    Analytics and Pixel Configuration
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Save GA4 Measurement ID and Facebook Pixel ID for global website tracking scripts.
                  </p>

                  <form className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-800">
                        GA4 Measurement ID
                      </label>
                      <input
                        type="text"
                        value={trackingGaMeasurementId}
                        onChange={(e) => setTrackingGaMeasurementId(e.target.value)}
                        placeholder="G-XXXXXXXXXX"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-800">
                        Facebook Pixel ID
                      </label>
                      <input
                        type="text"
                        value={trackingFbPixelId}
                        onChange={(e) => setTrackingFbPixelId(e.target.value)}
                        placeholder="123456789012345"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-800">
                        <input
                          type="checkbox"
                          checked={trackingEnabled}
                          onChange={(e) => setTrackingEnabled(e.target.checked)}
                          className="size-4 rounded border-gray-300"
                        />
                        Enable GA and Pixel globally
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <button
                        type="button"
                        onClick={handleSaveTrackingSettings}
                        disabled={trackingSaveLoading}
                        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
                      >
                        {trackingSaveLoading ? "Saving..." : "Save Tracking Settings"}
                      </button>
                    </div>

                    {trackingSaveMessage ? (
                      <div
                        className={`md:col-span-2 rounded-md px-3 py-2 text-sm ${
                          trackingSaveMessage.type === "success"
                            ? "border border-green-200 bg-green-50 text-green-700"
                            : "border border-red-200 bg-red-50 text-red-700"
                        }`}
                      >
                        {trackingSaveMessage.text}
                      </div>
                    ) : null}
                  </form>
                </div>
              </div>
            ) : null}
            {activeItem === "users" ? (
              <div className="space-y-5">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search by name, email, username"
                      className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none md:col-span-2"
                    />
                    <select
                      value={userStatusFilter}
                      onChange={(e) => setUserStatusFilter(e.target.value as "all" | "active" | "banned")}
                      className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="banned">Banned</option>
                    </select>
                    <select
                      value={userPlanFilter}
                      onChange={(e) => setUserPlanFilter(e.target.value as "all" | "free" | "pro" | "business")}
                      className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                    >
                      <option value="all">All Plans</option>
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                      <option value="business">Business</option>
                    </select>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void fetchUsers()}
                      className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black"
                    >
                      Search
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUserSearch("");
                        setUserStatusFilter("all");
                        setUserPlanFilter("all");
                        void fetchUsers("", "all", "all");
                      }}
                      className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {usersError ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{usersError}</div>
                ) : null}
                {usersSuccess ? (
                  <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{usersSuccess}</div>
                ) : null}

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  {usersLoading ? (
                    <div className="p-8 text-sm text-gray-600">Loading users...</div>
                  ) : users.length === 0 ? (
                    <div className="p-8 text-sm text-gray-600">No users found.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Username</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Plan</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Created</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/80">
                              <td className="px-4 py-3 text-sm text-gray-900">{user.name}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{user.username}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{user.email}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {user.isProtectedSuperAdmin ? "N/A (Super Admin)" : user.plan}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                    user.status === "active"
                                      ? "border border-green-200 bg-green-50 text-green-700"
                                      : "border border-red-200 bg-red-50 text-red-700"
                                  }`}
                                >
                                  {user.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">{formatDate(user.createdAt)}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => startEditingUser(user)}
                                    disabled={Boolean(user.isProtectedSuperAdmin || deletingUserId === user.id)}
                                    className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => toggleBanUser(user)}
                                    disabled={Boolean(user.isProtectedSuperAdmin || deletingUserId === user.id)}
                                    className={`rounded-md px-3 py-1.5 text-xs font-medium text-white ${
                                      user.status === "active" ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
                                    }`}
                                  >
                                    {user.status === "active" ? "Ban" : "Unban"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteUser(user)}
                                    disabled={Boolean(user.isProtectedSuperAdmin || deletingUserId === user.id)}
                                    className="rounded-md bg-rose-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                                  >
                                    {deletingUserId === user.id ? "Deleting..." : "Delete"}
                                  </button>
                                  {user.isProtectedSuperAdmin ? (
                                    <span className="rounded-md border border-indigo-200 bg-indigo-50 px-2 py-1 text-[11px] font-medium text-indigo-700">
                                      Protected
                                    </span>
                                  ) : null}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {selectedUserId ? (
                  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <h3 className="text-base font-semibold text-gray-900">Edit User</h3>
                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                      <input
                        type="text"
                        value={editingUserName}
                        onChange={(e) => setEditingUserName(e.target.value)}
                        placeholder="Full name"
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={editingUserUsername}
                        onChange={(e) => setEditingUserUsername(e.target.value)}
                        placeholder="Username"
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                      <input
                        type="email"
                        value={editingUserEmail}
                        onChange={(e) => setEditingUserEmail(e.target.value)}
                        placeholder="Email address"
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      />
                      <select
                        value={editingUserPlan}
                        onChange={(e) => setEditingUserPlan(e.target.value as ManagedUser["plan"])}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      >
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="business">Business</option>
                      </select>
                      <select
                        value={editingUserStatus}
                        onChange={(e) => setEditingUserStatus(e.target.value as ManagedUser["status"])}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      >
                        <option value="active">Active</option>
                        <option value="banned">Banned</option>
                      </select>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={saveUserChanges}
                        disabled={savingUser}
                        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {savingUser ? "Saving..." : "Save User"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedUserId(null)}
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}
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
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Ticket Number</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Category</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">User</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">User Plan</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">View</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {filteredTickets.map((ticket) => (
                            <Fragment key={ticket.id}>
                              <tr className="hover:bg-gray-50/70">
                                <td className="px-4 py-3 text-sm font-mono font-semibold text-gray-900">
                                  {ticket.ticketNumber ? `#${ticket.ticketNumber}` : `#REF-${ticket.id.slice(-6)}`}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">{ticket.category.toUpperCase()}</td>
                                <td className="px-4 py-3">
                                  <p className="text-sm font-medium text-gray-900">{ticket.user.name || ticket.user.username}</p>
                                  <p className="text-xs text-gray-500">{ticket.user.email}</p>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">{getPlanLabel(ticket.user.plan)}</td>
                                <td className="px-4 py-3">
                                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeClass(ticket.status)}`}>
                                    {getStatusLabel(ticket.status)}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <button
                                    type="button"
                                    onClick={() => handleSelectTicket(ticket.id)}
                                    className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
                                  >
                                    {activeTicketId === ticket.id ? "Hide" : "View"}
                                  </button>
                                </td>
                              </tr>
                              {activeTicketId === ticket.id ? (
                                <tr>
                                  <td colSpan={6} className="px-4 py-4">
                                    <div className="rounded-xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white p-4 sm:p-5">
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
                                    <span className="text-xs text-gray-500">
                                      Replies: {ticket.replyCount}
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
                                  </td>
                                </tr>
                              ) : null}
                            </Fragment>
                          ))}
                        </tbody>
                      </table>
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
