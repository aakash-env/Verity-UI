"use client";

import { CardSpotlight } from "@/components/ui/card-spotlight";
import { ShieldCheck, ArrowUpRight } from "lucide-react";

export function CardSpotlightDemo() {
  return (
    <div
      className="flex flex-col items-center justify-center select-none cursor-default w-full max-w-[280px]"
      onClick={(e) => e.stopPropagation()}
    >
      <CardSpotlight
        color="rgba(99, 102, 241, 0.25)"
        radius={220}
        className="w-full p-5 bg-[#191a1f] border border-white/10 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-400">
            2FA Active
          </span>
        </div>

        <h3 className="text-sm font-semibold text-[#eceae5] tracking-tight">
          Enterprise Security
        </h3>
        <p className="text-[11px] text-[#8e909a] mt-1 leading-snug">
          End-to-end hardware key enclave encryption.
        </p>

        <div className="mt-4 pt-3 border-t border-white/6 flex items-center justify-between text-[11px] text-indigo-400 font-medium group">
          <span>Manage credentials</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </CardSpotlight>

      <span className="text-[11px] text-[#72747d] tracking-wide font-normal mt-2.5">
        Move cursor to reveal spotlight
      </span>
    </div>
  );
}
