# LeadFormHub — Complete SEO Audit Report

**Audit date:** February 2025  
**Scope:** SaaS lead generation / form builder platform (www.leadformhub.com)  
**Purpose:** Execution-ready recommendations for developer + SEO strategist

---

## 1. Website Overview

### 1.1 Domain strength
- **Assumption:** New or low authority (no backlink/DA data in codebase).
- **Domain:** `https://www.leadformhub.com` (SITE_URL in `src/lib/seo.ts`).
- **Recommendation:** Submit to Google Search Console and Bing Webmaster Tools; verify www vs non-www and set preferred canonical. Build topical authority around “lead capture,” “form builder,” and “India B2B.”

### 1.2 Target audience & intent match
| Audience | Primary intent | Current match |
|----------|----------------|---------------|
| Indian B2B / SMBs | Lead capture software, verified leads, INR pricing | Strong in content (India, INR, OTP) |
| Agencies | Multi-client forms, branded hub | Good (Features, comparison pages) |
| Startups / sales teams | Form builder + CRM, one dashboard | Good (Features, Integrations) |
| People switching from Typeform/Google Forms/Zoho | Alternative comparison | Dedicated comparison pages present |

**Gap:** Global “form builder” and “lead capture” intent is partially diluted by India-first messaging on homepage; consider geo-specific variants or clearer global value prop in meta and H1.

### 1.3 Core product positioning vs SEO intent
- **Positioning:** Lead capture form builder with OTP verification, branded hub, one dashboard, India-first, INR pricing.
- **SEO intent:** Terms like “lead capture form builder,” “online form builder,” “lead generation forms” are targeted in root metadata and homepage.
- **Alignment:** Good. Ensure “lead capture software” (used in docs) is consistently reflected in titles and H1s where that’s the primary keyword.

---

## 2. Keyword Audit

### 2.1 Primary keywords currently targeted (by page)
| Page | Current focus (from metadata/content) |
|------|--------------------------------------|
| Home | lead capture form builder, online form builder, high-converting leads |
| Features | form builder, analytics, secure lead capture (meta); “lead capture” in H1 |
| Pricing | form builder SaaS pricing, lead capture software plans (meta); “Transparent pricing” in H1 |
| Integrations | form builder integrations, API (meta); “Connect your CRM, email…” in H1 |
| Blog | lead capture form, lead generation best practices |
| FAQ | lead capture forms, form builder FAQ |
| Typeform alt | typeform alternative |
| Google Forms alt | google forms alternative, lead generation |
| Zoho alt | zoho forms alternative |
| About | leadformhub, lead capture form builder |

### 2.2 Missing high-intent keywords (suggested)
- **Commercial:** “best lead capture software,” “lead capture software India,” “form builder with OTP,” “lead capture tool for B2B.”
- **Comparison:** “Typeform vs LeadFormHub,” “Google Forms vs form builder for business,” “JotForm alternative,” “Tally alternative.”
- **Product:** “drag and drop form builder,” “form builder with analytics,” “lead capture with phone verification,” “free form builder for lead generation.”
- **Use-case:** “landing page form builder,” “contact form with verification,” “lead capture for events,” “form builder for agencies.”

### 2.3 Keyword cannibalization issues
| Issue | Location | Fix |
|-------|----------|-----|
| “Form builder” in multiple titles without clear differentiation | Features, Pricing, Integrations, About, Contact all use “form builder” in title | Make each title unique: lead capture **features**, **pricing**, **integrations**, **about**, **contact** with secondary keyword variation |
| Home vs Features both target “lead capture” + “form builder” | Home and /features | Home = “lead capture form builder” / “software”; Features = “lead capture features” / “form builder features” (per doc) |
| “Lead capture” in FAQ title and root keywords | Root keywords + FAQ title | Keep; ensure FAQ H1 includes “lead capture software FAQ” (doc says “Lead Capture Software FAQ”) |

