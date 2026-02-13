import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, CTA, Footer } from "@/components/landing";
import { Container } from "@/components/ui/Container";
import { KnowledgeBaseSearch } from "@/components/KnowledgeBaseSearch";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Knowledge Base – How to Use LeadFormHub | Step-by-Step Guide",
  description:
    "Learn how to use LeadFormHub: create forms, collect leads, enable OTP verification, view your dashboard, and get help. Simple answers for new users.",
  path: "/knowledge-base",
});

const gettingStartedItems = [
  {
    question: "What is LeadFormHub in simple words?",
    answer:
      "LeadFormHub is an online tool that lets you create forms (like contact forms or sign-up forms) and collect leads. A 'lead' is someone who filled your form — you get their name, email, phone, or whatever you asked for. Everything is stored in one place so you can follow up easily.",
  },
  {
    question: "Who is LeadFormHub for?",
    answer:
      "It's for anyone who wants to collect contacts from a website or link: small businesses, marketers, sales teams, coaches, or freelancers. If you need people to fill a form and want those responses in one dashboard (with optional phone verification), LeadFormHub is for you.",
  },
  {
    question: "How do I create an account?",
    answer:
      "Click 'Get Started Free' on the homepage, enter your email and a password, and confirm your email if we ask you to. Once you're in, you'll see your dashboard. No credit card is needed to start.",
  },
  {
    question: "What can I do right after signing up?",
    answer:
      "Right after signup you can create your first form. Go to 'Forms' in your dashboard, click 'Create form', give it a name, add the fields you need (name, email, phone, etc.), and save. Then share the form link with others — when someone submits, they become a lead in your account.",
  },
];

const formsItems = [
  {
    question: "How do I create a new form?",
    answer:
      "Log in, go to the Forms section, and click the button to create a new form. Give your form a name (e.g. 'Contact us' or 'Demo request'). Then add the fields you want: name, email, phone, company, or custom questions. You can mark which fields are required. Save the form when you're done.",
  },
  {
    question: "What kind of fields can I add to my form?",
    answer:
      "You can add common fields like name, email, and phone number, plus custom text fields for questions (e.g. 'What is your budget?' or 'How did you hear about us?'). You choose which fields are required so visitors must fill them before submitting.",
  },
  {
    question: "Can I change my form after I've created it?",
    answer:
      "Yes. Open the form from your Forms list, then use the design or edit options to add or remove fields, change labels, or update settings. Changes apply to the form link immediately, so the next person who opens the link will see the updated form.",
  },
  {
    question: "Where do I find the link to my form?",
    answer:
      "Each form has its own link. After creating or opening a form, look for the 'Form link' or 'Share' section. The link looks like: yoursite.com/f/your-form-id. Copy this link and share it on your website, social media, or in emails so people can fill your form.",
  },
];

const sharingItems = [
  {
    question: "How do I share my form with visitors?",
    answer:
      "Copy your form link from the form's share or embed section. You can paste this link anywhere: in an email, on social media, in a WhatsApp message, or on your website. Anyone who clicks the link can open and submit the form. You don't need to install anything on their device.",
  },
  {
    question: "Can I put my form on my own website?",
    answer:
      "Yes. You can embed your form on your website. In the form's embed section you'll get a small code snippet. Paste that into your website page where you want the form to appear. The form will then show directly on your site so visitors don't have to leave the page.",
  },
  {
    question: "Do I need technical skills to use the form link or embed?",
    answer:
      "No. Using the link is as simple as copying and pasting. For embedding, you (or your web developer) paste the provided code into your website. We give you the exact code; no programming knowledge is required to copy and paste it.",
  },
  {
    question: "Does LeadFormHub track where my leads come from (e.g. Facebook, Google)?",
    answer:
      "Yes. If you add UTM parameters to your form link (e.g. ?utm_source=facebook&utm_medium=paid&utm_campaign=summer), we store them with each lead. You can see the source in each lead's details. On Pro and Business plans, the Analytics page shows a 'Lead source analytics' section with leads and conversion by source and campaign.",
  },
];

const leadsItems = [
  {
    question: "Where do I see the people who filled my form?",
    answer:
      "All submissions appear in the Leads section of your dashboard. You can see each lead's name, email, phone (if you asked for it), and any other answers they gave. You can sort and view leads so you can follow up quickly.",
  },
  {
    question: "What is a 'lead'?",
    answer:
      "A lead is one person who submitted your form. We save their answers (e.g. name, email, phone) as one lead in your account. So if 10 people fill your form, you get 10 leads, each with their own details.",
  },
  {
    question: "Can I export my leads?",
    answer:
      "Yes. From the Leads section you can export your leads (for example as CSV) so you can use them in a spreadsheet, email tool, or CRM. This helps you backup data or move it to another system.",
  },
];

