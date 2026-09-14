"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState, useRef, useSyncExternalStore } from "react";
import { BrandLogo } from "./Logo";
import { useAuth } from "@/context/AuthContext";
import {
  LogOut,
  ChevronDown,
  Bookmark,
  SquarePlus,
  MessageSquare,
  Sun,
  Moon,
  Volume2,
  VolumeX,
} from "lucide-react";

interface NavProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const emptySubscribe = () => () => { };

export function Nav({ searchQuery = "", onSearchChange }: NavProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { user, openAuthModal, signOut } = useAuth();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!isUserMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isUserMenuOpen]);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  // Derive user display name & avatar
  const userMetadata = user?.user_metadata;
  const fullName =
    userMetadata?.full_name ||
    userMetadata?.name ||
    userMetadata?.user_name ||
    (user?.email ? user.email.split("@")[0] : "Member");

  const avatarUrl = userMetadata?.avatar_url || userMetadata?.picture;

  return (
    <nav className="bencho-nav" aria-label="Main Navigation">
      {/* Left: Brand Icon + Links */}
      <div className="flex items-center gap-6 justify-self-start">
        <Link href="/" className="text-[var(--color-text)] flex items-center hover:opacity-85 transition-opacity" aria-label="Verity">
          <BrandLogo size={22} />
        </Link>
        <div className="flex items-center gap-5 text-sm">
          <a href="#blocks" className="text-[var(--color-text)] font-medium">
            Blocks
          </a>
        </div>
      </div>

      {/* Center: Search pill bar */}
      <div className="bencho-search-bar justify-self-center">
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

      {/* Right: Sound, Theme, Join / User */}
      <div className="flex items-center gap-3 justify-self-end">
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

        {/* User Account Name Button / Join for free */}
        {mounted && user ? (
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((o) => !o)}
              className="bencho-nav-user-pill"
              title={fullName}
              aria-label="User account menu"
              aria-expanded={isUserMenuOpen}
              aria-haspopup="menu"
            >
              {avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="bencho-nav-user-avatar"
                />
              ) : (
                <span className="bencho-nav-user-avatar">
                  {(fullName[0] || "U").toUpperCase()}
                </span>
              )}
              <span className="truncate max-w-[130px] font-medium">{fullName}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 opacity-60 shrink-0 transition-transform duration-150 ${isUserMenuOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {isUserMenuOpen && (
              <div
                className="bencho-user-dropdown"
                role="menu"
                aria-orientation="vertical"
              >
                {/* 1. Saved */}
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    const el = document.getElementById("blocks");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bencho-user-dropdown-row"
                >
                  <span>Saved</span>
                  <Bookmark className="w-4 h-4 text-[#8c8e96]" />
                </button>

                {/* 2. Request a block */}
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    window.open(
                      "https://github.com/aakash-env/Verity-UI/issues",
                      "_blank"
                    );
                  }}
                  className="bencho-user-dropdown-row"
                >
                  <span>Request a block</span>
                  <SquarePlus className="w-4 h-4 text-[#8c8e96]" />
                </button>

                {/* 3. Contact us */}
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    window.location.href = "mailto:support@verity.dev";
                  }}
                  className="bencho-user-dropdown-row"
                >
                  <span>Contact us</span>
                  <MessageSquare className="w-4 h-4 text-[#8c8e96]" />
                </button>

                {/* 4. Sign out */}
                <button
                  type="button"
                  role="menuitem"
                  onClick={async () => {
                    setIsUserMenuOpen(false);
                    await signOut();
                  }}
                  className="bencho-user-dropdown-row"
                >
                  <span>Sign out</span>
                  <LogOut className="w-4 h-4 text-[#8c8e96]" />
                </button>

                {/* Divider */}
                <div className="bencho-user-dropdown-divider" />

                {/* 5. Theme row */}
                <div className="bencho-user-dropdown-row cursor-default hover:bg-transparent">
                  <span>Theme</span>
                  <div
                    className="bencho-user-dropdown-pill-switch"
                    role="group"
                    aria-label="Theme switcher"
                  >
                    <button
                      type="button"
                      onClick={() => setTheme("light")}
                      className={`bencho-user-dropdown-pill-btn ${theme === "light"
                          ? "bencho-user-dropdown-pill-btn--active"
                          : ""
                        }`}
                      title="Light mode"
                      aria-label="Light mode"
                    >
                      <Sun className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme("dark")}
                      className={`bencho-user-dropdown-pill-btn ${theme === "dark"
                          ? "bencho-user-dropdown-pill-btn--active"
                          : ""
                        }`}
                      title="Dark mode"
                      aria-label="Dark mode"
                    >
                      <Moon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme("system")}
                      className={`bencho-user-dropdown-pill-btn ${theme === "system" || !theme
                          ? "bencho-user-dropdown-pill-btn--active"
                          : ""
                        }`}
                      title="System theme"
                      aria-label="System theme"
                    >
                      <SystemThemeIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 6. Sound row */}
                <div className="bencho-user-dropdown-row cursor-default hover:bg-transparent">
                  <span>Sound</span>
                  <div
                    className="bencho-user-dropdown-pill-switch"
                    role="group"
                    aria-label="Sound switcher"
                  >
                    <button
                      type="button"
                      onClick={() => setSoundEnabled(false)}
                      className={`bencho-user-dropdown-pill-btn ${!soundEnabled
                          ? "bencho-user-dropdown-pill-btn--active"
                          : ""
                        }`}
                      title="Sound muted"
                      aria-label="Sound muted"
                    >
                      <VolumeX className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSoundEnabled(true)}
                      className={`bencho-user-dropdown-pill-btn ${soundEnabled
                          ? "bencho-user-dropdown-pill-btn--active"
                          : ""
                        }`}
                      title="Sound on"
                      aria-label="Sound on"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="bencho-user-dropdown-divider" />

                {/* 7. Profile info footer */}
                <div className="bencho-user-dropdown-footer">
                  <p className="bencho-user-dropdown-footer-name truncate">
                    {fullName}
                  </p>
                  <p className="bencho-user-dropdown-footer-email truncate">
                    {user.email}
                  </p>
                </div>
              </div>
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

function SystemThemeIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a10 10 0 0 1 0 20Z" fill="currentColor" />
    </svg>
  );
}