### 2.4 Suggested keyword-to-page mapping
| Target keyword (primary) | Page | Current title/H1 | Recommended title | Recommended H1 (concept) |
|--------------------------|------|------------------|-------------------|---------------------------|
| lead capture form builder | Home | ✓ | Keep; ensure “India” or “verified” in meta | Lead capture form builder for modern businesses (or doc: “Enterprise Lead Capture Software for India”) |
| lead capture software India | Home / About | Partial | “Lead Capture Software for India \| LeadFormHub” (home or about) | Use in one primary H1 (doc suggests home) |
| lead capture features | Features | Partial | “Lead Capture Features \| Form Builder \| LeadFormHub” | “Lead Capture Features Built for Verified, High-Quality Leads” (per doc) |
| lead capture software pricing | Pricing | Partial | “Lead Capture Software Pricing (INR) \| LeadFormHub” | “Lead Capture Software Pricing: Transparent, One-Time Plans in INR” (align with product) |
| lead capture integrations | Integrations | Partial | “Lead Capture Integrations \| CRM, API \| LeadFormHub” | “Lead Capture Integrations: Connect Your CRM, Email, and Tools” (per doc) |
| typeform alternative India | /typeform-alternative | ✓ | Keep; add “India” if desired | “Typeform Alternative in India: …” (per doc) |
| google forms alternative for lead generation | /google-forms-alternative | ✓ | Keep | Per doc |
| zoho forms alternative India | /zoho-forms-alternative | ✓ | Keep | Per doc |
| lead capture software FAQ | FAQ | Partial | “Lead Capture Software FAQ \| LeadFormHub” | “Lead Capture Software FAQ: Answers for Teams and Decision-Makers” (per doc) |
| what is a lead capture form | Blog | ✓ | Keep | Keep |
| form builder API / webhooks | /api-docs | ✓ | “API & Webhooks \| LeadFormHub” | Keep |

---

## 3. On-Page SEO Audit (Page-wise)

### 3.1 Homepage (/)

| Element | Current | Issue | Exact fix |
|--------|---------|--------|-----------|
| **Title** | “Lead Capture Form Builder for High-Converting Leads \| LeadFormHub” | Good; could add “India” for local intent | Optional: “Lead Capture Form Builder for India \| High-Converting Leads \| LeadFormHub” |
| **Meta description** | 160 chars, feature-focused | Good | Keep; ensure “India” or “INR” if targeting local |
| **H1** | “Lead Capture Form Builder for Modern Businesses” (Hero.tsx) | Doc specifies “Enterprise Lead Capture Software for India: Verified Leads, One Hub” — intent drift | Change H1 to include “India” and “verified” or “software” to match doc and keyword “lead capture software india” |
| **H2 structure** | In Hero, Problem, Solution, Features, etc. | Multiple sections; need single H1 then H2s | Ensure only one H1; verify H2s match doc (Why Indian B2B Teams, How It Works, Built for Agencies, etc.) |
| **Keyword placement** | “lead capture,” “form builder” in copy | Good | Add “lead capture software” in first 100 words if targeting that term |
| **Content depth** | Long landing with Features, HowItWorks, UseCases, Integrations, PricingPreview, FAQ | Strong | Add short intro paragraph under H1 with primary keyword (per PAGE-CONTENT-SEO) |
| **CTA** | “Get Started Free,” “Get In Touch” | Good | Keep; ensure one primary CTA above fold |
| **Schema** | Organization, WebSite, SoftwareApplication, Product (reviews) | Good | Add BreadcrumbList for home if needed |

**Bullet fixes (Home):**
- Align H1 with doc: “Enterprise Lead Capture Software for India: Verified Leads, One Hub” or keep current and add “for India” in subhead.
- Add first paragraph under H1 with “lead capture software,” “verified leads,” “one hub,” “INR.”
- Ensure all H2s from doc are present and in order where possible (Why Indian B2B, How LeadFormHub Works, Built for Agencies, Trusted by…, One-Time Pricing, Get Started).

