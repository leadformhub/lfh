"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { UpgradeModal } from "@/components/UpgradeModal";
import { canUseOtp } from "@/lib/plans";
import { canUseEmailAlertOnLead } from "@/lib/plan-features";

export function NewFormClient({
  plan,
  razorpayKeyId,
}: {
  plan: string;
  razorpayKeyId: string | null;
}) {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeModalReason, setUpgradeModalReason] = useState<"otp" | "email">("otp");
  const [form, setForm] = useState({
    name: "",
    status: "PUBLIC" as "PUBLIC" | "PRIVATE",
    description: "",
    formType: "contact",
    emailAlertEnabled: false,
    emailOtpEnabled: false,
    mobileOtpEnabled: false,
    redirectUrl: "",
  });

  const planKey = plan as "free" | "pro" | "business";
  const isFreeUser = !canUseOtp(planKey);
  const canUseEmailAlert = canUseEmailAlertOnLead(planKey);

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
          emailAlertEnabled: form.emailAlertEnabled,
          emailOtpEnabled: form.emailOtpEnabled,
          mobileOtpEnabled: form.mobileOtpEnabled,
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
        router.replace(`/${username}/forms/${formId}/design`);
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

  function handleMobileOtpClick(e: React.MouseEvent) {
    if (isFreeUser) {
      e.preventDefault();
      setUpgradeModalReason("otp");
      setShowUpgradeModal(true);
    }
  }

  function handleEmailAlertClick(e: React.MouseEvent) {
    if (!canUseEmailAlert) {
      e.preventDefault();
      setUpgradeModalReason("email");
      setShowUpgradeModal(true);
    }
  }

  function handleEmailOtpClick(e: React.MouseEvent) {
    if (isFreeUser) {
      e.preventDefault();
      setUpgradeModalReason("otp");
      setShowUpgradeModal(true);
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
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
            <div className="flex flex-col gap-2 lg:col-span-2">
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
            <div className="flex flex-col gap-2 border-t border-neutral-200 pt-4 lg:border-t-0 lg:border-l lg:border-neutral-100 lg:pl-6 lg:pt-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Options
              </p>
              <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-1">
                <label
                  className={`flex cursor-pointer items-center gap-2 rounded py-2 min-h-[44px] text-xs text-neutral-800 sm:min-h-0 sm:py-1.5 ${!canUseEmailAlert ? "cursor-pointer" : ""}`}
                  onClick={handleEmailAlertClick}
                >
                  <input
                    type="checkbox"
                    checked={form.emailAlertEnabled}
                    onChange={(e) => {
                      if (canUseEmailAlert) {
                        setForm((f) => ({ ...f, emailAlertEnabled: e.target.checked }));
                      }
                    }}
                    disabled={!canUseEmailAlert}
                    className="h-4 w-4 rounded border-neutral-300 text-[var(--color-accent)] disabled:cursor-pointer"
                  />
                  Notify Lead By Email
                  {!canUseEmailAlert && (
                    <svg
                      className="size-3.5 shrink-0 text-neutral-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </label>
                <label
                  className={`flex cursor-pointer items-center gap-2 rounded py-2 min-h-[44px] text-xs text-neutral-800 sm:min-h-0 sm:py-1.5 ${isFreeUser ? "cursor-pointer" : ""}`}
                  onClick={handleEmailOtpClick}
                >
                  <input
                    type="checkbox"
                    checked={form.emailOtpEnabled}
                    onChange={(e) => {
                      if (!isFreeUser) {
                        setForm((f) => ({ ...f, emailOtpEnabled: e.target.checked }));
                      }
                    }}
                    disabled={isFreeUser}
                    className="h-4 w-4 rounded border-neutral-300 text-[var(--color-accent)] disabled:cursor-pointer"
                  />
                  Email OTP
                  {isFreeUser && (
                    <svg
                      className="size-3.5 shrink-0 text-neutral-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </label>
                <label
                  className={`flex cursor-pointer items-center gap-2 rounded py-2 min-h-[44px] text-xs text-neutral-800 sm:min-h-0 sm:py-1.5 ${isFreeUser ? "cursor-pointer" : ""}`}
                  onClick={handleMobileOtpClick}
                >
                  <input
                    type="checkbox"
                    checked={form.mobileOtpEnabled}
                    onChange={(e) => {
                      if (!isFreeUser) {
                        setForm((f) => ({ ...f, mobileOtpEnabled: e.target.checked }));
                      }
                    }}
                    disabled={isFreeUser}
                    className="h-4 w-4 rounded border-neutral-300 text-[var(--color-accent)] disabled:cursor-pointer"
                  />
                  Mobile OTP
                  {isFreeUser && (
                    <svg
                      className="size-3.5 shrink-0 text-neutral-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </label>
              </div>
              <div className="mt-auto flex flex-col gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="min-h-[44px] w-full rounded-lg bg-[var(--color-accent)] py-2.5 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
                >
                  {loading ? "Creating…" : "Create & Design"}
                </button>
                <Link
                  href={`/${username}/forms`}
                  className="min-h-[44px] inline-flex items-center justify-center w-full rounded-lg border border-neutral-300 py-2.5 text-center text-sm font-medium text-neutral-800 hover:bg-neutral-50"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>

      <UpgradeModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPlan={plan}
        razorpayKeyId={razorpayKeyId}
        title={upgradeModalReason === "email" ? "Upgrade to notify leads by email" : "Upgrade to unlock Mobile OTP"}
        description={upgradeModalReason === "email" ? "Notify Lead By Email is available on Pro and Business plans. Upgrade to get email alerts when a new lead is submitted." : "Mobile OTP verification is available on Pro and Business plans. Upgrade to verify leads and reduce fake numbers."}
      />
    </>
  );
}
