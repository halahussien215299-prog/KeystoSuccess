import { Metadata } from "next";
import { DEPARTMENTS } from "@/lib/data";
import { DepartmentPageLayout } from "@/components/DepartmentPageLayout";

const dept = DEPARTMENTS.find((d) => d.id === "cleaning")!;

export const metadata: Metadata = {
  title: "النظافة والخدمات المتكاملة | مفاتيح النجاح المحدودة",
  description: dept.shortDesc
};

export default function CleaningPage() {
  return <DepartmentPageLayout dept={dept} />;
}
