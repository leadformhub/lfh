import fs from "fs";

const SITE_URL = "https://leadformhub.com";

function getBlogCanonicalUrl(slug) {
  return `${SITE_URL}/blog/${slug}`;
}

function buildBlogPostingSchema(options) {
  const url = getBlogCanonicalUrl(options.slug);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: options.headline,
    description: options.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: "LeadFormHub Editorial Team" },
    publisher: { "@type": "Organization", name: "LeadFormHub", url: SITE_URL },
    datePublished: options.datePublished,
    dateModified: options.dateModified ?? options.datePublished,
  };
}

function buildBreadcrumbSchema(slug, headline) {
  const postUrl = getBlogCanonicalUrl(slug);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: headline, item: postUrl },
    ],
  };
}

function buildFaqPageSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

const pages = [
  {
    name: "typeform-vs-leadformhub",
    slug: "typeform-vs-leadformhub",
    headline: "Typeform vs LeadFormHub: Compare Form Builders & Lead Capture",
    description:
      "Compare Typeform and LeadFormHub for lead capture: ease of use, form builder pricing, OTP verification, and best use cases.",
    datePublished: "2025-02-01",
    dateModified: "2026-06-07",
    faqs: [
      {
        question: "Is LeadFormHub a good Typeform alternative for lead capture?",
        answer:
          "Yes. LeadFormHub is built as a Typeform alternative for teams that prioritise lead capture and lead quality. You get optional OTP verification, a branded hub, and a unified lead dashboard.",
      },
      {
        question: "Does Typeform have OTP or phone verification for leads?",
        answer:
          "No. Typeform does not offer built-in OTP or phone verification. LeadFormHub offers optional OTP verification.",
      },
      {
        question: "How does form builder pricing compare between Typeform and LeadFormHub?",
        answer:
          "Typeform prices in USD with a free tier and paid subscriptions. LeadFormHub offers a free tier and paid plans with monthly payment options.",
      },
      {
        question: "Which is better for B2B lead generation forms?",
        answer:
          "For B2B lead generation forms where you need real, reachable contacts, LeadFormHub is often the better fit because of OTP verification and a lead-focused dashboard.",
      },
    ],
  },
  {
    name: "typeform-alternative",
    slug: "typeform-alternative",
    headline: "Typeform Alternative for Verified Lead Capture Forms",
    description:
      "Looking for a Typeform alternative? Use LeadFormHub as your lead capture form builder with OTP verification, form analytics, and a sales-ready dashboard.",
    datePublished: "2025-02-01",
    dateModified: "2026-06-07",
    faqs: [
      {
        question: "Why use LeadFormHub instead of Typeform for lead capture?",
        answer:
          "LeadFormHub is built for lead quality: OTP verification, a dedicated branded hub, and a sales-ready dashboard.",
      },
      {
        question: "Does LeadFormHub support monthly payment?",
        answer: "Yes. LeadFormHub offers monthly plans with multiple payment options.",
      },
      {
        question: "Can I have a branded form URL like Typeform?",
        answer: "Yes. You get a dedicated hub at leadformhub.com/yourbrand.",
      },
    ],
  },
];

function buildHtml(page) {
  const schemas = [
    buildBlogPostingSchema({
      slug: page.slug,
      headline: page.headline,
      description: page.description,
      datePublished: page.datePublished,
      dateModified: page.dateModified,
    }),
    buildBreadcrumbSchema(page.slug, page.headline),
    buildFaqPageSchema(page.faqs),
  ];
  const scripts = schemas
    .map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join("\n");
  return `<!DOCTYPE html><html><head><title>${page.headline}</title>${scripts}</head><body><h1>${page.headline}</h1></body></html>`;
}

async function validateWithSchemaOrg(html) {
  const res = await fetch("https://validator.schema.org/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html }),
  });
  const text = await res.text();
  const jsonText = text.replace(/^\)\]\}'\n?/, "");
  return JSON.parse(jsonText);
}

function collectSchemaTypes(tree, types = new Set()) {
  if (tree?.name) types.add(tree.name);
  for (const child of tree?.children ?? []) collectSchemaTypes(child, types);
  return types;
}

async function validateWithGoogleRichResults(html) {
  const res = await fetch(
    "https://search.google.com/test/rich-results?hl=en",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0",
      },
      body: new URLSearchParams({
        code: html,
      }),
    }
  );
  return { status: res.status, text: await res.text() };
}

for (const page of pages) {
  const html = buildHtml(page);
  fs.writeFileSync(`tmp-schema-${page.name}.html`, html);
  console.log(`\n=== ${page.name} ===`);
  console.log("Local schema types: BlogPosting, BreadcrumbList, FAQPage");

  const schemaResult = await validateWithSchemaOrg(html);
  const types = new Set();
  for (const tree of schemaResult?.trees ?? []) {
    collectSchemaTypes(tree, types);
  }
  console.log("Schema.org validator detected types:", [...types].sort().join(", ") || "(none)");
  console.log("Schema.org errors:", schemaResult?.totalNumErrors ?? schemaResult?.errors?.length ?? 0);
  console.log("BlogPosting valid:", types.has("BlogPosting") ? "PASS" : "FAIL");
  console.log("FAQPage valid:", types.has("FAQPage") ? "PASS" : "FAIL");
  if (schemaResult?.errors?.length) {
    console.log("Sample errors:", schemaResult.errors.slice(0, 2));
  }
}

// Live production check
console.log("\n=== LIVE PRODUCTION (typeform-vs-leadformhub) ===");
const liveRes = await fetch("https://leadformhub.com/blog/typeform-vs-leadformhub");
const liveHtml = await liveRes.text();
const liveTypes = [...liveHtml.matchAll(/"@type":"([^"]+)"/g)].map((m) => m[1]);
const uniqueLive = [...new Set(liveTypes)];
console.log("Detected @type values on live page:", uniqueLive.join(", "));
console.log(
  "BlogPosting on live:",
  uniqueLive.includes("BlogPosting") ? "YES" : "NO (deploy pending)"
);
console.log("FAQPage on live:", uniqueLive.includes("FAQPage") ? "YES" : "NO");
