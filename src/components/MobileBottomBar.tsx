"use client";

import React from "react";
import Link from "next/link";
import { CalendarCheck, Home, LayoutGrid } from "lucide-react";
import { ModernWhatsAppIcon, ModernPhoneIcon } from "@/components/Icons";
import { useSiteContent } from "@/context/ContentContext";

export function MobileBottomBar() {
  const { content } = useSiteContent();
  const company = content?.company;
  const phones = company?.phones || [];

  const primaryPhone = company?.primaryPhone || phones[0]?.number || "0918536828";
  const primaryWhatsApp = company?.primaryWhatsApp || phones[0]?.waLink || "249918536828";

  const openBookingModal = () => {
    window.dispatchEvent(new CustomEvent("open-booking-modal"));
  };

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0d233a]/95 backdrop-blur-xl border-t border-[#132f4c] px-3 py-2 shadow-2xl">
      <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
        {/* Home */}
        <Link
          href="/"
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-zinc-300 hover:text-[#eab308] transition-colors min-w-[54px]"
        >
          <Home className="w-5 h-5 stroke-[1.75]" />
          <span className="text-[10px] font-medium mt-1">الرئيسية</span>
        </Link>

        {/* Services */}
        <Link
          href="/#services"
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-zinc-300 hover:text-[#eab308] transition-colors min-w-[54px]"
        >
          <LayoutGrid className="w-5 h-5 stroke-[1.75]" />
          <span className="text-[10px] font-medium mt-1">الخدمات</span>
        </Link>

        {/* Center Booking CTA */}
        <button
          onClick={openBookingModal}
          className="flex flex-col items-center justify-center -mt-5 bg-[#c6ae4c] hover:bg-[#d4b248] text-[#0d233a] w-12 h-12 rounded-full shadow-lg shadow-black/40 border-2 border-[#0d233a] active:scale-95 transition-transform cursor-pointer"
          aria-label="حجز خدمة"
        >
          <CalendarCheck className="w-6 h-6 stroke-[2.2]" />
        </button>

        {/* Call Now */}
        <a
          href={`tel:${primaryPhone}`}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-zinc-300 hover:text-[#c6ae4c] transition-colors min-w-[54px]"
        >
          <ModernPhoneIcon size={20} className="text-[#c6ae4c]" />
          <span className="text-[10px] font-medium mt-1">اتصال</span>
        </a>

        {/* WhatsApp direct */}
        <a
          href={`https://wa.me/${primaryWhatsApp}?text=${encodeURIComponent("مرحباً شركة مفاتيح النجاح المحدودة 🔑، أود الاستفسار عن الخدمات والحجز.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-zinc-300 hover:text-emerald-400 transition-colors min-w-[54px]"
        >
          <ModernWhatsAppIcon size={20} className="text-emerald-400" />
          <span className="text-[10px] font-medium mt-1">واتساب</span>
        </a>
      </div>
    </div>
  );
}
