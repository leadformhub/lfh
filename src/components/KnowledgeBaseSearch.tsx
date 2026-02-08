"use client";

import { useState, useMemo } from "react";
import { ComparisonFAQ } from "@/components/landing";
import { Container } from "@/components/ui/Container";
import type { ComparisonFAQItem } from "@/components/landing/ComparisonFAQ";

export type KnowledgeBaseSection = {
  title: string;
  description: string;
  items: ComparisonFAQItem[];
};

type KnowledgeBaseSearchProps = {
  sections: KnowledgeBaseSection[];
};

function matchQuery(text: string, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  return text.toLowerCase().includes(q);
}

function filterItems(items: ComparisonFAQItem[], query: string): ComparisonFAQItem[] {
  if (!query.trim()) return items;
  return items.filter(
    (item) =>
      matchQuery(item.question, query) || matchQuery(item.answer, query)
  );
}

export function KnowledgeBaseSearch({ sections }: KnowledgeBaseSearchProps) {
  const [query, setQuery] = useState("");

  const filteredSections = useMemo(() => {
    return sections
      .map((section) => ({
        ...section,
        items: filterItems(section.items, query),
      }))
      .filter((section) => section.items.length > 0);
  }, [sections, query]);

  const hasQuery = query.trim().length > 0;
  const hasResults = filteredSections.length > 0;

  return (
    <>
      <section className="section-padding border-t border-[var(--border-subtle)] bg-[var(--background-elevated)]">
        <Container size="narrow" className="px-4 sm:px-6">
          <label htmlFor="kb-search" className="sr-only">
            Search knowledge base
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" aria-hidden>
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              id="kb-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions and answers..."
              className="w-full rounded-xl border border-[var(--border-default)] bg-white py-3 pl-12 pr-4 text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
              aria-describedby={hasQuery && !hasResults ? "kb-no-results" : undefined}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--foreground-muted)] hover:bg-[var(--neutral-100)] hover:text-[var(--foreground)]"
                aria-label="Clear search"
              >
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {hasQuery && (
            <p className="mt-2 text-base text-[var(--foreground-muted)]" id="kb-no-results">
              {hasResults
                ? `${filteredSections.reduce((acc, s) => acc + s.items.length, 0)} result(s)`
                : "No matching questions or answers. Try different keywords."}
            </p>
          )}
        </Container>
      </section>

      {hasResults ? (
        filteredSections.map((section, idx) => (
          <section
            key={section.title}
            className={idx % 2 === 0 ? "section-padding border-t border-[var(--border-subtle)] bg-white" : "section-padding border-t border-[var(--border-subtle)] bg-[var(--background-elevated)]"}
          >
            <Container size="narrow" className="px-4 sm:px-6">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
                {section.title}
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                {section.description}
              </p>
              <ComparisonFAQ items={section.items} className="mt-8" />
            </Container>
          </section>
        ))
      ) : !hasQuery ? (
        sections.map((section, idx) => (
          <section
            key={section.title}
            className={idx % 2 === 0 ? "section-padding border-t border-[var(--border-subtle)] bg-white" : "section-padding border-t border-[var(--border-subtle)] bg-[var(--background-elevated)]"}
          >
            <Container size="narrow" className="px-4 sm:px-6">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
                {section.title}
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                {section.description}
              </p>
              <ComparisonFAQ items={section.items} className="mt-8" />
            </Container>
          </section>
        ))
      ) : (
        <section className="section-padding border-t border-[var(--border-subtle)] bg-[var(--background-elevated)]">
          <Container size="narrow" className="px-4 text-center sm:px-6">
            <p className="text-[var(--foreground-muted)]">
              No articles match &quot;{query.trim()}&quot;. Try searching for &quot;form&quot;, &quot;lead&quot;, &quot;OTP&quot;, &quot;dashboard&quot;, or &quot;export&quot;.
            </p>
          </Container>
        </section>
      )}
    </>
  );
}
