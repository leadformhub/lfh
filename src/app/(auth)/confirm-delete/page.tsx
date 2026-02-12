"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ConfirmDeleteForm() {
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setToken(searchParams.get("token") || "");
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/confirm-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to delete account");
        return;
      }
      setDone(true);
      if (data.redirect) {
        window.location.href = data.redirect;
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
        <p className="text-red-600">Invalid or expired link. Request a new one from Settings.</p>
        <Link href="/login" className="mt-4 inline-block text-blue-600 hover:underline">
          Back to login
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
        <p className="text-green-600">Account deleted. Redirecting to login…</p>
        <Link href="/login" className="mt-4 inline-block text-blue-600 hover:underline">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
      <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Confirm account deletion</h1>
      <p className="text-base text-neutral-600 mb-6">
        This will permanently delete your account. Forms and subscription will be removed. Leads are kept but unmapped.
        This cannot be undone.
      </p>
      {error && <p className="text-red-600 text-base mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Deleting…" : "Delete my account"}
        </button>
      </form>
      <p className="mt-4 text-center text-base">
        <Link href="/login" className="text-blue-600 hover:underline">
          Cancel and go back
        </Link>
      </p>
    </div>
  );
}

export default function ConfirmDeletePage() {
  return (
    <Suspense fallback={<div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 animate-pulse h-64" />}>
      <ConfirmDeleteForm />
    </Suspense>
  );
}
