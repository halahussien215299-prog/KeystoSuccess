"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  MapPin
} from "lucide-react";
import { ModernWhatsAppIcon, ModernPhoneIcon } from "@/components/Icons";
import { useSiteContent } from "@/context/ContentContext";

export function Footer() {
  const { content } = useSiteContent();
  const company = content?.company || {
    name: "مفاتيح النجاح المحدودة",
    description: "شركة متعددة الخدمات تقدم حلولاً متكاملة في مجالات النظافة، الدعاية والتسويق، السفر والسياحة، المقاولات العامة، والتجارة والخدمات اللوجستية.",
    email: "mafteeh26@gmail.com",
    phones: [
      { label: "خدمة العملاء", number: "0918536828", display: "0918536828", waLink: "249918536828" },
      { label: "المبيعات والحجوزات", number: "0110061201", display: "0110061201", waLink: "249110061201" },
      { label: "الإدارة والمتابعة", number: "0110061223", display: "0110061223", waLink: "249110061223" }
    ]
  };

  const phones = company.phones || [];

  const openBookingModal = () => {
    window.dispatchEvent(new CustomEvent("open-booking-modal"));
  };

  return (
    <footer className="bg-[#071524] border-t border-[#132f4c] text-zinc-300 text-right" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 sm:pt-14 sm:pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
          {/* Column 1 (Right in RTL): Brand & Company Info matching screenshot 3 */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div
                style={{
                  width: `${company?.logoSize || 56}px`,
                  height: `${company?.logoSize || 56}px`
                }}
                className="relative rounded-full overflow-hidden shrink-0 shadow-xl shadow-black/50 ring-2 ring-[#c6ae4c]/35 group-hover:ring-[#c6ae4c] group-hover:scale-105 transition-all duration-300"
              >
                <Image
                  src={company?.logoUrl || "/logo.png"}
                  alt="شعار مفاتيح النجاح"
                  fill
                  className="object-cover scale-110"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-[#c6ae4c] transition-colors">
                  مفاتيح النجاح المحدودة
                </h3>
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-sm">
              {company.description ||
                "شركة متعددة الخدمات تقدم حلولاً متكاملة في مجالات النظافة، الدعاية والتسويق، السفر والسياحة، المقاولات العامة، والتجارة والخدمات اللوجستية."}
            </p>
          </div>

          {/* Column 2 (Middle in RTL): Quick Links matching screenshot 3 */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#eab308] tracking-wide mb-3">
              روابط سريعة
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/cleaning" className="hover:text-[#eab308] transition-colors text-zinc-300">
                  النظافة والخدمات
                </Link>
              </li>
              <li>
                <Link href="/marketing" className="hover:text-[#eab308] transition-colors text-zinc-300">
                  الدعاية والتسويق
                </Link>
              </li>
              <li>
                <Link href="/travel" className="hover:text-[#eab308] transition-colors text-zinc-300">
                  السفر والسياحة
                </Link>
              </li>
              <li>
                <Link href="/contracting" className="hover:text-[#eab308] transition-colors text-zinc-300">
                  المقاولات العامة
                </Link>
              </li>
              <li>
                <Link href="/trade" className="hover:text-[#eab308] transition-colors text-zinc-300">
                  التجارة واللوجستيات
                </Link>
              </li>
              <li>
                <button
                  onClick={openBookingModal}
                  className="hover:text-[#eab308] transition-colors text-zinc-300 text-right cursor-pointer"
                >
                  حجز خدمة
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3 (Left in RTL): WhatsApp Bookings matching screenshot 3 */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#eab308] tracking-wide mb-3">
              احجز عبر واتساب
            </h4>
            <div className="space-y-2.5">
              {phones.map((phone) => (
                <div key={phone.number} className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5 font-mono text-zinc-200">
                    <ModernPhoneIcon size={14} className="text-[#c6ae4c]" />
                    <span>{phone.display}</span>
                  </div>
                  <a
                    href={`https://wa.me/${phone.waLink}?text=${encodeURIComponent("مرحباً شركة مفاتيح النجاح المحدودة 🔑، أود حجز خدمة.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-lg bg-[#1a8885] hover:bg-[#157774] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <span>حجز</span>
                    <ModernWhatsAppIcon size={13} className="text-white" />
                  </a>
                </div>
              ))}

              <div className="pt-2 space-y-2 border-t border-[#132f4c] text-xs text-zinc-300">
                <a
                  href={`mailto:${company?.email || "mafteeh26@gmail.com"}`}
                  className="flex items-center gap-2 hover:text-[#eab308] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#eab308]" />
                  <span>{company?.email || "mafteeh26@gmail.com"}</span>
                </a>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#eab308]" />
                  <span>السودان</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar matching screenshot 3 */}
        <div className="pt-8 mt-8 border-t border-[#132f4c] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© 2026 شركة مفاتيح النجاح المحدودة. جميع الحقوق محفوظة.</p>
          <a
            href="https://wa.me/966543907572?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D8%B1%D9%88%D8%A7%D8%AF%20%D8%A7%D9%84%D8%B1%D9%82%D9%85%D9%8A%D8%A9%20%F0%9F%9A%80%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%AA%D8%B5%D9%85%D9%8A%D9%85%20%D9%88%D8%AA%D8%B7%D9%88%D9%8A%D8%B1%20%D9%85%D9%88%D9%82%D8%B9%20%D8%A5%D9%84%D9%83%D8%AA%D8%B1%D9%88%D9%86%D9%8A."
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-full bg-[#091b2c] hover:bg-[#112a45] border border-[#1e3a5f] hover:border-[#c6ae4c] text-zinc-300 hover:text-white text-[11px] font-medium flex items-center gap-1.5 shadow-xs transition-all duration-200 group cursor-pointer"
            title="تواصل مع رواد الرقمية عبر واتساب: 0543907572"
          >
            <span>صمم بواسطة</span>
            <span className="font-bold text-[#c6ae4c] group-hover:text-amber-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#c6ae4c] animate-pulse" />
              رواد الرقمية
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
