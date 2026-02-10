import Link from "next/link";

export function DashboardFooter() {
  return (
    <footer
      className="mt-auto shrink-0 border-t border-[var(--border-default)] bg-[var(--background-alt)] px-4 py-4 md:px-6 md:py-5"
      role="contentinfo"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
        <p className="text-xs text-[var(--foreground-muted)]">
          © {new Date().getFullYear()} LeadFormHub
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1" aria-label="Footer">
          <Link
            href="/privacy-policy"
            className="text-xs font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            Privacy policy
          </Link>
          <Link
            href="/terms-and-conditions"
            className="text-xs font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            Terms
          </Link>
          <Link
            href="/contact"
            className="text-xs font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            Contact
          </Link>
          <Link
            href="/support"
            className="text-xs font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            Support
          </Link>
        </nav>
      </div>
    </footer>
  );
}