---

### 3.2 Features (/features)

| Element | Current | Issue | Exact fix |
|--------|---------|--------|-----------|
| **Title** | “Form Builder with Analytics & Secure Lead Capture Features” | “Lead capture features” not in title | “Lead Capture Features \| Form Builder with OTP & Analytics \| LeadFormHub” |
| **Meta description** | Good | — | Add “lead capture features” once |
| **H1** | “Lead capture built for verified, high-quality leads” | Doc: “Lead Capture Features Built for Verified, High-Quality Leads” | Use full phrase: “Lead Capture Features Built for Verified, High-Quality Leads” |
| **H2** | OTP Verification, Branded Forms, Centralized Dashboard, Analytics, Security, Integrations | Matches doc | Add id="lead-capture" to hero or first section if Footer links to /features#lead-capture |
| **Keyword placement** | “Lead capture” in H1 | Good | Ensure “lead capture features” in first paragraph |
| **Content depth** | Good (sections with H3s) | — | Keep |
| **CTA** | “Start Free,” “See pricing” | Good | Keep |
| **Internal links** | Link to /integrations | Good | Add link to /pricing, /faq in CTA strip |

**Bullet fixes (Features):**
- Update page title to include “Lead Capture Features.”
- Set H1 to “Lead Capture Features Built for Verified, High-Quality Leads.”
- Add section id `lead-capture` (e.g. on hero or first content block) and fix Footer “Lead Capture Forms” link to `/features#lead-capture` (or point to `#secure-validation` and update Footer).
- Ensure first paragraph includes “lead capture features” (per doc).

---

### 3.3 Pricing (/pricing)

| Element | Current | Issue | Exact fix |
|--------|---------|--------|-----------|
| **Title** | “Form Builder SaaS Pricing – Lead Capture Software Plans (INR)” | Good | Optional: “Lead Capture Software Pricing \| Plans in INR \| LeadFormHub” |
| **Meta description** | “Simple monthly pricing in INR…” | Correct for current product | Keep (align with actual billing: monthly vs one-time) |
| **H1** | “Transparent pricing in INR. No hidden fees.” | Doc: “Lead Capture Software Pricing: Transparent, One-Time Plans in INR” | If product is one-time: use doc H1. If monthly: “Lead Capture Software Pricing: Transparent Plans in INR” |
| **H2** | Simple pricing, Compare Free vs Pro vs Business, etc. | Good | Align trust copy with product (monthly vs one-time) everywhere |
| **Keyword placement** | “Pricing” in H1 | Add “lead capture software pricing” | Use in H1 or first paragraph |
| **Content depth** | Good (plans, trust, comparison) | — | Keep |
| **Schema** | Product with offers (Free, Pro, Business) | Good | Keep |
| **CTA** | “See plans,” “Start Free,” “Get Started Free” | Good | Add “Questions? See FAQ” (already present) |

**Bullet fixes (Pricing):**
- Decide product positioning: one-time vs monthly. Align H1, trust bullets, and doc (PAGE-CONTENT-SEO says “one-time”; current UI says “monthly”). Then standardize all copy.
- Add “lead capture software pricing” in title and/or H1.
- Keep FAQ link in CTA block.

---

### 3.4 Integrations (/integrations)

| Element | Current | Issue | Exact fix |
|--------|---------|--------|-----------|
| **Title** | “Form Builder Integrations & API \| LeadFormHub” | “Lead capture integrations” missing | “Lead Capture Integrations \| CRM, Zapier, API \| LeadFormHub” |
| **Meta description** | Good | — | Include “lead capture integrations” once |
| **H1** | “Connect your CRM, email, and tools you already use” | Doc: “Lead Capture Integrations: Connect Your CRM, Email, and Tools” | Change to: “Lead Capture Integrations: Connect Your CRM, Email, and Tools” |
| **H2** | CRM, Email, Zapier, API, Secure Data Flow, Get Help | Matches doc | Keep |
| **Keyword placement** | “Integrations” in hero | Add “lead capture integrations” | In H1 and first paragraph |
| **Content depth** | Good | — | Add link to /api-docs from API section |
| **CTA** | “Start Free” | Good | Add “See API docs” link |

