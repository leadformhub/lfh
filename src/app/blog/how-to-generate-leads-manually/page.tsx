import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, CTA, Footer } from "@/components/landing";
import { BlogInternalLinks } from "@/components/blog/BlogInternalLinks";
import { Container } from "@/components/ui/Container";
import { BlogImageBlock } from "@/components/blog/BlogImageBlock";
import { buildPageMetadata } from "@/lib/seo";

/**
 * Blog — SEO: how to generate leads manually. Informational, topical authority.
 */
export const metadata: Metadata = buildPageMetadata({
  title: "How to Generate Leads Manually: Tactics That Still Work Today",
  description:
    "Manual lead generation tactics that still work: networking, referrals, outreach, and events. Step-by-step guide for small teams and solopreneurs. Start filling your pipeline.",
  path: "/blog/how-to-generate-leads-manually",
});

export default function HowToGenerateLeadsManuallyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main>
        <section
          className="hero-section relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28"
          aria-labelledby="article-heading"
        >
          <div className="hero-bg absolute inset-0" />
          <div className="hero-orb hero-orb-1" aria-hidden />
          <div className="hero-orb hero-orb-2" aria-hidden />
          <div className="hero-orb hero-orb-3" aria-hidden />

          <Container size="default" className="relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="hero-content mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                Blog
              </p>
              <h1
                id="article-heading"
                className="font-heading text-4xl font-extrabold leading-[1.15] tracking-tight text-[var(--foreground-heading)] sm:text-5xl lg:text-6xl"
              >
                How to Generate Leads Manually
              </h1>
              <p className="hero-content mt-6 text-lg leading-relaxed text-[var(--foreground-muted)]">
                Automation has its place, but manual lead generation still works—especially when you&apos;re small, personal, and focused. This guide covers practical tactics to generate leads manually: networking, referrals, outreach, and events, so you can fill your pipeline without depending only on ads or algorithms.
              </p>
              <BlogImageBlock variant="hero-manual" layout="featured" caption="Manual lead gen: intentional, personal, effective." />
            </div>
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <div className="prose prose-neutral max-w-none">
              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Why manual lead generation still matters
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Automated funnels and paid campaigns can scale, but they often feel impersonal. When you generate leads manually, you control the message, the timing, and the relationship from the first touch. For B2B, local businesses, and service providers, a personal approach often converts better than cold traffic. Manual doesn&apos;t mean slow or random—it means intentional: you choose who you talk to and how you follow up.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Network in the right places
              </h2>
              <BlogImageBlock variant="network" caption="Show up where your ideal customers are." />
              <p className="mt-2 text-[var(--foreground-muted)]">
                The first step to generate leads manually is to show up where your ideal customers are. That might be industry events, local meetups, LinkedIn groups, or online communities. Don&apos;t go with a hard pitch—go to help, answer questions, and share useful ideas. Over time, people remember you and start referring others or reaching out when they need what you offer.
              </p>
              <ul className="mt-2 list-disc pl-6 text-[var(--foreground-muted)]">
                <li>Pick one or two communities or events and show up consistently.</li>
                <li>Leave a clear way for people to contact you: a link to your <Link href="/" className="font-medium text-[var(--color-accent)] hover:underline">homepage</Link> or a simple contact form.</li>
                <li>When someone asks for more info, send them to a short form or booking link so you capture their details and can follow up.</li>
              </ul>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Ask for referrals the right way
              </h2>
              <BlogImageBlock variant="referrals" caption="Happy customers can introduce you to new leads." />
              <p className="mt-2 text-[var(--foreground-muted)]">
                Your best leads often come from people who already trust you: existing clients, partners, or contacts. To generate leads manually through referrals, make it easy and specific. After a successful project or sale, ask: &quot;Who else do you know who might benefit from this?&quot; Offer a simple way for them to introduce you—for example, a form where they can submit their own details and the referred person&apos;s name, or a short link they can share. Thank every referrer and follow up quickly so the referred lead feels valued.
              </p>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Referrals work best when you don&apos;t ask everyone the same way. Tailor the ask to the relationship: a recent happy customer might be willing to post a recommendation or send an intro; a long-term partner might prefer a quiet email intro. Either way, make the next step obvious—a link to a form or your contact page—so the new lead can reach you without friction.
              </p>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Using a <Link href="https://www.leadformhub.com/free-online-form-builder-unlimited" className="font-medium text-[var(--color-accent)] hover:underline">free online form builder with unlimited submissions</Link> helps you collect leads without worrying about limits.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Do targeted outreach (without spamming)
              </h2>
              <BlogImageBlock variant="outreach" caption="Personalised outreach beats bulk messages." />
              <p className="mt-2 text-[var(--foreground-muted)]">
                Manual outreach means you identify specific people or companies and reach out one by one. Research first: understand their role, company, and likely pain. Keep messages short, relevant, and focused on them—not a generic template. One or two sentences on why you&apos;re reaching out and one clear next step (e.g. &quot;Worth a 10-minute call?&quot;) work better than long emails. Track who you contacted and when, so you can follow up without duplicating or forgetting.
              </p>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Cold email or LinkedIn messages get a bad rap when they&apos;re bulk and generic. When you generate leads manually, quality beats quantity. Sending twenty personalised notes to the right people often outperforms hundreds of copy-paste messages. If someone replies asking for more information, send them to a short form or booking page so you capture their details and keep the conversation moving.
              </p>
              <ul className="mt-2 list-disc pl-6 text-[var(--foreground-muted)]">
                <li>Use a spreadsheet or simple CRM to log outreach and responses.</li>
                <li>If they say &quot;send me more info&quot;, send a link to a form or landing page so you capture their details and stay in control of the next step.</li>
              </ul>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Use events and workshops to capture leads
              </h2>
              <BlogImageBlock variant="events" caption="Events and webinars are perfect for registration forms." />
              <p className="mt-2 text-[var(--foreground-muted)]">
                Webinars, workshops, and live events are strong ways to generate leads manually. You provide value upfront; in return, attendees register with name and email (or phone). Use a simple registration form—the fewer fields, the higher sign-up. After the event, follow up within 24–48 hours while the conversation is still fresh. A <Link href="/free-online-form-builder-unlimited" className="font-medium text-[var(--color-accent)] hover:underline">free online form builder with unlimited submissions</Link> lets you run multiple events or campaigns without worrying about submission caps.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Use cases: form building and lead generation together
              </h2>
              <BlogImageBlock variant="pipeline" caption="Forms capture manual leads in one place." />
              <p className="mt-2 text-[var(--foreground-muted)]">
                Manual lead generation and form building work together. You meet someone at an event—they go to your site and fill a contact or demo form. You do outreach—you send them to a short form to book a call or get a resource. You run a webinar—attendees sign up via a registration form and you follow up from one dashboard. In each case, the manual part is the relationship and the message; the form is where you capture the lead so nothing gets lost. Small businesses, coaches, agencies, and freelancers all benefit from having one place to collect and manage these contacts.
              </p>
              <p className="mt-2 text-[var(--foreground-muted)]">
                If you need a single place to capture manual leads—from referrals, events, or outreach—a <Link href="/free-online-form-builder-unlimited" className="font-medium text-[var(--color-accent)] hover:underline">free online form builder with unlimited submissions</Link> keeps everything in one dashboard without caps or clutter.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Stay consistent and measure what works
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Manual lead generation pays off when you do it regularly. Block time each week for networking, referrals, and outreach. Note which channels bring the best leads—events vs referrals vs LinkedIn—and invest more there. Use a simple pipeline: form submission → quick reply → conversation. The goal isn&apos;t to do everything at once; it&apos;s to build a repeatable habit that fills your pipeline with people you actually want to talk to.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Conclusion
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                You can generate leads manually by networking where your audience is, asking for referrals in a clear way, doing targeted outreach, and using events to capture interest. Pair that with a simple way to collect contact details—like a form on your site or a <Link href="/free-online-form-builder-unlimited" className="font-medium text-[var(--color-accent)] hover:underline">free online form builder with unlimited submissions</Link>—so every manual touch turns into a lead you can follow up on. Start with one tactic, do it well, and scale from there.
              </p>
            </div>
          </Container>
        </section>
        <BlogInternalLinks />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}
