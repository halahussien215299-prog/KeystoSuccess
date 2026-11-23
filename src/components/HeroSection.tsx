"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react";
import { useSiteContent } from "@/context/ContentContext";
import { ModernWhatsAppIcon, ModernPhoneIcon } from "@/components/Icons";

export function HeroSection() {
  const { content } = useSiteContent();
  const company = content?.company;
  const hero = content?.hero;

  const mainPhone = company?.primaryPhone || company?.phones?.[0]?.number || "0918536828";
  const mainWa = company?.primaryWhatsApp || company?.phones?.[0]?.waLink || "249918536828";
  const logoUrl = company?.logoUrl || "/logo.png";

  // Support multiple background images with smooth slideshow
  const backgroundImages: string[] =
    hero?.backgroundImages && hero.backgroundImages.length > 0
      ? hero.backgroundImages.map(img => img.endsWith(".png") ? img.replace(".png", ".jpg") : img)
      : [
        "/images/hero-banner.jpg",
        "/images/travel.jpg",
        "/images/contracting.jpg",
        "/images/cleaning.jpg",
        "/images/marketing.jpg",
        "/images/trade.jpg"
      ];

  const slideInterval = (hero?.slideInterval || 5) * 1000;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (backgroundImages.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, slideInterval);

    return () => clearInterval(timer);
  }, [backgroundImages.length, isPaused, slideInterval]);

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + backgroundImages.length) % backgroundImages.length);
  };

  return (
    <section
      className="relative min-h-0 sm:min-h-[85vh] lg:min-h-[88vh] flex items-center justify-center overflow-hidden bg-[#071524] text-white"
      dir="rtl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slideshow: Supports Multiple Images with Smooth Crossfade */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {backgroundImages.map((imgSrc, idx) => {
          // Render current slide, next slide, and first slide to save memory and network bandwidth
          const isNeeded =
            idx === currentSlide ||
            idx === (currentSlide + 1) % backgroundImages.length ||
            idx === 0;
          if (!isNeeded) return null;

          return (
            <div
              key={imgSrc + idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? "opacity-50" : "opacity-0 pointer-events-none"
                }`}
            >
              <Image
                src={imgSrc}
                alt={`خلفية مفاتيح النجاح ${idx + 1}`}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover object-center scale-105 transition-transform duration-7000 ease-out"
              />
            </div>
          );
        })}

        {/* High-Contrast Directional Navy Gradient Overlays: Deep velvety navy behind text on right, image shines on left */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#071524]/95 via-[#071524]/80 to-[#071524]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071524] via-transparent to-[#071524]/60" />

        {/* Ambient Subtle Glows for depth */}
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#c6ae4c]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14 sm:py-20 lg:py-24 w-full">
        <div className="max-w-3xl space-y-5 sm:space-y-6 text-right animate-in fade-in duration-500">
          {/* Top Pill Badge with Vibrant Metallic Gold */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0a1c30]/95 border border-[#c6ae4c]/60 shadow-xl shadow-black/40 backdrop-blur-md transition-all duration-300 hover:border-[#f5c344]">
            <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 ring-1 ring-[#f5c344]/80">
              <Image
                src={logoUrl}
                alt="شعار"
                fill
                sizes="20px"
                className="object-contain"
              />
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#f5c344] tracking-wide drop-shadow-sm">
              {hero?.badge || "شركة مفاتيح النجاح المحدودة • شريكك نحو التميز"}
            </span>
          </div>

          {/* Main Headline with High-Contrast Vivid Gold and Pure White */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.25] text-white">
            <span className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">مفتاحك نحو </span>
            <span className="bg-gradient-to-r from-[#ffe082] via-[#f5c344] to-[#df9d1d] bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(245,195,68,0.4)]">
              {hero?.titleHighlight || "النجاح"}
            </span>
            <br className="hidden sm:inline" />
            <span className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"> والتميز</span>
          </h1>

          {/* Subtitle with High Legibility Crisp White */}
          <p className="text-sm sm:text-lg lg:text-xl text-zinc-100 font-medium leading-relaxed max-w-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {hero?.description ||
              "شركة رائدة متعددة الخدمات نقدم حلولاً متكاملة في مجالات النظافة، الدعاية والتسويق، السفر والسياحة، المقاولات العامة، والتجارة والخدمات اللوجستية."}
          </p>

          {/* 3 CTA Buttons with High-Contrast Vibrancy */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3.5 pt-2">
            {/* 1. WhatsApp Button: Vivid Emerald/Teal (#0d9488) */}
            <a
              href={`https://wa.me/${mainWa}?text=${encodeURIComponent("مرحباً شركة مفاتيح النجاح المحدودة 🔑، أود الاستفسار عن الخدمات وطلب الحجز.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 sm:px-6 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-[#0d9488] hover:bg-[#0f766e] text-white shadow-xl shadow-[#0d9488]/35 border border-[#2dd4bf]/40 flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <ModernWhatsAppIcon size={18} className="text-white" />
              <span>احجز عبر واتساب</span>
            </a>

            {/* 2. Direct Call Button: Royal Navy (#1e3a5f) with Crisp Border & Gold Icon */}
            <a
              href={`tel:${mainPhone}`}
              className="px-4 py-3 sm:px-6 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-[#1e3a5f] hover:bg-[#284973] text-white border border-[#4a72a5] shadow-xl shadow-black/35 flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <ModernPhoneIcon size={16} className="text-[#f5c344]" />
              <span className="text-white font-bold">اتصل الآن</span>
            </a>

            {/* 3. Contact Us Button: Radiant Gold with Dark Text */}
            <Link
              href="/contact"
              className="col-span-2 sm:col-span-1 px-4 py-3 sm:px-6 sm:py-3.5 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-[#f5c344] to-[#df9d1d] hover:from-[#fcd34d] hover:to-[#e0a224] text-[#071524] shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <span>تواصل معنا</span>
              <ArrowLeft className="w-4 h-4 stroke-[2.4]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Multiple Background Image Slide Controls & Indicators (When multiple images exist) */}
      {backgroundImages.length > 1 && (
        <div className="absolute bottom-5 left-6 sm:left-10 z-20 flex items-center gap-2 bg-[#091b2c]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
          <button
            onClick={goToPrevSlide}
            aria-label="الصورة السابقة"
            className="text-zinc-400 hover:text-white transition-colors p-1"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-1.5">
            {backgroundImages.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentSlide(dotIdx)}
                aria-label={`خلفية رقم ${dotIdx + 1}`}
                className={`transition-all duration-300 rounded-full ${dotIdx === currentSlide
                  ? "w-5 h-1.5 bg-[#f5c344] shadow-sm shadow-[#f5c344]/50"
                  : "w-1.5 h-1.5 bg-white/40 hover:bg-white/80"
                  }`}
              />
            ))}
          </div>
          <button
            onClick={goToNextSlide}
            aria-label="الصورة التالية"
            className="text-zinc-400 hover:text-white transition-colors p-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </section>
  );
}
