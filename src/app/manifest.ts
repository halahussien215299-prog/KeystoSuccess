import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "شركة مفاتيح النجاح المحدودة",
    short_name: "مفاتيح النجاح",
    description:
      "شركة رائدة متعددة الخدمات تقدم حلولاً متكاملة في مجالات النظافة، الدعاية والتسويق، السفر والسياحة والعمرة، المقاولات العامة، والتجارة والخدمات اللوجستية.",
    start_url: "/",
    display: "standalone",
    background_color: "#081626",
    theme_color: "#0d233a",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
