"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Terminal } from "lucide-react";

export function MechanicalKeybind() {
  const [pressedKey, setPressedKey] = useState<"cmd" | "k" | null>(null);
  const [activatedCount, setActivatedCount] = useState(0);

  // Global listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPressedKey("k");
        setActivatedCount((c) => c + 1);
        setTimeout(() => setPressedKey(null), 250);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const triggerPress = (key: "cmd" | "k") => {
    setPressedKey(key);
    setActivatedCount((c) => c + 1);
    setTimeout(() => setPressedKey(null), 200);
  };

  return (
    <div
      className="flex flex-col items-center justify-center gap-2.5 select-none cursor-default"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mechanical-keybind-card">
        {/* Micro Status */}
        <div className="w-full flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5 font-medium text-[var(--color-text,#eceae5)]">
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            Command Palette
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">
            {activatedCount > 0 ? `${activatedCount} fired` : "Ready"}
          </span>
        </div>

        {/* 3D Keycap Switch Stage */}
        <div className="flex items-center gap-3 py-1 [perspective:800px]">
          {/* Keycap 1: Command / Ctrl */}
          <button
            type="button"
            onMouseDown={() => triggerPress("cmd")}
            className={`mechanical-keycap ${
              pressedKey === "cmd" || pressedKey === "k" ? "is-pressed" : ""
            }`}
            title="Command modifier"
            aria-label="Command key"
          >
            {/* Stem Face */}
            <div className="mechanical-keycap-face">
              <span className="text-[9px] font-mono text-[var(--color-muted,#8c8e96)] self-start">⌘</span>
              <span className="text-[11px] font-semibold tracking-wider font-mono text-[var(--color-text,#eceae5)]">cmd</span>
            </div>
          </button>

          {/* Plus separator */}
          <span className="text-xs font-semibold text-[var(--color-muted,#71747e)]">+</span>

          {/* Keycap 2: K Key */}
          <button
            type="button"
            onMouseDown={() => triggerPress("k")}
            className={`mechanical-keycap ${
              pressedKey === "k" ? "is-pressed" : ""
            }`}
            title="K action key"
            aria-label="K key"
          >
            {/* Stem Face */}
            <div className="mechanical-keycap-face">
              <span className="text-[9px] font-mono text-[var(--color-muted,#8c8e96)] self-start">K</span>
              <span className="text-sm font-bold tracking-wider font-mono text-amber-400">K</span>
            </div>
          </button>
        </div>

        {/* Tactile hint */}
        <div className="flex items-center gap-1 text-[10px] text-[var(--color-muted,#71747e)]">
          <Sparkles className="w-3 h-3 text-amber-400/80" />
          <span>Click keycaps or press <kbd className="font-mono text-[var(--color-text,#eceae5)]">⌘K</kbd></span>
        </div>
      </div>
    </div>
  );
}