**Bullet fixes (Integrations):**
- Update title to “Lead Capture Integrations \| …”
- Set H1 to “Lead Capture Integrations: Connect Your CRM, Email, and Tools.”
- Add “lead capture integrations” in first paragraph.
- Link to /api-docs from API card/section.

---

### 3.5 Blog (/blog)

| Element | Current | Issue | Exact fix |
|--------|---------|--------|-----------|
| **Title** | “Blog \| What Is a Lead Capture Form & Lead Generation Best Practices \| LeadFormHub” | Long; “Blog” is weak | “What Is a Lead Capture Form? Tips & Best Practices \| LeadFormHub” or “Lead Capture Form Guide & Best Practices \| LeadFormHub” |
| **Meta description** | Good | — | Keep |
| **H1** | “What is a lead capture form? Tips and best practices” | Good | Keep |
| **Content** | Single hub page; “New articles coming soon” + links to alternatives, features, pricing | Thin; no real articles | Add 2–3 real articles (see Content Audit); keep hub H1 and internal links |
| **Schema** | FAQPage (what is lead capture form, how to create high-converting) | Good | Keep; add Article schema when posts exist |
| **CTA** | Via CTA component | Good | Keep |

**Bullet fixes (Blog):**
- Shorten title; drop “Blog \|” or make it “Lead Capture Form Blog \| ….”
- Treat current page as blog hub; add at least 2–3 full articles (e.g. “What Is a Lead Capture Form?,” “How to Create High-Converting Lead Forms,” “Lead Capture Best Practices for B2B”).
- Add internal links from blog to /features, /pricing, /typeform-alternative, etc. (already started).

---

### 3.6 FAQ (/faq)

| Element | Current | Issue | Exact fix |
|--------|---------|--------|-----------|
| **Title** | “Lead Capture Forms & Form Builder FAQ \| LeadFormHub” | Doc: “lead capture software faq” | “Lead Capture Software FAQ \| LeadFormHub” |
| **Meta description** | Good | — | Keep |
| **H1** | “Answers for teams and decision-makers” | Doc: “Lead Capture Software FAQ: Answers for Teams and Decision-Makers” | “Lead Capture Software FAQ: Answers for Teams and Decision-Makers” |
| **H2** | OTP Verification, Pricing and Billing, Data Security, Setup and Onboarding | Good | Keep |
| **Schema** | FAQPage with all Q&As | Good | Keep |
| **Keyword placement** | “Lead capture” in title | Add “lead capture software” in H1 | Per fix above |

**Bullet fixes (FAQ):**
- Title: “Lead Capture Software FAQ \| LeadFormHub.”
- H1: “Lead Capture Software FAQ: Answers for Teams and Decision-Makers.”

---

### 3.7 Alternative pages (Typeform, Google Forms, Zoho)

- **Titles/descriptions:** Generally good; include “Typeform alternative,” “Google Forms alternative,” “Zoho Forms alternative” and “India” where relevant.
- **H1s:** Align with doc (Typeform: “Typeform Alternative in India: …”; Google: “Google Forms Alternative for Lead Generation: …”; Zoho: “Zoho Forms Alternative in India: …”) if current H1s differ.
- **Schema:** FAQPage + SoftwareApplication on alternatives — keep.
- **CTAs:** “Start Free” / “Get Started” — keep.

---

### 3.8 About, Contact, Support, API Docs, Knowledge Base

