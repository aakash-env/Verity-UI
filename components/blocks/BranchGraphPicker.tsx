"use client";

import React, { useState } from "react";
import { GitBranch, GitMerge, CheckCircle2, ArrowUpRight } from "lucide-react";

interface Branch {
  id: string;
  name: string;
  badge: string;
  isMain?: boolean;
  commitsAhead: number;
}

const BRANCHES: Branch[] = [
  { id: "main", name: "main", badge: "Production", isMain: true, commitsAhead: 0 },
  { id: "auth", name: "feat/pkce-oauth", badge: "Staging", commitsAhead: 3 },
  { id: "edge", name: "exp/wasm-proxy", badge: "Building", commitsAhead: 7 },
];

export function BranchGraphPicker() {
  const [activeBranch, setActiveBranch] = useState("auth");

  return (
    <div
      className="flex flex-col items-center justify-center gap-3 select-none cursor-default"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="branch-picker-card">
        {/* Header */}
        <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-text,#eceae5)]">
          <div className="flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-violet-400" />
            <span>Branch Topology</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Clean Tree
          </span>
        </div>

        {/* Visual Branch Nodes List */}
        <div className="relative flex flex-col gap-1.5 pl-3.5 border-l-2 border-violet-500/30 ml-2 py-0.5">
          {BRANCHES.map((b) => {
            const isActive = activeBranch === b.id;
            return (
              <div
                key={b.id}
                onClick={() => setActiveBranch(b.id)}
                className={`branch-picker-item ${isActive ? "is-active" : ""}`}
              >
                {/* Node dot on the branch line */}
                <span
                  className={`absolute -left-[20px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 transition-all ${
                    isActive
                      ? "bg-violet-400 border-[#16171b] ring-2 ring-violet-500/40 scale-110"
                      : "bg-[#282a32] border-[#16171b]"
                  }`}
                />

                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-mono font-medium text-[var(--color-text,#eceae5)] flex items-center gap-1.5">
                    {b.isMain ? (
                      <GitMerge className="w-3 h-3 text-violet-400 shrink-0" />
                    ) : (
                      <GitBranch className="w-3 h-3 text-sky-400 shrink-0" />
                    )}
                    <span className="truncate max-w-[130px]">{b.name}</span>
                  </span>
                  <span className="text-[9px] text-[var(--color-muted,#71747e)]">
                    {b.isMain ? "Base deployment" : `${b.commitsAhead} ahead`}
                  </span>
                </div>

                <span
                  className={`text-[9px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 shrink-0 ${
                    b.isMain
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : isActive
                      ? "bg-violet-500/20 text-violet-300 border-violet-500/30"
                      : "bg-white/5 text-[var(--color-muted,#8c8e96)] border-white/8"
                  }`}
                >
                  {b.badge}
                  {isActive && <ArrowUpRight className="w-2.5 h-2.5" />}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <span className="text-[11px] text-[#72747d] tracking-wide font-normal">
        Select target branch to rebase
      </span>
    </div>
  );
}
