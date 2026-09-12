"use client";

import { useState, useRef, useEffect } from "react";
import type { Risk } from "./HoldToConfirm";

export interface DangerousToggleProps {
  risk?: Risk;
  title?: string;
  consequence?: string;
  label?: string;
  description?: string;
  defaultChecked?: boolean;
  holdDuration?: number; // ms to hold before toggling, default 600
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: (newValue: boolean) => void | Promise<void>;
  onCancel?: () => void;
  onError?: (err: unknown) => void;
  disabled?: boolean;
  hideMeta?: boolean;
}

type PendingState = "idle" | "pending" | "loading" | "error";

export function DangerousToggle({
  risk = "irreversible",
  title = "Dangerous toggle",
  consequence = "Disabling 2FA removes a security layer from your account.",
  label = "Two-factor authentication",
  description = "Require 2FA on sign-in",
  defaultChecked = true,
  holdDuration = 600,
  confirmLabel = "Turn off",
  cancelLabel = "Keep on",
  onConfirm,
  onCancel,
  onError,
  disabled = false,
  hideMeta = false,
}: DangerousToggleProps) {
  const [checked, setChecked] = useState(defaultChecked);
  const [pendingState, setPendingState] = useState<PendingState>("idle");
  const [pendingProgress, setPendingProgress] = useState(0); // 0-1
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pendingVal, setPendingVal] = useState<boolean | null>(null);
  const pendingValue = useRef<boolean | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const confirmRef = useRef(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = mq.matches;
    const h = (e: MediaQueryListEvent) => { reducedMotion.current = e.matches; };
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const triggerConfirm = async (nextValue: boolean) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    startRef.current = null;

    if (confirmRef.current) return;
    confirmRef.current = true;

    setPendingState("loading");

    try {
      await Promise.resolve(onConfirm(nextValue));
      setChecked(nextValue);
      setPendingState("idle");
      setPendingProgress(0);
      pendingValue.current = null;
      setPendingVal(null);
    } catch (err) {
      setPendingState("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      onError?.(err);
    } finally {
      confirmRef.current = false;
    }
  };

  const startPending = (nextValue: boolean) => {
    if (disabled || pendingState !== "idle") return;

    if (reducedMotion.current) {
      pendingValue.current = nextValue;
      setPendingVal(nextValue);
      setPendingState("pending");
      setPendingProgress(1);
      return;
    }

    pendingValue.current = nextValue;
    setPendingVal(nextValue);
    setPendingState("pending");
    setPendingProgress(0);
    startRef.current = performance.now();

    const tick = (now: number) => {
      if (!startRef.current) return;
      const elapsed = now - startRef.current;
      const p = Math.min(elapsed / holdDuration, 1);
      setPendingProgress(p);

      if (p >= 1) {
        triggerConfirm(nextValue);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const cancelPending = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    startRef.current = null;
    setPendingState("idle");
    setPendingProgress(0);
    pendingValue.current = null;
    setPendingVal(null);
    onCancel?.();
  };

  const handleToggleClick = () => {
    if (pendingState !== "idle") return;
    const next = !checked;
    startPending(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") cancelPending();
    if ((e.key === " " || e.key === "Enter") && pendingState === "idle") {
      e.preventDefault();
      handleToggleClick();
    }
  };

  const handleMouseUp = () => {
    if (pendingState === "pending" && pendingProgress < 1) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
  };

  const reset = () => {
    setPendingState("idle");
    setPendingProgress(0);
    setErrorMsg(null);
    pendingValue.current = null;
    setPendingVal(null);
    confirmRef.current = false;
  };

  const showInlineConfirm = pendingState === "pending" && pendingProgress >= 0.3;

  return (
    <div className="dangerous-toggle" data-risk={risk} data-state={pendingState}>
      {!hideMeta && (
        <div className="dangerous-toggle__meta">
          <p className="dangerous-toggle__title">{title}</p>
          <p className="dangerous-toggle__consequence">{consequence}</p>
        </div>
      )}

      <div className="dangerous-toggle__control-row">
        <div className="dangerous-toggle__label-group">
          <span className="dangerous-toggle__label">{label}</span>
          <span className="dangerous-toggle__description">{description}</span>
        </div>

        {/* Toggle switch */}
        <button
          role="switch"
          aria-checked={checked}
          aria-label={label}
          className="dangerous-toggle__switch"
          onClick={handleToggleClick}
          onKeyDown={handleKeyDown}
          onMouseUp={handleMouseUp}
          disabled={disabled || pendingState === "loading"}
          data-state={pendingState}
          data-checked={checked}
          data-risk={risk}
        >
          <span className="dangerous-toggle__thumb" aria-hidden="true">
            {pendingState === "loading" && (
              <span className="dangerous-toggle__spinner" aria-hidden="true" />
            )}
          </span>
          {/* Hold progress outline */}
          {pendingState === "pending" && (
            <span
              className="dangerous-toggle__pending-ring"
              style={{
                background: `conic-gradient(var(--color-danger) ${pendingProgress * 360}deg, transparent 0deg)`,
              }}
              aria-hidden="true"
            />
          )}
        </button>
      </div>

      {/* Inline confirm popup */}
      {showInlineConfirm && (
        <div
          className="dangerous-toggle__popup"
          role="dialog"
          aria-label="Confirm toggle"
          aria-modal="false"
        >
          <p className="dangerous-toggle__popup-text">
            {pendingVal ? "Enable" : "Disable"} {label}?
          </p>
          <div className="dangerous-toggle__popup-actions">
            <button
              className="dangerous-toggle__popup-confirm"
              onClick={() => {
                const target = pendingVal ?? !checked;
                triggerConfirm(target);
              }}
              data-risk={risk}
              autoFocus
            >
              {confirmLabel}
            </button>
            <button className="dangerous-toggle__popup-cancel" onClick={cancelPending}>
              {cancelLabel}
            </button>
          </div>
        </div>
      )}

      {pendingState === "error" && (
        <div className="dangerous-toggle__error" role="alert">
          <span>{errorMsg}</span>
          <button onClick={reset}>Dismiss</button>
        </div>
      )}

      <p className="dangerous-toggle__hint" aria-live="polite">
        {pendingState === "idle" && (checked ? "Enabled" : "Disabled")}
        {pendingState === "pending" && "Hold or confirm to toggle…"}
        {pendingState === "loading" && "Applying change…"}
      </p>
    </div>
  );
}
