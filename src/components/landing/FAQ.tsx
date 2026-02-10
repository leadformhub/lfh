"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const items = [
  {
    question: "What is LeadFormHub?",
    answer:
      "LeadFormHub is a lead capture platform that lets you create branded forms, collect submissions in one dashboard, and optionally verify mobile numbers with OTP. You get a dedicated hub at leadformhub.com/yourname.",
  },
  {
    question: "Do I need a credit card to start?",
    answer:
      "No. The free plan does not require a credit card. You can create forms, collect up to 50 leads per month, and use your subdomain. When you upgrade, payment is in INR via UPI, card, or net banking (Razorpay).",
  },
  {
    question: "How does OTP verification work?",
    answer:
      "When a visitor submits a form with a phone number, you can require a one-time code sent to that number. They enter it to confirm. Only verified submissions are stored as leads in your dashboard.",
  },
  {
    question: "Can I embed forms on my site?",
    answer:
      "Yes. You can share a direct link to your form or embed it on your website with a snippet. Forms are responsive and work on all devices.",
  },
  {
    question: "What integrations are available?",
    answer:
      "You can export leads to CSV. Email alerts and CRM integrations are available. Payments are powered by Razorpay. Additional integrations, including Zapier, are on the roadmap.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-[var(--background)] py-24 sm:py-32">
      <Container size="narrow">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-[var(--foreground-muted)]">
            Clear answers to common questions about LeadFormHub.
          </p>
        </div>
        <ul className="mt-16 space-y-4">
          {items.map((item, i) => (
            <li
              key={item.question}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-elevated)]"
            >
              <button
                type="button"
                className="flex w-full min-h-[44px] items-center justify-between gap-4 px-6 py-5 text-left font-heading font-medium text-[var(--foreground-heading)] transition-colors hover:bg-[var(--neutral-50)]"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
                aria-controls={`faq-answer-${i}`}
                id={`faq-question-${i}`}
              >
                {item.question}
                <span
                  className={cn(
                    "flex-shrink-0 transition-transform duration-200",
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>
              <div
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-question-${i}`}
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
      </Container>
    </section>
  );
}
