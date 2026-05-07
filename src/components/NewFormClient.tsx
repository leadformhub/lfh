"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

function usePrefetchFormDesigner() {
  useEffect(() => {
    const t = setTimeout(() => {
      void import("@/components/FormBuilder");
    }, 400);
    return () => clearTimeout(t);
  }, []);
}

export function NewFormClient() {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    status: "PUBLIC" as "PUBLIC" | "PRIVATE",
    description: "",
    formType: "contact",
    redirectUrl: "",
  });

  usePrefetchFormDesigner();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/forms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          status: form.status,
          description: form.description,
          formType: form.formType,
          redirectUrl: form.redirectUrl || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create form");
        return;
      }
      const formId = data.form?.id ?? data.id;
      if (formId) {
        router.replace(`/${username}/forms/${formId}`);
        router.refresh();
      } else {
        window.location.href = `/${username}/forms`;
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputBase =
    "w-full rounded border border-neutral-300 bg-white px-2.5 py-1.5 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/30";

  return (
    <>
      <div className="flex h-full max-h-[calc(100vh-4rem)] min-h-0 w-full flex-col overflow-hidden p-4 lg:p-6">
        <div className="flex shrink-0 flex-col gap-1 border-b border-neutral-200 pb-2">
          <div className="flex items-center gap-3">
            <Link
              href={`/${username}/forms`}
              className="text-xs font-medium text-[var(--color-accent)] hover:underline"
            >
              ← Back
            </Link>
            {error && (
              <span className="ml-auto rounded bg-red-50 px-2 py-1 text-xs text-red-600">{error}</span>
            )}
          </div>
          <h1 className="font-heading text-lg font-bold text-neutral-900">Create Form</h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mt-2 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white p-3 shadow-sm lg:p-4"
        >
          <div className="flex min-h-0 flex-1 flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 gap-y-3">
                <div>
                  <label className="mb-0.5 block text-xs font-medium text-neutral-600">Form name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className={inputBase}
                    placeholder="e.g. Contact Us"
                    required
                  />
                </div>
                <div>
                  <label className="mb-0.5 block text-xs font-medium text-neutral-600">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, status: e.target.value as "PUBLIC" | "PRIVATE" }))
                    }
                    className={`${inputBase} cursor-pointer bg-white`}
                  >
                    <option value="PUBLIC">Public</option>
                    <option value="PRIVATE">Private</option>
                  </select>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="mb-0.5 block text-xs font-medium text-neutral-600">
                    Description
                  </label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className={inputBase}
                    placeholder="Short description (optional)"
                  />
                </div>
                <div>
                  <label className="mb-0.5 block text-xs font-medium text-neutral-600">
                    Form Type
                  </label>
                  <input
                    type="text"
                    value={form.formType}
                    onChange={(e) => setForm((f) => ({ ...f, formType: e.target.value }))}
                    className={inputBase}
                    placeholder="e.g. contact"
                  />
                </div>
                <div>
                  <label className="mb-0.5 block text-xs font-medium text-neutral-600">
                    Redirect URL
                  </label>
                  <input
                    type="url"
                    value={form.redirectUrl}
                    onChange={(e) => setForm((f) => ({ ...f, redirectUrl: e.target.value }))}
                    placeholder="https://..."
                    className={inputBase}
                  />
                </div>
              </div>
            </div>
            <div className="mt-auto flex flex-col gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] py-2.5 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span
                      className="size-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent"
                      aria-hidden
                    />
                    Processing...
                  </>
                ) : (
                  "Create & Design"
                )}
              </button>
              <Link
                href={`/${username}/forms`}
                className="min-h-[44px] inline-flex items-center justify-center w-full rounded-lg border border-neutral-300 py-2.5 text-center text-sm font-medium text-neutral-800 hover:bg-neutral-50"
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
