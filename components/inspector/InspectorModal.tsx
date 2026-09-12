"use client";

import React, { useState, useEffect } from "react";
import type { Risk } from "../confirms/HoldToConfirm";
import {
  HoldToConfirm,
  TypeToConfirm,
  UndoToast,
  SlideToDelete,
  TwoStepReview,
  InlineRowConfirm,
  DangerousToggle,
} from "../confirms";
import { FannedCards } from "../blocks/FannedCards";
import { TaskChecklist } from "../blocks/TaskChecklist";
import { ColorSwatches } from "../blocks/ColorSwatches";
import { RadialOrb } from "../blocks/RadialOrb";
import { ImagesBadgeDemo } from "../blocks/ImagesBadgeDemo";
import { TextHoverEffectDemo } from "../blocks/TextHoverEffectDemo";
import { TooltipCardDemo } from "../blocks/TooltipCardDemo";
import { CanvasTextDemo } from "../blocks/CanvasTextDemo";
import { CardSpotlightDemo } from "../blocks/CardSpotlightDemo";
import { InputOtpDemo } from "../blocks/InputOtpDemo";

export interface BlockConfig {
  id: string;
  name: string;
  category: "IRREVERSIBLE" | "FINANCIAL" | "LOW" | "INTERACTION" | "SELECTION" | "CREATIVE" | "SECURITY" | string;
  risk?: Risk;
  tagline: string;
  description: string;
  codeReact: string;
  codeTailwind?: string;
  codeCss?: string;
}

interface InspectorModalProps {
  block: BlockConfig | null;
  onClose: () => void;
}