| Page | Title | H1 | Fix |
|------|------|-----|-----|
| About | Good | “Verified lead capture built for India” | Doc H1: “About LeadFormHub: Verified Lead Capture Built for India” — consider adding “About LeadFormHub” in H1 |
| Contact | “Contact Us \| LeadFormHub Form Builder” | “Contact Us” | Add “Lead Capture” or “Form Builder” in meta; H1 can stay or “Contact LeadFormHub” |
| Support | In layout: “Support \| LeadFormHub Lead Capture Software” | “Raise Support Request” | Good; optional H1 “Support \| LeadFormHub” for clarity |
| API-docs | “API & Webhooks \| LeadFormHub” | “API & Webhooks” | Good; add to sitemap (see Technical) |
| Knowledge-base | “Knowledge Base – How to Use LeadFormHub \| …” | Check for single H1 | Ensure one H1; add “lead capture” in intro if missing |

---

## 4. Technical SEO Audit

### 4.1 Page speed (mobile & desktop)
- **Not measured in codebase.** Run Lighthouse (mobile + desktop) and PageSpeed Insights for:
  - LCP, FID/INP, CLS (Core Web Vitals)
  - TBT, speed index
- **Likely levers:** Next.js (good base); font display swap (Plus_Jakarta_Sans); reduce hero or heavy JS if any; image optimization (next/image) for any images; ensure no render-blocking beyond fonts.

**Actions:**
- Run Lighthouse on /, /features, /pricing, /integrations, /blog.
- Optimize images (WebP, sizing, lazy load).
- Defer non-critical JS; keep above-the-fold minimal.

### 4.2 Core Web Vitals
- **No instrumentation in repo.** Add (e.g. `web-vitals` + send to analytics) to measure LCP, INP, CLS in production.
- **Layout shift:** Hero orbs and cards — ensure reserved space so CLS stays low.
- **LCP:** Hero and first content; optimize largest element (image or gradient).

### 4.3 Indexing & crawlability
| Item | Status | Fix |
|------|--------|-----|
| Auth routes | noindex (auth layout) | ✓ Keep |
| Dashboard | noindex (dashboard layout) | ✓ Keep |
| robots.txt | Allow /; disallow /api/, /login, /signup, /forgot-password, /reset-password; sitemap URL | ✓ Good |
| Public forms /f/[slug] | No robots set in generateMetadata | **Add noindex** for /f/[slug] (thin, duplicate-style pages) |
| Sitemap | Marketing pages only; no /api-docs | Add /api-docs to sitemap (optional, indexable doc) |

**Exact fixes:**
- In `src/app/f/[slug]/page.tsx` (or layout if exists): set `robots: { index: false, follow: true }` in metadata for public form URLs so form pages are not indexed.
- In `src/app/sitemap.ts`: add `{ path: "/api-docs", priority: 0.7, changeFrequency: "monthly" }` if you want API docs indexed.

### 4.4 Sitemap & robots.txt
- **Sitemap:** `sitemap.ts` generates XML; includes home, features, pricing, faq, knowledge-base, integrations, about, blog, contact, support, privacy, terms, disclaimer, three alternative pages. **Missing:** /api-docs (add if indexable).
- **robots.ts:** Sitemap URL correct. Disallow list is correct. Ensure production SITE_URL is https://www.leadformhub.com.

### 4.5 Canonical & duplicate content
- **Canonical:** `buildPageMetadata` sets `alternates.canonical` per page. Good.
- **Duplicate risk:** /f/[slug] pages are dynamic and similar structure; noindex them (see above).
- **www vs non-www:** Ensure server redirects non-www to www (or vice versa) and that SITE_URL matches; GSC shows preferred version.

### 4.6 URL structure
- **Good:** /features, /pricing, /integrations, /blog, /faq, /about, /contact, /typeform-alternative, /google-forms-alternative, /zoho-forms-alternative, /api-docs, /knowledge-base, /support, /privacy-policy, /terms-and-conditions, /disclaimer.
- **Dynamic:** /f/[slug] — keep; noindex.
- **Dashboard:** /[username]/dashboard, etc. — not in sitemap; noindex. OK.

