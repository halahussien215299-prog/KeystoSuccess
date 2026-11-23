"use client";

import React, { useEffect, useRef, useState } from "react";
import { Award, Users, Layers, ShieldCheck, TrendingUp, Sparkles } from "lucide-react";
import { useSiteContent } from "@/context/ContentContext";

interface StatItem {
  value: string;
  label: string;
  sublabel: string;
}

const statIcons = [
  <Award key="award" className="w-4 h-4 text-[#d6b124] stroke-[2]" />,
  <Users key="users" className="w-4 h-4 text-[#d6b124] stroke-[2]" />,
  <Layers key="layers" className="w-4 h-4 text-[#d6b124] stroke-[2]" />,
  <ShieldCheck key="shield" className="w-4 h-4 text-[#d6b124] stroke-[2]" />
];

function AnimatedStatCell({
  stat,
  index,
  inView
}: {
  stat: StatItem;
  index: number;
  inView: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(stat.value);
  const isFirst = index === 0;

  useEffect(() => {
    if (!inView) return;

    const rawVal = stat.value.trim();
    const isPercent = rawVal.includes("%");
    const isPlus = rawVal.includes("+");
    const numericStr = rawVal.replace(/[^\d.]/g, "");
    const targetNumber = parseFloat(numericStr) || 0;
    const isDecimal = numericStr.includes(".");

    let startTime: number | null = null;
    const duration = 1000;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      const easeOut = 1 - Math.pow(1 - progress, 4);
      const current = targetNumber * easeOut;

      let formatted = isDecimal
        ? current.toFixed(1)
        : Math.floor(current).toLocaleString("en-US");

      if (isPlus) formatted += "+";
      if (isPercent) formatted += "%";

      setDisplayValue(formatted);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(rawVal);
      }
    };

    const rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [inView, stat.value]);

  return (
    <div
      className={`relative p-3.5 sm:p-7 rounded-2xl flex flex-col justify-between items-center text-center select-none transition-all duration-300 group ${
        isFirst
          ? "bg-gradient-to-b from-[#d6b124]/10 via-white to-white"
          : "hover:bg-zinc-50/70"
      }`}
    >
      {/* Top Micro-Badge with Icon */}
      <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#d6b124]/10 border border-[#d6b124]/30 flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110">
          {statIcons[index % statIcons.length]}
        </div>
        {isFirst && (
          <span className="px-2 py-0.5 rounded-full bg-[#d6b124]/15 border border-[#d6b124]/35 text-[9px] sm:text-[10px] font-bold text-[#b59218] tracking-wide">
            إنجاز معتمد
          </span>
        )}
      </div>

      {/* Main Animated Number */}
      <div
        className={`font-mono text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-1 sm:mb-2 transition-transform duration-300 group-hover:scale-105 ${
          isFirst ? "text-[#d6b124]" : "text-[#0d233a]"
        }`}
      >
        {displayValue}
      </div>

      {/* Label and Sublabel */}
      <div className="space-y-0.5">
        <h4 className="text-xs sm:text-sm font-bold text-zinc-900 group-hover:text-[#b59218] transition-colors">
          {stat.label}
        </h4>
        <p className="text-[10px] sm:text-xs text-zinc-500 font-normal line-clamp-1 sm:line-clamp-none">
          {stat.sublabel}
        </p>
      </div>

      {/* Bottom glowing accent bar on hover */}
      <div
        className={`absolute bottom-0 inset-x-8 h-0.5 rounded-full transition-all duration-300 ${
          isFirst
            ? "bg-[#d6b124]"
            : "bg-transparent group-hover:bg-[#d6b124]/60 group-hover:inset-x-6"
        }`}
      />
    </div>
  );
}

export function StatsCounterSection() {
  const { content } = useSiteContent();
  const stats: StatItem[] = content?.company?.stats || [
    { value: "1,200+", label: "مشروع منجز بنجاح", sublabel: "في كافة القطاعات" },
    { value: "500+", label: "عميل يثق بخدماتنا", sublabel: "أفراد وشركات" },
    { value: "5", label: "أقسام رئيسية متكاملة", sublabel: "خدمات شاملة تحت سقف واحد" },
    { value: "99.4%", label: "نسبة رضا العملاء", sublabel: "التزام بالجودة والدقة" }
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-20 -mt-6 sm:-mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      dir="rtl"
    >
      {/* Modern Island Bar with subtle gradient rim */}
      <div className="p-[1.5px] rounded-3xl bg-gradient-to-r from-[#d6b124]/40 via-[#d6b124]/20 to-[#d6b124]/40 shadow-xl shadow-zinc-900/10">
        <div className="bg-white/98 backdrop-blur-2xl rounded-[22px] grid grid-cols-2 lg:grid-cols-4 divide-y-0 sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-zinc-100 p-2 sm:p-2.5 gap-2 sm:gap-0">
          {stats.map((stat, idx) => (
            <AnimatedStatCell
              key={idx}
              stat={stat}
              index={idx}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
