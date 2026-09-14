"use client";

import React, { useState, useEffect, useRef } from "react";
import { Copy, Check, Eye, EyeOff, ShieldCheck } from "lucide-react";

const REAL_KEY = "sk_live_9f83ac127e904b77d";
const MASKED_KEY = "sk_live_••••••••••••9481";
const CHARS = "ABCDEF0123456789abcdef!@#$%^&*";

export function SecretKeyVault() {
  const [revealed, setRevealed] = useState(false);
  const [displayText, setDisplayText] = useState(MASKED_KEY);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Scramble deciphering effect
  const scrambleTo = (target: string, onDone?: () => void) => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(
        target
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return target[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= target.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        onDone?.();
      }

      iteration += 1.5;
    }, 25);
  };

  const handleToggleReveal = () => {
    if (!revealed) {
      setRevealed(true);
      setTimeLeft(5);
      scrambleTo(REAL_KEY);
    } else {
      setRevealed(false);
      scrambleTo(MASKED_KEY);
    }
  };

  // Auto-mask countdown timer
  useEffect(() => {
    if (!revealed) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setRevealed(false);
          scrambleTo(MASKED_KEY);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [revealed]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(REAL_KEY);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center gap-3 select-none cursor-default"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="secret-vault-card">
        {/* Header with security status */}
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5 font-medium text-[var(--color-text,#eceae5)]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Production API Secret
          </span>
          {revealed && (
            <span className="text-[10px] text-amber-400 font-mono">
              Masking in {timeLeft}s
            </span>
          )}
        </div>

        {/* Masked / Deciphered Key Display */}
        <div className="secret-vault-terminal">
          <span className="truncate mr-2 select-all">
            {displayText}
          </span>

          {/* Action icons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleToggleReveal}
              className="secret-vault-btn"
              title={revealed ? "Mask secret" : "Reveal secret"}
              aria-label={revealed ? "Mask secret" : "Reveal secret"}
            >
              {revealed ? (
                <EyeOff className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="secret-vault-btn"
              title="Copy API secret"
              aria-label="Copy API secret"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Micro Entropy & Key Health indicator */}
        <div className="flex items-center justify-between text-[10px] text-[var(--color-muted,#8c8e96)] pt-0.5">
          <span>256-bit AES · FIPS 140-3</span>
          <span className="text-emerald-500 font-medium">99.8% Entropy</span>
        </div>
      </div>

      <span className="text-[11px] text-[#72747d] tracking-wide font-normal">
        {revealed ? "Auto-masks after 5 seconds" : "Click eye to decrypt secret"}
      </span>
    </div>
  );
}