### 4.7 Schema markup opportunities
| Page | Current | Add |
|------|---------|-----|
| Root layout | Organization, WebSite, SoftwareApplication | — |
| Home | Product (reviews) | BreadcrumbList |
| Pricing | Product with offers | — |
| FAQ | FAQPage | — |
| Blog | FAQPage | Article(s) when posts exist |
| Alternatives | FAQPage, SoftwareApplication | BreadcrumbList |
| All | — | Consider local business or same-as in Organization if you have social/location |

---

## 5. Content Audit

### 5.1 Existing content quality
- **Home:** Strong; multiple sections, clear value prop, social proof, FAQ.
- **Features / Pricing / Integrations:** Solid; matches doc structure and messaging.
- **FAQ:** Good; comprehensive Q&As with schema.
- **Alternatives:** Good; comparison tables, FAQs, use cases.
- **About:** Good; mission, philosophy, India-first.
- **Blog:** **Thin** — hub only, “coming soon”; no full articles yet.
- **Knowledge base:** Good; getting started, forms, leads, OTP, etc.
- **API docs:** Functional; could add more “lead capture” and “form builder” context for SEO.

### 5.2 Thin pages
| Page | Issue | Action |
|------|--------|--------|
| /blog | No real articles; placeholder text | Add 2–3 long-form articles (see 5.4) |
| /contact | Short; only email/support/FAQ links | Acceptable for contact; add 1–2 sentences on “lead capture” or “form builder” if desired |
| /f/[slug] | Dynamic form pages | Noindex; no need to thicken |

### 5.3 Missing content types
- **Comparison articles:** “Typeform vs LeadFormHub,” “Google Forms vs LeadFormHub” (you have alternative pages; could add vs-style blog posts).
- **Use-case pages:** “Lead capture for events,” “Form builder for agencies,” “Landing page forms” (could be sections on Features or dedicated pages).
- **Templates / tools:** “Lead capture form template,” “Contact form template” (download or demo).
- **Glossary / definitions:** “What is lead capture,” “What is OTP verification” (partially in Blog/FAQ; expand).

### 5.4 Blog content gap vs competitors
- Competitors typically have: “What is a lead capture form,” “How to create high-converting forms,” “Best form builders,” “Lead capture best practices,” comparison posts, use-case guides.
- **You have:** Hub with one conceptual H1 and “coming soon”; FAQ schema on blog.
- **Gap:** No full blog articles yet.

### 5.5 Priority blog topics (with intent)
| Topic | Intent | Priority |
|-------|--------|----------|
| What is a lead capture form? (expanded) | Informational | High |
| How to create high-converting lead generation forms | How-to | High |
| Lead capture best practices for B2B | Informational / commercial | High |
| Typeform vs LeadFormHub (comparison) | Commercial | Medium |
| Google Forms vs LeadFormHub for lead gen | Commercial | Medium |
| Form builder with OTP verification: why it matters | Informational | Medium |
| Best lead capture software for Indian businesses | Commercial | Medium |
| Lead capture for webinars and events | Use-case | Medium |
| How to reduce fake leads (OTP and validation) | How-to | Low |

---

## 6. Competitor SEO Gap Analysis

### 6.1 Competitor pages that typically rank higher
- Typeform, JotForm, Google Forms, Zoho Forms, Tally, Typeform alternatives, “best form builder” roundups.
- **Gaps:** You lack “best form builder” or “best lead capture software” list content; fewer blog articles; less backlink depth (assumed).

### 6.2 Keyword gaps
- “JotForm alternative,” “Tally alternative,” “Typeform vs,” “form builder comparison,” “free form builder for businesses,” “lead capture software comparison.”
- **Action:** Add one “JotForm alternative” and one “Tally alternative” page (or combined “form builder alternatives India”); consider “vs” comparison blog posts.

