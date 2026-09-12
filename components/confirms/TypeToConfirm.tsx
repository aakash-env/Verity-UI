"use client";

import { useState, useRef, useId } from "react";
import type { Risk } from "./HoldToConfirm";

export interface TypeToConfirmProps {
  risk?: Risk;
  title?: string;
  consequence?: string;
  confirmPhrase: string; // exact string user must type
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  onError?: (err: unknown) => void;
  disabled?: boolean;
  loading?: boolean;
  hideMeta?: boolean;
}

type State = "idle" | "loading" | "success" | "error";

export function TypeToConfirm({
  risk = "irreversible",
  title = "Confirm deletion",
  consequence = "This cannot be undone.",
  confirmPhrase,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  onError,
  disabled = false,
  hideMeta = false,
}: TypeToConfirmProps) {
  const [value, setValue] = useState("");
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const pendingRef = useRef(false);

  const matches = value === confirmPhrase;
  const isDisabled = disabled || !matches || state === "loading" || state === "success";

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!matches || pendingRef.current) return;
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
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setValue("");
      onCancel?.();
    }
    if (e.key === "Enter" && matches) {
      handleSubmit();
    }
  };

  const handleReset = () => {
    setValue("");
    setState("idle");
    setErrorMsg(null);
    pendingRef.current = false;
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div className="type-confirm" data-risk={risk} data-state={state}>
      {!hideMeta && (
        <div className="type-confirm__meta">
          <p className="type-confirm__title">{title}</p>
          <p className="type-confirm__consequence">{consequence}</p>
        </div>
      )}

      {state !== "success" ? (
        <form onSubmit={handleSubmit} noValidate>
          <div className="type-confirm__field">
            <label htmlFor={inputId} className="type-confirm__label">
              Type{" "}
              <code className="type-confirm__phrase">
                {confirmPhrase}
              </code>{" "}
              to confirm
            </label>
            <input
              ref={inputRef}
              id={inputId}
              type="text"
              className="type-confirm__input"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (state === "error") {
                  setState("idle");
                  setErrorMsg(null);
                }
              }}
              onKeyDown={handleKeyDown}
              disabled={state === "loading"}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-describedby={
                errorMsg ? `${inputId}-error` : `${inputId}-hint`
              }
              data-match={matches ? "true" : "false"}
            />
            <span id={`${inputId}-hint`} className="type-confirm__hint sr-only">
              {matches ? "Input matches, you may confirm" : `Type ${confirmPhrase} exactly to enable confirm`}
            </span>
          </div>

          {errorMsg && (
            <p id={`${inputId}-error`} className="type-confirm__error" role="alert">
              {errorMsg}
            </p>
          )}

          <div className="type-confirm__actions">
            <button
              type="submit"
              className="type-confirm__submit"
              disabled={isDisabled}
              data-risk={risk}
            >
              {state === "loading" ? "Processing…" : confirmLabel}
            </button>
            <button
              type="button"
              className="type-confirm__cancel"
              onClick={() => {
                setValue("");
                onCancel?.();
              }}
              disabled={state === "loading"}
            >
              {cancelLabel}
            </button>
          </div>
        </form>
      ) : (
        <div className="type-confirm__success" role="status">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <span>Done</span>
          <button className="type-confirm__reset-btn" onClick={handleReset} type="button">
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
