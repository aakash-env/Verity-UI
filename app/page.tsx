"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import {
  InspectorModal,
  type BlockConfig,
} from "@/components/inspector/InspectorModal";
import {
  HoldToConfirm,
  TypeToConfirm,
  UndoToast,
  TwoStepReview,
  InlineRowConfirm,
  DangerousToggle,
} from "@/components/confirms";
import { FannedCards } from "@/components/blocks/FannedCards";
import { ColorSwatches } from "@/components/blocks/ColorSwatches";
import { ImagesBadgeDemo } from "@/components/blocks/ImagesBadgeDemo";
import { TextHoverEffectDemo } from "@/components/blocks/TextHoverEffectDemo";
import { TooltipCardDemo } from "@/components/blocks/TooltipCardDemo";
import { CanvasTextDemo } from "@/components/blocks/CanvasTextDemo";
import { InputOtpDemo } from "@/components/blocks/InputOtpDemo";
import { SlidersHorizontal, Play } from "lucide-react";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const BLOCKS: BlockConfig[] = [
  {
    id: "images-badge",
    name: "3D images badge",
    category: "INTERACTION",
    tagline: "3D folder badge that fans out preview images on hover",
    description:
      "Hover-triggered 3D folder flap that unpacks floating preview cards with spring physics and depth stacking.",
    codeReact: `import { ImagesBadge } from "@/components/ui/images-badge";

<ImagesBadge
  text="View project gallery"
  images={[
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23"
  ]}
/>`,
    codeCss: `/* Tailwind CSS utility classes */
// Badge wrapper
className="inline-flex cursor-pointer items-center gap-3.5 px-4 py-2.5 rounded-full bg-[#1e2025] hover:bg-[#26282f] border border-white/10 text-sm font-medium text-[#eceae5] shadow-xl transition-all [perspective:1000px] [transform-style:preserve-3d]"

// 3D Folder back & flap
className="absolute inset-0 rounded-[5px] bg-gradient-to-b from-amber-400 to-amber-500 shadow-sm [transform-style:preserve-3d]"

// Popping preview cards
className="absolute top-0.5 left-1/2 origin-bottom overflow-hidden rounded-[4px] bg-neutral-900 shadow-md ring-1 ring-white/20"`,
  },
  {
    id: "text-hover-effect",
    name: "Text hover effect",
    category: "CREATIVE",
    tagline: "Cursor-tracking chromatic gradient illumination mask",
    description:
      "Interactive SVG text with outline stroke animation, user cursor radial gradient mask, and dynamic chromatic light reveal.",
    codeReact: `import { TextHoverEffect } from "@/components/ui/text-hover-effect";

<TextHoverEffect text="VERITY" duration={0.15} />`,
    codeCss: `/* Tailwind CSS utility classes */
// SVG canvas wrapper
className="select-none cursor-pointer w-full max-w-[340px] h-auto"

// Text ghost outline
className="fill-transparent stroke-neutral-700 font-sans text-6xl font-bold tracking-tight opacity-30"

// Text animated stroke
className="fill-transparent stroke-neutral-500 font-sans text-6xl font-bold tracking-tight"

// Chromatic reveal fill
className="fill-transparent stroke-[url(#textGradient)] font-sans text-6xl font-bold tracking-tight [mask:url(#textMask)]"`,
  },
  {
    id: "tooltip-card",
    name: "Tooltip card",
    category: "SELECTION",
    tagline: "Spring-animated contextual floating profile card",
    description:
      "Contextual trigger card with spring-animated floating popup containing rich operator metadata, avatar, and live status indicator.",
    codeReact: `import { TooltipCard } from "@/components/ui/tooltip-card";

<TooltipCard
  side="top"
  content={
    <div className="flex items-center gap-3">
      <img src="/avatar.jpg" className="w-8 h-8 rounded-full" />
      <div>
        <p className="text-xs font-semibold">Elena Rostova</p>
        <p className="text-[10px] text-muted">@elena · Designer</p>
      </div>
    </div>
  }
>
  <button className="px-4 py-2 rounded-xl bg-neutral-900 border">
    Hover operator profile
  </button>
</TooltipCard>`,
    codeCss: `/* Tailwind CSS utility classes */
// Trigger container
className="relative inline-block select-none"

// Floating tooltip card
className="absolute z-50 min-w-[220px] rounded-2xl bg-[#1c1d22]/95 border border-white/10 p-3.5 text-[#eceae5] shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl"

// Interactive trigger button
className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#1f2024] hover:bg-[#282a30] border border-white/8 transition-all shadow-lg cursor-pointer"`,
  },
  {
    id: "canvas-text",
    name: "Canvas generative text",
    category: "CREATIVE",
    tagline: "Fluid bezier sine curve wave text rendered on HTML5 canvas",
    description:
      "Interactive multi-stop generative sine waves rendered in real-time on HTML5 canvas using composite masking.",
    codeReact: `import { CanvasText } from "@/components/ui/canvas-text";

<CanvasText
  text="VERITY"
  colors={["#38bdf8", "#818cf8", "#c084fc", "#f472b6", "#fb7185", "#34d399"]}
  lineGap={7}
  lineWidth={1.6}
  curveIntensity={40}
  animationDuration={4}
/>`,
    codeCss: `/* Tailwind CSS utility classes */
// Responsive wrapper
className="relative inline-block select-none text-5xl font-black tracking-tight"

// Background canvas element
className="pointer-events-none absolute top-0 left-0 w-full h-full"

// Surface background token
className="bg-[#151619] dark:bg-[#151619]"`,
  },
  {
    id: "input-otp",
    name: "Input OTP",
    category: "SELECTION",
    tagline: "Segmented one-time code input with 3D flip and sweep trails",
    description:
      "A segmented one-time-password input with spring-animated 3D flip digits, active focus rings, paste sweep trails, and validation states.",
    codeReact: `import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

export function OtpVerification() {
  const [value, setValue] = React.useState("");

  return (
    <InputOTP
      maxLength={6}
      value={value}
      onChange={(value) => setValue(value)}
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}`,
    codeCss: `/* Tailwind CSS utility classes */
// Segmented slot
className="relative flex size-14 items-center justify-center rounded-xl bg-foreground/[0.06] text-2xl font-semibold tabular-nums ring-1 ring-foreground/8 transition-[background-color,color] duration-150 ease-out outline-none data-[active=true]:z-10 data-[active=true]:bg-foreground/10 motion-reduce:transition-none"

// Active focus spring ring
className="pointer-events-none absolute inset-0 rounded-xl ring-[3px] ring-foreground/75"

// Slot container group
className="flex items-center gap-3"

// Separator minus icon
className="flex items-center text-foreground/40 [&_svg:not([class*='size-'])]:size-5"`,
  },
  {
    id: "fanned-cards",
    name: "3D fanned card deck",
    category: "INTERACTION",
    tagline: "Interactive perspective fan with depth swapping",
    description:
      "Layered 3D cards with hover fanning physics, specular gloss reflection, and instant click-to-front depth sorting.",
    codeReact: `import { FannedCards } from "@/components/blocks/FannedCards";

<FannedCards />`,
    codeCss: `/* Tailwind CSS utility classes */
// 3D Deck container
className="relative w-[280px] h-[170px] flex items-center justify-center [perspective:1000px] select-none"

// Fanned Card item
className="absolute w-[112px] h-[154px] rounded-[18px] overflow-hidden border border-white/12 shadow-2xl transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] [transform-style:preserve-3d]"`,
  },
  {
    id: "hold-to-confirm",
    name: "Hold to confirm",
    category: "IRREVERSIBLE",
    risk: "irreversible",
    tagline: "Continuous hold required to execute",
    description:
      "Replaces standard dialogs with a deliberate progress hold. Zero artificial easing — releasing early snaps back immediately.",
    codeReact: `import { HoldToConfirm } from "@/components/confirms";

<HoldToConfirm
  risk="irreversible"
  title="Drop production cluster"
  consequence="Cluster db-prod-01 and all replicas will be deleted immediately."
  confirmLabel="Hold to drop"
  holdDuration={1200}
  onConfirm={async () => {
    await api.deleteCluster("db-prod-01");
  }}
/>`,
    codeCss: `/* Tailwind CSS utility classes */
// Button container
className="relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-[#151619] border border-white/10 select-none"

// Progress circle ring
className="relative w-20 h-20 rounded-full flex items-center justify-center border-2 border-red-500/20 active:scale-95 transition-transform"

// Hold stroke fill
className="stroke-red-500 transition-none"`,
  },
  {
    id: "type-to-confirm",
    name: "Type to confirm",
    category: "IRREVERSIBLE",
    risk: "irreversible",
    tagline: "Strict exact-phrase matching",
    description:
      "Forces the operator to type the exact resource identifier before the delete button unlocks. No trim shortcuts.",
    codeReact: `import { TypeToConfirm } from "@/components/confirms";

<TypeToConfirm
  risk="irreversible"
  title="Permanently remove repository"
  consequence="This repository and its entire git history will be permanently deleted."
  confirmPhrase="verity/payments-core"
  confirmLabel="Delete repository"
  onConfirm={async () => {
    await api.deleteRepo("verity/payments-core");
  }}
/>`,
    codeCss: `/* Tailwind CSS utility classes */
// Confirmation box
className="flex flex-col gap-3 p-5 rounded-2xl bg-[#151619] border border-white/10"

// Exact-match input
className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-[#eceae5] focus:outline-none focus:border-red-500 data-[match=true]:border-red-500"

// Delete button
className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors"`,
  },
  {
    id: "undo-toast",
    name: "Undo toast",
    category: "LOW",
    risk: "low",
    tagline: "Optimistic action with rollback window",
    description:
      "Applies low-risk changes immediately with an honest linear countdown bar. 1-click instant rollback without modal interruptions.",
    codeReact: `import { UndoToast } from "@/components/confirms";

<UndoToast
  risk="low"
  title="Archive deployment build"
  consequence="Build artifact #8491 has been archived."
  actionLabel="Archive build log"
  undoLabel="Undo"
  duration={6000}
  onConfirm={async () => {
    await api.archiveBuild(8491);
  }}
  onUndo={() => {
    console.log("Rolled back");
  }}
/>`,
    codeCss: `/* Tailwind CSS utility classes */
// Toast wrapper
className="flex items-center justify-between gap-4 px-5 py-3 rounded-2xl bg-[#1c1d22] border border-white/10 shadow-2xl"

// Linear countdown progress bar
className="h-1 rounded-full bg-[#eceae5] transition-none w-full"

// Rollback undo action
className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-[#eceae5] transition-colors"`,
  },
  {
    id: "two-step-review",
    name: "Two-step review",
    category: "FINANCIAL",
    risk: "financial",
    tagline: "Inline consequence breakdown",
    description:
      "Itemizes seat reductions, prorated charges, and SLA removals on step 1 before unlocking step 2 final confirmation.",
    codeReact: `import { TwoStepReview } from "@/components/confirms";

<TwoStepReview
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
    await api.downgradePlan();
  }}
/>`,
    codeCss: `/* Tailwind CSS utility classes */
// Review breakdown card
className="flex flex-col gap-3 p-6 rounded-2xl bg-[#151619] border border-white/10 max-w-[320px]"

// Critical consequence row
className="flex items-center justify-between text-xs py-1 text-red-400 font-medium"

// Confirm downgrade button
className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-colors shadow-md"`,
  },
  {
    id: "inline-row-confirm",
    name: "Inline row confirm",
    category: "IRREVERSIBLE",
    risk: "irreversible",
    tagline: "In-place morph without layout jump",
    description:
      "Morphs the table row directly in place. Avoids scroll jumps and disconnect, defaulting focus safely to Cancel.",
    codeReact: `import { InlineRowConfirm } from "@/components/confirms";

<InlineRowConfirm
  risk="irreversible"
  title="Manage read replicas"
  consequence="Terminating this replica removes the read query endpoint."
  rowLabel="replica-us-east-4a"
  rowMeta="PostgreSQL 16 · 1.2 TB storage"
  confirmLabel="Delete"
  cancelLabel="Keep"
  onConfirm={async () => {
    await api.deleteReplica("replica-us-east-4a");
  }}
/>`,
    codeCss: `/* Tailwind CSS utility classes */
// Table row container
className="flex items-center justify-between p-3.5 rounded-xl bg-[#191a1f] border border-white/10 transition-colors data-[confirming=true]:bg-red-500/10 data-[confirming=true]:border-red-500/30"

// Delete confirm button
className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition-colors"

// Cancel keep button
className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-[#eceae5] transition-colors"`,
  },
  {
    id: "palette-swatches",
    name: "Color palette mixer",
    category: "SELECTION",
    tagline: "Harmonic color swatches with one-click copy & shuffle",
    description:
      "Fluid squircle color swatches with instant hex code copying, ambient glow, and spring rotational shuffle button.",
    codeReact: `import { ColorSwatches } from "@/components/blocks/ColorSwatches";

<ColorSwatches />`,
    codeCss: `/* Tailwind CSS utility classes */
// Swatch pod
className="flex items-center gap-3 p-2 rounded-[20px] bg-[#1f2024] border border-white/6 shadow-2xl"

// Squircle color swatch
className="w-11 h-11 rounded-[13px] transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-md"

// Shuffle action button
className="w-11 h-11 rounded-[13px] bg-white/5 hover:bg-white/10 border border-white/8 flex items-center justify-center text-[#eceae5] transition-transform active:rotate-180"`,
  },
  {
    id: "dangerous-toggle",
    name: "Dangerous toggle",
    category: "IRREVERSIBLE",
    risk: "irreversible",
    tagline: "Protected switch with hold threshold",
    description:
      "Prevents single-click accidental switch flips on hardware keys or 2FA with hold duration and inline confirmation dialog.",
    codeReact: `import { DangerousToggle } from "@/components/confirms";

<DangerousToggle
  risk="irreversible"
  title="Hardware security enforcement"
  consequence="Disabling hardware 2FA removes WebAuthn protection from logins."
  label="Require Security Key"
  description="Enforce hardware FIDO2 key for all workspace members"
  defaultChecked={true}
  holdDuration={600}
  confirmLabel="Turn off security key"
  onConfirm={async () => {
    await api.setSecurityKey(false);
  }}
/>`,
    codeCss: `/* Tailwind CSS utility classes */
// Protected switch wrapper
className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#151619] border border-white/10"

// Toggle track
className="relative w-12 h-7 rounded-full bg-neutral-800 transition-colors data-[checked=true]:bg-red-600"

// Toggle thumb with spring transition
className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform duration-200 data-[checked=true]:translate-x-5 shadow-sm"`,
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalBlock, setActiveModalBlock] = useState<BlockConfig | null>(null);
  const [cardResetKeys, setCardResetKeys] = useState<Record<string, number>>({});

  const handleReplay = useCallback((blockId: string) => {
    setCardResetKeys((prev) => ({
      ...prev,
      [blockId]: (prev[blockId] || 0) + 1,
    }));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const c = params.get("c");
      if (c) {
        const found = BLOCKS.find((b) => b.id === c);
        if (found) {
          queueMicrotask(() => setActiveModalBlock(found));
        }
      }
    }
  }, []);

  const filteredBlocks = useMemo(() => {
    if (!searchQuery.trim()) return BLOCKS;
    const q = searchQuery.toLowerCase();
    return BLOCKS.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.tagline.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Clean Navigation */}
      <Nav searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Clean Minimal Hero */}
      <header className="bencho-hero">
        <h1 className="bencho-hero__title">
          UI blocks you can bench.
        </h1>
        <p className="bencho-hero__subtitle">
          A library of interactive UI blocks you can explore, tweak, and take straight into your projects.
        </p>
      </header>

      {/* Pure 3-Column Card Grid — No Unnecessary Text */}
      <main id="blocks" className="bencho-grid-container flex-1">
        <div className="bencho-grid">
          {filteredBlocks.map((block) => (
            <div
              key={block.id}
              className="bencho-card group cursor-pointer"
              onClick={() => setActiveModalBlock(block)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setActiveModalBlock(block);
                }
              }}
              aria-label={`Inspect ${block.name}`}
            >
              {/* Isolated demo container - captures component interactions so checking/clicking doesn't open modal */}
              <div
                key={cardResetKeys[block.id] || 0}
                className="bencho-card-demo-wrap"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                }}
              >
                {renderCardComponent(block.id)}
              </div>

              {/* Hover overlay: title on bottom-left, action buttons on bottom-right (exact bencho.dev design) */}
              <div className="bencho-card-overlay">
                <span className="bencho-card-title-hover">
                  {block.name}
                </span>
                <div className="bencho-card-actions-hover">
                  {/* Replay action */}
                  <button
                    type="button"
                    className="bencho-card-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReplay(block.id);
                    }}
                    title="Replay component"
                    aria-label={`Replay ${block.name}`}
                  >
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </button>

                  {/* Tune / Inspect action */}
                  <button
                    type="button"
                    className="bencho-card-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveModalBlock(block);
                    }}
                    title="Inspect & get code"
                    aria-label={`Inspect ${block.name}`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBlocks.length === 0 && (
          <div className="text-center py-24 text-[var(--color-muted)]">
            <p className="text-sm font-medium">
              No components found matching &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        )}
      </main>

      {/* Floating Split-View Inspector Modal */}
      <InspectorModal
        key={activeModalBlock?.id}
        block={activeModalBlock}
        onClose={() => setActiveModalBlock(null)}
      />

      <Footer />
    </div>
  );
}

