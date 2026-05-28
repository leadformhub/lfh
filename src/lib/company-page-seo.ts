import { canonicalUrlFromPath, SITE_URL } from "@/lib/seo";

export type CompanyFaqItem = { question: string; answer: string };

export function buildWebPageBreadcrumbSchema(path: string, pageName: string) {
  const pageUrl = canonicalUrlFromPath(path);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: pageName, item: pageUrl },
    ],
  };
}

export function buildCompanyFaqSchema(faqs: CompanyFaqItem[]) {
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
