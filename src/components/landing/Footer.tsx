"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Tooltip } from "@/components/ui/Tooltip";
import { FeedbackTrigger } from "@/components/FeedbackModal";
import { cn } from "@/lib/utils";

const TRUST_TOOLTIP = "We build with security and privacy in mind.";

const trustBadges = [
  { label: "Secure by design", tooltip: TRUST_TOOLTIP },
  { label: "Encrypted data", tooltip: TRUST_TOOLTIP },
  { label: "Privacy-conscious", tooltip: TRUST_TOOLTIP },
] as const;

/** Enterprise Footer — grouped by user intent; accordion on mobile, grid on desktop */
const productLinks: { label: string; href?: string; isFeedback?: boolean }[] = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Feedback", isFeedback: true },
];

const useCaseLinks = [
  { label: "Lead Capture Forms", href: "/features#lead-capture" },
  { label: "Form Automation", href: "/features#form-automation" },
  { label: "Secure Lead Validation", href: "/features#secure-validation" },
  { label: "Analytics & Insights", href: "/features#analytics" },
];

const compareLinks = [
  { label: "Typeform alternative", href: "/blog/typeform-alternative" },
  { label: "Google Forms alternative", href: "/blog/google-forms-alternative" },
  { label: "Zoho Forms alternative", href: "/zoho-forms-alternative" },
];

const resourcesLinks = [
  { label: "Webhooks", href: "/api-docs#webhooks" },
  { label: "Integrations", href: "/integrations" },
  { label: "Knowledge Base", href: "/knowledge-base" },
  { label: "API Docs", href: "/api-docs" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
  { label: "Raise Support Request", href: "/support" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms and Conditions", href: "/terms-and-conditions" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Sitemap", href: "/sitemap.xml" },
];

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/leadformhub", icon: "linkedin" },
  { label: "Instagram", href: "https://www.instagram.com/leadformhub/", icon: "instagram" },
  { label: "X (Twitter)", href: "https://x.com/leadformhub", icon: "x" },
  { label: "Facebook", href: "https://www.facebook.com/leadformhub", icon: "facebook" },
];

function SocialIcon({ type }: { type: string }) {
  const className = "size-5 shrink-0";
  if (type === "instagram") {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
      </svg>
    );
  }
  if (type === "x") {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  if (type === "facebook") {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }
  if (type === "linkedin") {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }
  return null;
}

const linkBase =
  "inline-flex min-h-[44px] min-w-[44px] sm:min-w-0 sm:min-h-[40px] items-center rounded-md px-2 -ml-2 text-base font-medium leading-6 text-[var(--footer-link)] transition-all duration-200 hover:text-[var(--footer-heading)] hover:bg-[var(--footer-divider)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--footer-heading)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--footer-bg)]";

