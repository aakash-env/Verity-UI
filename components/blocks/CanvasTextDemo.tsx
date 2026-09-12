"use client";

import { CanvasText } from "@/components/ui/canvas-text";

export function CanvasTextDemo() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2 select-none cursor-default w-full"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-center py-2">
        <CanvasText
          text="VERITY"
          className="text-5xl font-black tracking-tight"
          backgroundClassName="bg-[#151619]"
          colors={[
            "#38bdf8",
            "#818cf8",
            "#c084fc",
            "#f472b6",
            "#fb7185",
            "#34d399",
          ]}
          lineGap={7}
          lineWidth={1.6}
          curveIntensity={40}
          animationDuration={4}
        />
      </div>
      <span className="text-[11px] text-[#72747d] tracking-wide font-normal">
        Animated generative sine canvas
      </span>
    </div>
  );
}
