"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { value: "general", label: "General" },
  { value: "billing", label: "Billing" },
  { value: "bug", label: "Bug Report" },
  { value: "feature", label: "Feature Request" },
  { value: "other", label: "Other" },
] as const;

type RequestRow = {
  id: string;
  ticketNumber: string | null;
  category: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  replyCount?: number;
};

type ReplyRow = { id: string; body: string; isFromStaff: boolean; createdAt: string };
type ThreadData = {
  request: { id: string; ticketNumber: string | null; subject: string; message: string; status: string; createdAt: string };
  replies: ReplyRow[];
};

export default function RaiseRequestPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastTicketNumber, setLastTicketNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [thread, setThread] = useState<ThreadData | null>(null);
  const [loadingThread, setLoadingThread] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [formData, setFormData] = useState({
    category: "general" as const,
    subject: "",
    message: "",
  });

  async function fetchRequests() {
    setLoadingList(true);
    try {
      const res = await fetch("/api/support-requests");
      if (!res.ok) throw new Error("Failed to load requests");
      const data = await res.json();
      setRequests(data.requests ?? []);
    } catch {
      setRequests([]);
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchThread(requestId: string) {
    setLoadingThread(true);
    setThread(null);
    try {
      const res = await fetch(`/api/support-requests/${requestId}/replies`);
      if (!res.ok) throw new Error("Failed to load thread");
      const data = await res.json();
      setThread({
        request: data.request,
        replies: data.replies ?? [],
      });
    } catch {
      setThread(null);
    } finally {
      setLoadingThread(false);
    }
  }

  function toggleExpand(req: RequestRow) {
    if (expandedId === req.id) {
      setExpandedId(null);
      setThread(null);
      setReplyMessage("");
      return;
    }
    setExpandedId(req.id);
    fetchThread(req.id);
  }

  async function handleStatusChange(requestId: string, newStatus: string) {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/support-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      if (expandedId === requestId && thread) {
        setThread({ ...thread, request: { ...thread.request, status: newStatus } });
      }
      await fetchRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleAddReply(e: React.FormEvent, requestId: string) {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    setSendingReply(true);
    try {
      const res = await fetch(`/api/support-requests/${requestId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyMessage.trim(), fromSupport: false }),
      });
      if (!res.ok) throw new Error("Failed to send reply");
      setReplyMessage("");
      await fetchThread(requestId);
      await fetchRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/support-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: formData.category,
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to submit request");
      setSubmitted(true);
      setLastTicketNumber(data.request?.ticketNumber ?? null);
      setFormData({ category: "general", subject: "", message: "" });
      await fetchRequests();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function formatDate(iso: string) {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  }

  function statusBadge(status: string) {
    const map: Record<string, string> = {
      open: "bg-amber-100 text-amber-800",
      in_progress: "bg-blue-100 text-blue-800",
      resolved: "bg-emerald-100 text-emerald-800",
    };
    const label = status === "in_progress" ? "In progress" : status.charAt(0).toUpperCase() + status.slice(1);
    return (
      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${map[status] ?? "bg-neutral-100 text-neutral-700"}`}>
        {label}
      </span>
    );
  }

  return (
    <div className="min-w-0 p-4 sm:p-5 md:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 sm:mb-8">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
            Raise Request
          </h1>
          <p className="mt-1 text-base text-[var(--foreground-muted)]">
            Submit a support or feature request. We&apos;ll get back to you as soon as possible.
          </p>
        </header>

        <section className="rounded-xl border border-[var(--border-default)] bg-[var(--background-elevated)] p-5 shadow-sm sm:p-6">
          <h2 className="font-heading text-lg font-semibold text-[var(--foreground-heading)]">New request</h2>
          {submitted && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-base text-emerald-800">
              <p className="font-semibold">Request submitted successfully.</p>
              {lastTicketNumber && (
                <p className="mt-1 font-mono text-base font-bold text-emerald-900">
                  Your ticket number: {lastTicketNumber}
                </p>
              )}
              <p className="mt-1 text-emerald-700">Please quote this ticket number when contacting support. Replies from our team will be sent to your account email—check that inbox (and spam folder).</p>
              <p className="mt-1 text-emerald-700">You can submit another below or check the list.</p>
            </div>
          )}
          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-base text-red-800">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-[var(--foreground)]">
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData((d) => ({ ...d, category: e.target.value as typeof formData.category }))}
                className="mt-1 w-full rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-[var(--foreground)]">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                required
                maxLength={200}
                value={formData.subject}
                onChange={(e) => setFormData((d) => ({ ...d, subject: e.target.value }))}
                placeholder="Brief summary of your request"
                className="mt-1 w-full rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[var(--foreground)]">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                maxLength={10000}
                value={formData.message}
                onChange={(e) => setFormData((d) => ({ ...d, message: e.target.value }))}
                placeholder="Describe your issue or request in detail."
                className="mt-1 w-full resize-y rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />
              <p className="mt-1 text-xs text-[var(--foreground-muted)]">Max 10,000 characters.</p>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2"
            >
              {submitting ? "Submitting…" : "Submit Request"}
            </button>
          </form>
        </section>

        <section className="mt-8">
          <h2 className="font-heading mb-2 text-lg font-semibold text-[var(--foreground-heading)]">Your requests</h2>
          <p className="mb-4 text-base text-[var(--foreground-muted)]">
            Click a request to see the threaded conversation. Replies from support are also sent to your account email (same thread subject).
          </p>
          {loadingList ? (
            <div className="rounded-xl border border-[var(--border-default)] bg-[var(--background-elevated)] p-8 text-center text-[var(--foreground-muted)]">
              Loading…
            </div>
          ) : requests.length === 0 ? (
            <div className="rounded-xl border border-[var(--border-default)] bg-[var(--background-elevated)] p-8 text-center text-[var(--foreground-muted)]">
              No requests yet. Submit one above.
            </div>
          ) : (
            <ul className="space-y-3">
              {requests.map((req) => (
                <li key={req.id} className="rounded-xl border border-[var(--border-default)] bg-[var(--background-elevated)] shadow-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleExpand(req)}
                    className="w-full text-left p-4 hover:bg-[var(--background)]/50 transition-colors flex flex-wrap items-center justify-between gap-2"
                  >
                    <span className="font-mono text-sm font-bold text-[var(--foreground-heading)]">
                      {req.ticketNumber ? (req.ticketNumber.startsWith("#") ? req.ticketNumber : `#${req.ticketNumber}`) : `#REF-${req.id.slice(-6)}`}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
                      {CATEGORIES.find((c) => c.value === req.category)?.label ?? req.category}
                    </span>
                    {statusBadge(req.status)}
                    {(req.replyCount ?? 0) > 0 && (
                      <span className="text-xs text-[var(--foreground-muted)]">
                        {req.replyCount} {req.replyCount === 1 ? "reply" : "replies"}
                      </span>
                    )}
                    <span className="text-xs text-[var(--foreground-subtle)] ml-auto">
                      {expandedId === req.id ? "▼ Hide thread" : "▶ View thread"}
                    </span>
                  </button>
                  {expandedId === req.id && (
                    <div className="border-t border-[var(--border-default)] bg-[var(--background)]/30 p-4">
                      {loadingThread ? (
                        <p className="text-base text-[var(--foreground-muted)]">Loading thread…</p>
                      ) : thread ? (
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-medium text-[var(--foreground-muted)]">Status</span>
                            <select
                              value={thread.request.status}
                              onChange={(e) => handleStatusChange(req.id, e.target.value)}
                              disabled={updatingStatus}
                              className="rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] disabled:opacity-70"
                            >
                              <option value="open">Open</option>
                              <option value="in_progress">In progress</option>
                              <option value="resolved">Resolved</option>
                            </select>
                            {updatingStatus && <span className="text-xs text-[var(--foreground-muted)]">Updating…</span>}
                          </div>
                          <div className="rounded-lg border border-[var(--border-default)] bg-[var(--background-elevated)] p-3">
                            <p className="text-xs font-medium text-[var(--foreground-muted)]">Your initial message · {formatDate(thread.request.createdAt)}</p>
                            <p className="mt-1 text-base text-[var(--foreground)] whitespace-pre-wrap">{thread.request.message}</p>
                          </div>
                          {thread.replies.map((r) => (
                            <div
                              key={r.id}
                              className={`rounded-lg border p-3 ${r.isFromStaff ? "border-blue-200 bg-blue-50/50" : "border-[var(--border-default)] bg-[var(--background-elevated)]"}`}
                            >
                              <p className="text-xs font-medium text-[var(--foreground-muted)]">
                                {r.isFromStaff ? "Support" : "You"} · {formatDate(r.createdAt)}
                              </p>
                              <p className="mt-1 text-base text-[var(--foreground)] whitespace-pre-wrap">{r.body}</p>
                            </div>
                          ))}
                          <form onSubmit={(e) => handleAddReply(e, req.id)} className="pt-2">
                            <label htmlFor={`reply-${req.id}`} className="block text-sm font-medium text-[var(--foreground)] mb-1">
                              Add a reply
                            </label>
                            <textarea
                              id={`reply-${req.id}`}
                              rows={3}
                              maxLength={10000}
                              value={replyMessage}
                              onChange={(e) => setReplyMessage(e.target.value)}
                              placeholder="Add more information or follow up…"
                              className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                            />
                            <button
                              type="submit"
                              disabled={sendingReply || !replyMessage.trim()}
                              className="mt-2 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-70"
                            >
                              {sendingReply ? "Sending…" : "Send reply"}
                            </button>
                          </form>
                        </div>
                      ) : (
                        <p className="text-base text-[var(--foreground-muted)]">Could not load thread.</p>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