function renderCardComponent(id: string) {
  switch (id) {
    case "images-badge":
      return <ImagesBadgeDemo />;

    case "text-hover-effect":
      return <TextHoverEffectDemo />;

    case "tooltip-card":
      return <TooltipCardDemo />;

    case "canvas-text":
      return <CanvasTextDemo />;

    case "input-otp":
      return <InputOtpDemo />;

    case "fanned-cards":
      return <FannedCards />;

    case "hold-to-confirm":
      return (
        <HoldToConfirm
          hideMeta
          risk="irreversible"
          confirmLabel="Hold to confirm"
          holdDuration={1200}
          onConfirm={async () => {
            await delay(800);
          }}
        />
      );

    case "type-to-confirm":
      return (
        <TypeToConfirm
          hideMeta
          risk="irreversible"
          confirmPhrase="delete"
          confirmLabel="Delete"
          onConfirm={async () => {
            await delay(700);
          }}
        />
      );

    case "undo-toast":
      return (
        <UndoToast
          hideMeta
          risk="low"
          consequence="Item archived."
          actionLabel="Archive item"
          duration={6000}
          onConfirm={async () => {
            await delay(300);
          }}
        />
      );

    case "two-step-review":
      return (
        <TwoStepReview
          hideMeta
          risk="financial"
          consequences={[
            { label: "Compute nodes removed", count: 4, critical: true },
            { label: "Seats reduced to 5", critical: true },
          ]}
          confirmLabel="Confirm"
          onConfirm={async () => {
            await delay(800);
          }}
        />
      );

    case "inline-row-confirm":
      return (
        <InlineRowConfirm
          hideMeta
          risk="irreversible"
          rowLabel="replica-us-east"
          rowMeta="PostgreSQL 16"
          confirmLabel="Delete"
          cancelLabel="Keep"
          onConfirm={async () => {
            await delay(700);
          }}
        />
      );

    case "palette-swatches":
      return <ColorSwatches />;

    case "dangerous-toggle":
      return (
        <DangerousToggle
          hideMeta
          risk="irreversible"
          label="Security Key"
          description="Require hardware key"
          defaultChecked={true}
          holdDuration={600}
          confirmLabel="Disable"
          onConfirm={async () => {
            await delay(600);
          }}
        />
      );

    default:
      return null;
  }
}
