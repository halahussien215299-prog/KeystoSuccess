"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  CheckCircle2,
  CalendarCheck,
  ShieldCheck
} from "lucide-react";
import { ModernWhatsAppIcon } from "@/components/Icons";
import { DepartmentInfo } from "@/lib/data";
import { UmrahPackages } from "@/components/UmrahPackages";
import { useSiteContent } from "@/context/ContentContext";

interface Props {
  dept: DepartmentInfo;
}

export function DepartmentPageLayout({ dept }: Props) {
  const { content } = useSiteContent();
  const liveDept = content?.departments?.find((d) => d.id === dept.id) || dept;
  const phones = content?.company?.phones || [];

  const openBookingModal = (serviceName?: string) => {
    window.dispatchEvent(
      new CustomEvent("open-booking-modal", {
        detail: {
          department: serviceName ? `${liveDept.title} - ${serviceName}` : liveDept.title
        }
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-zinc-900" dir="rtl">
      {/* Hero Header with Background Banner in Deep Navy #0d233a */}
      <section className="relative min-h-[46vh] sm:min-h-[50vh] flex items-center justify-center overflow-hidden py-14 sm:py-16 bg-[#0d233a] text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src={liveDept.image}
            alt={liveDept.title}
            fill
            priority
            className="object-cover object-center opacity-75 scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Subtle directional gradient: dark on the right behind text, clear on the left so image is vivid */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d233a] via-transparent to-[#071524]/40" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#0d233a]/90 via-[#0d233a]/55 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-right">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-zinc-300 mb-4">
            <Link href="/" className="hover:text-[#c6ae4c] transition-colors">
              الرئيسية
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[#c6ae4c] font-semibold">{liveDept.title}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#091b2c]/90 border border-[#1e3a5f] text-[#c6ae4c] text-xs font-semibold mb-3.5">
            <ShieldCheck className="w-4 h-4 text-[#c6ae4c]" />
            <span>{liveDept.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            {liveDept.title}
          </h1>

          <p className="text-sm sm:text-lg text-zinc-200 max-w-2xl leading-relaxed mb-6 sm:mb-8 font-normal">
            {liveDept.shortDesc}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openBookingModal()}
              className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-[#c6ae4c] hover:bg-[#d4b248] text-[#0d233a] shadow-lg shadow-black/25 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>طلب حجز خدمة في هذا القسم</span>
            </button>

            <a
              href={`https://wa.me/${phones[0]?.waLink || "249918536828"}?text=${encodeURIComponent(`مرحباً شركة مفاتيح النجاح المحدودة 🔑، أرغب في الاستفسار عن خدمات (${liveDept.title}).`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-[#1a8885] hover:bg-[#157774] text-white flex items-center gap-2 shadow-lg shadow-[#1a8885]/35 transition-all active:scale-95"
            >
              <ModernWhatsAppIcon size={16} />
              <span>واتساب الاستفسارات</span>
            </a>
          </div>
        </div>
      </section>

      {/* About the Sector Section */}
      <section className="py-14 sm:py-16 border-t border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
          <div className="max-w-3xl mb-10 space-y-2">
            <span className="text-xs font-bold text-[#eab308] uppercase tracking-wider block">
              نظرة عامة متخصصة
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0d233a] tracking-tight">
              عن قسم {liveDept.title}
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed pt-2">
              {liveDept.fullDesc}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {liveDept.features.map((feat, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/90 hover:border-amber-400 transition-all shadow-xs"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3">
                  <CheckCircle2 className="w-5 h-5 stroke-[2]" />
                </div>
                <h3 className="text-base font-bold text-[#0d233a] mb-1.5">{feat.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Checklist Grid */}
      <section className="py-16 sm:py-20 bg-[#f8fafc] text-right border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
            <span className="text-xs font-bold text-[#eab308] uppercase tracking-wider block">
              قائمة الخدمات التخصصية ({liveDept.services.length})
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0d233a] tracking-tight">
              جميع خدمات قسم {liveDept.title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500">
              انقر على أي خدمة لطلب حجزها مباشرة أو الاستفسار عن تفاصيلها
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {liveDept.services.map((srv, idx) => (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-2xl bg-white border border-zinc-200 hover:border-amber-400 shadow-xs hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div>
                  {/* Service Image Preview */}
                  <div className="relative h-44 sm:h-48 w-full rounded-xl overflow-hidden mb-3.5 bg-zinc-100 border border-zinc-200/80 group-hover:border-amber-400/50 transition-all">
                    <Image
                      src={`/images/services/${liveDept.id}-${(idx % 8) + 1}.jpg`}
                      alt={srv}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#0d233a]/90 backdrop-blur-md text-[10px] font-bold text-[#eab308] border border-[#1e3a5f] shadow-xs">
                      خدمة معتمدة
                    </span>
                  </div>

                  {/* Title & Checkmark */}
                  <div className="flex items-start gap-2.5 mb-4">
                    <div className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-[#0d233a] group-hover:text-amber-700 transition-colors leading-snug">
                      {srv}
                    </h4>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openBookingModal(srv)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-zinc-50 hover:bg-[#eab308] hover:text-[#0d233a] text-[#0d233a] border border-zinc-200 hover:border-[#eab308] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs group/btn"
                >
                  <span>طلب حجز الخدمة</span>
                  <ChevronLeft className="w-3.5 h-3.5 group-hover/btn:translate-x-[-2px] transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* If Travel Dept, Embed Umrah Packages */}
      {liveDept.id === "travel" && <UmrahPackages />}

      {/* Direct Contact for Department */}
      <section className="py-14 sm:py-16 bg-white border-t border-zinc-200">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-5">
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#0d233a] tracking-tight">
            هل لديك متطلبات خاصة في مجال {liveDept.title}؟
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-xl mx-auto">
            تواصل مباشرة مع أحد ممثلي الخدمة عبر الأرقام الرسمية أو أرسل رسالة واتساب مفصلة:
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {phones.map((p) => (
              <a
                key={p.number}
                href={`https://wa.me/${p.waLink}?text=${encodeURIComponent(`مرحباً شركة مفاتيح النجاح المحدودة 🔑، أرغب في حجز خدمة من قسم (${liveDept.title}).`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-emerald-500 text-xs text-zinc-800 flex items-center gap-2 hover:bg-emerald-50 shadow-xs transition-colors"
              >
                <ModernWhatsAppIcon size={16} className="text-emerald-600" />
                <span>واتساب {p.label}:</span>
                <span className="font-mono text-[#0d233a] font-bold">{p.display}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
