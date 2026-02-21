import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, ComparisonFAQ, CTA, Footer } from "@/components/landing";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Free Online Form Builder With Unlimited Submissions | LeadFormHub",
  description:
    "Create forms with unlimited submissions—no caps, no paywalls. Free online form builder for lead capture, events, and landing pages. Start free, scale without limits.",
  path: "/free-online-form-builder-unlimited",
});

const whyBullets = [
  {
    title: "No response caps",
    desc: "Collect every lead. When traffic spikes or a campaign converts, you don't hit a limit or lose submissions.",
  },
  {
    title: "One dashboard for all forms",
    desc: "Contact, demo request, event signup—all submissions in one place. No juggling tools or quotas.",
  },
  {
    title: "Scale without surprise paywalls",
    desc: "Start free. Grow traffic and submissions without upgrading the day you hit 50 or 100 responses.",
  },
];

const useCases = [
  {
    title: "Lead capture",
    description: "Landing pages, contact forms, demo requests. Capture name, email, phone—no cap on how many people submit.",
  },
  {
    title: "Events & webinars",
    description: "Registration and signup forms that accept every submission. No closing the form early when signups surge.",
  },
  {
    title: "Multiple forms, one tool",
    description: "Run contact, enquiry, and newsletter forms without each one eating into a shared response quota.",
  },
];

const benefitsBullets = [
  {
    title: "Mobile-friendly forms",
    desc: "Most people fill forms on their phone. Ours work on every device—no tiny buttons or broken layouts.",
  },
  {
    title: "Instant email notification",
    desc: "Get notified the moment someone submits so you can follow up quickly. No checking the dashboard by chance.",
  },
  {
    title: "Optional OTP verification",
    desc: "Cut fake and wrong numbers. Enable OTP per form so you only get real, reachable contacts when it matters.",
  },
];

