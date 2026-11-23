import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { ContentProvider } from "@/context/ContentContext";
import { SiteChromeWrapper } from "@/components/SiteChromeWrapper";
import { readSiteContent } from "@/lib/content-store";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mafteeh-alnajah.com"),
  title: {
    default: "شركة مفاتيح النجاح المحدودة | مفتاحك نحو النجاح والتميز",
    template: "%s | مفاتيح النجاح المحدودة"
  },
  description:
    "شركة مفاتيح النجاح المحدودة - شريكك الرائد لتقديم حلول متكاملة وموثوقة بأعلى معايير الجودة في مجالات النظافة العامة والمنشآت، الدعاية والتسويق الرقمي، السفر والسياحة والعمرة، المقاولات والتشطيبات العامة، والتجارة والخدمات اللوجستية.",
  keywords: [
    "مفاتيح النجاح",
    "شركة مفاتيح النجاح المحدودة",
    "نظافة منشآت ومنازل",
    "شركة نظافة بالخرطوم",
    "دعاية وإعلان وتسويق إلكتروني",
    "سفر وسياحة وتأشيرات",
    "باقات العمرة",
    "مقاولات عامة وتشطيبات",
    "تجارة عامة واستيراد وتصدير",
    "خدمات لوجستية وشحن",
    "الخرطوم",
    "السودان",
    "Keys of Success"
  ],
  authors: [
    { name: "مفاتيح النجاح المحدودة" },
    { name: "رواد الرقمية", url: "https://wa.me/966543907572" }
  ],
  creator: "شركة مفاتيح النجاح المحدودة",
  publisher: "شركة مفاتيح النجاح المحدودة",
  formatDetection: {
    email: true,
    address: true,
    telephone: true
  },
  alternates: {
    canonical: "https://www.mafteeh-alnajah.com"
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    shortcut: "/favicon.ico"
  },
  openGraph: {
    title: "شركة مفاتيح النجاح المحدودة | مفتاحك نحو النجاح والتميز",
    description:
      "حلول متكاملة في مجالات النظافة، الدعاية والتسويق، السفر والسياحة، المقاولات، والتجارة واللوجستيات بأعلى معايير الجودة والاحترافية.",
    url: "https://www.mafteeh-alnajah.com",
    siteName: "شركة مفاتيح النجاح المحدودة",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "شعار وهوية شركة مفاتيح النجاح المحدودة"
      }
    ],
    locale: "ar_SA",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "شركة مفاتيح النجاح المحدودة | مفتاحك نحو النجاح والتميز",
    description:
      "حلول متكاملة في مجالات النظافة، الدعاية والتسويق، السفر والسياحة والعمرة، المقاولات، والتجارة واللوجستيات.",
    images: ["/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.mafteeh-alnajah.com/#organization",
      name: "شركة مفاتيح النجاح المحدودة",
      alternateName: "Keys of Success Co. Ltd",
      url: "https://www.mafteeh-alnajah.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.mafteeh-alnajah.com/logo.png",
        width: 500,
        height: 500
      },
      image: "https://www.mafteeh-alnajah.com/og-image.png",
      description:
        "شركة رائدة متعددة الخدمات تقدم حلولاً متكاملة في مجالات النظافة العامة والمنشآت، الدعاية والتسويق، السفر والسياحة، المقاولات، والتجارة واللوجستيات.",
      email: "mafteeh26@gmail.com",
      telephone: ["+249918536828", "+249110061201", "+249110061223"],
      address: {
        "@type": "PostalAddress",
        addressLocality: "الخرطوم",
        addressCountry: "SD"
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+249918536828",
          contactType: "customer service",
          areaServed: "SD",
          availableLanguage: ["Arabic", "English"]
        },
        {
          "@type": "ContactPoint",
          telephone: "+249110061201",
          contactType: "sales",
          areaServed: "SD",
          availableLanguage: ["Arabic", "English"]
        }
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://www.mafteeh-alnajah.com/#website",
      url: "https://www.mafteeh-alnajah.com",
      name: "شركة مفاتيح النجاح المحدودة",
      publisher: {
        "@id": "https://www.mafteeh-alnajah.com/#organization"
      },
      inLanguage: "ar"
    }
  ]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const initialContent = readSiteContent();

  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full bg-[#f8fafc] text-zinc-900 font-sans">
        <ContentProvider initialContent={initialContent}>
          <SiteChromeWrapper>{children}</SiteChromeWrapper>
        </ContentProvider>
      </body>
    </html>
  );
}
