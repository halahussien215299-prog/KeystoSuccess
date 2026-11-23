import { Metadata } from "next";
import { DEPARTMENTS } from "@/lib/data";
import { DepartmentPageLayout } from "@/components/DepartmentPageLayout";

const dept = DEPARTMENTS.find((d) => d.id === "travel")!;

export const metadata: Metadata = {
  title: "السفر والسياحة وتأشيرات العمرة | مفاتيح النجاح المحدودة",
  description: dept.shortDesc
};

export default function TravelPage() {
  return <DepartmentPageLayout dept={dept} />;
}
