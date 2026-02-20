import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, CTA, Footer } from "@/components/landing";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "How to Follow Up on Leads Quickly: Why Speed Matters",
  description:
    "Why fast follow-up on leads wins more deals. Practical tips to respond within minutes, use notifications, and never let a hot lead go cold. For small teams and solopreneurs.",
  path: "/blog/how-to-follow-up-on-leads-quickly",
});

export default function HowToFollowUpOnLeadsQuicklyPage() {
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
                How to Follow Up on Leads <span className="hero-highlight">Quickly</span>
              </h1>
              <p className="hero-content mt-6 text-lg leading-relaxed text-[var(--foreground-muted)]">
                A lead that gets a response within minutes is far more likely to convert than one that waits hours or days. Here’s why speed matters and how to follow up on leads quickly—without burning out—using simple systems and the right tools.
              </p>
            </div>
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <div className="prose prose-neutral max-w-none">
              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Why fast follow-up wins
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                When someone fills your form or requests a demo, they’re in a moment of intent. They’re thinking about your offer right then. If you reply within minutes, you’re still part of that conversation. If you reply tomorrow, they may have already moved on, compared options, or forgotten why they reached out. Studies and sales teams consistently show that leads contacted within five minutes convert at a much higher rate than those contacted after an hour or a day.
              </p>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Fast follow-up also signals that you’re responsive and professional. It sets the tone for the rest of the relationship. So even if you’re a small team or a solopreneur, building a habit of following up on leads quickly is one of the highest-leverage things you can do.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Get notified the moment a lead comes in
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                You can’t follow up quickly if you don’t know a lead has arrived. Use a form builder or lead capture tool that sends you an instant email (or in-app notification) when someone submits. That way you’re not depending on remembering to check a dashboard—you get a ping and can act. Many tools support this; for example, a <Link href="/blog/contact-form-with-instant-email-notification" className="font-medium text-[var(--color-accent)] hover:underline">contact form with instant email notification</Link> is built for exactly this. LeadFormHub sends an email on every new submission so you see leads as they land—see our <Link href="/features" className="font-medium text-[var(--color-accent)] hover:underline">features</Link> for details.
              </p>
              <p className="mt-2 text-[var(--foreground-muted)]">
                If you’re on the go, make sure notifications are enabled on your phone for that email or app. A quick “Thanks, I’ll call you in 5” reply can lock in the lead while you get to a quiet place for a proper call.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Have a simple first response ready
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                You don’t need a long message in the first touch. The goal is to acknowledge quickly and set a clear next step. A short email or SMS works: “Hi [Name], got your request—calling you in the next 10 minutes” or “Thanks for reaching out. I’ll send over the details by 5 pm today.” You can use a short template and personalize the name and one line so it doesn’t feel robotic. The key is speed; you can go deeper in the call or second email.
              </p>
              <p className="mt-2 text-[var(--foreground-muted)]">
                If your form builder supports it, an automatic reply to the submitter (“We got your message and will get back within 24 hours”) is good for expectations—but it doesn’t replace a real, fast follow-up from you. Combine both: auto-reply for reassurance, then a personal response as soon as you can.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Prioritise by intent
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Not every lead is equal. Demo requests and “contact me” from a pricing page are usually hotter than a generic newsletter signup. If you get a mix, triage: reply to high-intent leads first, ideally within minutes. Batch lower-priority follow-ups (e.g. nurture emails) for later in the day. That way you’re not sacrificing speed on the leads that are most likely to close.
              </p>
              <p className="mt-2 text-[var(--foreground-muted)]">
                If your form captures “type of enquiry” or “interest,” use that to decide who gets a call first. A lead who selected “Ready to buy” or “Demo” should jump the queue.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Keep leads in one place
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                When forms from your website, landing page, and ads all feed into one dashboard, you don’t waste time checking three different tools. You get one notification, open one list, and act. A single lead capture dashboard also makes it easier to see if someone has submitted before or to hand off to a teammate. So when you’re setting up <Link href="/blog/how-to-generate-leads-for-free" className="font-medium text-[var(--color-accent)] hover:underline">how to generate leads for free</Link> or running <Link href="/blog/lead-capture-form-for-facebook-ads-landing-page" className="font-medium text-[var(--color-accent)] hover:underline">Facebook ad landing page forms</Link>, send everything to the same place and follow up from there.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Quick recap
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Follow up on leads quickly by turning on instant notifications, sending a short first response right away, and prioritising high-intent leads. Keep all leads in one dashboard so you can act without switching tools. Speed isn’t about working 24/7—it’s about responding when the lead is still hot. With the right setup, you can do that even as a small team.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Frequently asked questions
              </h2>
              <h3 className="font-heading mt-6 text-lg font-semibold text-[var(--foreground)]">
                How fast should I follow up on a lead?
              </h3>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Ideally within five to 15 minutes for high-intent leads (demo, contact, quote). Even a short “Got it, calling you shortly” helps. For lower-intent (e.g. newsletter), same day is usually fine. The sooner you respond, the better your conversion tends to be.
              </p>
              <h3 className="font-heading mt-6 text-lg font-semibold text-[var(--foreground)]">
                What if I can’t respond 24/7?
              </h3>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Use an instant email notification so you see leads as they come in. When you’re available, reply immediately. When you’re not, set an auto-reply so they know when to expect a response. Prioritise the hottest leads when you’re back so you don’t leave them waiting days.
              </p>
              <h3 className="font-heading mt-6 text-lg font-semibold text-[var(--foreground)]">
                Does instant follow-up really increase conversions?
              </h3>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Yes. Fast contact keeps you top of mind and shows you’re serious. Leads who are contacted within minutes are much more likely to answer and move forward than those who wait hours or days. It’s one of the simplest levers to improve lead conversion.
              </p>
            </div>
          </Container>
        </section>
        <CTA />
        <Footer />
      </main>
    </div>
  );
}
