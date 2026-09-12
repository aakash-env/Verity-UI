"use client";

import { useState } from "react";

const PALETTES = [
  ["#f7d6e6", "#d8b4f8", "#818cf8", "#334155"],
  ["#ff7b72", "#f97316", "#fbbf24", "#3b82f6"],
  ["#047857", "#10b981", "#34d399", "#a7f3d0"],
  ["#ec4899", "#8b5cf6", "#3b82f6", "#06b6d4"],
  ["#0f172a", "#334155", "#64748b", "#94a3b8"],
  ["#451a03", "#b45309", "#f59e0b", "#fde68a"],
  ["#1e1b4b", "#4338ca", "#6366f1", "#a5b4fc"],
  ["#312e81", "#7c3aed", "#c084fc", "#f5d0fe"],
];

export function ColorSwatches() {
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);

  const colors = PALETTES[paletteIndex];

  const handleShuffle = () => {
    setRotation((r) => r + 360);
    setPaletteIndex((prev) => (prev + 1) % PALETTES.length);
  };

  const handleCopy = (color: string, index: number) => {
    try {
      navigator.clipboard.writeText(color);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className="flex items-center gap-3 select-none pointer-events-auto cursor-default"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Left Pod: 4 Color Swatches */}
      <div
        className="p-2 rounded-[20px] bg-[#1f2024] border border-white/6 flex items-center gap-2"
        style={{
          boxShadow: "0 8px 32px -8px rgba(0, 0, 0, 0.4)",
        }}
      >
        {colors.map((color, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleCopy(color, i)}
            title={`Click to copy ${color}`}
            aria-label={`Color ${color}`}
            className="relative w-11 h-11 rounded-[13px] transition-all duration-300 hover:scale-108 active:scale-95 cursor-pointer flex items-center justify-center group"
            style={{
              backgroundColor: color,
              boxShadow: `0 4px 12px ${color}33`,
            }}
          >
            {copiedIndex === i && (
              <span className="w-5 h-5 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-[#eceae5] text-[10px]">
                ✓
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Right Pod: Refresh / Shuffle Action Button */}
      <button
        type="button"
        onClick={handleShuffle}
        title="Shuffle color palette"
        aria-label="Shuffle color palette"
        className="w-[60px] h-[60px] rounded-[20px] bg-[#1f2024] border border-white/6 flex items-center justify-center text-[#eceae5]/60 hover:text-[#eceae5] hover:bg-[#27282e] active:scale-95 transition-all duration-200 cursor-pointer"
        style={{
          boxShadow: "0 8px 32px -8px rgba(0, 0, 0, 0.4)",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
        </svg>
      </button>
    </div>
  );
}
