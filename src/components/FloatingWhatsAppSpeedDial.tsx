"use client";

import React, { useState } from "react";
import { X, ChevronUp, ArrowUpLeft } from "lucide-react";
import { ModernWhatsAppIcon, ModernPhoneIcon } from "@/components/Icons";
import { useSiteContent } from "@/context/ContentContext";

export function FloatingWhatsAppSpeedDial() {
  const { content } = useSiteContent();
  const company = content?.company;
  const phones = company?.phones || [];

  const primaryPhone = company?.primaryPhone || phones[0]?.number || "0918536828";
  const primaryWhatsApp = company?.primaryWhatsApp || phones[0]?.waLink || "249918536828";

  const [open, setOpen] = useState(false);

  return (
    <div className="hidden md:flex fixed bottom-6 left-6 z-40 flex-col items-start gap-3 select-none">
      {/* Expanded WhatsApp Numbers Popup */}
      {open && (
        <div
          className="bg-white/98 backdrop-blur-xl border border-zinc-200 rounded-2xl p-4 shadow-2xl shadow-zinc-900/15 w-76 animate-in slide-in-from-bottom-4 duration-200 text-right"
          dir="rtl"
        >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-zinc-900">خدمة عملاء واتساب المباشرة</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-zinc-400 hover:text-zinc-700 p-1 rounded-md transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-zinc-500 mb-3">
            اختر الرقم المناسب لبدء محادثة فورية مع ممثل القسم:
          </p>

          <div className="space-y-2">
            {phones.map((phone) => (
              <a
                key={phone.number}
                href={`https://wa.me/${phone.waLink || phone.number}?text=${encodeURIComponent("مرحباً شركة مفاتيح النجاح المحدودة 🔑، أود الاستفسار عن الخدمات المتاحة.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 hover:bg-emerald-50 border border-zinc-200 hover:border-emerald-300 text-xs transition-all group"
              >
                <div>
                  <div className="font-semibold text-zinc-800 group-hover:text-emerald-700 transition-colors">
                    {phone.label}
                  </div>
                  <div className="font-mono text-[11px] text-zinc-500">
                    {phone.display || phone.number}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <ModernWhatsAppIcon size={16} />
                </div>
              </a>
            ))}
          </div>

          <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
            <span>الرقم الرئيسي:</span>
            <span className="font-mono font-bold text-emerald-700">{primaryWhatsApp}</span>
          </div>
        </div>
      )}

      {/* Modern Floating Action Buttons Container */}
      <div className="flex flex-col items-center gap-2.5">
        {/* Modern Call Button */}
        <div className="relative group">
          <a
            href={`tel:${primaryPhone}`}
            aria-label={`اتصال مباشر: ${primaryPhone}`}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#c6ae4c] via-amber-400 to-[#caa13a] text-zinc-950 shadow-xl shadow-black/30 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white cursor-pointer relative"
          >
            {/* Pulsing ring */}
            <span className="absolute inset-0 rounded-full border-2 border-amber-400 animate-ping opacity-30 pointer-events-none" />
            <ModernPhoneIcon size={20} className="text-zinc-950 stroke-[2.2] animate-bounce" />
          </a>

          {/* Floating Tooltip Pill */}
          <div className="absolute left-16 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/95 text-white text-xs font-semibold whitespace-nowrap shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-left-2 duration-150 pointer-events-none">
            <ModernPhoneIcon size={14} className="text-[#c6ae4c]" />
            <span>اتصال: {primaryPhone}</span>
          </div>
        </div>

        {/* Modern WhatsApp Button */}
        <div className="relative group">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label="تواصل عبر واتساب"
            className="w-14 h-14 rounded-full bg-[#1a8885] hover:bg-[#157774] text-white shadow-xl shadow-[#1a8885]/40 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white cursor-pointer relative"
          >
            {/* Online Indicator Badge */}
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#c6ae4c] border-2 border-white flex items-center justify-center text-[9px] font-bold text-zinc-950">
              {phones.length || 3}
            </span>

            {open ? (
              <X className="w-6 h-6 stroke-[2.2]" />
            ) : (
              <ModernWhatsAppIcon size={28} className="text-white" />
            )}
          </button>

          {/* Floating Tooltip Pill */}
          {!open && (
            <div className="absolute left-16 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/95 text-white text-xs font-semibold whitespace-nowrap shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-left-2 duration-150 pointer-events-none">
              <ModernWhatsAppIcon size={14} className="text-emerald-400" />
              <span>محادثة واتساب سريعة</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
