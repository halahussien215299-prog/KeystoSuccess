import { COMPANY_INFO, DEPARTMENTS, TESTIMONIALS } from "./data";

export interface SiteContent {
  company: typeof COMPANY_INFO & {
    logoUrl?: string;
    logoSize?: number;
  };
  departments: typeof DEPARTMENTS;
  testimonials: typeof TESTIMONIALS;
  hero: {
    badge: string;
    titlePrimary: string;
    titleHighlight: string;
    titleSuffix: string;
    description: string;
    backgroundImages?: string[];
    slideInterval?: number;
  };
}

export function getInitialContent(): SiteContent {
  return {
    company: COMPANY_INFO,
    departments: DEPARTMENTS,
    testimonials: TESTIMONIALS,
    hero: {
      badge: "شركة مفاتيح النجاح المحدودة • شريكك نحو التميز",
      titlePrimary: "مفتاحك نحو",
      titleHighlight: "النجاح",
      titleSuffix: "والتميز",
      description: "شركة رائدة متعددة الخدمات نقدم حلولاً متكاملة بأعلى معايير الجودة والموثوقية في مجالات النظافة، الدعاية والتسويق، السفر والسياحة والعمرة، المقاولات العامة، والتجارة واللوجستيات.",
      backgroundImages: [
        "/images/hero-banner.jpg",
        "/images/travel.jpg",
        "/images/contracting.jpg",
        "/images/cleaning.jpg",
        "/images/trade.jpg"
      ],
      slideInterval: 5
    }
  };
}
