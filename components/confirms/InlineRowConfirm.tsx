"use client";

import { useState, useRef } from "react";
import type { Risk } from "./HoldToConfirm";

export interface InlineRowConfirmProps {
  risk?: Risk;
  title?: string;
  consequence?: string;
  rowLabel?: string;
  rowMeta?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  onError?: (err: unknown) => void;
  disabled?: boolean;
  hideMeta?: boolean;
}

type RowState = "normal" | "confirming" | "loading" | "success" | "error";

export function InlineRowConfirm({
  risk = "irreversible",
  title = "Inline row confirm",
  consequence = "Row morphs in place — no modal.",
  rowLabel = "database-prod-2024",
  rowMeta = "Last accessed 2 hours ago",
  confirmLabel = "Delete",
  cancelLabel = "Keep",
  onConfirm,
  onCancel,
  onError,
  disabled = false,
  hideMeta = false,
}: InlineRowConfirmProps) {
  const [rowState, setRowState] = useState<RowState>("normal");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const pendingRef = useRef(false);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);
  const deleteBtnRef = useRef<HTMLButtonElement>(null);

  const startConfirm = () => {
    setRowState("confirming");
    setTimeout(() => cancelBtnRef.current?.focus(), 50);
  };

  const handleConfirm = async () => {
    if (pendingRef.current) return;
    pendingRef.current = true;
    setRowState("loading");
    try {
      await Promise.resolve(onConfirm());
      setRowState("success");
    } catch (err) {
      setRowState("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      onError?.(err);
      pendingRef.current = false;
    }
  };

  const handleCancel = () => {
    setRowState("normal");
    onCancel?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && rowState === "confirming") {
      handleCancel();
    }
    if (e.key === "Enter" && rowState === "confirming") {
      handleConfirm();
    }
  };

  const reset = () => {
    setRowState("normal");
    setErrorMsg(null);
    pendingRef.current = false;
  };

  return (
    <div className="inline-row-demo" data-risk={risk}>
      {!hideMeta && (
        <div className="inline-row__meta">
          <p className="inline-row__title">{title}</p>
          <p className="inline-row__consequence">{consequence}</p>
        </div>
      )}

      {/* The row */}
      <div
        className="inline-row__row"
        data-state={rowState}
        onKeyDown={handleKeyDown}
        aria-label={`Row for ${rowLabel}`}
      >
        {/* Row content — always present */}
        <div className="inline-row__row-content">
          <span className="inline-row__row-label">{rowLabel}</span>
          <span className="inline-row__row-meta">{rowMeta}</span>
        </div>

        {/* Actions: morph between normal ↔ confirming */}
        <div className="inline-row__row-actions" aria-live="polite">
          {rowState === "normal" && (
            <button
              className="inline-row__delete-trigger"
              onClick={startConfirm}
              disabled={disabled}
              data-risk={risk}
              aria-label={`Delete ${rowLabel}`}
            >
              Delete
            </button>
          )}

          {rowState === "confirming" && (
            <span className="inline-row__confirm-group">
              <span className="inline-row__confirm-question">Delete?</span>
              <button
                ref={deleteBtnRef}
                className="inline-row__confirm-yes"
                onClick={handleConfirm}
                data-risk={risk}
                aria-label={`Confirm delete ${rowLabel}`}
              >
                {confirmLabel}
              </button>
              <button
                ref={cancelBtnRef}
                className="inline-row__confirm-no"
                onClick={handleCancel}
                aria-label="Cancel delete"
              >
                {cancelLabel}
              </button>
            </span>
          )}

          {rowState === "loading" && (
            <span className="inline-row__loading" role="status" aria-live="polite">
              <span className="inline-row__spinner" aria-hidden="true" />
              <span className="sr-only">Deleting…</span>
            </span>
          )}

          {rowState === "success" && (
            <span className="inline-row__success" role="status">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <button className="inline-row__reset" onClick={reset}>Reset</button>
            </span>
          )}

          {rowState === "error" && (
            <span className="inline-row__error" role="alert">
              <span>{errorMsg}</span>
              <button onClick={reset}>Retry</button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
