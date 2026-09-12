"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface TooltipCardProps {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  tooltipClassName?: string;
  side?: "top" | "bottom";
}

export function TooltipCard({
  children,
  content,
  className,
  tooltipClassName,
  side = "top",
}: TooltipCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={cn("relative inline-block select-none", className)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={(e) => {
        // Prevent click from bubbling out
        e.stopPropagation();
      }}
    >
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.92,
              y: side === "top" ? 10 : -10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.92,
              y: side === "top" ? 10 : -10,
            }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 26,
            }}
            className={cn(
              "absolute z-50 min-w-[220px] rounded-2xl bg-[#1c1d22]/95 border border-white/10 p-3.5 text-[#eceae5] shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl pointer-events-auto",
              side === "top" && "bottom-full left-1/2 -translate-x-1/2 mb-3",
              side === "bottom" && "top-full left-1/2 -translate-x-1/2 mt-3",
              tooltipClassName
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
