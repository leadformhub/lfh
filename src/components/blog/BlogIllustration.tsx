"use client";

import { cn } from "@/lib/utils";

export type BlogIllustrationVariant =
  | "hero-free"
  | "hero-manual"
  | "content-leads"
  | "social-proof"
  | "lead-capture"
  | "use-cases"
  | "consistency"
  | "network"
  | "referrals"
  | "outreach"
  | "events"
  | "pipeline";

export type BlogIllustrationProps = {
  variant: BlogIllustrationVariant;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeMap = { sm: 160, md: 240, lg: 320 };

/**
 * Decorative SVG illustrations for blog posts. Uses CSS variables for theming.
 */
export function BlogIllustration({ variant, className, size = "md" }: BlogIllustrationProps) {
  const dim = sizeMap[size];
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      aria-hidden
    >
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[var(--color-accent)]"
      >
        {variant === "hero-free" && <HeroFree />}
        {variant === "hero-manual" && <HeroManual />}
        {variant === "content-leads" && <ContentLeads />}
        {variant === "social-proof" && <SocialProof />}
        {variant === "lead-capture" && <LeadCapture />}
        {variant === "use-cases" && <UseCases />}
        {variant === "consistency" && <Consistency />}
        {variant === "network" && <Network />}
        {variant === "referrals" && <Referrals />}
        {variant === "outreach" && <Outreach />}
        {variant === "events" && <Events />}
        {variant === "pipeline" && <Pipeline />}
      </svg>
    </div>
  );
}

function HeroFree() {
  return (
    <>
      <circle cx="120" cy="100" r="56" fill="var(--color-accent-subtle)" />
      <path
        d="M120 60v40l24 24"
        stroke="var(--color-accent)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="120" cy="100" r="8" fill="var(--color-accent)" />
      <rect x="72" y="160" width="96" height="12" rx="6" fill="var(--neutral-200)" />
      <rect x="80" y="178" width="80" height="8" rx="4" fill="var(--neutral-100)" />
    </>
  );
}

function HeroManual() {
  return (
    <>
      <circle cx="120" cy="90" r="44" fill="var(--color-accent-subtle)" />
      <path
        d="M100 90c0-11 9-20 20-20s20 9 20 20"
        stroke="var(--color-accent)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="120" cy="110" r="12" fill="var(--color-accent)" />
      <path d="M80 150h80M80 168h60M80 186h72" stroke="var(--neutral-300)" strokeWidth="3" strokeLinecap="round" />
    </>
  );
}

function ContentLeads() {
  return (
    <>
      <rect x="48" y="56" width="144" height="100" rx="12" fill="var(--color-accent-subtle)" />
      <rect x="56" y="68" width="80" height="8" rx="4" fill="var(--color-accent)" opacity="0.8" />
      <rect x="56" y="84" width="128" height="6" rx="3" fill="var(--neutral-300)" />
      <rect x="56" y="96" width="112" height="6" rx="3" fill="var(--neutral-300)" />
      <rect x="56" y="108" width="96" height="6" rx="3" fill="var(--neutral-300)" />
      <rect x="56" y="132" width="64" height="12" rx="6" fill="var(--color-accent)" />
    </>
  );
}

function SocialProof() {
  return (
    <>
      <circle cx="88" cy="80" r="28" fill="var(--color-accent-subtle)" />
      <circle cx="88" cy="80" r="12" fill="var(--color-accent)" />
      <circle cx="152" cy="80" r="28" fill="var(--color-accent-subtle)" />
      <path d="M148 76l6 8 12-14" stroke="var(--color-accent)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M72 140h96" stroke="var(--neutral-200)" strokeWidth="4" strokeLinecap="round" />
      <path d="M80 160h80M88 180h64" stroke="var(--neutral-200)" strokeWidth="3" strokeLinecap="round" />
    </>
  );
}

