"use client";

import React from "react";
import Image from "next/image";
import {
  CalendarCheck,
  Plane,
  Building2,
  Calendar,
  Check,
  Star,
  Crown,
  Sparkles,
  MapPin,
  ShieldCheck,
  Car
} from "lucide-react";
import { ModernWhatsAppIcon } from "@/components/Icons";
import { useSiteContent } from "@/context/ContentContext";
import { ScrollReveal } from "@/components/ScrollReveal";

interface PackageMetadata {
  id: string;
  image: string;
  stars: number;
  badgeLabel?: string;
  isVip?: boolean;
  featured?: boolean;
}

const packageMeta: Record<string, PackageMetadata> = {
  eco: {
    id: "eco",
    image: "/images/services/travel-3.jpg",
    stars: 3,
    badgeLabel: "الخيار الاقتصادي المعتمد",
    featured: false
  },
  premium: {
    id: "premium",
    image: "/images/services/travel-1.jpg",
    stars: 4,
    badgeLabel: "الأكثر طلباً واختياراً",
    featured: true
  },
  vip: {
    id: "vip",
    image: "/images/travel.jpg",
    stars: 5,
    badgeLabel: "خدمات رجال الأعمال VIP",
    isVip: true,
    featured: false
  }
};

export function UmrahPackages() {
  const { content } = useSiteContent();
  const travelDept = content?.departments?.find((d) => d.id === "travel");
  const packages = travelDept?.packages || [
    {
      id: "eco",
      title: "باقة العمرة الاقتصادية",
      desc: "مثالية للأفراد والعائلات الباحثين عن خدمة موثوقة بتكلفة اقتصادية مريحة.",
      duration: "7 أيام / 6 ليالي",
      hotel: "فندق 3 نجوم قريب ومريح",
      includes: [
        "إصدار تأشيرة العمرة والتأمين الطبي",
        "إقامة 7 أيام في مكة المكرمة",
        "استقبال ونقل من وإلى المطار",
        "إشراف ومتابعة ميدانية على مدار الساعة"
      ]
    },
    {
      id: "premium",
      title: "باقة العمرة المميزة",
      desc: "الباقة الأكثر طلباً تجمع بين الراحة الفندقية والموقع الاستراتيجي والخدمات الإضافية.",
      duration: "10 أيام / 9 ليالي",
      hotel: "فندق 4 نجوم مع إطلالة قريبة",
      featured: true,
      badge: "الأكثر طلباً",
      includes: [
        "تأشيرة العمرة وتأمين السفر الشامل",
        "إقامة 10 أيام (مكة والمدينة)",
        "فندق 4 نجوم مع وجبة الإفطار",
        "نقل خاص حديث ومريح",
        "زيارة المعالم والمزارات التاريخية"
      ]
    },
    {
      id: "vip",
      title: "باقة العمرة VIP",
      desc: "تجربة روحانية استثنائية مع خدمات رجال الأعمال وفنادق الـ 5 نجوم المطلة مباشرة.",
      duration: "14 يوم / 13 ليلة",
      hotel: "فندق 5 نجوم فاخر مطل على الحرم",
      badge: "خدمات رجال الأعمال",
      includes: [
        "تأشيرة VIP وإجراءات سريعة وفورية",
        "إقامة 14 يوم بفندق 5 نجوم مطل على الحرم",
        "سيارات خاصة VIP وسائق مخصص طوال الإقامة",
        "بوفيه إفطار وعشاء فاخر مفتوح",
        "مرشد خاص متفرغ لخدمتكم وتسهيل المناسك"
      ]
    }
  ];

  const waTarget = content?.company?.phones?.[2]?.waLink || "249110061223";

  const handleBookPackage = (pkgTitle: string) => {
    window.dispatchEvent(
      new CustomEvent("open-booking-modal", {
        detail: {
          department: `السفر والسياحة والتأشيرات (عمرة) - ${pkgTitle}`
        }
      })
    );
  };

  return (
    <section
      className="py-12 sm:py-20 lg:py-28 bg-[#f8fafc] border-t border-zinc-200 relative overflow-hidden"
      id="umrah"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold shadow-xs">
            <Plane className="w-3.5 h-3.5 text-emerald-600 stroke-[2.2]" />
            <span>برامج وخدمات العمرة المميزة • رحلة إيمانية متكاملة</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0d233a] tracking-tight">
            باقات العمرة <span className="text-[#eab308]">المتكاملة والفاخرة</span>
          </h2>
          <p className="text-xs sm:text-base text-zinc-600 leading-relaxed font-normal">
            نوفر لضيوف الرحمن باقات عمرة صُممت بأعلى المعايير، تشمل التأشيرات الرسمية السريعة، أرقى الفنادق القريبة من الحرمين الشريفين، والنقل الخاص المريح لضمان رحلة إيمانية خاشعة ومطمئنة.
          </p>
        </ScrollReveal>

        {/* 3 Packages Luxury Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {packages.map((pkg, idx) => {
            const meta = packageMeta[pkg.id] || {
              id: pkg.id,
              image: "/images/travel.jpg",
              stars: 4,
              badgeLabel: pkg.badge || "باقة معتمدة",
              isVip: pkg.id === "vip",
              featured: pkg.featured
            };

            const isVip = meta.isVip || pkg.id === "vip";
            const isFeatured = meta.featured || pkg.featured;

            return (
              <ScrollReveal
                key={pkg.id}
                delay={idx * 100}
                direction="up"
                className="h-full flex flex-col"
              >
                <div
                  className={`group relative rounded-3xl flex flex-col justify-between overflow-hidden transition-all duration-300 h-full ${
                    isVip
                      ? "bg-gradient-to-b from-[#091b2c] via-[#0d233a] to-[#071524] text-white border-2 border-amber-400 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/35 hover:-translate-y-2"
                      : isFeatured
                      ? "bg-gradient-to-b from-amber-50/60 via-white to-white text-zinc-900 border-2 border-[#eab308] ring-4 ring-amber-400/15 shadow-xl shadow-amber-500/15 hover:shadow-2xl hover:shadow-amber-500/25 hover:-translate-y-2 lg:-translate-y-2"
                      : "bg-white text-zinc-900 border border-zinc-200/90 shadow-md hover:shadow-xl hover:border-amber-300 hover:-translate-y-1.5"
                  }`}
                >
                  {/* Top Photographic Architectural Banner */}
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden shrink-0">
                    <Image
                      src={meta.image}
                      alt={pkg.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    {/* Atmospheric Dark Navy Gradient over image */}
                    <div
                      className={`absolute inset-0 ${
                        isVip
                          ? "bg-gradient-to-t from-[#091b2c] via-[#091b2c]/60 to-black/30"
                          : "bg-gradient-to-t from-black/85 via-black/40 to-black/20"
                      }`}
                    />

                    {/* Top Floating Badge */}
                    <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
                      {isVip ? (
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-[#091b2c] text-xs font-black shadow-lg shadow-black/40 flex items-center gap-1.5">
                          <Crown className="w-3.5 h-3.5 fill-[#091b2c] stroke-[#091b2c]" />
                          <span>{meta.badgeLabel || "خدمات VIP ورجال الأعمال"}</span>
                        </span>
                      ) : isFeatured ? (
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-extrabold shadow-md shadow-amber-500/30 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 fill-white stroke-white" />
                          <span>{meta.badgeLabel || "الأكثر طلباً واختياراً"}</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[#0d233a] text-[11px] font-bold shadow-md border border-white/50">
                          {meta.badgeLabel || "الخيار الاقتصادي"}
                        </span>
                      )}
                    </div>

                    {/* Top Left: Star Rating in Gold */}
                    <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1">
                      {[...Array(meta.stars)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-[10px] font-mono font-bold text-amber-300 mr-1">
                        {meta.stars} نجوم
                      </span>
                    </div>

                    {/* Title Overlay at bottom of banner */}
                    <div className="absolute bottom-3 inset-x-4 text-right">
                      <h3
                        className={`text-xl sm:text-2xl font-black tracking-tight drop-shadow-md ${
                          isVip ? "text-[#eab308]" : "text-white"
                        }`}
                      >
                        {pkg.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Description */}
                      <p
                        className={`text-xs sm:text-sm leading-relaxed mb-5 ${
                          isVip ? "text-zinc-300" : "text-zinc-600"
                        }`}
                      >
                        {pkg.desc}
                      </p>

                      {/* Duration & Hotel Highlights in Luxury Two-Column Bento Tiles */}
                      <div className="grid grid-cols-2 gap-2.5 mb-5">
                        {/* Duration Tile */}
                        <div
                          className={`p-3 rounded-2xl border flex flex-col justify-between text-right ${
                            isVip
                              ? "bg-[#11273f]/80 border-amber-400/25 text-zinc-200"
                              : isFeatured
                              ? "bg-amber-50/70 border-amber-200/80 text-zinc-800"
                              : "bg-zinc-50 border-zinc-200/80 text-zinc-800"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                                isVip
                                  ? "bg-amber-400/20 text-amber-300"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              <Calendar className="w-3.5 h-3.5 stroke-[2.2]" />
                            </div>
                            <span
                              className={`text-[10px] font-bold ${
                                isVip ? "text-amber-300" : "text-amber-800"
                              }`}
                            >
                              المدة الإجمالية
                            </span>
                          </div>
                          <span className="text-xs font-black tracking-tight">
                            {pkg.duration}
                          </span>
                        </div>

                        {/* Hotel Tile */}
                        <div
                          className={`p-3 rounded-2xl border flex flex-col justify-between text-right ${
                            isVip
                              ? "bg-[#11273f]/80 border-amber-400/25 text-zinc-200"
                              : isFeatured
                              ? "bg-amber-50/70 border-amber-200/80 text-zinc-800"
                              : "bg-zinc-50 border-zinc-200/80 text-zinc-800"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                                isVip
                                  ? "bg-amber-400/20 text-amber-300"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              <Building2 className="w-3.5 h-3.5 stroke-[2.2]" />
                            </div>
                            <span
                              className={`text-[10px] font-bold ${
                                isVip ? "text-amber-300" : "text-amber-800"
                              }`}
                            >
                              مستوى الإقامة
                            </span>
                          </div>
                          <span className="text-xs font-black tracking-tight line-clamp-1">
                            {pkg.hotel}
                          </span>
                        </div>
                      </div>

                      {/* Package Inclusions Checklist with Luxury Badges */}
                      <div className="space-y-2.5 mb-6">
                        <span
                          className={`block text-[11px] font-extrabold uppercase tracking-wider mb-2 ${
                            isVip ? "text-amber-300" : "text-zinc-400"
                          }`}
                        >
                          المميزات والخدمات المشمولة:
                        </span>
                        {pkg.includes.map((inc, iIdx) => (
                          <div key={iIdx} className="flex items-start gap-2.5 text-xs">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                                isVip
                                  ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                                  : isFeatured
                                  ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                                  : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                              }`}
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                            <span
                              className={`leading-relaxed font-medium ${
                                isVip ? "text-zinc-200" : "text-zinc-700"
                              }`}
                            >
                              {inc}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dual Action CTA Buttons */}
                    <div className="space-y-2 pt-4 border-t border-zinc-100/10">
                      {/* Main Booking Button */}
                      <button
                        type="button"
                        onClick={() => handleBookPackage(pkg.title)}
                        className={`w-full py-3.5 rounded-xl font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 cursor-pointer ${
                          isVip
                            ? "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-zinc-950 shadow-amber-500/30 hover:shadow-amber-500/50"
                            : isFeatured
                            ? "bg-[#0d233a] hover:bg-[#132f4c] text-white shadow-zinc-900/15"
                            : "bg-[#0d233a] hover:bg-[#132f4c] text-white shadow-zinc-900/15"
                        }`}
                      >
                        <CalendarCheck
                          className={`w-4 h-4 stroke-[2.2] ${
                            isVip ? "text-zinc-950" : "text-[#eab308]"
                          }`}
                        />
                        <span>حجز الباقة عبر الموقع</span>
                      </button>

                      {/* Direct WhatsApp Consultation Button */}
                      <a
                        href={`https://wa.me/${waTarget}?text=${encodeURIComponent(
                          `مرحباً شركة مفاتيح النجاح المحدودة 🔑، أود الاستفسار عن تفاصيل وحجز (${pkg.title}).`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 ${
                          isVip
                            ? "bg-emerald-950/50 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-500/40"
                            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        <ModernWhatsAppIcon size={16} className="text-emerald-500" />
                        <span>استفسار واتساب مباشر</span>
                      </a>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
