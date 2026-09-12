"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import type { Risk } from "./HoldToConfirm";

export interface SlideToDeleteProps {
  risk?: Risk;
  title?: string;
  consequence?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  threshold?: number; // 0-1, default 0.8
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  onError?: (err: unknown) => void;
  disabled?: boolean;
  hideMeta?: boolean;
}

type State = "idle" | "loading" | "success" | "error";

export function SlideToDelete({
  risk = "irreversible",
  title = "Slide to delete",
  consequence = "This will permanently delete the item.",
  confirmLabel = "Slide to delete →",
  cancelLabel = "Cancel",
  threshold = 0.8,
  onConfirm,
  onCancel,
  onError,
  disabled = false,
  hideMeta = false,
}: SlideToDeleteProps) {
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef(false);
  const reducedMotion = useRef(false);
  const [maxDrag, setMaxDrag] = useState(240);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = mq.matches;
    const h = (e: MediaQueryListEvent) => { reducedMotion.current = e.matches; };
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const x = useMotionValue(0);
  const THUMB_SIZE = 48;

  const updateMaxDrag = useCallback(() => {
    if (trackRef.current) {
      const width = trackRef.current.offsetWidth - THUMB_SIZE - 8;
      setMaxDrag(Math.max(width, 100));
    }
  }, []);

  useEffect(() => {
    updateMaxDrag();
    window.addEventListener("resize", updateMaxDrag);
    return () => window.removeEventListener("resize", updateMaxDrag);
  }, [updateMaxDrag]);

  const labelOpacity = useTransform(x, [0, maxDrag * 0.4], [1, 0]);

  const triggerConfirm = useCallback(async () => {
    if (pendingRef.current) return;
    pendingRef.current = true;
    setState("loading");
    try {
      await Promise.resolve(onConfirm());
      setState("success");
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      onError?.(err);
      animate(x, 0, { type: "spring", damping: 30, stiffness: 400, bounce: 0 });
      pendingRef.current = false;
    }
  }, [onConfirm, onError, x]);

  const handleDragEnd = useCallback(() => {
    const current = x.get();
    const ratio = current / maxDrag;

    if (ratio >= threshold) {
      animate(x, maxDrag, { duration: 0.1 });
      triggerConfirm();
    } else {
      // Snap back with spring
      animate(x, 0, {
        type: "spring",
        damping: reducedMotion.current ? 1000 : 30,
        stiffness: 400,
        bounce: 0,
      });
    }
  }, [x, maxDrag, threshold, triggerConfirm]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = maxDrag / 8;
    if (e.key === "ArrowRight") {
      const next = Math.min(x.get() + step, maxDrag);
      x.set(next);
      if (next / maxDrag >= threshold) {
        animate(x, maxDrag, { duration: 0.1 });
        triggerConfirm();
      }
    }
    if (e.key === "ArrowLeft") {
      x.set(Math.max(x.get() - step, 0));
    }
    if (e.key === "Escape") {
      animate(x, 0, { type: "spring", damping: 30, stiffness: 400, bounce: 0 });
      onCancel?.();
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      animate(x, maxDrag, { duration: 0.1 });
      setTimeout(triggerConfirm, 100);
    }
  };

  const handleReset = () => {
    setState("idle");
    setErrorMsg(null);
    x.set(0);
    pendingRef.current = false;
  };

  return (
    <div className="slide-delete" data-risk={risk} data-state={state}>
      {!hideMeta && (
        <div className="slide-delete__meta">
          <p className="slide-delete__title">{title}</p>
          <p className="slide-delete__consequence">{consequence}</p>
        </div>
      )}

      {state !== "success" ? (
        <>
          <div
            ref={trackRef}
            className="slide-delete__track"
            aria-label={`${confirmLabel}. Slide right to delete, or press Enter to confirm.`}
            data-state={state}
          >
            {/* Track label */}
            <motion.span
              className="slide-delete__label"
              style={{ opacity: labelOpacity }}
              aria-hidden="true"
            >
              {state === "loading" ? "Processing…" : confirmLabel}
            </motion.span>

            {/* Thumb */}
            <motion.div
              className="slide-delete__thumb"
              style={{ x }}
              drag={state === "idle" && !disabled ? "x" : false}
              dragConstraints={{ left: 0, right: maxDrag }}
              dragElastic={0.05}
              onDragEnd={handleDragEnd}
              onKeyDown={handleKeyDown}
              tabIndex={disabled || state !== "idle" ? -1 : 0}
              role="slider"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round((x.get() / (maxDrag || 1)) * 100)}
              aria-label="Slide to delete thumb"
              whileTap={{ scale: 0.96 }}
              data-risk={risk}
            >
              {state === "loading" ? (
                <span className="slide-delete__spinner" aria-hidden="true" />
              ) : (
                <TrashIcon />
              )}
            </motion.div>
          </div>

          {errorMsg && (
            <p className="slide-delete__error" role="alert">{errorMsg}</p>
          )}

          <div className="slide-delete__actions">
            <button
              className="slide-delete__cancel"
              onClick={() => {
                animate(x, 0, { type: "spring", damping: 30, stiffness: 400, bounce: 0 });
                onCancel?.();
              }}
              disabled={state === "loading"}
              type="button"
            >
              {cancelLabel}
            </button>
          </div>
        </>
      ) : (
        <div className="slide-delete__success" role="status">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <span>Deleted</span>
          <button className="slide-delete__reset" onClick={handleReset}>Reset</button>
        </div>
      )}
    </div>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}
