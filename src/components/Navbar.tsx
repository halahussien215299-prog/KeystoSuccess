"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Mail,
  Menu,
  X,
  ChevronLeft,
  CalendarCheck
} from "lucide-react";
import { ModernWhatsAppIcon, ModernPhoneIcon } from "@/components/Icons";
import { useSiteContent } from "@/context/ContentContext";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/cleaning", label: "النظافة والخدمات" },
  { href: "/marketing", label: "الدعاية والتسويق" },
  { href: "/travel", label: "السفر والسياحة" },
  { href: "/contracting", label: "المقاولات العامة" },
  { href: "/trade", label: "التجارة واللوجستيات" },
  { href: "/contact", label: "تواصل معنا" }
];

export function Navbar() {
  const { content } = useSiteContent();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const company = content?.company;
  const logoUrl = company?.logoUrl || "/logo.png";
  const logoSize = company?.logoSize || 64;
  const phones = company?.phones || [
    { label: "خدمة العملاء", number: "0918536828", display: "0918536828", waLink: "249918536828" },
    { label: "المبيعات والحجوزات", number: "0110061201", display: "0110061201", waLink: "249110061201" },
    { label: "الإدارة والمتابعة", number: "0110061223", display: "0110061223", waLink: "249110061223" }
  ];
  const mainWa = company?.primaryWhatsApp || phones[0]?.waLink || "249918536828";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openBookingModal = () => {
    window.dispatchEvent(new CustomEvent("open-booking-modal"));
  };

  return (
    <header className="sticky top-0 z-50 w-full" dir="rtl">
      {/* Top Utility Bar with sleek modern pills */}
      <div className="bg-[#091b2c] border-b border-[#132f4c] text-xs py-1.5 px-4 hidden md:block text-[#eab308]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Right in RTL: Phone Number Pills in Gold */}
          <div className="flex items-center gap-2.5">
            {phones.map((phone) => (
              <a
                key={phone.number}
                href={`tel:${phone.number}`}
                className="px-2.5 py-1 rounded-full bg-[#0d233a] hover:bg-[#132f4c] border border-[#1e3a5f] hover:border-amber-400 text-xs font-mono font-semibold text-[#eab308] flex items-center gap-1.5 transition-all duration-200 shadow-2xs"
                title={phone.label}
              >
                <span>{phone.display}</span>
                <ModernPhoneIcon size={12} className="text-[#c6ae4c]" />
              </a>
            ))}
          </div>

          {/* Left in RTL: Email & WhatsApp Pill Actions */}
          <div className="flex items-center gap-3">
            <a
              href={`mailto:${company?.email || "mafteeh26@gmail.com"}`}
              className="flex items-center gap-1.5 text-zinc-300 hover:text-amber-300 transition-colors font-medium text-xs"
            >
              <Mail className="w-3.5 h-3.5 stroke-[2] text-[#c6ae4c]" />
              <span>{company?.email || "mafteeh26@gmail.com"}</span>
            </a>
            <div className="w-px h-3 bg-[#1e3a5f]" />
            <a
              href={`https://wa.me/${mainWa}?text=${encodeURIComponent("مرحباً شركة مفاتيح النجاح المحدودة 🔑، أرغب في الاستفسار والحجز.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-full bg-[#1a8885]/20 hover:bg-[#1a8885]/35 border border-[#1a8885]/50 text-emerald-300 hover:text-emerald-200 transition-all font-semibold text-xs flex items-center gap-1.5"
            >
              <ModernWhatsAppIcon size={14} className="text-emerald-400" />
              <span>احجز عبر واتساب</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar (Modern Frosted Glass Navy #0d233a) */}
      <nav
        className={`bg-[#0d233a]/95 backdrop-blur-xl border-b border-[#132f4c] transition-all duration-300 ${
          scrolled ? "py-2.5 shadow-2xl shadow-black/35" : "py-3.5 shadow-lg shadow-black/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo (Right side in RTL) - Dynamic Logo Size & Source */}
          <Link
            href="/"
            className="flex items-center group focus:outline-none"
            aria-label="الرئيسية - شركة مفاتيح النجاح المحدودة"
          >
            <div
              style={{
                width: `${logoSize}px`,
                height: `${logoSize}px`
              }}
              className="relative rounded-full overflow-hidden shrink-0 shadow-xl shadow-black/50 ring-2 ring-[#c6ae4c]/40 group-hover:ring-[#c6ae4c] group-hover:scale-105 group-hover:shadow-amber-500/25 transition-all duration-300"
            >
              <Image
                src={logoUrl}
                alt="شعار شركة مفاتيح النجاح المحدودة"
                fill
                priority
                sizes="(max-width: 768px) 60px, 100px"
                className="object-cover scale-110"
              />
            </div>
          </Link>

          {/* Desktop Nav Links (Center / Left in RTL) - Exact reference colors */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#283953] text-[#c6ae4c] border border-[#3b5377] shadow-xs"
                      : "text-zinc-200 hover:text-[#c6ae4c] hover:bg-[#112a45]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Quick CTA Button (Left in RTL) */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={openBookingModal}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 shadow-md shadow-amber-500/25 active:scale-95 transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
            >
              <CalendarCheck className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>طلب حجز</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-[#091b2c] border border-[#132f4c] text-[#eab308] hover:text-white transition-colors"
              aria-label="القائمة الرئيسية"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="lg:hidden bg-[#091b2c] border-b border-[#132f4c] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all ${
                      isActive
                        ? "bg-[#0d233a] text-[#eab308] font-bold border border-[#1e3a5f]"
                        : "text-zinc-200 hover:text-[#eab308] hover:bg-[#0d233a]"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronLeft className="w-4 h-4 text-zinc-500" />
                  </Link>
                );
              })}
            </div>

            {/* Mobile Contact Quick Actions */}
            <div className="pt-3 border-t border-[#132f4c] space-y-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  openBookingModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#eab308] text-[#0d233a] font-bold text-xs shadow-md transition-colors"
              >
                <CalendarCheck className="w-4 h-4 stroke-[2]" />
                <span>نموذج حجز خدمة</span>
              </button>
              <a
                href={`https://wa.me/${mainWa}?text=${encodeURIComponent("مرحباً شركة مفاتيح النجاح المحدودة 🔑، أود الاستفسار والحجز.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1a8885] hover:bg-[#157774] text-white font-bold text-xs shadow-md transition-colors"
              >
                <ModernWhatsAppIcon size={16} className="text-white" />
                <span>احجز عبر واتساب مباشرة</span>
              </a>
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {phones.map((p) => (
                  <a
                    key={p.number}
                    href={`tel:${p.number}`}
                    className="py-2 px-1 text-center bg-[#0d233a] border border-[#1e3a5f] rounded-lg text-[11px] font-mono text-[#eab308] font-semibold"
                  >
                    {p.display}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
