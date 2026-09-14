"use client";

import React, { useState } from "react";
import { motion } from "motion/react";

interface Option {
  id: string;
  label: string;
}

const DEFAULT_OPTIONS: Option[] = [
  { id: "all", label: "All" },
  { id: "prod", label: "Production" },
  { id: "stage", label: "Staging" },
  { id: "dev", label: "Preview" },
];

export function MagneticSelect() {
  const [selected, setSelected] = useState("prod");
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      className="flex flex-col items-center justify-center gap-3.5 select-none cursor-default"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="magnetic-select-container"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "5px",
          borderRadius: "9999px",
          userSelect: "none",
          position: "relative",
        }}
        onMouseLeave={() => setHovered(null)}
      >
      {DEFAULT_OPTIONS.map((opt) => {
        const isSelected = selected === opt.id;
        const isHovered = hovered === opt.id;

        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setSelected(opt.id)}
            onMouseEnter={() => setHovered(opt.id)}
            className={`magnetic-select-btn ${isSelected ? "is-selected" : ""}`}
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
              padding: "8px 16px",
              borderRadius: "9999px",
              fontSize: "13px",
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              cursor: "pointer",
              border: "none",
              outline: "none",
              background: "transparent",
              transition: "color 150ms ease",
              zIndex: 1,
            }}
          >
            {/* Active Pill Background */}
            {isSelected && (
              <motion.div
                layoutId="magnetic-active-pill"
                className="magnetic-select-active-pill"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "9999px",
                  zIndex: -1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 32,
                }}
              />
            )}

            {/* Hover Indicator Glow */}
            {isHovered && !isSelected && (
              <motion.div
                layoutId="magnetic-hover-pill"
                className="magnetic-select-hover-pill"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "9999px",
                  zIndex: -1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 480,
                  damping: 36,
                }}
              />
            )}

            <span
              style={{
                position: "relative",
                zIndex: 2,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {isSelected && <span className="magnetic-select-dot" />}
              {opt.label}
            </span>
          </button>
        );
      })}
      </div>
      <span className="text-[11px] text-[#72747d] tracking-wide font-normal">
        Spring snap with magnetic indicator
      </span>
    </div>
  );
}

