"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Risk } from "./HoldToConfirm";

export interface UndoToastProps {
  risk?: Risk;
  title?: string;
  consequence?: string;
  actionLabel?: string;
  undoLabel?: string;
  duration?: number; // ms, default 6000
  onConfirm: () => void | Promise<void>;
  onUndo?: () => void;
  onError?: (err: unknown) => void;
  disabled?: boolean;
  loading?: boolean;
  hideMeta?: boolean;
}

export function UndoToast({
  risk = "low",
  title = "Undo action",
  consequence = "Action has been applied.",
  actionLabel = "Delete item",
  undoLabel = "Undo",
  duration = 6000,
  onConfirm,
  onUndo,
  onError,
  disabled = false,
  hideMeta = false,
}: UndoToastProps) {
  const [phase, setPhase] = useState<"idle" | "active" | "undone" | "committed" | "error">("idle");
  const [progress, setProgress] = useState(1); // 1→0 countdown bar
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const pendingRef = useRef(false);

  const commit = useCallback(async () => {
    if (pendingRef.current) return;
    pendingRef.current = true;
    setPhase("committed");
    try {
      await Promise.resolve(onConfirm());
    } catch (err) {
      setPhase("error");
      setErrorMsg(err instanceof Error ? err.message : "Action failed");
      onError?.(err);
      pendingRef.current = false;
    }
  }, [onConfirm, onError]);

  const startToast = useCallback(() => {
    if (disabled || pendingRef.current) return;
    setPhase("active");
    setProgress(1);
    startRef.current = performance.now();

    const tick = (now: number) => {
      if (!startRef.current) return;
      const elapsed = now - startRef.current;
      const p = Math.max(1 - elapsed / duration, 0);
      setProgress(p);
      if (p > 0) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    timerRef.current = setTimeout(() => {
      commit();
    }, duration);
  }, [disabled, duration, commit]);

  const handleUndo = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    timerRef.current = null;
    rafRef.current = null;
    startRef.current = null;
    setPhase("undone");
    setProgress(1);
    onUndo?.();
  };

  const reset = () => {
    setPhase("idle");
    setProgress(1);
    setErrorMsg(null);
    pendingRef.current = false;
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="undo-toast-demo" data-risk={risk}>
      {!hideMeta && (
        <div className="undo-toast__meta">
          <p className="undo-toast__title">{title}</p>
          <p className="undo-toast__consequence">{consequence}</p>
        </div>
      )}

      {/* Trigger button */}
      {phase === "idle" && (
        <button
          className="undo-toast__trigger"
          onClick={startToast}
          disabled={disabled}
          data-risk={risk}
        >
          {actionLabel}
        </button>
      )}

      {/* Toast */}
      {phase === "active" && (
        <div
          className="undo-toast__toast"
          role="status"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="undo-toast__toast-bar">
            <span className="undo-toast__toast-message">{consequence}</span>
            <button
              className="undo-toast__undo-btn"
              onClick={handleUndo}
              autoFocus
            >
              {undoLabel}
            </button>
          </div>
          {/* Countdown bar: linear, no easing */}
          <div className="undo-toast__countdown">
            <div
              className="undo-toast__countdown-fill"
              style={{ width: `${progress * 100}%`, transition: "none" }}
              aria-hidden="true"
            />
          </div>
          <span className="sr-only">
            {Math.ceil(progress * duration / 1000)} seconds to undo
          </span>
        </div>
      )}

      {phase === "undone" && (
        <div className="undo-toast__result undo-toast__result--undone" role="status">
          <span>↩ Action undone</span>
          <button className="undo-toast__reset" onClick={reset}>Try again</button>
        </div>
      )}

      {phase === "committed" && (
        <div className="undo-toast__result undo-toast__result--committed" role="status">
          <span>✓ Action applied</span>
          <button className="undo-toast__reset" onClick={reset}>Reset</button>
        </div>
      )}

      {phase === "error" && (
        <div className="undo-toast__result undo-toast__result--error" role="alert">
          <span>{errorMsg}</span>
          <button className="undo-toast__reset" onClick={reset}>Try again</button>
        </div>
      )}
    </div>
  );
}
