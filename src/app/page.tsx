import React from "react";
import { HeroSection } from "@/components/HeroSection";
import { StatsCounterSection } from "@/components/StatsCounterSection";
import { BentoServices } from "@/components/BentoServices";
import { UmrahPackages } from "@/components/UmrahPackages";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { ReviewsSection } from "@/components/ReviewsSection";
import { QuickContactBanner } from "@/components/QuickContactBanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsCounterSection />
      <BentoServices />
      <UmrahPackages />
      <WhyChooseUs />
      <ReviewsSection />
      <QuickContactBanner />
    </>
  );
}
