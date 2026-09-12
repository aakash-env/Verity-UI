"use client";

import { TextHoverEffect } from "@/components/ui/text-hover-effect";

export function TextHoverEffectDemo() {
  return (
    <div
      className="flex flex-col items-center justify-center w-full max-w-[280px] select-none cursor-default"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-full flex items-center justify-center h-[90px]">
        <TextHoverEffect text="VERITY" duration={0.15} />
      </div>
      <span className="text-[11px] text-[#72747d] tracking-wide font-normal mt-2">
        Hover text to illuminate
      </span>
    </div>
  );
}
