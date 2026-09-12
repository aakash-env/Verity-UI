"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandLogo } from "./Logo";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";

interface NavProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function Nav({ searchQuery = "", onSearchChange }: NavProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const { user, openAuthModal, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="bencho-nav" aria-label="Main Navigation">
      {/* Left: Brand Icon + Links */}
      <div className="flex items-center gap-6">
        <Link href="/" className="text-[var(--color-text)] flex items-center hover:opacity-85 transition-opacity" aria-label="Verity">
          <BrandLogo size={22} />
        </Link>
        <div className="flex items-center gap-5 text-sm">
          <a href="#blocks" className="text-[var(--color-text)] font-medium">
            Blocks
          </a>
          <a
            href="#blocks"
            className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            Studio
          </a>
        </div>
      </div>

      {/* Center: Search pill bar */}
      <div className="bencho-search-bar">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search components"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="bencho-search-input"
          aria-label="Search confirmation components"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange?.("")}
            className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)]"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Right: Sound, Theme, Join */}
      <div className="flex items-center gap-3">
        {/* Sound toggle (bencho style) */}
        <button
          type="button"
          onClick={() => setSoundEnabled((s) => !s)}
          className="bencho-nav-icon-btn"
          title={soundEnabled ? "Mute audio" : "Unmute audio"}
          aria-label={soundEnabled ? "Mute audio" : "Unmute audio"}
        >
          {soundEnabled ? <VolumeOnIcon /> : <VolumeOffIcon />}
        </button>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="bencho-nav-icon-btn"
          title={mounted ? `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode` : "Toggle theme"}
          aria-label="Toggle theme"
        >
          {mounted ? (
            resolvedTheme === "dark" ? (
              <SunIcon />
            ) : (
              <MoonIcon />
            )
          ) : (
            <span className="w-4 h-4 opacity-0" />
          )}
        </button>

        {/* User Account / Join for free */}
        {user ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((o) => !o)}
              className="size-8 rounded-full border border-white/10 hover:border-white/20 bg-white/5 flex items-center justify-center text-xs font-semibold text-white overflow-hidden transition-all cursor-pointer"
              title={user.email || "Account"}
              aria-label="User account menu"
            >
              {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                <img
                  src={user.user_metadata.avatar_url || user.user_metadata.picture}
                  alt={user.email || "User avatar"}
                  className="size-full object-cover"
                />
              ) : (
                <span>{(user.email?.[0] || "U").toUpperCase()}</span>
              )}
            </button>

            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#1c1d22] border border-white/10 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-white/5">
                    <p className="text-xs font-medium text-white truncate">
                      {user.user_metadata?.full_name ||
                        user.user_metadata?.name ||
                        "Member"}
                    </p>
                    <p className="text-[11px] text-muted truncate">{user.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      signOut();
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-red-400 hover:bg-white/5 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="size-3.5" />
                    <span>Sign out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => openAuthModal()}
            className="bencho-nav-cta cursor-pointer"
          >
            Join for free
          </button>
        )}
      </div>
    </nav>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-muted)] shrink-0">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" x2="16.65" y1="21" y2="16.65" />
    </svg>
  );
}

function VolumeOffIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" x2="17" y1="9" y2="15" />
      <line x1="17" x2="23" y1="9" y2="15" />
    </svg>
  );
}

function VolumeOnIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}
