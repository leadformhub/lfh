import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, CTA, Footer } from "@/components/landing";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Free Enquiry Form Builder Without Coding: Collect Leads in Minutes",
  description:
    "Build enquiry forms for your business without writing code. What to look for in a free enquiry form builder, what you can do with it, and how to get started today.",
  path: "/blog/free-enquiry-form-builder-without-coding",
});

export default function FreeEnquiryFormBuilderWithoutCodingPage() {
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
                Free Enquiry Form Builder <span className="hero-highlight">Without Coding</span>: Get Started in Minutes
              </h1>
              <p className="hero-content mt-6 text-lg leading-relaxed text-[var(--foreground-muted)]">
                You don’t need a developer or a single line of code to collect enquiries. A free enquiry form builder without coding lets you add fields, change labels, and get a shareable link or embed—all from a simple interface. Here’s what to expect and how to pick one.
              </p>
            </div>
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <div className="prose prose-neutral max-w-none">
              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Why “without coding” matters
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Most small businesses and solopreneurs don’t have a developer on hand. You might have a website built with a template or a landing page from a hosting provider. Adding a custom form with code is out of the question—and honestly unnecessary. A free enquiry form builder without coding gives you a visual or form-based editor: you click to add a field, type the label, choose whether it’s required, and you’re done. Need a phone number? Add a phone field. Need a dropdown for “Type of enquiry”? Add a dropdown and list the options. No HTML, no APIs, no scripts. You get a link to share or a snippet to paste into your site, and submissions start landing in your dashboard or inbox.
              </p>
              <p className="mt-2 text-[var(--foreground-muted)]">
                That doesn’t mean the form is basic. Modern form builders support text fields, dropdowns, checkboxes, date pickers, file uploads (on paid plans often), and conditional logic in some cases. For an enquiry form you usually need name, email or phone, and a message or “enquiry type”—all of which are standard. The point is you don’t have to build any of that yourself.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                What you can do with a free enquiry form builder
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                First, design the form. Add and remove fields, reorder them, set which ones are required. Give it a title and maybe a short line of text above the form (“Drop your details and we’ll get back in 24 hours”). Second, get it in front of people. You’ll get a direct link—something like yourform.com/form/abc123—that you can put in your email signature, on social media, or in ads. Many builders also give you an embed code so you can paste it into your website and the form appears on your own page. Third, collect and use the data. Submissions show up in a dashboard where you can see each enquiry with timestamp and fields. Often you can turn on email notification so every new submission lands in your inbox. Some tools let you export to CSV or connect to a spreadsheet. That’s the full loop—no code involved.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                What “free” usually means
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Free tiers vary. Some form builders let you create one or two forms and collect a limited number of responses per month (e.g. 50 or 100). Others allow more forms but cap submissions. A few are free forever with a “Powered by” or small branding on the form. When you’re choosing a free enquiry form builder without coding, check: How many forms can I create? How many submissions per month? Is there a time limit (e.g. free for 14 days) or is it free ongoing? For a typical small business enquiry form, 50–100 submissions per month is often enough to start. If you run a big campaign and blow past that, you can upgrade or switch. The idea is to start without paying and see if it fits.
              </p>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Also look at what’s included. Email notifications, embed code, and mobile-friendly forms should be standard even on free. Optional extras like OTP verification, custom branding, or removal of “Powered by” might be on paid plans. That’s fine—you can still run a solid enquiry form on the free tier.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Ease of use and mobile
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                If it takes an hour to build your first form, you’ll put it off. The best free enquiry form builders get you from signup to live form in under 10 minutes. You pick a template or start blank, add a few fields, save, and grab the link. No tutorials required. And because a lot of traffic comes from phones, the form itself must work on mobile. Buttons and fields should be easy to tap, text should be readable without zooming. Test the form on your phone before you share it—if it’s clunky, your completion rate will drop.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Where to put your enquiry form
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Use the form link on your website (contact page or a dedicated “Enquire” page), in your email signature, and on social profiles. If you run ads, send traffic to a landing page that has the form above the fold. The fewer clicks between “I’m interested” and the form, the better. Tell people what happens next—“We’ll reply within 24 hours” or “A team member will call you”—so they know it’s worth filling.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                How LeadFormHub fits
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                LeadFormHub is a form builder built for lead capture. You can create an enquiry form without coding: add name, phone, email, message, and custom fields from a simple editor. No code required. You get a shareable link and embed code, instant email notification when someone submits, and a dashboard to view all leads. The free tier gives you a real starting point; optional OTP verification helps cut down wrong or fake numbers. For more, see our <Link href="/features" className="font-medium text-[var(--color-accent)] hover:underline">features</Link> and <Link href="/pricing" className="font-medium text-[var(--color-accent)] hover:underline">pricing</Link>, and our <Link href="/blog/google-forms-alternative" className="font-medium text-[var(--color-accent)] hover:underline">Google Forms alternative</Link> if you’re comparing options.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Quick recap
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                A free enquiry form builder without coding lets you build, share, and collect enquiries using a visual editor—no developer needed. Check the free tier limits (forms and submissions), make sure you get a link and embed, and test the form on mobile. Put the form where your audience is and say what happens after they submit. With the right tool, you can go from zero to collecting leads in minutes.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Frequently asked questions
              </h2>
              <h3 className="font-heading mt-6 text-lg font-semibold text-[var(--foreground)]">
                Is it really free with no coding?
              </h3>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Yes. Many form builders offer a free plan where you create forms by adding fields in a UI—no HTML or code. You get a link and sometimes an embed code. Limits (e.g. number of forms or submissions per month) apply, but you can run a full enquiry form without paying or coding.
              </p>
              <h3 className="font-heading mt-6 text-lg font-semibold text-[var(--foreground)]">
                Can I put the form on my own website?
              </h3>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Usually. Most form builders provide an embed code (iframe or script) that you paste into your website. The form then appears on your page and submissions go to the form builder’s dashboard and your notification email. You don’t need to host the form yourself.
              </p>
              <h3 className="font-heading mt-6 text-lg font-semibold text-[var(--foreground)]">
                What fields should I add to an enquiry form?
              </h3>
              <p className="mt-2 text-[var(--foreground-muted)]">
                At minimum: name and a way to contact them (email or phone, or both). A short message or “Enquiry type” dropdown helps you prioritise. Keep it to 4–6 fields so people don’t drop off. You can ask for more detail when you follow up.
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
