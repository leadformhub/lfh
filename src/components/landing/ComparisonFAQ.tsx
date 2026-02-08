"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export type ComparisonFAQItem = { question: string; answer: string };

type ComparisonFAQProps = {
  items: ComparisonFAQItem[];
  className?: string;
};

/**
 * Simple FAQ accordion for comparison and sales pages. No schema here — schema is output by the page.
 */
export function ComparisonFAQ({ items, className }: ComparisonFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <ul className={cn("space-y-4", className)}>
      {items.map((item, i) => (
        <li
          key={item.question}
          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)]"
        >
          <button
            type="button"
            className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-heading font-medium text-[var(--foreground)] hover:bg-[var(--neutral-50)]"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            aria-expanded={openIndex === i}
            aria-controls={`comparison-faq-${i}`}
            id={`comparison-faq-q-${i}`}
          >
            {item.question}
            <span
              className={cn(
                "shrink-0 transition-transform duration-200",
                openIndex === i && "rotate-180"
              )}
              aria-hidden
            >
              <svg
                className="size-5 text-[var(--foreground-muted)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
          <div
            id={`comparison-faq-${i}`}
            role="region"
            aria-labelledby={`comparison-faq-q-${i}`}
            className={cn(
              "overflow-hidden transition-all duration-200 ease-out",
              openIndex === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <p className="border-t border-[var(--border-subtle)] px-6 py-5 text-[var(--foreground-muted)]">
              {item.answer}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