export function InspectorModal({ block, onClose }: InspectorModalProps) {
  const [tab, setTab] = useState<"tune" | "code">("tune");
  const [copiedTarget, setCopiedTarget] = useState<string | null>(null);
  const [shared, setShared] = useState(false);
  const [addedToBench, setAddedToBench] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // Inspector interactive tweaks (matching bencho.dev controls)
  const [stageFill, setStageFill] = useState<"dark" | "light">("dark");
  const [strokeOn, setStrokeOn] = useState<boolean>(false);
  const [bounceVal, setBounceVal] = useState<number>(50);
  const [cornerVal, setCornerVal] = useState<number>(18);
  const [boxVal, setBoxVal] = useState<number>(18);

  useEffect(() => {
    if (block) {
      setTab("tune");
      setResetKey((prev) => prev + 1);
      setAddedToBench(false);
      setShared(false);
    }
  }, [block]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!block) return null;

  const handleCopy = async (text: string, target = "all") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTarget(target);
      setTimeout(() => setCopiedTarget(null), 1800);
    } catch {
      // ignore
    }
  };

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/?c=${block.id}`;
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleAddToBench = () => {
    setAddedToBench(true);
    setTimeout(() => setAddedToBench(false), 2500);
  };

  const renderComponentPreview = () => {
    switch (block.id) {
      case "radial-orb":
        return <RadialOrb key={resetKey} />;

      case "images-badge":
        return <ImagesBadgeDemo key={resetKey} />;

      case "text-hover-effect":
        return <TextHoverEffectDemo key={resetKey} />;

      case "tooltip-card":
        return <TooltipCardDemo key={resetKey} />;

      case "canvas-text":
        return <CanvasTextDemo key={resetKey} />;

      case "card-spotlight":
        return <CardSpotlightDemo inModal key={resetKey} />;

      case "input-otp":
        return <InputOtpDemo inModal key={resetKey} />;

      case "fanned-cards":
        return <FannedCards key={resetKey} />;

      case "task-checklist":
        return <TaskChecklist key={resetKey} />;

      case "palette-swatches":
        return <ColorSwatches key={resetKey} />;

      case "hold-to-confirm":
        return (
          <HoldToConfirm
            key={resetKey}
            risk="irreversible"
            title="Drop production cluster"
            consequence="Cluster db-prod-01 and all replicas will be deleted immediately."
            confirmLabel="Hold to drop"
            holdDuration={1200}
            onConfirm={async () => {
              await new Promise((r) => setTimeout(r, 800));
            }}
          />
        );

      case "type-to-confirm":
        return (
          <TypeToConfirm
            key={resetKey}
            risk="irreversible"
            title="Permanently remove repository"
            consequence="This repository and its entire git history will be permanently deleted."
            confirmPhrase="verity/payments-core"
            confirmLabel="Delete repository"
            onConfirm={async () => {
              await new Promise((r) => setTimeout(r, 700));
            }}
          />
        );

      case "undo-toast":
        return (
          <UndoToast
            key={resetKey}
            risk="low"
            title="Archive deployment build"
            consequence="Build artifact #8491 has been archived."
            actionLabel="Archive build log"
            undoLabel="Undo"
            duration={6000}
            onConfirm={async () => {
              await new Promise((r) => setTimeout(r, 300));
            }}
          />
        );

      case "slide-to-delete":
        return (
          <SlideToDelete
            key={resetKey}
            risk="irreversible"
            title="Revoke root API credential"
            consequence="Active background workers will immediately receive HTTP 401."
            confirmLabel="Slide to revoke key →"
            threshold={0.8}
            onConfirm={async () => {
              await new Promise((r) => setTimeout(r, 600));
            }}
          />
        );

      case "two-step-review":
        return (
          <TwoStepReview
            key={resetKey}
            risk="financial"
            title="Downgrade organization plan"
            consequence="You are about to downgrade from Enterprise to Starter."
            consequences={[
              { label: "Dedicated compute nodes terminated", count: 4, critical: true },
              { label: "Seats reduced from 50 to 5", critical: true },
              { label: "Audit log retention reduced to 7 days" },
              { label: "Priority SLA support disabled" },
            ]}
            confirmLabel="Downgrade plan"
            onConfirm={async () => {
              await new Promise((r) => setTimeout(r, 800));
            }}
          />
        );

      case "inline-row-confirm":
        return (
          <InlineRowConfirm
            key={resetKey}
            risk="irreversible"
            title="Manage read replicas"
            consequence="Terminating this replica removes the read query endpoint."
            rowLabel="replica-us-east-4a"
            rowMeta="PostgreSQL 16 · 1.2 TB storage"
            confirmLabel="Delete"
            cancelLabel="Keep"
            onConfirm={async () => {
              await new Promise((r) => setTimeout(r, 700));
            }}
          />
        );

      case "dangerous-toggle":
        return (
          <DangerousToggle
            key={resetKey}
            risk="irreversible"
            title="Hardware security enforcement"
            consequence="Disabling hardware 2FA removes WebAuthn protection from logins."
            label="Require Security Key"
            description="Enforce hardware FIDO2 key for all workspace members"
            defaultChecked={true}
            holdDuration={600}
            confirmLabel="Turn off security key"
            onConfirm={async () => {
              await new Promise((r) => setTimeout(r, 600));
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="bencho-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${block.name} Inspector`}
    >
      <div className="bencho-modal-container">
        {/* Left Side: Cinema Stage Card */}
        <div
          className={`bencho-stage-card ${stageFill === "light" ? "bencho-stage-card--light" : ""
            } ${strokeOn ? "bencho-stage-card--stroke" : ""}`}
        >
          {/* Top Stage Bar: Bookmark & Audio toggles */}
          <div className="flex items-center justify-end gap-2.5 z-10">
            <button
              type="button"
              onClick={() => setBookmarked((b) => !b)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#eceae5]/50 hover:text-[#eceae5] transition-colors cursor-pointer"
              title={bookmarked ? "Bookmarked" : "Bookmark block"}
              aria-label="Bookmark block"
            >
              <BookmarkIcon filled={bookmarked} />
            </button>
            <button
              type="button"
              onClick={() => setSoundEnabled((s) => !s)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#eceae5]/50 hover:text-[#eceae5] transition-colors cursor-pointer"
              title={soundEnabled ? "Mute audio" : "Unmute audio"}
              aria-label="Toggle sound"
            >
              {soundEnabled ? <VolumeOnIcon /> : <VolumeOffIcon />}
            </button>
          </div>

          {/* Stage Center Preview */}
          <div className="flex-1 flex items-center justify-center py-6">
            <div
              style={{
                borderRadius: `${cornerVal}px`,
                transition: "border-radius 120ms ease",
              }}
            >
              {renderComponentPreview()}
            </div>
          </div>

          {/* Bottom Stage Bar: Replay / Play trigger */}
          <div className="flex items-center justify-end z-10">
            <button
              type="button"
              onClick={() => setResetKey((k) => k + 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#eceae5]/40 hover:text-[#eceae5] transition-colors cursor-pointer"
              title="Replay interaction"
              aria-label="Replay interaction"
            >
              <PlayIcon />
            </button>
          </div>
        </div>

        {/* Right Side: Bencho Inspector Panel */}
        <div className="bencho-inspector-card">
          {/* Inspector Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="bencho-inspector__title">
                {block.name}
              </h2>
              <span className="bencho-inspector__subtitle">
                {block.category || "PRESS"}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="bencho-inspector__close"
              aria-label="Close inspector"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Segmented Switcher: Icons only (Sliders vs Code) */}
          <div className="bencho-inspector__tabs" role="tablist" aria-label="Panel">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "tune"}
              onClick={() => setTab("tune")}
              className={`bencho-inspector__tab ${tab === "tune" ? "bencho-inspector__tab--active" : ""}`}
              title="Controls"
              aria-label="Controls"
            >
              <SlidersIcon />
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "code"}
              onClick={() => setTab("code")}
              className={`bencho-inspector__tab ${tab === "code" ? "bencho-inspector__tab--active" : ""}`}
              title="Code"
              aria-label="Code"
            >
              <CodeIcon />
            </button>
          </div>

          {/* Controls list */}
          <div className="bencho-inspector__controls">
            {tab === "tune" ? (
              <div className="space-y-3">
                {/* Row 1: Fill [ Light | Dark ] */}
                <div className="bencho-inspector__toggle-row">
                  <span className="bencho-inspector__toggle-label">Fill</span>
                  <div className="bencho-inspector__pill-switch">
                    <button
                      type="button"
                      onClick={() => setStageFill("light")}
                      className={`bencho-inspector__pill-btn ${stageFill === "light" ? "bencho-inspector__pill-btn--active" : ""
                        }`}
                    >
                      Light
                    </button>
                    <button
                      type="button"
                      onClick={() => setStageFill("dark")}
                      className={`bencho-inspector__pill-btn ${stageFill === "dark" ? "bencho-inspector__pill-btn--active" : ""
                        }`}
                    >
                      Dark
                    </button>
                  </div>
                </div>

                {/* Row 2: Stroke [ Off | On ] */}
                <div className="bencho-inspector__toggle-row">
                  <span className="bencho-inspector__toggle-label">Stroke</span>
                  <div className="bencho-inspector__pill-switch">
                    <button
                      type="button"
                      onClick={() => setStrokeOn(false)}
                      className={`bencho-inspector__pill-btn ${!strokeOn ? "bencho-inspector__pill-btn--active" : ""
                        }`}
                    >
                      Off
                    </button>
                    <button
                      type="button"
                      onClick={() => setStrokeOn(true)}
                      className={`bencho-inspector__pill-btn ${strokeOn ? "bencho-inspector__pill-btn--active" : ""
                        }`}
                    >
                      On
                    </button>
                  </div>
                </div>

                {/* Row 3: Bounce [ Bounce | 50 ] */}
                <div className="bencho-inspector__param-row">
                  <div className="bencho-inspector__param-label">
                    Bounce
                  </div>
                  <div className="bencho-inspector__param-value">
                    <input
                      type="number"
                      value={bounceVal}
                      onChange={(e) => setBounceVal(Number(e.target.value))}
                      className="bencho-inspector__param-input"
                    />
                  </div>
                </div>

                {/* Row 4: Corner [ Corner | 18px ] */}
                <div className="bencho-inspector__param-row">
                  <div className="bencho-inspector__param-label">
                    Corner
                  </div>
                  <div className="bencho-inspector__param-value">
                    <span>{cornerVal}px</span>
                  </div>
                </div>

                {/* Row 5: Box [ Box | 18px ] */}
                <div className="bencho-inspector__param-row">
                  <div className="bencho-inspector__param-label">
                    Box
                  </div>
                  <div className="bencho-inspector__param-value">
                    <span>{boxVal}px</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Code Tab — Exact Bencho Dual View */
              (() => {
                const tailwindSnippet = block.codeTailwind || block.codeCss;
                return (
                  <div className="bencho-code-container">
                    {/* Tailwind CSS Block */}
                    {tailwindSnippet && (
                      <div className="bencho-code-section">
                        <div className="bencho-code-header">
                          <span className="bencho-code-label">TAILWIND</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(tailwindSnippet, "tailwind")}
                            className="bencho-code-copy-btn"
                            title="Copy Tailwind CSS"
                            aria-label="Copy Tailwind CSS"
                          >
                            {copiedTarget === "tailwind" ? (
                              <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-sans font-medium">
                                ✓ Copied
                              </span>
                            ) : (
                              <CopyIcon />
                            )}
                          </button>
                        </div>
                        <div className="bencho-code-box">
                          <pre className="bencho-code-pre">
                            <code>{renderHighlightedCode(tailwindSnippet, "tailwind")}</code>
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* React Block */}
                    <div className="bencho-code-section">
                      <div className="bencho-code-header">
                        <span className="bencho-code-label">REACT</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(block.codeReact, "react")}
                          className="bencho-code-copy-btn"
                          title="Copy React"
                          aria-label="Copy React"
                        >
                          {copiedTarget === "react" ? (
                            <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-sans font-medium">
                              ✓ Copied
                            </span>
                          ) : (
                            <CopyIcon />
                          )}
                        </button>
                      </div>
                      <div className="bencho-code-box" style={{ maxHeight: tailwindSnippet ? "130px" : "280px" }}>
                        <pre className="bencho-code-pre">
                          <code>{renderHighlightedCode(block.codeReact, "tsx")}</code>
                        </pre>
                      </div>
                    </div>

                    <p className="bencho-code-license">
                      Blocks are MIT licensed. Use them anywhere, including at work.
                    </p>
                  </div>
                );
              })()
            )}
          </div>

          {/* Bottom Actions: Share & Add to bench */}
          <div className="bencho-inspector__actions">
            <button
              type="button"
              onClick={handleShare}
              className="bencho-inspector__share-btn"
            >
              <ShareIcon />
              <span>{shared ? "Link Copied!" : "Share"}</span>
            </button>

            <button
              type="button"
              onClick={handleAddToBench}
              className="bencho-inspector__add-btn"
            >
              {addedToBench ? "Added to bench! ✓" : "Add to bench"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlidersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="9" y1="4.5" x2="9" y2="9.5" />
      <line x1="4" y1="17" x2="20" y2="17" />
      <line x1="15" y1="14.5" x2="15" y2="19.5" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="7 8 3 12 7 16" />
      <polyline points="17 8 21 12 17 16" />
      <line x1="14" y1="4" x2="10" y2="20" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function BookmarkIcon({ filled }: { filled?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}

function VolumeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" x2="17" y1="9" y2="15" />
      <line x1="17" x2="23" y1="9" y2="15" />
    </svg>
  );
}

function VolumeOnIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="13" height="13" x="9" y="9" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function renderHighlightedCode(code: string, lang: "tsx" | "css" | "tailwind") {
  if (!code) return null;

  const lines = code.split("\n");

  if (lang === "tailwind") {
    return lines.map((line, lineIdx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("//") || trimmed.startsWith("/*")) {
        return (
          <div key={lineIdx} className="leading-[1.6]">
            <span className="text-zinc-500 italic">{line}</span>
          </div>
        );
      }

      const classMatch = line.match(/^(\s*)(className=)(["'])(.*)(["'])(.*)$/);
      if (classMatch) {
        const [, indent, attr, openQuote, classList, closeQuote, rest] = classMatch;
        const tokens = classList.split(/(\s+)/);
        return (
          <div key={lineIdx} className="leading-[1.6]">
            {indent}
            <span className="text-sky-400 font-medium">{attr}</span>
            <span className="text-emerald-400">{openQuote}</span>
            {tokens.map((token, i) => {
              if (/^\s+$/.test(token)) {
                return token;
              }
              const lastColon = token.lastIndexOf(":");
              if (lastColon !== -1) {
                const modifier = token.slice(0, lastColon + 1);
                const utility = token.slice(lastColon + 1);
                return (
                  <span key={i}>
                    <span className="text-purple-400 font-medium">{modifier}</span>
                    <span className="text-emerald-300">{utility}</span>
                  </span>
                );
              }
              if (token.startsWith("[") || token.includes("[")) {
                return (
                  <span key={i} className="text-amber-300">
                    {token}
                  </span>
                );
              }
              return (
                <span key={i} className="text-emerald-300">
                  {token}
                </span>
              );
            })}
            <span className="text-emerald-400">{closeQuote}</span>
            {rest}
          </div>
        );
      }

      return (
        <div key={lineIdx} className="leading-[1.6]">
          <span className="text-zinc-300">{line.length > 0 ? line : "\u00A0"}</span>
        </div>
      );
    });
  }

  return lines.map((line, lineIdx) => {
    const elements: React.ReactNode[] = [];

    const regex =
      lang === "tsx"
        ? /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("[^"]*"|'[^']*'|`[^`]*`)|(<\/?[\w\d.-]+|\/?>)|(\b(?:import|from|export|default|const|let|var|return|async|await|function|type|interface)\b)|([\w\d.-]+(?=\=))|(\b(?:true|false|null|undefined|\d+)\b)/g
        : /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("[^"]*"|'[^']*')|([.#][\w\d.-]+)|([a-z-]+(?=\s*:))|(\b(?:var\([^)]+\)|\d+px|\d+ms|\d+%|none|true|false)\b)/g;

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        elements.push(line.substring(lastIndex, match.index));
      }

      const [, comment, str, tagOrSelector, kwOrProp, propOrVal, lit] = match;

      if (comment) {
        elements.push(
          <span key={match.index} className="text-zinc-500 italic">
            {comment}
          </span>
        );
      } else if (str) {
        elements.push(
          <span key={match.index} className="text-emerald-400">
            {str}
          </span>
        );
      } else if (tagOrSelector) {
        elements.push(
          <span key={match.index} className="text-sky-400 font-medium">
            {tagOrSelector}
          </span>
        );
      } else if (kwOrProp) {
        elements.push(
          <span key={match.index} className="text-purple-400 font-medium">
            {kwOrProp}
          </span>
        );
      } else if (propOrVal) {
        elements.push(
          <span key={match.index} className="text-amber-300">
            {propOrVal}
          </span>
        );
      } else if (lit) {
        elements.push(
          <span key={match.index} className="text-orange-400">
            {lit}
          </span>
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < line.length) {
      elements.push(line.substring(lastIndex));
    }

    return (
      <div key={lineIdx} className="leading-[1.6]">
        {elements.length > 0 ? elements : "\u00A0"}
      </div>
    );
  });
}

