"use client";

import { useState } from "react";

export function RadialOrb() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  // 6 satellites positioned at 60 degree intervals
  const radius = 64;
  const satellites = [0, 60, 120, 180, 240, 300].map((deg, i) => {
    const rad = (deg * Math.PI) / 180;
    const x = Math.round(Math.cos(rad) * radius);
    const y = Math.round(Math.sin(rad) * radius);
    return { i, x, y };
  });

  return (
    <div
      className="relative w-[180px] h-[180px] flex items-center justify-center pointer-events-auto select-none cursor-default"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 6 Orbiting Satellites */}
      {satellites.map(({ i, x, y }) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setActiveIdx(i)}
          onMouseLeave={() => setActiveIdx(null)}
          className="absolute w-8 h-8 rounded-full bg-[#26272b] dark:bg-[#25262a] border border-white/5 transition-transform duration-200 hover:scale-115 hover:bg-[#323338] cursor-pointer"
          style={{
            transform: `translate(${x}px, ${y}px) ${activeIdx === i ? "scale(1.15)" : "scale(1)"}`,
            boxShadow: activeIdx === i ? "0 0 12px rgba(255,255,255,0.12)" : "none",
          }}
          aria-label={`Satellite ${i + 1}`}
        />
      ))}

      {/* Center Radiant Orb */}
      <div
        className="relative z-10 w-16 h-16 rounded-full cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, #ff80d5 0%, #b86bfc 30%, #00d2ff 70%, #10b981 100%)",
          boxShadow:
            "0 0 30px rgba(184, 107, 252, 0.45), 0 0 60px rgba(0, 210, 255, 0.2), inset 0 2px 4px rgba(255,255,255,0.4)",
        }}
      />
    </div>
  );
}
