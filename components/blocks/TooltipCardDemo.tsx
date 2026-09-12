"use client";

import { TooltipCard } from "@/components/ui/tooltip-card";

export function TooltipCardDemo() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 select-none cursor-default pt-16 relative z-20"
      onClick={(e) => e.stopPropagation()}
    >
      <TooltipCard
        side="top"
        content={
          <div className="flex items-start gap-3 w-[230px]">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="Elena Rostova"
              className="w-10 h-10 rounded-full object-cover ring-1 ring-white/20 shrink-0"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-[#eceae5]">Elena Rostova</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-[10px] text-[#8e909a] font-mono">@elena · Lead Designer</span>
              <p className="text-[11px] text-[#b0b2bc] mt-1.5 leading-snug">
                Building generative spatial canvas UI systems.
              </p>
            </div>
          </div>
        }
      >
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#1f2024] hover:bg-[#282a30] border border-white/8 transition-all duration-150 cursor-pointer shadow-lg group">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            alt="Elena"
            className="w-6 h-6 rounded-full object-cover ring-1 ring-white/20"
          />
          <span className="text-xs font-medium text-[#eceae5] group-hover:text-white">
            Hover for operator profile
          </span>
        </div>
      </TooltipCard>

      <span className="text-[11px] text-[#72747d] tracking-wide font-normal">
        Hover pill to inspect rich card
      </span>
    </div>
  );
}
