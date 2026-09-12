"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface ImagesBadgeProps {
  text: string;
  images: string[];
  className?: string;
  href?: string;
  target?: string;
  folderSize?: { width: number; height: number };
  teaserImageSize?: { width: number; height: number };
  hoverImageSize?: { width: number; height: number };
  hoverTranslateY?: number;
  hoverSpread?: number;
  hoverRotation?: number;
}

export function ImagesBadge({
  text,
  images,
  className,
  href,
  target,
  folderSize = { width: 34, height: 26 },
  teaserImageSize = { width: 22, height: 16 },
  hoverImageSize = { width: 52, height: 36 },
  hoverTranslateY = -38,
  hoverSpread = 22,
  hoverRotation = 16,
}: ImagesBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  const displayImages = images.slice(0, 3);
  const tabWidth = folderSize.width * 0.38;
  const tabHeight = folderSize.height * 0.28;

  const Component = href ? "a" : "div";

  return (
    <Component
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      className={cn(
        "inline-flex cursor-pointer items-center gap-3.5 px-4 py-2.5 rounded-full bg-[#1e2025] dark:bg-[#1e2025] hover:bg-[#26282f] dark:hover:bg-[#26282f] border border-white/10 text-sm font-medium text-[#eceae5] shadow-xl transition-all duration-200 select-none relative z-10",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        // Prevent bubbling to outer card click
        e.stopPropagation();
      }}
    >
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{
          width: folderSize.width,
          height: folderSize.height,
          perspective: 1000,
        }}
      >
        <motion.div
          className="relative w-full h-full"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Folder Back */}
          <div className="absolute inset-0 rounded-[5px] bg-gradient-to-b from-amber-400 to-amber-500 shadow-sm dark:from-amber-500 dark:to-amber-600">
            <div
              className="absolute left-1 rounded-t-[3px] bg-gradient-to-b from-amber-300 to-amber-400 dark:from-amber-400 dark:to-amber-500"
              style={{
                top: -tabHeight * 0.65,
                width: tabWidth,
                height: tabHeight,
              }}
            />
          </div>

          {/* Floating Images popping out */}
          {displayImages.map((image, index) => {
            const totalImages = displayImages.length;
            const baseRotation =
              totalImages === 1
                ? 0
                : totalImages === 2
                ? (index - 0.5) * hoverRotation
                : (index - 1) * hoverRotation;

            const hoverY = hoverTranslateY - (totalImages - 1 - index) * 3;
            const hoverX =
              totalImages === 1
                ? 0
                : totalImages === 2
                ? (index - 0.5) * hoverSpread
                : (index - 1) * hoverSpread;

            const teaseY = -4 - (totalImages - 1 - index) * 1.5;
            const teaseRotation =
              totalImages === 1
                ? 0
                : totalImages === 2
                ? (index - 0.5) * 4
                : (index - 1) * 4;

            return (
              <motion.div
                key={index}
                className="absolute top-0.5 left-1/2 origin-bottom overflow-hidden rounded-[4px] bg-neutral-900 shadow-md ring-1 ring-white/20"
                animate={{
                  x: `calc(-50% + ${isHovered ? hoverX : 0}px)`,
                  y: isHovered ? hoverY : teaseY,
                  rotate: isHovered ? baseRotation : teaseRotation,
                  width: isHovered ? hoverImageSize.width : teaserImageSize.width,
                  height: isHovered ? hoverImageSize.height : teaserImageSize.height,
                }}
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 24,
                  delay: index * 0.02,
                }}
                style={{
                  zIndex: 10 + index,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={`Preview ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            );
          })}

          {/* Folder Front Cover with 3D flap */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-[85%] origin-bottom rounded-[5px] bg-gradient-to-b from-amber-300 to-amber-400 shadow-sm dark:from-amber-400 dark:to-amber-500"
            animate={{
              rotateX: isHovered ? -50 : -22,
              scaleY: isHovered ? 0.82 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 24,
            }}
            style={{
              transformStyle: "preserve-3d",
              zIndex: 20,
            }}
          >
            <div className="absolute top-1 right-1 left-1 h-px bg-amber-200/50 dark:bg-amber-300/50" />
          </motion.div>
        </motion.div>
      </div>

      <span className="truncate">{text}</span>
    </Component>
  );
}
