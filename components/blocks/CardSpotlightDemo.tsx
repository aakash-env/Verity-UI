"use client";

import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Check, ShieldCheck } from "lucide-react";

interface CardSpotlightDemoProps {
  inModal?: boolean;
}

const steps = [
  "Enter your email address",
  "Create a strong password",
  "Set up two-factor authentication",
  "Verify your identity",
];

export function CardSpotlightDemo({ inModal = false }: CardSpotlightDemoProps) {
  return (
    <div
      className={`w-full select-none cursor-default flex items-center justify-center ${
        inModal ? "max-w-md p-2" : "max-w-[320px] sm:max-w-[340px]"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <CardSpotlight
        color="#1e2229"
        radius={inModal ? 320 : 220}
        className={`w-full rounded-2xl border border-white/10 bg-[#0f1013] shadow-xl ${
          inModal ? "p-6 sm:p-8" : "p-4 sm:p-5"
        }`}
      >
        <div className="relative z-20 text-left">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center shrink-0">
                <ShieldCheck className="size-3.5 text-blue-400" />
              </div>
              <h3 className="text-sm font-semibold tracking-tight text-white">
                Authentication steps
              </h3>
            </div>
            <span className="text-[10px] font-mono font-medium text-neutral-400 bg-white/[0.06] px-2 py-0.5 rounded-full border border-white/5 shrink-0">
              4 steps
            </span>
          </div>

          <p className="text-[11px] text-neutral-400 leading-snug mb-3">
            Follow these steps to secure your account:
          </p>

          {/* Checklist */}
          <ul className="space-y-1.5 text-xs text-white">
            {steps.map((step) => (
              <li key={step} className="flex items-center gap-2">
                <span className="flex size-3.5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                  <Check
                    className="size-2 stroke-[3] text-blue-400"
                    aria-hidden="true"
                  />
                </span>
                <span className="text-[11.5px] text-neutral-200 font-normal">
                  {step}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-neutral-400">
            <span>Account Security</span>
            <span className="text-blue-400 font-medium">Ready to verify</span>
          </div>
        </div>
      </CardSpotlight>
    </div>
  );
}
