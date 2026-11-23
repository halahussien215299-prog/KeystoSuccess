import { Metadata } from "next";
import { DEPARTMENTS } from "@/lib/data";
import { DepartmentPageLayout } from "@/components/DepartmentPageLayout";

const dept = DEPARTMENTS.find((d) => d.id === "travel")!;

export const metadata: Metadata = {
  title: "السفر والسياحة وحجوزات الطيران وباقات العمرة الشاملة",
  description:
    dept.shortDesc ||
    "تنظيم رحلات العمرة، حجز تذاكر الطيران، استخراج التأشيرات، وحجوزات الفنادق بأفضل الأسعار وأعلى مستويات الراحة.",
  alternates: {
    canonical: "https://www.mafteeh-alnajah.com/travel",
  },
  openGraph: {
    title: "السفر والسياحة وباقات العمرة | مفاتيح النجاح المحدودة",
    description: dept.shortDesc,
    url: "https://www.mafteeh-alnajah.com/travel",
    images: [{ url: "/images/travel.jpg", width: 1200, height: 630 }],
  },
};

export default function TravelPage() {
  return <DepartmentPageLayout dept={dept} />;
}
