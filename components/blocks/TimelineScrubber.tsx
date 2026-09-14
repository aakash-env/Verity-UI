"use client";

import React, { useState } from "react";
import { GitCommit, History, RotateCcw } from "lucide-react";

interface Revision {
  id: string;
  hash: string;
  label: string;
  time: string;
  additions: number;
  deletions: number;
  author: string;
}

const REVISIONS: Revision[] = [
  { id: "1", hash: "8f2a1b", label: "feat: add oauth pkce", time: "10m ago", additions: 42, deletions: 6, author: "Aakash" },
  { id: "2", hash: "3c7e90", label: "fix: sanitize redirect", time: "1h ago", additions: 18, deletions: 12, author: "Alex" },
  { id: "3", hash: "b5182d", label: "perf: cache font asset", time: "3h ago", additions: 5, deletions: 31, author: "Elena" },
  { id: "4", hash: "e9041a", label: "refactor: isolate cards", time: "1d ago", additions: 64, deletions: 28, author: "David" },
];

export function TimelineScrubber() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeRev = REVISIONS[activeIdx];

  return (
    <div
      className="flex flex-col items-center justify-center gap-3 select-none cursor-default"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="timeline-scrubber-card">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text,#eceae5)]">
            <History className="w-3.5 h-3.5 text-sky-400" />
            <span>Audit Scrubber</span>
          </div>
          <span className="text-[10px] font-mono text-[var(--color-muted,#8c8e96)] bg-white/5 dark:bg-white/5 px-2 py-0.5 rounded-md border border-white/6">
            {activeRev.hash}
          </span>
        </div>

        {/* Revision Details Popover */}
        <div className="timeline-scrubber-popover">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[var(--color-text,#eceae5)] truncate max-w-[190px]">
              {activeRev.label}
            </span>
            <span className="text-[10px] text-[var(--color-muted,#71747e)] shrink-0">
              {activeRev.time}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
            <span className="text-[var(--color-muted,#8c8e96)] flex items-center gap-1">
              <GitCommit className="w-3 h-3 text-sky-400" />
              {activeRev.author}
            </span>
            <div className="flex items-center gap-2 font-mono text-[10px]">
              <span className="text-emerald-400">+{activeRev.additions}</span>
              <span className="text-rose-400">-{activeRev.deletions}</span>
            </div>
          </div>
        </div>

        {/* Interactive Scrub Track */}
        <div className="relative pt-2 pb-1 flex flex-col gap-1.5">
          <div className="relative flex items-center justify-between">
            {/* Track background line */}
            <div className="timeline-scrubber-track-bg" />

            {/* Active fill progress line */}
            <div
              className="absolute left-2 h-1 rounded-full bg-sky-500 transition-all duration-200"
              style={{
                width: `${(activeIdx / (REVISIONS.length - 1)) * 95}%`,
              }}
            />

            {/* Scrubber revision nodes */}
            {REVISIONS.map((rev, idx) => {
              const isCurrent = activeIdx === idx;
              return (
                <button
                  key={rev.id}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`timeline-scrubber-node ${isCurrent ? "is-active" : ""}`}
                  title={`Revert to ${rev.hash}`}
                  aria-label={`Revision ${rev.hash}`}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[10px] text-[var(--color-muted,#6b6d75)] font-mono pt-1">
            <span>Latest (HEAD)</span>
            <span className="flex items-center gap-1 text-sky-400/80 cursor-pointer hover:underline">
              <RotateCcw className="w-2.5 h-2.5" />
              Rollback
            </span>
          </div>
        </div>
      </div>

      <span className="text-[11px] text-[#72747d] tracking-wide font-normal">
        Click node on timeline to rollback commit
      </span>
    </div>
  );
}
