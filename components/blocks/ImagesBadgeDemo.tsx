"use client";

import { ImagesBadge } from "@/components/ui/images-badge";

const DEMO_IMAGES = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80",
];

export function ImagesBadgeDemo() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 select-none cursor-default pt-10"
      onClick={(e) => e.stopPropagation()}
    >
      <ImagesBadge
        text="View project gallery"
        images={DEMO_IMAGES}
        className="shadow-xl"
      />
      <span className="text-[11px] text-[#72747d] tracking-wide font-normal">
        Hover folder to reveal deck
      </span>
    </div>
  );
}
