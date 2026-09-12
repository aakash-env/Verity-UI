"use client";

import { useState, useEffect } from "react";

export type LogoVariant = "nova" | "swift" | "prism" | "ibex";

interface BrandLogoProps {
  className?: string;
  size?: number;
  initialVariant?: LogoVariant;
  interactive?: boolean;
}

const VARIANTS: { id: LogoVariant; name: string }[] = [
  { id: "nova", name: "Verity Nova (Astroid Star)" },
  { id: "swift", name: "Origami Swift" },
  { id: "prism", name: "Verity Prism" },
  { id: "ibex", name: "Geometric Ibex" },
];

export function BrandLogo({
  className = "",
  size = 22,
  initialVariant = "nova",
  interactive = true,
}: BrandLogoProps) {
  const [variant, setVariant] = useState<LogoVariant>(initialVariant);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("verity_brand_logo_variant") as LogoVariant;
      if (saved && VARIANTS.some((v) => v.id === saved)) {
        queueMicrotask(() => {
          setVariant(saved);
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const cycleVariant = (e: React.MouseEvent) => {
    if (!interactive) return;
    e.preventDefault();
    e.stopPropagation();

    const currentIndex = VARIANTS.findIndex((v) => v.id === variant);
    const nextIndex = (currentIndex + 1) % VARIANTS.length;
    const nextVariant = VARIANTS[nextIndex].id;
    setVariant(nextVariant);

    try {
      localStorage.setItem("verity_brand_logo_variant", nextVariant);
    } catch {
      // ignore
    }
  };

  const currentName = VARIANTS.find((v) => v.id === variant)?.name || "Verity";

  return (
    <span
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? cycleVariant : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                cycleVariant(e as unknown as React.MouseEvent);
              }
            }
          : undefined
      }
      className={`relative inline-flex items-center justify-center p-0.5 rounded-lg text-[var(--color-text)] select-none ${
        interactive
          ? "transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          : ""
      } ${className}`}
      title={interactive ? `${currentName} • Click to cycle logo design` : currentName}
      aria-label={`${currentName} logo`}
    >
      {variant === "nova" && <NovaLogo size={size} />}
      {variant === "swift" && <SwiftLogo size={size} />}
      {variant === "prism" && <PrismLogo size={size} />}
      {variant === "ibex" && <IbexLogo size={size} />}
    </span>
  );
}

/**
 * Variant 1: Verity Nova (4-point chiseled astroid star)
 * Features 4 concave geometric quadrants with high-contrast directional lighting
 * and an optical center aperture dot.
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

/**
 * Variant 2: Origami Swift (Minimalist folded bird in flight)
 * Clean Japanese paper-fold geometry with dynamic diagonal thrust.
 */
export function SwiftLogo({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 hover:translate-x-0.5 hover:-translate-y-0.5"
      aria-hidden="true"
    >
      {/* Upper High Wing */}
      <path
        d="M13 11L10 2L16.5 10Z"
        fill="currentColor"
        fillOpacity="1"
      />
      {/* Head / Beak */}
      <path
        d="M13 11L22 5.5L16.5 10Z"
        fill="currentColor"
        fillOpacity="0.9"
      />
      {/* Keel / Torso */}
      <path
        d="M13 11L9 13.5L6.5 15.5L11.5 12Z"
        fill="currentColor"
        fillOpacity="0.75"
      />
      {/* Lower Swept Wing */}
      <path
        d="M11.5 12L6 21.5L9 13.5Z"
        fill="currentColor"
        fillOpacity="0.55"
      />
      {/* Tail Feathers */}
      <path
        d="M6.5 15.5L2.5 18L9 13.5Z"
        fill="currentColor"
        fillOpacity="0.4"
      />
    </svg>
  );
}

/**
 * Variant 3: Verity Prism (Impossible Hex-Prism / Geometric Monogram)
 * An isometric crystal prism with central optical negative space.
 */
export function PrismLogo({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 hover:rotate-12"
      aria-hidden="true"
    >
      {/* Top Face */}
      <path
        d="M12 2.5L20 7L12 11.5L4 7Z"
        fill="currentColor"
        fillOpacity="0.85"
      />
      {/* Left Face */}
      <path
        d="M4 7L12 11.5L12 21L4 16.5Z"
        fill="currentColor"
        fillOpacity="1"
      />
      {/* Right Face */}
      <path
        d="M20 7L12 11.5L12 21L20 16.5Z"
        fill="currentColor"
        fillOpacity="0.55"
      />
      {/* Inner Central Prism Core */}
      <path
        d="M12 7.5L15.5 9.5L12 14.5L8.5 9.5Z"
        fill="var(--color-bg, #101114)"
      />
      <circle cx="12" cy="10.8" r="1.1" fill="currentColor" fillOpacity="0.9" />
    </svg>
  );
}

/**
 * Variant 4: Geometric Ibex (Minimalist Luxury Horned Mascot)
 * Polished luxury mascot mark replacing the low-res pixelated goat.
 */
export function IbexLogo({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 hover:-translate-y-0.5"
      aria-hidden="true"
    >
      {/* Left Horn */}
      <path
        d="M11 8.5C10.5 4.5 6.5 2.5 3.5 3.5C5 5.5 8 7 10 9.5Z"
        fill="currentColor"
        fillOpacity="1"
      />
      {/* Right Horn */}
      <path
        d="M13 8.5C13.5 4.5 17.5 2.5 20.5 3.5C19 5.5 16 7 14 9.5Z"
        fill="currentColor"
        fillOpacity="0.75"
      />
      {/* Left Ear */}
      <path
        d="M9 10L4 11.2L8.5 12.8Z"
        fill="currentColor"
        fillOpacity="0.6"
      />
      {/* Right Ear */}
      <path
        d="M15 10L20 11.2L15.5 12.8Z"
        fill="currentColor"
        fillOpacity="0.5"
      />
      {/* Head Shield / Muzzle */}
      <path
        d="M9.5 9.5H14.5L13.2 18L12 21L10.8 18Z"
        fill="currentColor"
        fillOpacity="0.88"
      />
      {/* Forehead Diamond Accent */}
      <path
        d="M12 7.8L13.8 9.6L12 11.4L10.2 9.6Z"
        fill="currentColor"
        fillOpacity="1"
      />
    </svg>
  );
}
