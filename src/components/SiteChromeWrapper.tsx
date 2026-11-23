"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { InteractiveBookingModal } from "@/components/InteractiveBookingModal";
import { FloatingWhatsAppSpeedDial } from "@/components/FloatingWhatsAppSpeedDial";
import { MobileBottomBar } from "@/components/MobileBottomBar";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";

export function SiteChromeWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // Admin routes are completely isolated from public site navigation and floating buttons
  if (isAdmin) {
    return (
      <div className="min-h-screen flex flex-col w-full bg-[#f8fafc]">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col pb-16 md:pb-0 relative">
      {/* Luxury Scroll Progress Bar */}
      <ScrollProgressBar />

      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <InteractiveBookingModal />
      <FloatingWhatsAppSpeedDial />
      <MobileBottomBar />
    </div>
  );
}
