"use client";

import { useRef, useState, useEffect, useCallback } from "react";

export type Risk = "low" | "irreversible" | "financial";

export interface HoldToConfirmProps {
  risk?: Risk;
  title?: string;
  consequence?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  onError?: (err: unknown) => void;
  disabled?: boolean;
  loading?: boolean;
  holdDuration?: number; // ms, default 1200
  hideMeta?: boolean;
}

const RING_SIZE = 80;
const STROKE = 6;
const RADIUS = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getRingColor(risk: Risk): string {
  if (risk === "irreversible") return "var(--color-danger)";
  if (risk === "financial") return "var(--color-warning)";
  return "var(--color-text)";
}

type State = "idle" | "holding" | "success" | "error" | "loading";

export function HoldToConfirm({
  risk = "low",
  title = "Hold to confirm",
  consequence = "This action will proceed.",
  confirmLabel = "Hold to confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  onError,
  disabled = false,
  loading = false,
  holdDuration = 1200,
  hideMeta = false,
}: HoldToConfirmProps) {
  const [state, setState] = useState<State>("idle");
  const [progress, setProgress] = useState(0); // 0-1
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pendingRef = useRef(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => {
      reducedMotion.current = e.matches;
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const cancelHold = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    startTimeRef.current = null;
    if (state === "holding") {
      setState("idle");
      setProgress(0);
    }
  }, [state]);

  const triggerConfirm = useCallback(async () => {
    if (pendingRef.current) return;
    pendingRef.current = true;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    startTimeRef.current = null;

    setState("loading");
    setProgress(1);
    setAnnouncement("Confirmed, processing…");

    try {
      await Promise.resolve(onConfirm());
      setState("success");
      setAnnouncement("Action confirmed successfully");
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setAnnouncement("An error occurred");
      onError?.(err);
    } finally {
      pendingRef.current = false;
    }
  }, [onConfirm, onError]);

  const startHold = useCallback(() => {
    if (disabled || loading || pendingRef.current || state === "success" || state === "loading") return;

    // Reduced motion: instant confirm
    if (reducedMotion.current) {
      triggerConfirm();
      return;
    }

    setState("holding");
    startTimeRef.current = performance.now();

    const tick = (now: number) => {
      if (!startTimeRef.current) return;
      const elapsed = now - startTimeRef.current;
      const p = Math.min(elapsed / holdDuration, 1);
      setProgress(p);

      if (p >= 0.5 && p < 0.51) setAnnouncement("Halfway there, keep holding");

      if (p >= 1) {
        setProgress(1);
        triggerConfirm();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [disabled, loading, state, holdDuration, triggerConfirm]);

  const handlePointerDown = () => startHold();
  const handlePointerUp = () => {
    if (state === "holding") cancelHold();
  };
  const handlePointerLeave = () => {
    if (state === "holding") cancelHold();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (state === "holding") return;
      startHold();
    }
    if (e.key === "Escape") {
      cancelHold();
      onCancel?.();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if ((e.key === " " || e.key === "Enter") && state === "holding") {
      cancelHold();
    }
  };

  const handleReset = () => {
    setState("idle");
    setProgress(0);
    setErrorMsg(null);
    pendingRef.current = false;
    buttonRef.current?.focus();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const ringColor = getRingColor(risk);
  const strokeDash = CIRCUMFERENCE * (1 - progress);
  const isDisabled = disabled || loading || state === "loading" || state === "success";

  return (
    <div className="hold-confirm" data-risk={risk} data-state={state}>
      {/* Screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      {!hideMeta && (
        <div className="hold-confirm__meta">
          <p className="hold-confirm__title">{title}</p>
          <p className="hold-confirm__consequence">{consequence}</p>
        </div>
      )}

      <div className="hold-confirm__controls">
        {state !== "success" && (
          <button
            ref={buttonRef}
            className="hold-confirm__button"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            disabled={isDisabled}
            aria-label={
              state === "loading"
                ? "Processing…"
                : `${confirmLabel}. Hold for ${holdDuration / 1000} seconds to confirm.`
            }
            aria-pressed={state === "holding"}
            data-state={state}
            style={{ "--ring-color": ringColor } as React.CSSProperties}
          >
            <svg
              className="hold-confirm__ring"
              width={RING_SIZE}
              height={RING_SIZE}
              viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
              aria-hidden="true"
            >
              {/* Track */}
              <circle
                className="hold-confirm__ring-track"
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RADIUS}
                fill="none"
                strokeWidth={STROKE}
              />
              {/* Fill */}
              <circle
                className="hold-confirm__ring-fill"
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RADIUS}
                fill="none"
                strokeWidth={STROKE}
                stroke={state === "idle" ? "transparent" : ringColor}
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={state === "holding" || state === "loading" ? strokeDash : CIRCUMFERENCE}
                strokeLinecap="round"
                transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
                style={{ transition: "none" }} // linear — no easing
              />
            </svg>

            {/* Center icon / label */}
            <span className="hold-confirm__button-inner" aria-hidden="true">
              {state === "loading" ? (
                <span className="hold-confirm__spinner" />
              ) : state === "holding" ? (
                <span className="hold-confirm__progress-pct">
                  {Math.round(progress * 100)}%
                </span>
              ) : (
                <HoldIcon />
              )}
            </span>
          </button>
        )}

        {state === "success" && (
          <div className="hold-confirm__success" role="status">
            <SuccessIcon />
            <span>Done</span>
            <button className="hold-confirm__reset-btn" onClick={handleReset}>
              Reset
            </button>
          </div>
        )}

        {state === "error" && (
          <div className="hold-confirm__error" role="alert">
            <span>{errorMsg || "Error"}</span>
            <button className="hold-confirm__retry" onClick={handleReset}>
              Try again
            </button>
          </div>
        )}

        {state !== "success" && state !== "loading" && (
          <button
            className="hold-confirm__cancel"
            onClick={() => {
              cancelHold();
              onCancel?.();
            }}
            disabled={loading || disabled}
            type="button"
          >
            {cancelLabel}
          </button>
        )}
      </div>

      <p className="hold-confirm__hint" aria-hidden="true">
        {state === "idle" && "Press and hold to confirm"}
        {state === "holding" && "Keep holding…"}
        {state === "loading" && "Processing…"}
        {state === "error" && "Action failed"}
      </p>
    </div>
  );
}

function HoldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
