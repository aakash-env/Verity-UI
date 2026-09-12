"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface CanvasRevealEffectProps {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
}

export const CanvasRevealEffect = ({
  animationSpeed = 0.4,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[59, 130, 246], [139, 92, 246]],
  containerClassName,
  dotSize = 3,
  showGradient = true,
}: CanvasRevealEffectProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    const spacing = 12;
    const cols = Math.ceil(width / spacing);
    const rows = Math.ceil(height / spacing);

    // Seed matrix for smooth organic flickering
    const dots: { col: number; row: number; seed: number; colorIdx: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({
          col: c,
          row: r,
          seed: Math.random() * 100,
          colorIdx: (c + r) % colors.length,
        });
      }
    }

    let startTime = performance.now();

    const render = (time: number) => {
      const elapsed = (time - startTime) * 0.001 * (animationSpeed * 2.5);
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const x = d.col * spacing + spacing / 2;
        const y = d.row * spacing + spacing / 2;

        // Pseudo noise / sine wave flicker
        const wave = Math.sin(elapsed * 3 + d.seed);
        const norm = (wave + 1) / 2; // 0 to 1
        const opacityIdx = Math.floor(norm * (opacities.length - 1));
        const alpha = opacities[opacityIdx] || 0.4;

        const [rVal, gVal, bVal] = colors[d.colorIdx] || [59, 130, 246];

        ctx.fillStyle = `rgba(${rVal}, ${gVal}, ${bVal}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [animationSpeed, colors, dotSize, opacities]);

  return (
    <div className={cn("h-full relative w-full", containerClassName)}>
      <canvas
        ref={canvasRef}
        className="h-full w-full block pointer-events-none"
      />
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-[84%] pointer-events-none" />
      )}
    </div>
  );
};
