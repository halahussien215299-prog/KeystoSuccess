"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

/**
 * High-performance, zero-latency wrapper.
 * Ensures all sections are immediately visible (no opacity-0 flash or layout blankness).
 */
export function ScrollReveal({
  children,
  className = ""
}: Props) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

