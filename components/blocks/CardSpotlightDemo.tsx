"use client";

import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Check } from "lucide-react";

const steps = [
  "Enter your email address",
  "Create a strong password",
  "Set up two-factor authentication",
  "Verify your identity",
];

export function CardSpotlightDemo() {
  return (
    <div
      className="w-full max-w-[420px] select-none cursor-default"
      onClick={(e) => e.stopPropagation()}
    >
      <CardSpotlight
        color="#262626"
        radius={280}
        className="min-h-[290px] w-full rounded-2xl border-white/10 bg-[#09090b] p-6 shadow-2xl"
      >
        <div className="relative z-20 text-left">
          <h3 className="text-xl font-bold tracking-tight text-white">
            Authentication steps
          </h3>
          <p className="mt-3 text-xs leading-relaxed text-neutral-300">
            Follow these steps to secure your account:
          </p>

          <ul className="mt-4 space-y-2 text-xs font-medium text-white">
            {steps.map((step) => (
              <li key={step} className="flex items-center gap-2">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-blue-500">
                  <Check
                    className="size-2.5 stroke-[3] text-white"
                    aria-hidden="true"
                  />
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-[11px] leading-relaxed text-neutral-400">
            Ensuring your account is properly secured helps protect your
            personal information and data.
          </p>
        </div>
      </CardSpotlight>
    </div>
  );
}
