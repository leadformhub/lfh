"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type FormRow = {
  id: string;
  name: string;
  status: string;
  formType: string;
  submissionsCount: number;
  viewsCount: number;
  createdAtFormatted: string;
};

export function FormsList({
  username,
  forms,
  total,
  page,
  perPage,
}: {
  username: string;
  forms: FormRow[];
  total: number;
  page: number;
  perPage: number;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const totalPages = Math.ceil(total / perPage);
  const base = `/${username}/forms`;

  async function handleStatusChange(formId: string, newStatus: "PUBLIC" | "PRIVATE") {
    setUpdatingStatus(formId);
    try {
      const res = await fetch(`/api/forms/${formId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) router.refresh();
    } finally {
      setUpdatingStatus(null);
    }
  }

  async function handleDelete(formId: string) {
    if (!confirm("Delete this form? This cannot be undone.")) return;
    setDeleting(formId);
    try {
      const res = await fetch(`/api/forms/${formId}/delete`, { method: "POST" });
      if (res.ok) router.refresh();
    } finally {
      setDeleting(null);
    }
  }

  if (forms.length === 0) {
    return (
      <div className="empty-state rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--background-elevated)] shadow-[var(--shadow-sm)]">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[var(--neutral-100)] text-[var(--foreground-muted)]" aria-hidden>
          <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="empty-state-title">No forms yet</p>
        <p className="empty-state-description">Create your first form to start collecting leads.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Mobile: Card layout */}
      <div className="space-y-4 md:hidden">
        {forms.map((f) => (
          <div
            key={f.id}
            className="rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--background-elevated)] p-4 shadow-[var(--shadow-sm)]"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="min-w-0 flex-1 truncate font-medium text-[var(--foreground-heading)]">
                {f.name}
              </h3>
              <select
                value={f.status}
                onChange={(e) => handleStatusChange(f.id, e.target.value as "PUBLIC" | "PRIVATE")}
                disabled={updatingStatus === f.id}
                className="form-input-base shrink-0 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--background-elevated)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/30 disabled:opacity-50"
              >
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
              </select>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--foreground-muted)]">
              <span>{f.formType}</span>
              <span>{f.viewsCount} views</span>
              <span>{f.submissionsCount} submissions</span>
              <span>
                {f.viewsCount > 0
                  ? ((f.submissionsCount / f.viewsCount) * 100).toFixed(1)
                  : "0"}% conversion
              </span>
              <span>{f.createdAtFormatted}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`${base}/${f.id}/design`}
                className="btn-base min-h-11 flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-default)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--neutral-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              >
                Edit
              </Link>
              <Link
                href={`/f/${f.id}`}
                target="_blank"
                className="btn-base min-h-11 flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-default)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--neutral-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              >
                View
              </Link>
              <Link
                href={`${base}/${f.id}/embed`}
                className="btn-base min-h-11 flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-default)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--neutral-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              >
                Embed
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(f.id)}
                disabled={deleting === f.id}
                className="btn-base min-h-11 flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-danger)]/30 px-4 py-2 text-sm font-medium text-[var(--color-danger)] transition-colors hover:bg-[var(--color-danger)]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-danger)] disabled:opacity-50"
              >
                {deleting === f.id ? "…" : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Table layout */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-[var(--border-default)] bg-white shadow-[var(--shadow-sm)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-[var(--neutral-50)] border-b border-[var(--border-default)]">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-[var(--foreground-muted)]">Form name</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--foreground-muted)]">Status</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--foreground-muted)]">Type</th>
                <th className="px-4 py-3 text-right font-medium text-[var(--foreground-muted)]">Views</th>
                <th className="px-4 py-3 text-right font-medium text-[var(--foreground-muted)]">Submissions</th>
                <th className="px-4 py-3 text-right font-medium text-[var(--foreground-muted)]">Conversion</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--foreground-muted)]">Created</th>
                <th className="px-4 py-3 text-right font-medium text-[var(--foreground-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {forms.map((f) => (
                <tr key={f.id} className="border-b border-[var(--neutral-100)] hover:bg-[var(--neutral-50)]/50 last:border-0">
                  <td className="px-4 py-3 font-medium text-[var(--foreground-heading)]">{f.name}</td>
                  <td className="px-4 py-3">
                    <select
                      value={f.status}
                      onChange={(e) => handleStatusChange(f.id, e.target.value as "PUBLIC" | "PRIVATE")}
                      disabled={updatingStatus === f.id}
                      className="form-input-base rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--background-elevated)] px-2 py-1.5 text-sm text-[var(--foreground)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/30 disabled:opacity-50"
                    >
                      <option value="PUBLIC">Public</option>
                      <option value="PRIVATE">Private</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-[var(--foreground-muted)]">{f.formType}</td>
                  <td className="px-4 py-3 text-right text-[var(--foreground)]">{f.viewsCount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-[var(--foreground)]">{f.submissionsCount}</td>
                  <td className="px-4 py-3 text-right font-medium text-[var(--foreground)]">
                    {f.viewsCount > 0 ? ((f.submissionsCount / f.viewsCount) * 100).toFixed(1) : "0"}%
                  </td>
                  <td className="px-4 py-3 text-[var(--foreground-muted)]">{f.createdAtFormatted}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex flex-wrap items-center justify-end gap-x-4 gap-y-1">
                      <Link href={`${base}/${f.id}/design`} className="font-medium text-[var(--color-accent)] transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-accent)]">Edit</Link>
                      <Link href={`/f/${f.id}`} target="_blank" className="font-medium text-[var(--color-accent)] transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-accent)]">View</Link>
                      <Link href={`${base}/${f.id}/embed`} className="font-medium text-[var(--color-accent)] transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-accent)]">Embed</Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(f.id)}
                        disabled={deleting === f.id}
                        className="font-medium text-[var(--color-danger)] transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-danger)] disabled:opacity-50"
                      >
                        {deleting === f.id ? "…" : "Delete"}
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col gap-3 rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--background-elevated)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-[var(--foreground-muted)]">
            {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}
          </span>
          <div className="flex gap-4">
            {page > 1 && (
              <Link
                href={`${base}?page=${page - 1}`}
                className="min-h-11 flex items-center text-sm font-medium text-[var(--color-accent)] transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`${base}?page=${page + 1}`}
                className="min-h-11 flex items-center text-sm font-medium text-[var(--color-accent)] transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
