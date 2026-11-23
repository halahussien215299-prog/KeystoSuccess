import { Metadata } from "next";
import { DEPARTMENTS } from "@/lib/data";
import { DepartmentPageLayout } from "@/components/DepartmentPageLayout";

const dept = DEPARTMENTS.find((d) => d.id === "marketing")!;

export const metadata: Metadata = {
  title: "الدعاية والتسويق الرقمي وإدارة الحملات الإعلانية",
  description:
    dept.shortDesc ||
    "حلول دعاية وإعلان مبتكرة، تصميم هويات بصرية متكاملة، وإدارة حملات التسويق الرقمي والسوشيال ميديا للشركات والأفراد.",
  alternates: {
    canonical: "https://www.mafteeh-alnajah.com/marketing",
  },
  openGraph: {
    title: "الدعاية والتسويق الرقمي | مفاتيح النجاح المحدودة",
    description: dept.shortDesc,
    url: "https://www.mafteeh-alnajah.com/marketing",
    images: [{ url: "/images/marketing.jpg", width: 1200, height: 630 }],
  },
};

export default function MarketingPage() {
  return <DepartmentPageLayout dept={dept} />;
}
