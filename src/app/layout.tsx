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
  metadataBase: new URL("https://mafteeh-alnajah.com"),
  title: "مفاتيح النجاح المحدودة | مفتاحك نحو النجاح والتميز",
  description:
    "شركة مفاتيح النجاح تقدم خدمات متنوعة واحترافية لعملائها بكل موثوقية وتميز في مجالات النظافة، الدعاية والتسويق، السفر والسياحة، المقاولات العامة، والتجارة والخدمات اللوجستية.",
  keywords: [
    "مفاتيح النجاح",
    "شركة مفاتيح النجاح المحدودة",
    "نظافة منشآت",
    "دعاية وتسويق",
    "عمرة وتأشيرات",
    "سفر وسياحة",
    "مقاولات عامة",
    "خدمات لوجستية وتجارة",
    "السودان"
  ],
  authors: [{ name: "مفاتيح النجاح" }, { name: "رواد الرقمية", url: "https://wa.me/966543907572" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png"
  },
  openGraph: {
    title: "مفاتيح النجاح المحدودة | مفتاحك نحو النجاح والتميز",
    description:
      "شركة رائدة متعددة الخدمات تقدم حلولاً متكاملة في مجالات النظافة، الدعاية والتسويق، السفر والسياحة، المقاولات العامة، والتجارة والخدمات اللوجستية.",
    images: [{ url: "/logo.png" }],
    locale: "ar_SA",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialContent = readSiteContent();

  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#f8fafc] text-zinc-900 font-sans">
        <ContentProvider initialContent={initialContent}>
          <SiteChromeWrapper>{children}</SiteChromeWrapper>
        </ContentProvider>
      </body>
    </html>
  );
}
