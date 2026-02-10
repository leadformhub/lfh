"use client";

import { useState } from "react";
import { Navbar, Footer } from "@/components/landing";
import { Container } from "@/components/ui/Container";
import Link from "next/link";

const SUBJECT_CATEGORIES = [
  "General Inquiry",
  "Billing & Payments",
  "Bug Report",
  "Feature Request",
  "Technical Support",
] as const;

const OTHER_VALUE = "Other";

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", subjectOther: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subjectToSend = formData.subject === OTHER_VALUE ? formData.subjectOther.trim() : formData.subject;
    if (!subjectToSend) {
      setError(formData.subject === OTHER_VALUE ? "Please enter your subject." : "Please select a subject.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/support/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, subject: subjectToSend }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data.error as string) || "Something went wrong. Please try again.");
        return;
      }
      setError("");
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", subjectOther: "", message: "" });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main>
        <section className="section-padding border-b border-[var(--border-subtle)] bg-white">
          <Container size="narrow" className="px-4 sm:px-6">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Raise Support Request
            </h1>
            <p className="mt-4 text-lg text-[var(--foreground-muted)]">
              Describe your issue or question. Our team will get back to you as soon as possible.
            </p>
            {submitted ? (
              <div className="mt-10 rounded-xl border border-[var(--color-success)]/30 bg-green-50 p-6 text-center">
                <p className="font-medium text-[var(--foreground)]">Request received</p>
                <p className="mt-1 text-base text-[var(--foreground-muted)]">
                  We&apos;ll respond to your request shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-sm font-medium text-[var(--color-accent)] hover:underline"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                {error && (
                  <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
                    {error}
                  </p>
                )}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[var(--foreground)]">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-[var(--border-default)] px-3 py-2 text-[var(--foreground)]"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)]">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-[var(--border-default)] px-3 py-2 text-[var(--foreground)]"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-[var(--foreground)]">
                    Subject
                  </label>
                  <select
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData((d) => ({ ...d, subject: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-[var(--border-default)] px-3 py-2 text-[var(--foreground)] bg-white"
                  >
                    <option value="">Select a category</option>
                    {SUBJECT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value={OTHER_VALUE}>{OTHER_VALUE}</option>
                  </select>
                  {formData.subject === OTHER_VALUE && (
                    <input
                      type="text"
                      required
                      value={formData.subjectOther}
                      onChange={(e) => setFormData((d) => ({ ...d, subjectOther: e.target.value }))}
                      placeholder="Please describe your subject"
                      className="mt-3 w-full rounded-lg border border-[var(--border-default)] px-3 py-2 text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)]"
                      aria-label="Custom subject"
                    />
                  )}
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[var(--foreground)]">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData((d) => ({ ...d, message: e.target.value }))}
                    placeholder="Describe your issue or question in detail."
                    className="mt-1 w-full rounded-lg border border-[var(--border-default)] px-3 py-2 text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-[var(--color-accent)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-70"
                >
                  {loading ? "Sending…" : "Submit Request"}
                </button>
                <p className="text-base text-[var(--foreground-muted)]">
                  We respect your privacy. Your data is never shared.
                </p>
              </form>
            )}
            <p className="mt-8 text-base text-[var(--foreground-muted)]">
              Back to{" "}
              <Link href="/contact" className="font-medium text-[var(--color-accent)] hover:underline">Contact</Link>.
            </p>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}