### 6.3 Content format gaps
- **Guides:** Long “ultimate guide to lead capture” or “form builder buyer’s guide.”
- **Comparisons:** Side-by-side tables (you have these on alternative pages); add blog comparisons.
- **Templates:** “Free lead capture form template,” “Contact form template” — you could offer a template or demo link and target those queries.

---

## 7. Internal Linking Audit

### 7.1 Current internal linking issues
| Issue | Where | Fix |
|-------|--------|-----|
| Broken anchor | Footer “Lead Capture Forms” → /features#lead-capture | No id="lead-capture" on Features. Add id or change link to /features or /features#secure-validation |
| Footer “Form Automation” → /features#form-automation | Section id exists (form-automation) | ✓ |
| Footer “Secure Lead Validation” → /features#secure-validation | Exists | ✓ |
| Footer “Analytics & Insights” → /features#analytics | Exists | ✓ |
| API-docs not in sitemap | Sitemap | Add /api-docs if you want it indexed and linked from Integrations |

### 7.2 Pages with no or few inbound links
- **api-docs:** Linked from Footer (Product, Resources). Add from Integrations page (API section).
- **knowledge-base:** In Footer (Resources). Add from FAQ (“Learn more in Knowledge Base”) and from Support page.
- **disclaimer / terms / privacy:** Footer only. OK for legal.
- **support:** Footer and Contact. OK.
- **Blog:** Footer and homepage (if Navbar has Blog). Add from Features/Pricing “Learn more on our blog” where relevant.

### 7.3 Recommended internal linking structure
- **Hub:** Home links to Features, Pricing, Integrations, Blog, FAQ, comparison pages, Signup.
- **Features:** Link to Pricing, Integrations, FAQ, /api-docs (from API section), and one comparison page.
- **Pricing:** Link to Features, FAQ, comparison pages, Signup.
- **Integrations:** Link to /api-docs, Pricing, Features.
- **FAQ:** Link to Pricing, Knowledge Base, Support, Features.
- **Blog:** Link to Features, Pricing, comparison pages, FAQ.
- **Alternatives:** Link to Features, Pricing, FAQ, each other (Typeform/Google/Zoho).
- **Footer:** Keep current groups; fix /features#lead-capture (add id or update href).

---

## 8. Backlink Audit (Assume low backlinks)

### 8.1 Backlink profile health
- **Assumption:** Low backlink volume. Avoid spam; focus on quality and relevance.

### 8.2 Anchor text issues
- Avoid over-optimization: e.g. “lead capture form builder” in every link. Use natural anchors: “LeadFormHub,” “form builder,” “here,” “this tool,” “lead capture software.”

### 8.3 Safe backlink acquisition strategy
- **Product:** Get listed on G2, Capterra, Gartner Digital Markets, SaaS directories (India and global).
- **Content:** Publish blog posts and comparison pages; share on LinkedIn/Twitter; offer quotes or data for others’ roundups (“best form builders for India”).
- **Partners:** Integrations (Zapier, CRMs) — listing and blog posts.
- **PR:** “LeadFormHub launches OTP verification for lead forms” — press or indie hacker posts.
- **Guests:** Guest posts on marketing/SaaS/India B2B blogs with one contextual link.
- **Avoid:** Buying links, link farms, irrelevant directories, exact-match anchor everywhere.

---

## 9. Conversion SEO Audit

### 9.1 SEO traffic conversion blockers
- **Primary CTA:** “Get Started Free” / “Start Free” — clear. Ensure signup flow is short and doesn’t drop SEO visitors.
- **Trust:** Reviews on home (schema + copy); trust badges in footer. Add “As used by X companies” or logos if available.
- **Clarity:** Pricing and “no credit card” are visible; keep above fold on Pricing and Home.

### 9.2 CTA placement
- Home: Hero (Get Started Free, Get In Touch); multiple CTAs down the page. Good.
- Features / Pricing / Integrations / FAQ: CTA strip and buttons. Good.
- **Suggestion:** One sticky CTA on mobile (e.g. “Start Free”) for long pages.