const otpItems = [
  {
    question: "What is OTP verification and why would I use it?",
    answer:
      "OTP means 'one-time password'. If you turn on OTP for a form, when someone enters their phone number and submits, we send a short code to that number. They must enter that code to finish. Only then do we save them as a lead. This way you know the phone number is real and that the person has access to it — fewer fake or wrong numbers.",
  },
  {
    question: "Do I have to use OTP on every form?",
    answer:
      "No. You choose per form. Use OTP when the phone number really matters (e.g. for sales calls or high-value signups). For simple newsletters or contact forms you can leave OTP off so more people complete the form quickly.",
  },
  {
    question: "What happens if someone doesn't enter the OTP code?",
    answer:
      "If OTP is required and they don't enter the correct code, that submission is not saved as a lead. So you only get leads who verified their number. They can try again by submitting the form once more and entering the new code we send.",
  },
];

const dashboardItems = [
  {
    question: "What is the dashboard and what does it show?",
    answer:
      "The dashboard is your main screen after login. It shows an overview of your forms and leads: how many forms you have, how many leads you've collected, recent submissions, and (on paid plans) basic analytics like form views and conversion. It helps you see your activity at a glance.",
  },
  {
    question: "What are form analytics?",
    answer:
      "Analytics show how your form is performing: how many people opened the form (views), how many submitted it (conversions), and sometimes trends over time. This helps you see if your form is being seen and how many visitors actually submit. Analytics are available on higher plans.",
  },
];

const billingItems = [
  {
    question: "Is there a free plan?",
    answer:
      "Yes. You can sign up and use LeadFormHub for free with limits (e.g. number of forms and leads). This lets you try the product and see if it fits. When you need more forms or leads, you can upgrade to a paid plan.",
  },
  {
    question: "How do I upgrade my plan?",
    answer:
      "From your account or the Pricing page, choose the plan you want and follow the payment steps. We accept UPI, cards, and net banking in INR. After payment, your account is upgraded and new limits apply immediately.",
  },
  {
    question: "What if I need more help?",
    answer:
      "Use the Knowledge Base (this page) and the FAQ for common questions. For account or technical issues, go to the Support page and submit a request, or email support. We'll get back to you as soon as we can.",
  },
];

const allKbItems = [
  ...gettingStartedItems,
  ...formsItems,
  ...sharingItems,
  ...leadsItems,
  ...otpItems,
  ...dashboardItems,
  ...billingItems,
];

const kbSections = [
  {
    title: "Getting started",
    description: "What LeadFormHub is, who it's for, and how to create your account and first form.",
    items: gettingStartedItems,
  },
  {
    title: "Creating and editing forms",
    description: "How to build a form, add fields, and find your form link.",
    items: formsItems,
  },
  {
    title: "Sharing your form",
    description: "How to share your form link and embed the form on your website.",
    items: sharingItems,
  },
  {
    title: "Viewing and managing leads",
    description: "Where leads appear, what a lead is, and how to export them.",
    items: leadsItems,
  },
  {
    title: "OTP verification (phone verification)",
    description: "What OTP is, when to use it, and what happens if someone doesn't verify.",
    items: otpItems,
  },
  {
    title: "Dashboard and analytics",
    description: "What the dashboard shows and how form analytics help you.",
    items: dashboardItems,
  },
  {
    title: "Billing and getting help",
    description: "Free plan, upgrading, and where to get support.",
    items: billingItems,
  },
];

const kbSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: allKbItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function KnowledgeBasePage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(kbSchema) }}
      />
      <Navbar />
      <main>
        <section className="section-padding border-b border-[var(--border-subtle)] bg-white">
          <Container size="narrow" className="px-4 text-center sm:px-6">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Knowledge Base: How to Use LeadFormHub
            </h1>
            <p className="mt-4 text-lg text-[var(--foreground-muted)]">
              New to LeadFormHub? Here you’ll find simple answers to the most common questions — no technical background needed. Learn how to create forms, collect leads, and get the most out of your account.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--color-accent)] px-5 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]"
              >
                Get Started Free
              </Link>
              <Link
                href="/faq"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--border-default)] px-5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--neutral-50)]"
              >
                FAQ
              </Link>
            </div>
          </Container>
        </section>

        <KnowledgeBaseSearch sections={kbSections} />

        <section className="section-padding border-t border-[var(--border-subtle)] bg-[var(--background)]">
          <Container size="narrow" className="px-4 text-center sm:px-6">
            <p className="text-[var(--foreground-muted)]">
              Didn’t find what you need? Check our{" "}
              <Link href="/faq" className="font-medium text-[var(--color-accent)] hover:underline">
                FAQ
              </Link>{" "}
              or{" "}
              <Link href="/support" className="font-medium text-[var(--color-accent)] hover:underline">
                raise a support request
              </Link>
              .
            </p>
            <Link
              href="/signup"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-[var(--color-accent)] px-6 text-base font-medium text-white hover:bg-[var(--color-accent-hover)]"
            >
              Get Started Free
            </Link>
          </Container>
        </section>

        <CTA />
        <Footer />
      </main>
    </div>
  );
}
