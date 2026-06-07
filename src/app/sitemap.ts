import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://leadformhub.com";

  const staticPages = [
    { url: baseUrl, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/pricing`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/typeform-alternative`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/zoho-forms-alternative`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/free-online-form-builder-unlimited`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/knowledge-base`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/about`, priority: 0.6, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/contact`, priority: 0.6, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/blog`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/blog/best-form-builder-tools-for-lead-generation-forms`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/blog/google-forms-vs-business-form-builders`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/blog/typeform-vs-leadformhub`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/blog/google-forms-alternative`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/blog/how-to-reduce-fake-leads-from-forms`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/blog/online-forms-in-digital-marketing`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/blog/form-builder-with-auto-email-response-for-clients`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/blog/contact-form-with-instant-email-notification`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/blog/online-admission-form-creator-for-schools`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/blog/how-to-increase-form-submissions`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/blog/how-to-follow-up-on-leads-quickly`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/blog/how-to-generate-leads-for-free`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/blog/how-to-generate-leads-manually`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/blog/lead-capture-form-for-facebook-ads-landing-page`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/blog/free-form-builder-for-coaching-institutes`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/blog/kaizen-vs-kanban`, priority: 0.6, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/blog/case-study-of-using-lead-generation-forms`, priority: 0.6, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/blog/free-online-form-builders`, priority: 0.6, changeFrequency: "monthly" as const },
  ];

  return staticPages.map((page) => ({
    url: page.url,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
