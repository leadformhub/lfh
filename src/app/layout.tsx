import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { SITE_URL } from "@/lib/seo";
import { RecaptchaScript } from "@/components/RecaptchaScript";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { ProcessingProvider } from "@/components/ProcessingProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Lead Capture Form Builder for High-Converting Leads | LeadFormHub",
    template: "%s | LeadFormHub",
  },
  description:
    "LeadFormHub is a powerful online form builder to create secure, high-converting lead capture forms with analytics, automation, and OTP validation.",
  keywords: [
    "lead capture form builder",
    "online form builder",
    "lead generation forms",
    "drag and drop form builder",
    "lead capture software",
    "form builder SaaS",
    "secure lead capture forms",
    "form builder with analytics",
    "lead capture tools for business",
  ],
  openGraph: {
    title: "Lead Capture Form Builder for High-Converting Leads | LeadFormHub",
    description:
      "LeadFormHub is a powerful online form builder to create secure, high-converting lead capture forms with analytics, automation, and OTP validation.",
    url: `${SITE_URL}/`,
    siteName: "LeadFormHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lead Capture Form Builder for High-Converting Leads | LeadFormHub",
    description:
      "LeadFormHub is a powerful online form builder to create secure, high-converting lead capture forms with analytics, automation, and OTP validation.",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "LeadFormHub",
        url: SITE_URL,
        description: "Lead capture form builder and online form builder for lead generation forms. Secure lead capture software with analytics and OTP validation.",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "LeadFormHub",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "SoftwareApplication",
        name: "LeadFormHub",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: "Lead capture form builder and form builder SaaS. Create secure lead capture forms with analytics, drag-and-drop builder, and lead management.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      },
    ],
  };

  const themeScript = `
    (function() {
      var t = typeof localStorage !== 'undefined' && localStorage.getItem('leadformhub-theme');
      var theme = (t === 'dark' || t === 'light') ? t : 'light';
      document.documentElement.setAttribute('data-theme', theme);
    })();
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${plusJakarta.variable} font-sans antialiased`} suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <RecaptchaScript />
        <GoogleAnalytics />
        <ProcessingProvider>{children}</ProcessingProvider>
      </body>
    </html>
  );
}
