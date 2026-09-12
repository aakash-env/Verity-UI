"use client";

import { useMotionValue, motion, useMotionTemplate } from "motion/react";
import React, { MouseEvent as ReactMouseEvent, useState } from "react";
import { cn } from "@/lib/utils";

export interface CardSpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  radius?: number;
  color?: string;
  children: React.ReactNode;
}

export function CardSpotlight({
  children,
  radius = 280,
  color = "rgba(59, 130, 246, 0.18)",
  className,
  ...props
}: CardSpotlightProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: ReactMouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={cn(
        "group/spotlight relative overflow-hidden rounded-[24px] border border-white/10 bg-[#17181c] p-6 select-none",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {/* Spotlight overlay tracking cursor */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[24px] opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              ${radius}px circle at ${mouseX}px ${mouseY}px,
              ${color},
              transparent 80%
            )
          `,
        }}
      />

      {/* Subtle ambient border highlight following cursor */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[24px] opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100 z-10"
        style={{
          maskImage: useMotionTemplate`
            radial-gradient(
              ${radius * 0.75}px circle at ${mouseX}px ${mouseY}px,
              white,
              transparent
            )
          `,
          border: "1px solid rgba(255, 255, 255, 0.25)",
        }}
      />

      <div className="relative z-20">{children}</div>
    </div>
  );
}