### 9.3 Trust signals missing
- **Testimonials with names/roles:** You have 3 reviews in schema and likely in SocialProof; ensure names, roles, and company (if any) visible on page.
- **Logos:** “Used by” or “Trusted by” with logos if you have permission.
- **Security:** “SSL,” “secure,” “data encrypted” — you mention in hero. Optional: short “Security” line in footer or Trust section.
- **Guarantee:** “Free to start,” “no credit card” — already present. Optional: “Cancel anytime” or “Export your data anytime” on Pricing.

---

## 10. Final SEO Action Plan

### 10.1 Priority fixes

**High (do first)**
1. **Noindex public form URLs** (`/f/[slug]`) to avoid thin/duplicate content.
2. **Align H1s and titles with keyword plan:** Home (lead capture software India / form builder), Features (lead capture features), Pricing (lead capture software pricing), Integrations (lead capture integrations), FAQ (lead capture software FAQ).
3. **Fix Footer anchor:** Add `id="lead-capture"` on Features or change “Lead Capture Forms” link to `/features` or `/features#secure-validation`.
4. **Pricing messaging:** Decide one-time vs monthly and align H1, trust bullets, and any schema/copy.
5. **Add 2–3 blog articles** (What is a lead capture form; How to create high-converting forms; Lead capture best practices) to make /blog a real content hub.

**Medium**
6. Add **api-docs** to sitemap if you want it indexed; add link from Integrations to /api-docs.
7. **Schema:** Add BreadcrumbList on key pages; keep FAQ and Product/Offers.
8. **Internal links:** From FAQ to Knowledge Base; from Integrations to API docs; from Blog to Features/Pricing/alternatives.
9. **Core Web Vitals:** Measure (web-vitals), then optimize LCP/CLS on home and key landing pages.
10. **One new comparison page:** e.g. “JotForm alternative” or “Tally alternative” (or combined “form builder alternatives India”).

**Low**
11. **Blog title:** Shorten; drop “Blog \|” or refine.
12. **About/Contact meta:** Minor tweaks for “lead capture” where it fits.
13. **Backlink strategy:** Submit to 2–3 quality directories; plan 1–2 guest posts or roundup contributions.
14. **Sticky CTA** on mobile for long pages.

### 10.2 30–60–90 day SEO roadmap

| Phase | Focus | Tasks |
|-------|--------|-------|
| **0–30 days** | Technical + on-page | Noindex /f/[slug]; fix canonical/www; fix all H1/title/meta per table; fix Footer #lead-capture; align pricing copy; add API-docs to sitemap and link from Integrations; run Lighthouse and fix critical CWV |
| **31–60 days** | Content + internal links | Publish 2–3 blog articles; add internal links from FAQ → Knowledge Base, Blog → Features/Pricing; add one new comparison page (e.g. JotForm or Tally alternative); optional BreadcrumbList schema |
| **61–90 days** | Authority + conversion | Submit to G2/Capterra/Product Hunt or similar; 1–2 quality backlinks (guest post or roundup); A/B test CTA copy; add “Used by” or trust logos if available; consider “vs” comparison blog posts |

### 10.3 Pages to optimize first for fastest ranking

1. **Home** — H1 + first paragraph + title/meta (lead capture form builder / lead capture software India).
2. **Pricing** — Title + H1 + one-time vs monthly consistency (lead capture software pricing).
3. **Features** — Title + H1 + id for footer (lead capture features).
4. **FAQ** — Title + H1 (lead capture software FAQ).
5. **Integrations** — Title + H1 (lead capture integrations).
6. **Blog** — Publish first article and add internal links; shorten title.

Then: alternative pages (already in good shape); About; api-docs; knowledge-base.

---

**End of SEO Audit Report.** Use the tables and bullet lists above for implementation; re-run Lighthouse and GSC after changes and iterate.
