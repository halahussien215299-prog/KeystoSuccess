import { Metadata } from "next";
import { DEPARTMENTS } from "@/lib/data";
import { DepartmentPageLayout } from "@/components/DepartmentPageLayout";

const dept = DEPARTMENTS.find((d) => d.id === "contracting")!;

export const metadata: Metadata = {
  title: "المقاولات العامة والتشطيبات الداخلية والترميمات",
  description:
    dept.shortDesc ||
    "تنفيذ أعمال المقاولات العامة والإنشاءات والتشطيبات الفاخرة والديكور بإشراف هندسي متكامل ومطابق لأعلى المواصفات.",
  alternates: {
    canonical: "https://www.mafteeh-alnajah.com/contracting",
  },
  openGraph: {
    title: "المقاولات العامة والإنشاءات | مفاتيح النجاح المحدودة",
    description: dept.shortDesc,
    url: "https://www.mafteeh-alnajah.com/contracting",
    images: [{ url: "/images/contracting.jpg", width: 1200, height: 630 }],
  },
};

export default function ContractingPage() {
  return <DepartmentPageLayout dept={dept} />;
}
