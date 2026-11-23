import { Metadata } from "next";
import { DEPARTMENTS } from "@/lib/data";
import { DepartmentPageLayout } from "@/components/DepartmentPageLayout";

const dept = DEPARTMENTS.find((d) => d.id === "contracting")!;

export const metadata: Metadata = {
  title: "المقاولات العامة والإنشاءات | مفاتيح النجاح المحدودة",
  description: dept.shortDesc
};

export default function ContractingPage() {
  return <DepartmentPageLayout dept={dept} />;
}
