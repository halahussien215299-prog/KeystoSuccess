import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تواصل معنا والحجز المباشر | شركة مفاتيح النجاح المحدودة",
  description:
    "تواصل مع شركة مفاتيح النجاح المحدودة للاستفسار وحجز الخدمات في النظافة، الدعاية، السفر والسياحة والعمرة، المقاولات، والتجارة واللوجستيات. أرقام الاتصال المباشر والواتساب.",
  alternates: {
    canonical: "https://www.mafteeh-alnajah.com/contact",
  },
  openGraph: {
    title: "تواصل معنا والحجز المباشر | شركة مفاتيح النجاح المحدودة",
    description:
      "تواصل مع فريق مفاتيح النجاح المحدودة لطلب عروض الأسعار وحجز الخدمات المتكاملة فورياً عبر الهاتف أو واتساب.",
    url: "https://www.mafteeh-alnajah.com/contact",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