const faqItems = [
  {
    question: "Is it really unlimited?",
    answer:
      "Yes. On the free tier, there is no cap on the number of submissions. You can collect as many leads as your campaigns bring in. Some advanced features (such as OTP verification) may have usage limits on the free plan; submissions themselves are unlimited.",
  },
  {
    question: "Are there any hidden submission caps?",
    answer:
      "No. There are no hidden caps on form submissions. The free tier is designed so you don't hit a limit and lose leads mid-campaign. If limits apply to other features (e.g. OTP), they're clearly stated in the plan.",
  },
  {
    question: "Can I create multiple forms?",
    answer:
      "Yes. You can create multiple forms—contact, enquiry, event registration, demo request, and more. Each form gets its own link and embed code, and all submissions appear in one dashboard.",
  },
  {
    question: "Is this suitable for small businesses?",
    answer:
      "Yes. The free tier is built for small businesses, solopreneurs, and teams who need lead capture without upfront cost or surprise paywalls. Start free, scale when you're ready. No credit card required to begin.",
  },
  {
    question: "Do I need coding skills?",
    answer:
      "No. You add fields using a visual editor, get a shareable link and embed code, and publish. No HTML, JavaScript, or technical setup. If you can fill in a form, you can build one.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "LeadFormHub",
  applicationCategory: "BusinessApplication",
  description: "Free online form builder with unlimited submissions. Lead capture, events, contact forms. No caps, no paywalls.",
  url: `${SITE_URL}/free-online-form-builder-unlimited`,
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
};

export default function FreeOnlineFormBuilderUnlimitedPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <Navbar />
      <main>
        {/* Hero */}
        <section
          className="hero-section relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28"
          aria-labelledby="landing-hero-heading"
        >
          <div className="hero-bg absolute inset-0" />
          <div className="hero-orb hero-orb-1" aria-hidden />
          <div className="hero-orb hero-orb-2" aria-hidden />
          <div className="hero-orb hero-orb-3" aria-hidden />

          <Container size="default" className="relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="hero-content mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                Free form builder
              </p>
              <h1
                id="landing-hero-heading"
                className="font-heading text-4xl font-extrabold leading-[1.15] tracking-tight text-[var(--foreground-heading)] sm:text-5xl lg:text-6xl"
              >
                Free online form builder with{" "}
                <span className="hero-highlight">unlimited submissions</span>
              </h1>
              <p className="hero-content mt-6 text-lg leading-relaxed text-[var(--foreground-muted)]">
                No caps. No surprise paywalls. Create forms for lead capture, events, and landing pages—and collect every submission in one place. Start free, scale when you're ready.
              </p>
              <p className="hero-content mt-4 text-base text-[var(--foreground-muted)]">
                <Link href="/blog/how-to-generate-leads-for-free" className="font-medium text-[var(--color-accent)] hover:underline">
                  Learn how to generate leads for free
                </Link>
                {" · "}
                <Link href="/blog/free-online-form-builders" className="font-medium text-[var(--color-accent)] hover:underline">
                  Compare free form builders
                </Link>
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="hero-content inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 text-base font-medium text-white shadow-[var(--shadow-cta)] transition-all hover:scale-[1.02] hover:bg-[var(--color-accent-hover)]"
                >
                  Start Free
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/features"
                  className="hero-content inline-flex h-12 items-center justify-center rounded-xl border-2 border-[var(--border-strong)] bg-white px-6 text-base font-medium text-[var(--foreground-heading)] transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent)]"
                >
                  See features
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Why unlimited */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              Why unlimited submissions matter
            </h2>
            <div className="mt-8 space-y-6 text-[var(--foreground-muted)]">
              <p>
                Many form builders advertise a free tier, but cap the number of submissions you can collect each month. Limits of 50, 100, or 500 responses are common. That sounds fine until you run a campaign that actually works—and then you hit the cap.
              </p>
              <p>
                When your form hits its limit, one of three things usually happens. The form stops accepting submissions entirely, so visitors see an error or a blank page. Or the tool sends you an urgent message to upgrade before you can keep collecting. Or submissions start getting dropped or delayed. In each case, your campaign stops working right when it matters most.
              </p>
              <p>
                This hurts businesses in real ways. A coaching centre opens batch registration and gets a flood of signups—only to discover the form cut off after 50 responses. A small agency runs a Facebook ad for a client; the ad performs well, but the form hits its cap and leads are lost. A freelancer publishes a popular blog post with a lead magnet; readers click through, but the form has already reached its monthly limit. In every scenario, interest is there. The form becomes the bottleneck.
              </p>
              <p>
                Unlimited submissions remove that bottleneck. You can run ads, publish content, and open registrations without wondering when the cap will hit. When traffic spikes—whether from a viral post, a seasonal campaign, or simply growth—your form keeps accepting submissions. No interruption, no surprise upgrade prompts, no lost leads. You focus on building and marketing; the form keeps working.
              </p>
              <p>
                If you&apos;re comparing form builders, check the fine print. Some tools say &quot;free&quot; but limit submissions per form or per month. Others offer unlimited only on paid plans. A truly unlimited free tier means you can scale your lead capture without upgrading the day your campaign succeeds. That&apos;s especially important for small businesses and solopreneurs who need to grow without unpredictable costs.
              </p>
              <p>
                The bottom line: submission caps create risk exactly when things are going well. A form that stops accepting leads mid-campaign or forces an upgrade at the wrong moment undermines your marketing effort. Unlimited submissions give you the freedom to run campaigns, grow traffic, and collect every lead—without the form getting in the way.
              </p>
            </div>
            <ul className="mt-10 space-y-6">
              {whyBullets.map((b) => (
                <li key={b.title} className="flex gap-4">
                  <span className="mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/10">
                    <svg className="size-3.5 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-heading font-semibold text-[var(--foreground-heading)]">{b.title}</h3>
                    <p className="mt-1 text-[var(--foreground-muted)]">{b.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* Use cases */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl text-center">
              Use cases
            </h2>
            <p className="mt-4 text-center text-[var(--foreground-muted)] max-w-2xl mx-auto">
              A free form builder with unlimited submissions fits many real-world scenarios. Whether you&apos;re capturing leads from a landing page, running event registration, or collecting enquiries across multiple forms, you don&apos;t want a submission cap to interrupt your workflow.
            </p>
            <ul className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-3">
              {useCases.map((uc) => (
                <li
                  key={uc.title}
                  className="rounded-2xl border border-[var(--border-default)] bg-white p-6 transition-shadow hover:shadow-[var(--shadow-md)]"
                >
                  <h3 className="font-heading font-semibold text-[var(--foreground-heading)]">{uc.title}</h3>
                  <p className="mt-2 text-base text-[var(--foreground-muted)]">{uc.description}</p>
                </li>
              ))}
            </ul>
            <div className="mt-12 space-y-6 text-[var(--foreground-muted)]">
              <p>
                For lead capture, forms are often the last step before a prospect becomes a lead. A contact form, demo request form, or enquiry form on your website or landing page collects name, email, phone, and sometimes a short message. When you run ads or drive organic traffic, every click that converts is a lead—and you want to capture all of them. A cap of 50 or 100 submissions per month means you might stop accepting leads right when your campaign peaks.
              </p>
              <p>
                Events and webinars are another common use case. Registration forms need to stay open until the event starts, and signups can spike in the final days. A limited free tier forces you to either close the form early, upgrade under pressure, or risk losing registrations. With unlimited submissions, you can leave the form open and accept every signup without worrying about the count.
              </p>
              <p>
                Many teams run multiple forms: a contact form on the website, an enquiry form for a specific service, a newsletter signup, and perhaps a demo or trial request. If each form shares a single response quota, one popular form can use up the limit and block others. Unlimited submissions let each form operate independently—you don&apos;t have to ration responses across forms.
              </p>
            </div>
          </Container>
        </section>

        {/* Who it's for */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              Who it&apos;s for
            </h2>
            <div className="mt-8 space-y-6 text-[var(--foreground-muted)]">
              <p>
                A free online form builder with unlimited submissions is built for teams and individuals who need to capture leads without worrying about caps or surprise costs. If you&apos;re a solopreneur, freelancer, coach, consultant, or small business owner, you likely don&apos;t have a developer on staff to build custom forms. You need something you can set up yourself, share quickly, and rely on when traffic grows.
              </p>
              <p>
                Coaching institutes and training centres use forms for batch registration, trial class signups, and general enquiries. When a new batch opens, signups can surge. A form with a 50-response cap would cut off mid-campaign. Schools and educational institutions need admission forms, feedback forms, and parent contact forms—often with seasonal spikes. Agencies running campaigns for clients need forms that scale with ad spend; if the client&apos;s budget drives 500 clicks to a landing page, the form should accept 500 submissions.
              </p>
              <p>
                Real estate agents, freelancers, and service providers use contact and enquiry forms to capture interest. A single viral post or referral can bring a wave of enquiries. With unlimited submissions, you don&apos;t have to worry about the form going offline when it matters most. Startups and small businesses testing content marketing or paid ads need forms that won&apos;t block growth—unlimited means you can experiment with campaigns without the form becoming the constraint.
              </p>
            </div>
          </Container>
        </section>

        {/* Form types you can create */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              Form types you can create
            </h2>
            <div className="mt-8 space-y-6 text-[var(--foreground-muted)]">
              <p>
                A good free form builder supports the types of forms you actually need. Contact forms are the most common: name, email, phone, and message. Demo request and trial signup forms add a few qualifier fields—company, role, or interest—so you can prioritise follow-up. Enquiry forms for services or products collect what the visitor is looking for and how to reach them.
              </p>
              <p>
                Event and webinar registration forms typically ask for name, email, and sometimes phone or company. Workshop organisers, trainers, and course creators use these to build attendee lists. Newsletter and waitlist forms are simpler—often just email, or email and name—and are used for gated content, product launches, or building an audience. Feedback and survey forms help you collect opinions from customers or event attendees; they can be short (a few questions) or longer, depending on your goals.
              </p>
              <p>
                Client intake forms are used by coaches, consultants, and freelancers to collect information from new clients before the first call or project. They might include fields for goals, background, timeline, and budget. All of these form types benefit from unlimited submissions—you never want to turn people away because you hit a cap. With a visual editor, you add the fields you need, get a link and embed code, and publish. No coding required.
              </p>
            </div>
          </Container>
        </section>

        {/* What you get */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              What you get
            </h2>
            <p className="mt-4 text-[var(--foreground-muted)]">
              Beyond unlimited submissions, a useful form builder needs features that make lead capture practical. Here&apos;s what matters.
            </p>
            <ul className="mt-8 space-y-6">
              {benefitsBullets.map((b) => (
                <li key={b.title} className="flex gap-4">
                  <span className="mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/10">
                    <svg className="size-3.5 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-heading font-semibold text-[var(--foreground-heading)]">{b.title}</h3>
                    <p className="mt-1 text-[var(--foreground-muted)]">{b.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-10 space-y-4 text-[var(--foreground-muted)]">
              <p>
                Mobile-friendly forms are essential because most people fill forms on their phones. Buttons and fields need to be easy to tap, text must be readable, and the layout should adapt to small screens. A form that works poorly on mobile loses submissions—people abandon forms that feel clunky or require zooming.
              </p>
              <p>
                Instant email notification means you get an alert the moment someone submits. You don&apos;t have to remember to check the dashboard; you can follow up quickly. Speed matters for lead conversion—responding within minutes often outperforms responding within hours. Optional OTP verification helps reduce fake or typo phone numbers. When you enable it per form, submitters verify their number before the submission is accepted. That&apos;s useful for high-value actions like demo requests where you plan to call back.
              </p>
            </div>
            <p className="mt-8">
              <Link href="/features" className="font-medium text-[var(--color-accent)] hover:underline">
                View all form builder features →
              </Link>
            </p>
          </Container>
        </section>

        {/* What makes a good free form builder */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              What makes a good free form builder
            </h2>
            <div className="mt-8 space-y-6 text-[var(--foreground-muted)]">
              <p>
                When you&apos;re choosing a free form builder, a few criteria matter. First, submission limits. Some tools cap you at 50 or 100 responses per month; others offer truly unlimited. Check whether the limit is per form or across all forms, and what happens when you hit it—does the form stop, or do you get an upgrade prompt?
              </p>
              <p>
                Second, ease of use. You should be able to create a form in under 10 minutes without reading a manual. Add fields, set labels, get a link and embed code—that&apos;s the core workflow. If it takes an hour to build a simple contact form, you&apos;ll put it off. Third, notifications. You need to know when someone submits. Email notification should be included on the free tier. Fourth, a single dashboard. If you run multiple forms, having all submissions in one place simplifies follow-up. You don&apos;t want to log into three different tools to see your leads.
              </p>
              <p>
                Fifth, mobile-friendly output. The forms you create should render well on phones. Test on a real device before you share the link. Sixth, shareable link and embed code. You need both: a direct link for social media, email, and ads, and an embed snippet for your website. Some builders charge for custom domains or remove &quot;Powered by&quot; branding on paid plans—that&apos;s fine for later; the free tier should at least give you a working link and embed.
              </p>
            </div>
          </Container>
        </section>

        {/* How to get started */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              How to get started
            </h2>
            <div className="mt-8 space-y-6 text-[var(--foreground-muted)]">
              <p>
                Getting started with a free form builder takes a few minutes. Sign up (no credit card required), create a new form, and add the fields you need. Most builders use a visual editor: you click to add a text field, email field, phone field, or dropdown, then type the label. Set which fields are required. Give the form a title and optionally a short description above the fields.
              </p>
              <p>
                Once the form is ready, get the shareable link. You can paste it in an email, share it on social media, or use it in an ad. If you have a website, grab the embed code and paste it into your page—the form will appear inline. Turn on email notification so you get an alert when someone submits. Test the form by filling it out yourself; confirm the submission lands in the dashboard and that you receive the notification.
              </p>
              <p>
                From there, you can create more forms for different purposes—contact, enquiry, event registration—and manage them from one dashboard. With unlimited submissions, you don&apos;t need to worry about caps. Focus on driving traffic and following up on leads; the form will keep working.
              </p>
            </div>
          </Container>
        </section>

        {/* Related resources */}
        <section className="border-t border-[var(--border-subtle)] bg-[var(--background-alt)] py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              Related resources
            </h2>
            <p className="mt-4 text-[var(--foreground-muted)]">
              Learn more about lead capture and form building from our blog:
            </p>
            <ul className="mt-6 space-y-3">
              <li>
                <Link href="/blog/what-is-a-lead-capture-form" className="font-medium text-[var(--color-accent)] hover:underline">
                  What is a lead capture form? Definition & best practices
                </Link>
              </li>
              <li>
                <Link href="/blog/how-to-increase-form-submissions" className="font-medium text-[var(--color-accent)] hover:underline">
                  How to increase form submissions
                </Link>
              </li>
              <li>
                <Link href="/blog/contact-form-with-instant-email-notification" className="font-medium text-[var(--color-accent)] hover:underline">
                  Contact form with instant email notification
                </Link>
              </li>
              <li>
                <Link href="/blog/drag-and-drop-form-builder" className="font-medium text-[var(--color-accent)] hover:underline">
                  Drag and drop form builder: create forms without coding
                </Link>
              </li>
            </ul>
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] text-center">
              Frequently asked questions
            </h2>
            <ComparisonFAQ items={faqItems} className="mt-10" />
          </Container>
        </section>

        {/* CTA strip */}
        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="default" className="px-4 text-center sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">Get started</p>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-[var(--foreground-heading)] sm:text-3xl">
              No submission caps. No credit card required.
            </h2>
            <p className="mt-2 text-[var(--foreground-muted)]">Create your account and your first form in minutes.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="rounded-full border border-[var(--border-default)] bg-[var(--neutral-50)] px-4 py-2 text-sm font-medium text-[var(--foreground-heading)]">Unlimited submissions</span>
              <span className="rounded-full border border-[var(--border-default)] bg-[var(--neutral-50)] px-4 py-2 text-sm font-medium text-[var(--foreground-heading)]">Mobile-friendly</span>
              <span className="rounded-full border border-[var(--border-default)] bg-[var(--neutral-50)] px-4 py-2 text-sm font-medium text-[var(--foreground-heading)]">Instant notifications</span>
            </div>
            <Link
              href="/signup"
              className="mt-10 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 text-base font-medium text-white shadow-[var(--shadow-cta)] transition-all hover:scale-[1.02] hover:bg-[var(--color-accent-hover)]"
            >
              Start Free
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </Container>
        </section>

        <CTA />
        <Footer />
      </main>
    </div>
  );
}