function FooterSection({
  title,
  links,
  open,
  onToggle,
}: {
  title: string;
  links: { label: string; href?: string; isFeedback?: boolean }[];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-[var(--footer-divider)] sm:border-0">
      <button
        type="button"
        className="flex w-full min-h-[48px] items-center justify-between py-3 text-left sm:pointer-events-none sm:min-h-0 sm:py-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--footer-heading)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--footer-bg)] rounded-md -mx-1 px-1 sm:mx-0 sm:px-0"
        onClick={onToggle}
        aria-expanded={open}
      >
        <h4 className="font-heading text-base font-semibold uppercase tracking-widest leading-6 text-white">
          {title}
        </h4>
        <svg
          className={cn("size-5 text-[var(--footer-link)] transition-transform duration-200 sm:hidden", open && "rotate-180")}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <ul className={cn("space-y-0.5 py-2 sm:mt-4 sm:space-y-1 sm:py-0", open ? "block" : "hidden sm:block")}>
        {links.map((l) => (
          <li key={l.label}>
            {l.isFeedback ? (
              <FeedbackTrigger className={linkBase}>
                {l.label}
              </FeedbackTrigger>
            ) : (
              <Link href={l.href!} className={linkBase}>
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const [productOpen, setProductOpen] = useState(false);
  const [useCasesOpen, setUseCasesOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);

  return (
    <footer className="relative bg-[var(--footer-bg)] pt-12 pb-0 sm:pt-24" role="contentinfo">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--footer-divider)] to-transparent" aria-hidden />
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <div className="shrink-0">
            <Link
              href="/"
              className="inline-flex items-center transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--footer-heading)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--footer-bg)] rounded-md -ml-1"
              aria-label="LeadFormHub home"
            >
              <Image src="/logo-w.png" alt="LeadFormHub" width={240} height={60} className="h-10 w-auto object-contain" loading="eager" />
            </Link>
            <p className="mt-4 max-w-sm text-base leading-6 text-[var(--footer-text)]">
              Lead capture form builder with OTP verification and analytics. Built for modern businesses.
            </p>
            <p className="mt-3 text-sm font-medium uppercase tracking-widest text-[var(--footer-link)]">
              Follow us
            </p>
            <div className="mt-3 flex gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-lg border border-[var(--footer-divider)] text-[var(--footer-link)]",
                    "transition-all duration-200 hover:text-[var(--footer-heading)] hover:border-[var(--footer-heading)]/40 hover:scale-105",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--footer-heading)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--footer-bg)]"
                  )}
                  aria-label={s.label}
                >
                  <SocialIcon type={s.icon} />
                </a>
              ))}
            </div>
            <div className="mt-6">
              <Link
                href="/pricing"
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[var(--footer-divider)] bg-[var(--footer-divider)]/30 px-4 text-sm font-semibold leading-6 text-[var(--footer-heading)] transition-all duration-200 hover:bg-[var(--footer-divider)]/60 hover:border-[var(--footer-heading)]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--footer-heading)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--footer-bg)]"
              >
                Get Started Free →
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-10">
            <FooterSection title="Product" links={productLinks} open={productOpen} onToggle={() => setProductOpen(!productOpen)} />
            <FooterSection title="Use Cases" links={useCaseLinks} open={useCasesOpen} onToggle={() => setUseCasesOpen(!useCasesOpen)} />
            <FooterSection title="Compare" links={compareLinks} open={compareOpen} onToggle={() => setCompareOpen(!compareOpen)} />
            <FooterSection title="Resources" links={resourcesLinks} open={resourcesOpen} onToggle={() => setResourcesOpen(!resourcesOpen)} />
            <FooterSection title="Company" links={companyLinks} open={companyOpen} onToggle={() => setCompanyOpen(!companyOpen)} />
            <FooterSection title="Legal" links={legalLinks} open={legalOpen} onToggle={() => setLegalOpen(!legalOpen)} />
          </div>
        </div>
        {/* Enterprise trust badges — visual only, with tooltip disclaimer */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 border-t border-[var(--footer-divider)] pt-8">
          <span
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-[var(--footer-divider)] bg-[var(--footer-divider)]/30 text-[var(--footer-link)]"
            aria-label="Trusted & secure"
          >
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </span>
          {trustBadges.map((badge) => (
            <Tooltip key={badge.label} content={badge.tooltip} side="top" className="inline-flex">
              <button
                type="button"
                className="inline-flex cursor-default items-center gap-2 rounded-full border border-[var(--footer-divider)] bg-[var(--footer-bg)] px-4 py-2 text-sm font-medium leading-6 text-[var(--footer-text)] shadow-sm transition-all duration-200 hover:border-[var(--footer-heading)]/30 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--footer-heading)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--footer-bg)]"
                aria-label={badge.label}
              >
                <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" aria-hidden />
                {badge.label}
              </button>
            </Tooltip>
          ))}
        </div>
        <div
          className="-mx-4 mt-8 flex min-h-[44px] flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t py-6 text-center text-base leading-6 text-[var(--footer-text)] sm:-mx-6 lg:-mx-8"
          style={{ borderColor: "var(--footer-divider)", backgroundColor: "var(--footer-bottom-bg)" }}
        >
          <span>© {new Date().getFullYear()} LeadFormHub. All rights reserved.</span>
        </div>
      </Container>
    </footer>
  );
}
