"use client";

import React from "react";
import { ModernWhatsAppIcon, ModernPhoneIcon } from "@/components/Icons";
import { useSiteContent } from "@/context/ContentContext";
import { ScrollReveal } from "@/components/ScrollReveal";

export function QuickContactBanner() {
  const { content } = useSiteContent();
  const phones = content?.company?.phones || [
    { label: "خدمة العملاء", number: "0918536828", display: "0918536828", waLink: "249918536828" },
    { label: "المبيعات والحجوزات", number: "0110061201", display: "0110061201", waLink: "249110061201" },
    { label: "الإدارة والمتابعة", number: "0110061223", display: "0110061223", waLink: "249110061223" }
  ];

  const openBookingModal = () => {
    window.dispatchEvent(new CustomEvent("open-booking-modal"));
  };

  return (
    <section className="py-10 sm:py-16 bg-[#0d233a] border-t border-[#132f4c] text-center text-white relative overflow-hidden" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        <ScrollReveal direction="up">
          <p className="text-sm sm:text-base text-zinc-200 font-medium leading-relaxed">
            ارسل طلب الحجز مباشرة عبر واتساب إلى احد ارقامنا، فريقنا جاهز لخدمتك
          </p>
        </ScrollReveal>

        {/* 3 WhatsApp Phone Buttons Grid with hover animations */}
        <ScrollReveal direction="up" delay={150}>
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
            {phones.map((phone) => (
              <a
                key={phone.number}
                href={`https://wa.me/${phone.waLink}?text=${encodeURIComponent("مرحباً شركة مفاتيح النجاح المحدودة 🔑، أرغب في حجز خدمة والاستفسار عن التفاصيل.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#1a8885] hover:bg-[#157774] text-white shadow-lg shadow-[#1a8885]/35 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-95 flex items-center gap-2 font-mono"
              >
                <ModernWhatsAppIcon size={16} className="text-white" />
                <span>{phone.display}</span>
              </a>
            ))}
          </div>
        </ScrollReveal>

        {/* Golden Outline Full Booking Button */}
        <ScrollReveal direction="up" delay={300}>
          <div className="pt-2 flex justify-center">
            <button
              onClick={openBookingModal}
              className="inline-flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-transparent hover:bg-[#091b2c] text-[#c6ae4c] border-2 border-[#c6ae4c] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
            >
              <ModernPhoneIcon size={16} className="text-[#c6ae4c]" />
              <span>نموذج الحجز الكامل</span>
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
