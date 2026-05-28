import Link from "next/link";
import { cn } from "@/lib/utils";

type CtaVariant = "start-free" | "create-form" | "try-free";

const LABELS: Record<CtaVariant, string> = {
  "start-free": "Start Free",
  "create-form": "Create Your First Form",
  "try-free": "Try LeadFormHub Free",
};

type BlogInlineCtaProps = {
  variant?: CtaVariant;
  className?: string;
};

export function BlogInlineCta({ variant = "start-free", className }: BlogInlineCtaProps) {
  return (
    <div className={cn("mt-8 flex flex-wrap items-center gap-4", className)}>
      <Link
        href="/signup"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 text-sm font-medium text-white shadow-[var(--shadow-cta)] transition-all hover:scale-[1.02] hover:bg-[var(--color-accent-hover)]"
      >
        {LABELS[variant]}
        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </Link>
      <Link href="/templates" className="text-sm font-medium text-[var(--color-accent)] hover:underline">
        Browse form templates
      </Link>
    </div>
  );
}
