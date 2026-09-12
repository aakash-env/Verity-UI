"use client";

import { useState } from "react";

interface CardItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  gradient: string;
}

const CARDS: CardItem[] = [
  {
    id: "emerald",
    title: "Verdant Mist",
    subtitle: "Cascades · 2,400m",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    gradient: "linear-gradient(135deg, #064e3b 0%, #0f766e 50%, #0284c7 100%)",
  },
  {
    id: "alpine",
    title: "Alpine Ridge",
    subtitle: "Dolomites · 3,150m",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80",
    gradient: "linear-gradient(135deg, #31103f 0%, #701a75 40%, #ea580c 100%)",
  },
  {
    id: "aurora",
    title: "Nordic Aurora",
    subtitle: "Tromsø · 69° N",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80",
    gradient: "linear-gradient(135deg, #022c22 0%, #065f46 40%, #06b6d4 100%)",
  },
];

export function FannedCards() {
  const [deck, setDeck] = useState(CARDS);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isDeckHovered, setIsDeckHovered] = useState(false);

  const bringToFront = (clickedId: string) => {
    const clickedCard = deck.find((c) => c.id === clickedId);
    if (!clickedCard) return;

    // Move clicked card to center (index 1)
    const remaining = deck.filter((c) => c.id !== clickedId);
    setDeck([remaining[0], clickedCard, remaining[1]]);
  };

  return (
    <div
      onMouseEnter={() => setIsDeckHovered(true)}
      onMouseLeave={() => {
        setIsDeckHovered(false);
        setHoveredIdx(null);
      }}
      onClick={(e) => e.stopPropagation()}
      className="relative w-[280px] h-[170px] flex items-center justify-center select-none pointer-events-auto cursor-pointer"
      style={{ perspective: "1000px" }}
    >
      {deck.map((card, idx) => {
        // idx 0 = left, idx 1 = center, idx 2 = right
        const isCenter = idx === 1;
        const isLeft = idx === 0;
        const isHovered = hoveredIdx === idx;

        // Dynamic transforms
        let translateX = isLeft ? (isDeckHovered ? -58 : -40) : isCenter ? 0 : isDeckHovered ? 58 : 40;
        let translateY = isCenter ? (isHovered ? -12 : -4) : isHovered ? -8 : 6;
        let rotate = isLeft ? (isDeckHovered ? -14 : -9) : isCenter ? 0 : isDeckHovered ? 14 : 9;
        let scale = isHovered ? 1.06 : isCenter ? 1.0 : 0.93;
        let zIndex = isHovered ? 30 : isCenter ? 20 : 10;
        let opacity = isCenter || isHovered ? 1 : 0.88;

        return (
          <div
            key={card.id}
            onClick={(e) => {
              e.stopPropagation();
              bringToFront(card.id);
            }}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className="absolute w-[112px] h-[154px] rounded-[18px] overflow-hidden border border-white/12 shadow-2xl transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] group"
            style={{
              transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`,
              zIndex,
              opacity,
              boxShadow: isCenter || isHovered
                ? "0 20px 40px -10px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.15)"
                : "0 10px 24px -6px rgba(0, 0, 0, 0.5)",
              background: card.gradient,
            }}
          >
            {/* Background Image with fallback */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={card.image}
              alt={card.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
              loading="lazy"
              onError={(e) => {
                // If offline or image fails, gradient fallback shows
                (e.target as HTMLElement).style.display = "none";
              }}
            />

            {/* Subtle glass specular gloss highlight */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.05) 45%, transparent 100%)",
              }}
            />

            {/* Bottom dark vignette */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

            {/* Tiny Label Badge on Center or Hovered Card */}
            {(isCenter || isHovered) && (
              <div className="absolute bottom-2 inset-x-2 flex flex-col pointer-events-none transition-opacity duration-300">
                <span className="text-[10px] font-medium text-[#eceae5] leading-tight truncate drop-shadow-sm">
                  {card.title}
                </span>
                <span className="text-[8px] text-[#eceae5]/60 leading-tight truncate">
                  {card.subtitle}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
