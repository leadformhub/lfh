import { Suspense } from "react";
import { getSession } from "@/lib/auth";
import { getRazorpayKeyId } from "@/lib/razorpay";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getPlanLimits, type PlanKey } from "@/lib/plans";
import { getOtpLimitForPlan } from "@/lib/plan-quotas";
import { getOtpUsageForUser } from "@/services/otp.service";
import { UpgradePlanCard } from "@/components/UpgradePlanCard";
import { ChangeEmailForm } from "@/components/ChangeEmailForm";
import { ChangeUsernameForm } from "@/components/ChangeUsernameForm";
import { DeleteAccountForm } from "@/components/DeleteAccountForm";
import { SettingsTabNav } from "@/components/SettingsTabNav";

export const metadata = {
  title: "Settings | LeadFormHub",
  description: "Account and app settings.",
};

function IconAccount({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}
function IconPlan({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}
function IconRocket({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}
function IconArrow({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
function IconKey({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  );
}
function IconDoc({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
function IconHelp({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function IconUsage({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}
function IconTrash({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

export default async function SettingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await getSession();
  const { username } = await params;
  const { tab: tabParam } = await searchParams;
  if (!session || session.username.toLowerCase() !== username.toLowerCase()) redirect("/login");
  const tab =
    tabParam === "usage"
      ? "usage"
      : tabParam === "plan-limits"
        ? "plan-limits"
        : "account";
  const planLabel = session.plan.charAt(0).toUpperCase() + session.plan.slice(1);
  const razorpayKeyId = getRazorpayKeyId();
  const base = `/${username}`;
  const settingsPath = `/${username}/settings`;

  // Usage data for Usage tab
  const planKey = session.plan as PlanKey;
  const limits = getPlanLimits(planKey);
  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);
  const [formsCount, otpUsage, leadsThisMonth, otpLimit] = await Promise.all([
    prisma.form.count({ where: { userId: session.userId } }),
    getOtpUsageForUser(session.userId),
    prisma.lead.count({ where: { userId: session.userId, createdAt: { gte: startOfMonth } } }),
    getOtpLimitForPlan(planKey),
  ]);
  const formsLimit = limits.maxForms === Infinity ? null : limits.maxForms;
  const leadsLimit = limits.maxLeadsPerMonth;

  return (
    <div className="min-w-0 p-4 sm:p-5 md:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 sm:mb-8">
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-[var(--foreground-heading)] tracking-tight">
            Settings
          </h1>
          <p className="mt-1 text-[var(--foreground-muted)] text-base">
            Manage your account, plan, and preferences.
          </p>
          <Suspense fallback={<div className="mt-4 h-12 w-48 rounded-xl bg-[var(--neutral-100)] animate-pulse" />}>
            <SettingsTabNav pathname={settingsPath} />
          </Suspense>
        </header>

        {tab === "usage" && (
          /* Usage tab */
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            <section
              className="min-w-0 rounded-xl border border-[var(--border-default)] bg-white shadow-[var(--shadow-sm)] overflow-hidden"
              aria-labelledby="usage-heading"
            >
              <div className="flex items-center gap-3 px-4 sm:px-5 md:px-6 py-3 sm:py-4 border-b border-[var(--border-default)] bg-[var(--background-alt)]">
                <span className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                  <IconUsage className="size-4 sm:size-5" />
                </span>
                <h2 id="usage-heading" className="text-base sm:text-lg font-semibold text-[var(--foreground-heading)]">
                  Usage this month
                </h2>
              </div>
              <div className="divide-y divide-[var(--border-default)]">
                <div className="px-4 sm:px-5 md:px-6 py-4">
                  <p className="text-xs font-medium text-[var(--foreground-muted)]">Forms</p>
                  <p className="mt-1 text-xl font-bold text-[var(--foreground-heading)]">
                    {formsCount}
                    {formsLimit !== null && (
                      <span className="ml-2 text-base font-normal text-[var(--foreground-muted)]">/ {formsLimit}</span>
                    )}
                    {formsLimit === null && (
                      <span className="ml-2 text-base font-normal text-[var(--foreground-muted)]">in use</span>
                    )}
                  </p>
                </div>
                <div className="px-4 sm:px-5 md:px-6 py-4">
                  <p className="text-xs font-medium text-[var(--foreground-muted)]">Leads this month</p>
                  <p className="mt-1 text-xl font-bold text-[var(--foreground-heading)]">
                    {leadsThisMonth}
                    {leadsLimit !== null && (
                      <span className="ml-2 text-base font-normal text-[var(--foreground-muted)]">/ {leadsLimit}</span>
                    )}
                  </p>
                </div>
                <div className="px-4 sm:px-5 md:px-6 py-4">
                  <p className="text-xs font-medium text-[var(--foreground-muted)]">OTP sent this month</p>
                  <p className="mt-1 text-xl font-bold text-[var(--foreground-heading)]">
                    {otpUsage.used}
                    {otpLimit !== null && (
                      <span className="ml-2 text-base font-normal text-[var(--foreground-muted)]">/ {otpLimit}</span>
                    )}
                    {otpLimit === null && (
                      <span className="ml-2 text-base font-normal text-[var(--foreground-muted)]">(OTP not included in Free)</span>
                    )}
                  </p>
                </div>
              </div>
            </section>
            <section className="min-w-0 rounded-xl border border-[var(--border-default)] bg-white shadow-[var(--shadow-sm)] p-4 sm:p-5">
              <p className="text-base text-[var(--foreground-muted)]">
                Usage resets at the start of each calendar month. Upgrade your plan for higher limits.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] hover:underline"
              >
                <IconDoc className="size-4 shrink-0" />
                View pricing
              </Link>
            </section>
          </div>
        )}

        {tab === "plan-limits" && (
          /* Plan & Limits tab – 2 cards */
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2">
            {/* Card 1: Current Plan */}
            <section
              className="min-w-0 rounded-xl border border-[var(--border-default)] bg-gradient-to-br from-[var(--color-accent)]/10 via-white to-white shadow-[var(--shadow-sm)] overflow-hidden"
              aria-labelledby="current-plan-heading"
            >
              <div className="flex items-center gap-3 px-4 sm:px-5 md:px-6 py-3 sm:py-4 border-b border-[var(--border-default)] bg-[var(--background-alt)]">
                <span className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                  <IconPlan className="size-4 sm:size-5" />
                </span>
                <h2 id="current-plan-heading" className="text-base sm:text-lg font-semibold text-[var(--foreground-heading)]">
                  Current plan
                </h2>
              </div>
              <div className="px-4 sm:px-5 md:px-6 py-4">
                <p className="text-xl font-bold text-[var(--foreground-heading)]">{planLabel}</p>
              <p className="mt-1 text-base text-[var(--foreground-muted)]">
                {planLabel === "Free" && "Upgrade to unlock OTP verification and more forms."}
                {planLabel === "Pro" && "You have unlimited forms and 100 OTP/month."}
                {planLabel === "Business" && "Full access to all features."}
              </p>
            </div>
          </section>

            {/* Card 2: Plans and limits */}
            <section
              className="min-w-0 rounded-xl border border-[var(--border-default)] bg-white shadow-[var(--shadow-sm)] overflow-hidden transition-shadow hover:shadow-[var(--shadow-md)]"
              aria-labelledby="limits-heading"
            >
              <div className="flex items-center gap-3 px-4 sm:px-5 md:px-6 py-3 sm:py-4 border-b border-[var(--border-default)] bg-[var(--background-alt)]">
                <span className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                  <IconPlan className="size-4 sm:size-5" />
                </span>
                <h2 id="limits-heading" className="text-base sm:text-lg font-semibold text-[var(--foreground-heading)]">
                  Plans and limits
                </h2>
              </div>
              <div className="px-4 sm:px-5 md:px-6 py-4 space-y-3">
                <ul className="text-base text-[var(--foreground)] space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" aria-hidden />
                    <span><strong>Free:</strong> 3 forms, no OTP</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" aria-hidden />
                    <span><strong>Pro:</strong> Unlimited forms, 100 OTP/month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" aria-hidden />
                    <span><strong>Business:</strong> Unlimited forms, 1,000 OTP/month</span>
                  </li>
                </ul>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 mt-2 text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] hover:underline"
                >
                  <IconDoc className="size-4 shrink-0" />
                  View full pricing
                </Link>
              </div>
            </section>

            {/* Upgrade card – full width */}
            <section
              className="min-w-0 sm:col-span-2 rounded-xl border-2 border-[var(--color-accent)]/30 bg-gradient-to-b from-[var(--color-accent)]/5 to-white shadow-[var(--shadow-sm)] overflow-hidden transition-shadow hover:shadow-[var(--shadow-md)]"
              aria-labelledby="upgrade-heading"
            >
              <div className="flex items-center gap-3 px-4 sm:px-5 md:px-6 py-3 sm:py-4 border-b border-[var(--border-default)] bg-[var(--color-accent)]/5">
                <span className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)] text-white">
                  <IconRocket className="size-4 sm:size-5" />
                </span>
                <h2 id="upgrade-heading" className="text-base sm:text-lg font-semibold text-[var(--foreground-heading)]">
                  Pro & Business
                </h2>
              </div>
              <div className="p-4 sm:p-5 md:p-6">
                <UpgradePlanCard currentPlan={session.plan} razorpayKeyId={razorpayKeyId} />
              </div>
            </section>
          </div>
        )}

        {tab === "account" && (
        /* Account tab */
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2">
          {/* Card 1: Email change */}
          <section
            className="min-w-0 rounded-xl border border-[var(--border-default)] bg-white shadow-[var(--shadow-sm)] overflow-hidden transition-shadow hover:shadow-[var(--shadow-md)]"
            aria-labelledby="email-heading"
          >
            <div className="flex items-center gap-3 px-4 sm:px-5 md:px-6 py-3 sm:py-4 border-b border-[var(--border-default)] bg-[var(--background-alt)]">
              <span className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <IconAccount className="size-4 sm:size-5" />
              </span>
              <h2 id="email-heading" className="text-base sm:text-lg font-semibold text-[var(--foreground-heading)]">
                Email
              </h2>
            </div>
            <div className="px-4 sm:px-5 md:px-6 py-4">
              <p className="text-xs font-medium text-[var(--foreground-muted)]">Current email</p>
              <p className="mt-0.5 text-base font-medium text-[var(--foreground-heading)] break-all">{session.email}</p>
              <p className="mt-3 text-xs font-medium text-[var(--foreground-muted)]">Change email</p>
              <p className="mt-0.5 text-base text-[var(--foreground-muted)] mb-3">We&apos;ll send a verification link to your new address. After you verify, your email will be updated.</p>
              <ChangeEmailForm />
            </div>
          </section>

          {/* Card 2: Username change */}
          <section
            className="min-w-0 rounded-xl border border-[var(--border-default)] bg-white shadow-[var(--shadow-sm)] overflow-hidden transition-shadow hover:shadow-[var(--shadow-md)]"
            aria-labelledby="username-heading"
          >
            <div className="flex items-center gap-3 px-4 sm:px-5 md:px-6 py-3 sm:py-4 border-b border-[var(--border-default)] bg-[var(--background-alt)]">
              <span className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <IconAccount className="size-4 sm:size-5" />
              </span>
              <h2 id="username-heading" className="text-base sm:text-lg font-semibold text-[var(--foreground-heading)]">
                Username
              </h2>
            </div>
            <div className="px-4 sm:px-5 md:px-6 py-4">
              <p className="text-xs font-medium text-[var(--foreground-muted)]">Current username</p>
              <p className="mt-0.5 text-base font-medium text-[var(--foreground-heading)] mb-2">@{session.username}</p>
              <p className="text-base text-[var(--foreground-muted)] mb-3">{`Your profile URL will update to /${session.username} after you change it.`}</p>
              <ChangeUsernameForm currentUsername={session.username} />
            </div>
          </section>

          {/* Row 2 – Card 1: Change password */}
          <section
            className="min-w-0 rounded-xl border border-[var(--border-default)] bg-white shadow-[var(--shadow-sm)] overflow-hidden transition-shadow hover:shadow-[var(--shadow-md)]"
            aria-labelledby="change-password-heading"
          >
            <div className="flex items-center gap-3 px-4 sm:px-5 md:px-6 py-3 sm:py-4 border-b border-[var(--border-default)] bg-[var(--background-alt)]">
              <span className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <IconKey className="size-4 sm:size-5" />
              </span>
              <h2 id="change-password-heading" className="text-base sm:text-lg font-semibold text-[var(--foreground-heading)]">
                Change password
              </h2>
            </div>
            <div className="px-4 sm:px-5 md:px-6 py-4">
              <p className="text-base text-[var(--foreground-muted)] mb-3">We&apos;ll send a reset link to your email so you can set a new password.</p>
              <Link
                href="/forgot-password"
                className="inline-flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent-hover)] transition-colors min-h-[44px] border border-[var(--border-default)]"
              >
                <span className="flex items-center gap-2">
                  <IconKey className="size-4 shrink-0" />
                  Send password reset link
                </span>
                <IconArrow className="size-4 shrink-0 opacity-70" />
              </Link>
            </div>
          </section>

          {/* Row 2 – Card 2: Quick links with logout */}
          <section
            className="min-w-0 rounded-xl border border-[var(--border-default)] bg-white shadow-[var(--shadow-sm)] overflow-hidden transition-shadow hover:shadow-[var(--shadow-md)]"
            aria-labelledby="quick-links-heading"
          >
            <div className="flex items-center gap-3 px-4 sm:px-5 md:px-6 py-3 sm:py-4 border-b border-[var(--border-default)] bg-[var(--background-alt)]">
              <span className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <IconHelp className="size-4 sm:size-5" />
              </span>
              <h2 id="quick-links-heading" className="text-base sm:text-lg font-semibold text-[var(--foreground-heading)]">
                Quick links
              </h2>
            </div>
            <nav className="divide-y divide-[var(--border-default)]">
              <Link
                href={`${base}/dashboard`}
                className="flex items-center justify-between gap-3 px-4 sm:px-5 md:px-6 py-3.5 text-[var(--foreground)] hover:bg-[var(--background-alt)] transition-colors min-h-[44px] sm:min-h-[48px]"
              >
                <span className="font-medium">Dashboard</span>
                <IconArrow className="size-4 shrink-0 text-[var(--foreground-muted)]" />
              </Link>
              <Link
                href="/pricing"
                className="flex items-center justify-between gap-3 px-4 sm:px-5 md:px-6 py-3.5 text-[var(--foreground)] hover:bg-[var(--background-alt)] transition-colors min-h-[44px] sm:min-h-[48px]"
              >
                <span className="font-medium">Pricing</span>
                <IconArrow className="size-4 shrink-0 text-[var(--foreground-muted)]" />
              </Link>
              <Link
                href="/faq"
                className="flex items-center justify-between gap-3 px-4 sm:px-5 md:px-6 py-3.5 text-[var(--foreground)] hover:bg-[var(--background-alt)] transition-colors min-h-[44px] sm:min-h-[48px]"
              >
                <span className="font-medium">FAQ</span>
                <IconArrow className="size-4 shrink-0 text-[var(--foreground-muted)]" />
              </Link>
            </nav>
          </section>

          {/* Delete account – full width */}
          <section
            className="min-w-0 sm:col-span-2 rounded-xl border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5 shadow-[var(--shadow-sm)] overflow-hidden"
            aria-labelledby="delete-account-heading"
          >
            <div className="flex items-center gap-3 px-4 sm:px-5 md:px-6 py-3 sm:py-4 border-b border-[var(--color-danger)]/20 bg-[var(--color-danger)]/10">
              <span className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-danger)]/20 text-[var(--color-danger)]">
                <IconTrash className="size-4 sm:size-5" />
              </span>
              <h2 id="delete-account-heading" className="text-base sm:text-lg font-semibold text-[var(--foreground-heading)]">
                Delete account
              </h2>
            </div>
            <div className="px-4 sm:px-5 md:px-6 py-4">
              <DeleteAccountForm />
            </div>
          </section>
        </div>
        )}
      </div>
    </div>
  );
}
