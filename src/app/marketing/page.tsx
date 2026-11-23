import { Metadata } from "next";
import { DEPARTMENTS } from "@/lib/data";
import { DepartmentPageLayout } from "@/components/DepartmentPageLayout";

const dept = DEPARTMENTS.find((d) => d.id === "marketing")!;

export const metadata: Metadata = {
  title: "الدعاية والتسويق الرقمي | مفاتيح النجاح المحدودة",
  description: dept.shortDesc
};

export default function MarketingPage() {
  return <DepartmentPageLayout dept={dept} />;
}
