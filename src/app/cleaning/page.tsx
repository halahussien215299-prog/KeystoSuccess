import { Metadata } from "next";
import { DEPARTMENTS } from "@/lib/data";
import { DepartmentPageLayout } from "@/components/DepartmentPageLayout";

const dept = DEPARTMENTS.find((d) => d.id === "cleaning")!;

export const metadata: Metadata = {
  title: "النظافة والخدمات المتكاملة للمنازل والمنشآت",
  description:
    dept.shortDesc ||
    "خدمات نظافة احترافية متكاملة للمنازل والشركات والمنشآت التجارية في الخرطوم والسودان بأحدث المعدات ومواد التعقيم المعتمدة.",
  alternates: {
    canonical: "https://www.mafteeh-alnajah.com/cleaning",
  },
  openGraph: {
    title: "النظافة والخدمات المتكاملة | مفاتيح النجاح المحدودة",
    description: dept.shortDesc,
    url: "https://www.mafteeh-alnajah.com/cleaning",
    images: [{ url: "/images/cleaning.jpg", width: 1200, height: 630 }],
  },
};

export default function CleaningPage() {
  return <DepartmentPageLayout dept={dept} />;
}
