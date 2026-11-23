import { Metadata } from "next";
import { DEPARTMENTS } from "@/lib/data";
import { DepartmentPageLayout } from "@/components/DepartmentPageLayout";

const dept = DEPARTMENTS.find((d) => d.id === "trade")!;

export const metadata: Metadata = {
  title: "التجارة العامة والخدمات اللوجستية والتوريدات",
  description:
    dept.shortDesc ||
    "خدمات الاستيراد والتصدير، التخليص الجمركي، التوريدات المتكاملة، والشحن والخدمات اللوجستية بكفاءة وموثوقية عالية.",
  alternates: {
    canonical: "https://www.mafteeh-alnajah.com/trade",
  },
  openGraph: {
    title: "التجارة والخدمات اللوجستية | مفاتيح النجاح المحدودة",
    description: dept.shortDesc,
    url: "https://www.mafteeh-alnajah.com/trade",
    images: [{ url: "/images/trade.jpg", width: 1200, height: 630 }],
  },
};

export default function TradePage() {
  return <DepartmentPageLayout dept={dept} />;
}
