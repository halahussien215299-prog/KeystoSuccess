"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Droplets,
  Megaphone,
  Plane,
  HardHat,
  Truck,
  ArrowLeft
} from "lucide-react";
import { useSiteContent } from "@/context/ContentContext";
import { ScrollReveal } from "@/components/ScrollReveal";

const iconMap: Record<string, React.ReactNode> = {
  Droplets: <Droplets className="w-5 h-5 text-[#eab308] stroke-[1.75]" />,
  Megaphone: <Megaphone className="w-5 h-5 text-[#eab308] stroke-[1.75]" />,
  Plane: <Plane className="w-5 h-5 text-[#eab308] stroke-[1.75]" />,
  HardHat: <HardHat className="w-5 h-5 text-[#eab308] stroke-[1.75]" />,
  Truck: <Truck className="w-5 h-5 text-[#eab308] stroke-[1.75]" />
};

export function BentoServices() {
  const { content } = useSiteContent();
  const departments = content?.departments || [];

  return (
    <section className="py-12 sm:py-20 lg:py-28 bg-white border-t border-zinc-200 relative overflow-hidden" id="services" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header matching screenshot 2 */}
        <ScrollReveal direction="up" className="text-center max-w-2xl mx-auto mb-8 sm:mb-16 space-y-2">
          <span className="text-xs sm:text-sm font-bold text-[#eab308] tracking-wider uppercase block">
            خدماتنا
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#0d233a] tracking-tight">
            أقسام الشركة
          </h2>
          <p className="text-xs sm:text-base text-zinc-500 leading-relaxed font-normal">
            نقدم مجموعة متنوعة من الخدمات المتكاملة لتلبية جميع احتياجاتكم
          </p>
        </ScrollReveal>

        {/* 3-Column Service Cards Grid matching screenshot 2 with ScrollReveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {departments.map((dept, idx) => (
            <ScrollReveal
              key={dept.id}
              delay={idx * 120}
              direction="up"
            >
              <Link
                href={`/${dept.id}`}
                className="group flex flex-col h-full bg-white rounded-2xl border border-zinc-200/90 overflow-hidden shadow-xs hover:shadow-2xl hover:border-amber-400/80 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              >
                {/* Card Image Banner with Category Badge */}
                <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-zinc-100">
                  <Image
                    src={dept.image}
                    alt={dept.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:from-black/60 transition-colors" />

                  {/* Category Badge Icon in top corner */}
                  <div className="absolute top-3.5 right-3.5 w-10 h-10 rounded-xl bg-[#0d233a]/90 backdrop-blur-md border border-[#1e3a5f] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {iconMap[dept.iconName] || <HardHat className="w-5 h-5 text-[#eab308]" />}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between text-right space-y-3">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#0d233a] group-hover:text-amber-600 transition-colors mb-2">
                      {dept.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed line-clamp-2">
                      {dept.shortDesc}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-600 group-hover:text-amber-700 transition-colors">
                    <span>اعرف المزيد</span>
                    <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1.5" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
