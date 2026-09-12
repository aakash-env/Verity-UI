"use client";

import { useState, useRef, useEffect } from "react";
import type { Risk } from "./HoldToConfirm";

export interface ConsequenceItem {
  label: string;
  count?: number;
  critical?: boolean;
}

export interface TwoStepReviewProps {
  risk?: Risk;
  title?: string;
  consequence?: string;
  consequences?: ConsequenceItem[];
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  onError?: (err: unknown) => void;
  disabled?: boolean;
  hideMeta?: boolean;
}

type State = "step1" | "step2" | "loading" | "success" | "error";

export function TwoStepReview({
  risk = "irreversible",
  title = "Review before deleting",
  consequence = "You are about to delete this workspace.",
  consequences = [
    { label: "Projects will be removed", count: 12, critical: true },
    { label: "Members will lose access", count: 4 },
    { label: "Billing will be cancelled", critical: true },
    { label: "API keys will be revoked", count: 3 },
  ],
  confirmLabel = "Delete workspace",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  onError,
  disabled = false,
  hideMeta = false,
}: TwoStepReviewProps) {
  const [state, setState] = useState<State>("step1");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const pendingRef = useRef(false);
  const step2Ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (state === "step2") {
      step2Ref.current?.focus();
    }
  }, [state]);

  const handleConfirm = async () => {
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
      pendingRef.current = false;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      if (state === "step2") setState("step1");
      else onCancel?.();
    }
  };

  const reset = () => {
    setState("step1");
    setErrorMsg(null);
    pendingRef.current = false;
  };

  return (
    <div className="two-step" data-risk={risk} data-state={state} onKeyDown={handleKeyDown}>
      {!hideMeta && (
        <div className="two-step__meta">
          <p className="two-step__title">{title}</p>
          <p className="two-step__consequence">{consequence}</p>
        </div>
      )}

      {/* Step indicator */}
      {(state === "step1" || state === "step2") && (
        <div className="two-step__progress" aria-label={`Step ${state === "step1" ? 1 : 2} of 2`}>
          <span className="two-step__step two-step__step--active" aria-current={state === "step1" ? "step" : undefined}>
            1
          </span>
          <span className="two-step__connector" />
          <span className={`two-step__step ${state === "step2" ? "two-step__step--active" : ""}`} aria-current={state === "step2" ? "step" : undefined}>
            2
          </span>
        </div>
      )}

      {/* Step 1: Review consequences */}
      {state === "step1" && (
        <div className="two-step__panel">
          <p className="two-step__panel-label">What will happen:</p>
          <ul className="two-step__consequences" role="list">
            {consequences.map((item, i) => (
              <li key={i} className={`two-step__item ${item.critical ? "two-step__item--critical" : ""}`}>
                <span className="two-step__item-icon" aria-hidden="true">
                  {item.critical ? "⚠" : "·"}
                </span>
                <span className="two-step__item-label">{item.label}</span>
                {item.count !== undefined && (
                  <span className="two-step__item-count" aria-label={`${item.count} items`}>
                    {item.count}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <div className="two-step__actions">
            <button
              className="two-step__next"
              onClick={() => setState("step2")}
              data-risk={risk}
            >
              I understand, continue →
            </button>
            <button className="two-step__cancel" onClick={onCancel} disabled={disabled}>
              {cancelLabel}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Final confirm */}
      {state === "step2" && (
        <div className="two-step__panel">
          <p className="two-step__panel-label two-step__panel-label--warn">
            This cannot be undone. Are you absolutely sure?
          </p>
          <div className="two-step__actions">
            <button
              ref={step2Ref}
              className="two-step__confirm"
              onClick={handleConfirm}
              disabled={disabled}
              data-risk={risk}
            >
              {confirmLabel}
            </button>
            <button className="two-step__back" onClick={() => setState("step1")}>
              ← Back
            </button>
          </div>
        </div>
      )}

      {state === "loading" && (
        <div className="two-step__loading" role="status" aria-live="polite">
          <span className="two-step__spinner" aria-hidden="true" />
          <span>Processing…</span>
        </div>
      )}

      {state === "success" && (
        <div className="two-step__success" role="status">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <span>Done</span>
          <button className="two-step__reset" onClick={reset}>Reset</button>
        </div>
      )}

      {state === "error" && (
        <div className="two-step__error" role="alert">
          <span>{errorMsg}</span>
          <button onClick={reset}>Try again</button>
        </div>
      )}
    </div>
  );
}
