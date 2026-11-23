import { Metadata } from "next";
import { DEPARTMENTS } from "@/lib/data";
import { DepartmentPageLayout } from "@/components/DepartmentPageLayout";

const dept = DEPARTMENTS.find((d) => d.id === "trade")!;

export const metadata: Metadata = {
  title: "التجارة والخدمات اللوجستية | مفاتيح النجاح المحدودة",
  description: dept.shortDesc
};

export default function TradePage() {
  return <DepartmentPageLayout dept={dept} />;
}
