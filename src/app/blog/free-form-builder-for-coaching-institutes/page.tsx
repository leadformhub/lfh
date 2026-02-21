import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, CTA, Footer } from "@/components/landing";
import { BlogImageBlock } from "@/components/blog/BlogImageBlock";
import { BlogInternalLinks } from "@/components/blog/BlogInternalLinks";
import { Container } from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/seo";

/**
 * Blog — SEO: free form builder for coaching institutes.
 */
export const metadata: Metadata = buildPageMetadata({
  title: "Free Form Builder for Coaching Institutes: Collect Leads Without the Fuss",
  description:
    "Why coaching centres need a free form builder that's simple and reliable. How to choose one, what to use it for (enquiries, trial signups, batch registration), and what to avoid.",
  path: "/blog/free-form-builder-for-coaching-institutes",
});

export default function FreeFormBuilderForCoachingInstitutesPage() {
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
                Free Form Builder for Coaching Institutes: Collect Leads Without the Fuss
              </h1>
              <p className="hero-content mt-6 text-lg leading-relaxed text-[var(--foreground-muted)]">
                Why coaching centres need a free form builder that&apos;s simple and reliable. How to choose one, what to use it for—enquiries, trial signups, batch registration—and what to avoid.
              </p>
              <BlogImageBlock variant="lead-capture" layout="featured" caption="A simple form builder keeps enquiries in one place." />
            </div>
          </Container>
        </section>

        <section className="border-t border-[var(--border-subtle)] bg-white py-16 sm:py-20">
          <Container size="narrow" className="px-4 sm:px-6">
            <div className="prose prose-neutral max-w-none">
              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Why coaching institutes need a form builder
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Parents and students reach out via WhatsApp, phone, or walk-in. Without a central place to capture details, enquiries slip through the cracks. A free form builder for coaching institutes gives you one link to share—on your website, in ads, on social, or in your bio—so every enquiry lands in one dashboard. You stop chasing DMs and missed calls, and you never lose a lead because it landed in the wrong inbox.
              </p>
              <p className="mt-2 text-[var(--foreground-muted)]">
                The key word is simple. Coaching centres don&apos;t need complex CRM software or paid tools with steep learning curves. They need a form that collects name, phone, email, and maybe one or two fields like &quot;Course of interest&quot; or &quot;Grade&quot;—enough to qualify and follow up. A <Link href="/blog/what-is-a-lead-capture-form" className="font-medium text-[var(--color-accent)] hover:underline">lead capture form</Link> built for this keeps things light and fast.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                What to use a free form builder for
              </h2>
              <BlogImageBlock variant="use-cases" caption="Forms for enquiries, trials, and batch registration." />
              <p className="mt-2 text-[var(--foreground-muted)]">
                <strong>Enquiry forms.</strong> When someone wants to know about your courses, fees, or batches, they fill a short form instead of calling or messaging. You get their details in one place and can call back at a convenient time. Use a single form for general enquiries, or separate forms per course if you want to segment leads.
              </p>
              <p className="mt-2 text-[var(--foreground-muted)]">
                <strong>Trial or demo class signups.</strong> Offer a free trial class and collect signups with a form. Fields: name, phone, grade or subject, preferred date or batch. Once they submit, you (or your team) get an instant notification and can confirm the slot. See how <Link href="/blog/how-to-increase-form-submissions" className="font-medium text-[var(--color-accent)] hover:underline">simple tweaks increase form submissions</Link>.
              </p>
              <p className="mt-2 text-[var(--foreground-muted)]">
                <strong>Batch registration.</strong> When a new batch opens, share a registration form. Keep it short: name, phone, parent name, grade, subject. Avoid long forms with 15+ fields—parents drop off. You can collect additional details when they come for admission. For workshops and events, a <Link href="/blog/online-registration-form-builder-for-workshops" className="font-medium text-[var(--color-accent)] hover:underline">registration form builder</Link> follows the same principle.
              </p>
              <p className="mt-2 text-[var(--foreground-muted)]">
                <strong>Parent feedback.</strong> After a term or batch, send a feedback form link. A few short questions help you improve and show parents you care. Low pressure, high signal.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                How to choose a free form builder for coaching
              </h2>
              <BlogImageBlock variant="content-leads" caption="Look for ease of use and mobile-friendly forms." />
              <p className="mt-2 text-[var(--foreground-muted)]">
                <strong>Easy to build.</strong> You should be able to create a form in minutes without coding. Drag-and-drop or simple field selection is ideal. If it takes hours to set up, you won&apos;t use it.
              </p>
              <p className="mt-2 text-[var(--foreground-muted)]">
                <strong>Submission limits.</strong> Some free tiers cap you at 50–100 submissions per month. Others offer unlimited. If you run ads or have multiple batches, check that the cap fits your expected volume. A <Link href="/free-online-form-builder-unlimited" className="font-medium text-[var(--color-accent)] hover:underline">free form builder with unlimited submissions</Link> avoids surprises.
              </p>
              <p className="mt-2 text-[var(--foreground-muted)]">
                <strong>Instant notifications.</strong> When someone submits, you need an email alert. Otherwise you&apos;ll miss leads or check too late. Fast follow-up matters—see our guide on <Link href="/blog/how-to-follow-up-on-leads-quickly" className="font-medium text-[var(--color-accent)] hover:underline">how to follow up on leads quickly</Link>.
              </p>
              <p className="mt-2 text-[var(--foreground-muted)]">
                <strong>Mobile-friendly.</strong> Most parents and students fill forms on their phones. If the form is hard to use on a small screen—tiny fields, awkward layout—completion drops. Test it on your own phone.
              </p>
              <p className="mt-2 text-[var(--foreground-muted)]">
                <strong>Shareable link and embed.</strong> You need a link to share on WhatsApp, Instagram bio, or ads, and optionally an embed code for your website. Compare <Link href="/blog/free-online-form-builders" className="font-medium text-[var(--color-accent)] hover:underline">free online form builders</Link> to find one that fits.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                What to avoid
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Don&apos;t use forms with 10+ required fields. Parents and students will abandon them. Collect the essentials first—name, phone, course or grade—and get the rest when they visit or call back.
              </p>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Don&apos;t use a form builder that looks spammy or has a confusing URL. People are cautious about sharing phone numbers. Where possible, use a tool that lets you embed forms on your site or use your branding.
              </p>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Don&apos;t forget to tell people what happens next. Add a line like &quot;We&apos;ll call you within 2 hours&quot; or &quot;You&apos;ll get a confirmation SMS.&quot; Setting expectations builds trust and reduces no-shows.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Where to put your form
              </h2>
              <BlogImageBlock variant="lead-capture" caption="One form, one dashboard—no lost enquiries." />
              <p className="mt-2 text-[var(--foreground-muted)]">
                Put the form link everywhere your audience is. Website contact or enquiry page, Instagram and Facebook bio, WhatsApp status, and ad landing pages. If you run Facebook or Google ads for coaching, send clicks to a dedicated landing page with the form—not a generic homepage. Match the ad promise to the form (e.g. &quot;Book a free trial&quot; → form titled &quot;Book Your Free Trial Class&quot;). For more on ads, see <Link href="/blog/lead-capture-form-for-facebook-ads-landing-page" className="font-medium text-[var(--color-accent)] hover:underline">lead capture form for Facebook ads landing page</Link>.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Optional: verify phone numbers
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                Wrong or fake phone numbers waste time. Some form builders support optional OTP verification: the user enters their number, gets a code, enters it, and the form submits. You only get reachable numbers. Not every institute needs it, but if you&apos;ve had trouble with typos or fake submissions, look for a <Link href="/features" className="font-medium text-[var(--color-accent)] hover:underline">form builder with OTP verification</Link>.
              </p>

              <h2 className="font-heading mt-8 text-xl font-semibold text-[var(--foreground)]">
                Quick recap
              </h2>
              <p className="mt-2 text-[var(--foreground-muted)]">
                A free form builder for coaching institutes should be simple: name, phone, maybe course or grade, and one or two optional fields. Use it for enquiries, trial signups, batch registration, and feedback. Choose one that&apos;s easy to build, sends instant notifications, works on mobile, and gives you a shareable link. Avoid long forms, spammy-looking tools, and unclear next steps. Put the form link on your site, social bio, and ad landing pages so every enquiry lands in one place.
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
