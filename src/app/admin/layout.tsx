import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة التحكم | شركة مفاتيح النجاح المحدودة",
  description: "نظام إدارة المحتوى والطلبات والاتصال",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-zinc-900 font-sans antialiased selection:bg-amber-100 selection:text-amber-900">
      {children}
    </div>
  );
}