function LeadCapture() {
  return (
    <>
      <rect x="56" y="48" width="128" height="88" rx="10" fill="var(--background-elevated)" stroke="var(--border-default)" strokeWidth="2" />
      <rect x="68" y="64" width="104" height="10" rx="4" fill="var(--neutral-100)" />
      <rect x="68" y="82" width="104" height="10" rx="4" fill="var(--neutral-100)" />
      <rect x="68" y="100" width="80" height="10" rx="4" fill="var(--neutral-100)" />
      <rect x="88" y="120" width="64" height="12" rx="6" fill="var(--color-accent)" />
      <circle cx="180" cy="168" r="24" fill="var(--color-success)" opacity="0.2" />
      <path d="M172 168l6 6 12-12" stroke="var(--color-success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

function UseCases() {
  return (
    <>
      <rect x="40" y="64" width="52" height="52" rx="10" fill="var(--color-accent-subtle)" />
      <rect x="148" y="64" width="52" height="52" rx="10" fill="var(--color-accent-subtle)" />
      <rect x="94" y="124" width="52" height="52" rx="10" fill="var(--color-accent-subtle)" />
      <circle cx="66" cy="88" r="8" fill="var(--color-accent)" />
      <circle cx="174" cy="88" r="8" fill="var(--color-accent)" />
      <circle cx="120" cy="148" r="8" fill="var(--color-accent)" />
      <path d="M92 118l28 6 28-6" stroke="var(--neutral-300)" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

function Consistency() {
  return (
    <>
      <path d="M60 120h24v48H60z" fill="var(--color-accent)" opacity="0.3" />
      <path d="M96 100h24v68H96z" fill="var(--color-accent)" opacity="0.5" />
      <path d="M132 80h24v88h-24z" fill="var(--color-accent)" />
      <path d="M168 100h24v68h-24z" fill="var(--color-accent)" opacity="0.5" />
      <path d="M204 120h24v48h-24z" fill="var(--color-accent)" opacity="0.3" />
      <path d="M60 168h168" stroke="var(--neutral-400)" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

function Network() {
  return (
    <>
      <circle cx="120" cy="70" r="22" fill="var(--color-accent-subtle)" />
      <circle cx="120" cy="70" r="8" fill="var(--color-accent)" />
      <circle cx="70" cy="130" r="18" fill="var(--neutral-100)" />
      <circle cx="120" cy="150" r="18" fill="var(--neutral-100)" />
      <circle cx="170" cy="130" r="18" fill="var(--neutral-100)" />
      <path d="M120 92v28M92 118l28 12 28-12" stroke="var(--neutral-300)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

function Referrals() {
  return (
    <>
      <circle cx="90" cy="90" r="32" fill="var(--color-accent-subtle)" />
      <circle cx="90" cy="90" r="10" fill="var(--color-accent)" />
      <circle cx="150" cy="90" r="32" fill="var(--color-accent-subtle)" />
      <path d="M146 86l5 6 10-12" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M120 122v36M100 158h40" stroke="var(--neutral-300)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="120" cy="178" r="20" fill="var(--neutral-100)" />
      <path d="M114 178l4 4 8-8" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

function Outreach() {
  return (
    <>
      <rect x="56" y="64" width="128" height="96" rx="8" fill="var(--background-elevated)" stroke="var(--border-subtle)" strokeWidth="2" />
      <rect x="68" y="78" width="80" height="6" rx="2" fill="var(--neutral-300)" />
      <rect x="68" y="92" width="104" height="6" rx="2" fill="var(--neutral-200)" />
      <rect x="68" y="106" width="96" height="6" rx="2" fill="var(--neutral-200)" />
      <rect x="68" y="132" width="48" height="10" rx="4" fill="var(--color-accent)" />
      <circle cx="188" cy="188" r="20" fill="var(--color-accent-subtle)" />
      <path d="M182 188l4 4 10-10" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

function Events() {
  return (
    <>
      <rect x="48" y="56" width="144" height="80" rx="10" fill="var(--color-accent-subtle)" />
      <rect x="60" y="68" width="120" height="8" rx="4" fill="var(--color-accent)" opacity="0.8" />
      <rect x="60" y="84" width="80" height="6" rx="2" fill="var(--neutral-300)" />
      <rect x="60" y="96" width="100" height="6" rx="2" fill="var(--neutral-300)" />
      <circle cx="120" cy="140" r="28" fill="var(--neutral-100)" stroke="var(--border-default)" strokeWidth="2" />
      <path d="M120 118v22l14 12" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

function Pipeline() {
  return (
    <>
      <rect x="44" y="72" width="40" height="40" rx="8" fill="var(--color-accent-subtle)" />
      <path d="M84 92h32M116 92h24" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" />
      <rect x="140" y="72" width="40" height="40" rx="8" fill="var(--color-accent-subtle)" />
      <path d="M180 92h20" stroke="var(--neutral-300)" strokeWidth="2" strokeLinecap="round" />
      <rect x="92" y="148" width="40" height="40" rx="8" fill="var(--color-accent-subtle)" />
      <circle cx="112" cy="168" r="6" fill="var(--color-accent)" />
    </>
  );
}
