"use client";

import React from "react";
import Image from "next/image";

interface Props {
  className?: string;
  size?: number;
  opacity?: number;
  rotate?: number;
  position?: "center" | "top-right" | "top-left" | "bottom-right" | "bottom-left";
  pattern?: boolean;
}

export function LogoWatermark({
  className = "",
  size = 420,
  opacity = 0.05,
  rotate = -12,
  position = "center",
  pattern = false
}: Props) {
  if (pattern) {
    return (
      <div
        className={`absolute inset-0 pointer-events-none select-none z-0 overflow-hidden ${className}`}
        style={{
          backgroundImage: "url('/logo.png')",
          backgroundSize: "140px 140px",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
          opacity: opacity,
          maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 80%)"
        }}
        aria-hidden="true"
      />
    );
  }

  const getPositionClass = () => {
    switch (position) {
      case "top-right":
        return "-top-20 -right-20";
      case "top-left":
        return "-top-20 -left-20";
      case "bottom-right":
        return "-bottom-20 -right-20";
      case "bottom-left":
        return "-bottom-20 -left-20";
      default:
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
    }
  };

  return (
    <div
      className={`absolute pointer-events-none select-none z-0 ${getPositionClass()} ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        opacity: opacity,
        transform: `rotate(${rotate}deg)`,
      }}
      aria-hidden="true"
    >
      <div className="relative w-full h-full">
        <Image
          src="/logo.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}
