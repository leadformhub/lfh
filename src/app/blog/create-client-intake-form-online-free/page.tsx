import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, CTA, Footer } from "@/components/landing";
import { BlogInternalLinks } from "@/components/blog/BlogInternalLinks";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Create Client Intake Form Online Free: Onboard New Clients Without Paper or PDFs",
  description:
    "How to create a client intake form online for free. What to include, how to keep it simple, and which form builder to use so you can start collecting intake details today.",
  path: "/blog/create-client-intake-form-online-free",
});

export default function CreateClientIntakeFormOnlineFreePage() {
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
                Create a <span className="hero-highlight">Client Intake Form Online Free</span>—No Paper, No PDFs
              </h1>
              <p className="hero-content mt-6 text-lg leading-relaxed text-[var(--foreground-muted)]">
                Coaches, consultants, freelancers, and small agencies need to collect info from new clients before the first call or project. You can create a client intake form online free with a form builder—no coding, no monthly fee to start. Here’s what to put in it and how to get it live.
              </p>
            </div>
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <div className="prose prose-neutral max-w-none">
              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Why move client intake online?
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                A lot of people still send a PDF or Word form and ask the client to fill it and email it back. That works, but it’s clunky. The client has to download, maybe print, fill by hand or in a PDF editor, save, and attach to an email. You get a file that you might have to retype or copy into your CRM. An online client intake form is simpler: you send a link, they open it on their phone or laptop, fill the fields, and submit. You get the data in one place—usually a dashboard or an email—without handling attachments or re-entering data. For the client it’s faster; for you it’s cleaner. And you can create a client intake form online free with many form builders, so there’s no cost to try.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                What to include in a client intake form
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                It depends on your service. A coach might want: name, email, phone, what they want to achieve, how they heard about you, and preferred session time. A designer might want: name, company, project type, budget range, timeline, and a short brief. A consultant might want: name, role, company size, main challenge, and what success looks like. The idea is to collect enough so that when you get on the call or start the project, you’re not asking basics—you’re already prepared. But don’t overdo it. A 50-field form will put people off. Aim for one screen or two at most. You can always send a follow-up form or ask for more in the first call.
              </p>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Common building blocks: full name, email, phone (so you can reach them), and then 3–5 questions specific to your offer. Use dropdowns for things like “Project type” or “Goal”; use short text for “Main challenge” or “Brief.” If you need a longer answer, one paragraph field is enough. Label everything clearly so the client knows what to enter.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                How to create the form for free
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Sign up for a form builder that has a free plan. Create a new form, give it a title (e.g. “New client intake”), and add the fields you need. Most form builders let you add text fields, dropdowns, checkboxes, and maybe a date picker—all from a simple editor, no code. Set which fields are required so you don’t get half-empty submissions. Then get the shareable link. You can send that link to new clients in an email (“Before our call, please fill this short form”) or put it on your website. Some form builders also give you an embed code so the form appears on a page on your site. When someone submits, you get the response in the dashboard and often an email notification. That’s it—you’ve created a client intake form online free.
              </p>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Check the free tier limits: how many forms, how many responses per month. For a solo or small practice, one intake form and 20–50 submissions per month is often enough. If you outgrow that, you can upgrade or switch. The goal is to start without spending and see if the workflow fits.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Making it easy for the client
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Send the form link when you confirm the first call or project. Say why it helps: “So I can prepare and make the most of our time.” Keep the form short and mobile-friendly—many clients will fill it on their phone. If a question is optional, mark it that way so they don’t get stuck. And set expectations: “Takes about 3 minutes” or “Please submit at least 24 hours before our call.” You can also send an auto-reply after they submit: “Thanks, we’ve received your intake form. See you on [date].” That confirms they’re done and you’re ready.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Where the data goes
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                In most form builders, submissions show up in a dashboard. You see each response with the date and all the fields. You can often export to CSV or copy details into your notes or CRM. If you want to be notified the moment someone submits, turn on email notification—then you get an email with the intake details and can prepare for the call without logging in. For client intake, that’s usually enough. You don’t need a fancy CRM integration to start; you just need to see the data and act on it.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                How LeadFormHub fits
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                LeadFormHub is a form builder you can use to create a client intake form online free. Add fields for name, email, phone, and any custom questions (dropdowns, short text, paragraph). No code needed. You get a shareable link and optional embed, instant email notification when someone submits, and a dashboard to view all responses. You can turn on an auto-reply so the client gets a “We received your form” message. There’s a free tier to start; see our <Link href="/features" className="font-medium text-[var(--color-accent)] hover:underline">features</Link> and <Link href="/pricing" className="font-medium text-[var(--color-accent)] hover:underline">pricing</Link> for limits and options.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Quick recap
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                You can create a client intake form online free with a form builder: add the fields you need, get a link, and send it to new clients. Keep the form short and mobile-friendly, and say what it’s for and when to submit. Use email notification so you see each submission right away, and optionally send an auto-reply to confirm. No paper, no PDFs, no code—just one link and all intake data in one place.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Frequently asked questions
              </h2>
              <h3 className="font-heading mt-6 text-lg font-semibold text-[var(--foreground)]">
                What’s the difference between a client intake form and a contact form?
              </h3>
              <p className="mt-2 text-[var(--foreground-muted)]">
                A contact form is generic: name, email, message. A client intake form is for people who are already your client or about to become one. It asks for details you need to deliver your service—goals, project type, timeline, etc. So it’s longer and more specific, but still should be kept to one or two screens.
              </p>
              <h3 className="font-heading mt-6 text-lg font-semibold text-[var(--foreground)]">
                How long should the intake form be?
              </h3>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Long enough to be useful, short enough that people finish. For most coaches and consultants, 5–10 fields (including name and contact) is enough. If you need more, split into two steps or ask for the rest on the first call.
              </p>
              <h3 className="font-heading mt-6 text-lg font-semibold text-[var(--foreground)]">
                Can I use the same form for different services?
              </h3>
              <p className="mt-2 text-[var(--foreground-muted)]">
                You can. Add a dropdown like “What are you interested in?” (e.g. 1:1 coaching, group programme, workshop) and then optional sections or a single “Tell us more” field. Or create separate forms per service so the questions are tailored and you don’t confuse the client.
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
