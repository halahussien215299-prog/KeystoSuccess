"use client";

import React from "react";
import { Star, Quote } from "lucide-react";
import { useSiteContent } from "@/context/ContentContext";
import { ScrollReveal } from "@/components/ScrollReveal";

export function ReviewsSection() {
  const { content } = useSiteContent();
  const testimonials = content?.testimonials || [];

  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-white border-t border-zinc-200 relative overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="text-center max-w-2xl mx-auto mb-8 sm:mb-16 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>آراء وتجارب عملائنا</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0d233a] tracking-tight">
            ماذا يقول عملاؤنا عن <span className="text-[#eab308]">خدماتنا؟</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            فخورون بثقة عملائنا وشراكاتنا المستمرة في مختلف القطاعات والخدمات
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-right">
          {testimonials.map((t, idx) => (
            <ScrollReveal
              key={t.id}
              delay={idx * 100}
              direction="up"
            >
              <div className="p-5 sm:p-6 rounded-2xl bg-[#f8fafc] border border-zinc-200 hover:border-amber-400/80 shadow-xs hover:shadow-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 group h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <Quote className="w-5 h-5 text-zinc-400 group-hover:text-amber-500 transition-colors" />
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed mb-6 font-normal">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-200">
                  <div className="font-bold text-[#0d233a] text-sm">{t.name}</div>
                  <div className="text-xs text-amber-700 font-semibold mt-0.5">{t.role}</div>
                  <div className="text-[11px] text-zinc-500 mt-1">{t.department}</div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
