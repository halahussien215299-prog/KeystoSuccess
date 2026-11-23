"use client";

import React from "react";
import {
  ShieldCheck,
  Award,
  Clock,
  CheckCircle2,
  Wrench,
  Headphones
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

export function WhyChooseUs() {
  const points = [
    {
      title: "خبرة متراكمة واحترافية عالية",
      desc: "طواقم متخصصة وخبراء في كل قطاع لضمان تنفيذ الخدمات وفق المعايير القياسية العالمية.",
      icon: <Award className="w-5 h-5 text-[#eab308] stroke-[1.75]" />
    },
    {
      title: "دقة في المواعيد والتنفيذ",
      desc: "التزام صارم بالجداول الزمنية المحددة مع العملاء في كافة المشاريع والحجوزات دون تأخير.",
      icon: <Clock className="w-5 h-5 text-[#eab308] stroke-[1.75]" />
    },
    {
      title: "أحدث التقنيات والمعدات",
      desc: "نوفر معدات متطورة وأحدث البرمجيات لضمان كفاءة الإنجاز وأعلى جودة في المخرجات.",
      icon: <Wrench className="w-5 h-5 text-[#eab308] stroke-[1.75]" />
    },
    {
      title: "خدمة عملاء ومتابعة مستمرة",
      desc: "فريق دعم متواجد عبر 3 أرقام وواتساب على مدار الساعة لخدمتكم ومتابعة طلباتكم.",
      icon: <Headphones className="w-5 h-5 text-[#eab308] stroke-[1.75]" />
    }
  ];

  return (
    <section className="py-12 sm:py-20 lg:py-28 bg-[#f8fafc] border-y border-zinc-200 relative overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left / Info Text */}
          <ScrollReveal direction="right" className="lg:col-span-5 space-y-4 text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>الثقة والمصداقية</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0d233a] tracking-tight leading-tight">
              لماذا تختار <span className="text-[#eab308]">شركة مفاتيح النجاح</span> كشريكك الدائم؟
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              نحن نؤمن بأن النجاح يبدأ من الاهتمام بأدق التفاصيل. من خلال خبرتنا الواسعة في مجالات النظافة، التسويق، السفر والعمرة، المقاولات، واللوجستيات، نقدم لك باقة حلول استثنائية تغنيك عن التعامل مع أطراف متعددة.
            </p>
            <div className="p-4 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-700 flex items-center gap-3 shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-medium">أكثر من 1200 عميل ومشروع موثق بنجاح في جميع أنحاء السودان.</span>
            </div>
          </ScrollReveal>

          {/* Right / Bento Feature Grid (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 text-right">
            {points.map((p, idx) => (
              <ScrollReveal
                key={idx}
                delay={idx * 100}
                direction="up"
              >
                <div className="p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200/90 hover:border-amber-400 transition-all duration-300 shadow-xs hover:shadow-lg hover:-translate-y-1 h-full">
                  <div className="w-10 h-10 rounded-xl bg-[#0d233a] border border-[#1e3a5f] flex items-center justify-center mb-3.5 shadow-sm">
                    {p.icon}
                  </div>
                  <h3 className="text-base font-bold text-[#0d233a] mb-2">{p.title}</h3>
                  <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">{p.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
