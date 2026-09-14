"use client";

import { useEffect } from "react";

interface BrandLogoProps {
  className?: string;
  size?: number;
  interactive?: boolean;
}

export function BrandLogo({
  className = "",
  size = 22,
  interactive = true,
}: BrandLogoProps) {
  // Clean up any stale variant preference from previous versions
  useEffect(() => {
    try {
      localStorage.removeItem("verity_brand_logo_variant");
    } catch {
      // ignore
    }
  }, []);

  return (
    <span
      className={`relative inline-flex items-center justify-center p-0.5 rounded-lg text-[var(--color-text)] select-none ${interactive
        ? "transition-transform duration-300 hover:scale-105 active:scale-95"
        : ""
        } ${className}`}
      title="Verity"
      aria-label="Verity logo"
    >
      <NovaLogo size={size} />
    </span>
  );
}

/**
 * Verity Nova (4-point chiseled astroid star)
 * Features 4 concave geometric facets with high-contrast directional lighting,
 * precision center aperture dot, and smooth 45-degree hover rotation.
 */
export function NovaLogo({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-500 hover:rotate-45"
      aria-hidden="true"
    >
      {/* North-East Facet (Direct Light) */}
      <path
        d="M12 12L12 2C12 7.52 16.48 12 22 12L12 12Z"
        fill="currentColor"
        fillOpacity="1"
      />
      {/* North-West Facet (Ambient Light) */}
      <path
        d="M12 12L2 12C7.52 12 12 7.52 12 2L12 12Z"
        fill="currentColor"
        fillOpacity="0.75"
      />
      {/* South-West Facet (Deep Shadow) */}
      <path
        d="M12 12L12 22C12 16.48 7.52 12 2 12L12 12Z"
        fill="currentColor"
        fillOpacity="0.38"
      />
      {/* South-East Facet (Mid Shadow) */}
      <path
        d="M12 12L22 12C16.48 12 12 16.48 12 22L12 12Z"
        fill="currentColor"
        fillOpacity="0.55"
      />
      {/* Precision Core Cutout & Floating Pip */}
      <circle cx="12" cy="12" r="1.6" fill="var(--color-bg, #101114)" />
      <circle cx="12" cy="12" r="0.75" fill="currentColor" />
    </svg>
  );
}
