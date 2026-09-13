"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalWhy: string | undefined;
  openAuthModal: (why?: string) => void;
  closeAuthModal: () => void;
  signInWithGoogle: () => Promise<void>;
  sendEmailOtp: (email: string) => Promise<{ shown?: string }>;
  verifyEmailOtp: (email: string, token: string) => Promise<void>;
  signOut: () => Promise<void>;
  benchedBlocks: string[];
  toggleBench: (blockId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "verity-benched";
const BENCH_PROMPT = "Sign in and your collection is saved to your account.";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalWhy, setAuthModalWhy] = useState<string | undefined>(undefined);

  // Saved / Benched blocks
  const [benchedBlocks, setBenchedBlocks] = useState<string[]>([]);

  // Load benched blocks from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        queueMicrotask(() => {
          setBenchedBlocks(JSON.parse(saved));
        });
      }
    } catch {
      // ignore
    }
  }, []);

  // Sync Supabase Auth session & changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        setIsAuthModalOpen(false);
      }
    });

    // Handle PKCE auth code in URL (e.g. email magic link or OAuth landing on /?code=...)
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        supabase.auth
          .exchangeCodeForSession(code)
          .then(({ data, error }) => {
            if (!error && data?.session) {
              setSession(data.session);
              setUser(data.session.user);
              setIsAuthModalOpen(false);
            }
          })
          .catch((err) => {
            console.error("Failed to exchange auth code:", err);
          })
          .finally(() => {
            // Clean ?code= from the address bar so the URL remains clean
            const cleanUrl = new URL(window.location.href);
            cleanUrl.searchParams.delete("code");
            cleanUrl.searchParams.delete("auth_error");
            window.history.replaceState(
              {},
              document.title,
              cleanUrl.pathname +
                (cleanUrl.search ? cleanUrl.search : "") +
                cleanUrl.hash
            );
          });
      }
    }

    return () => subscription.unsubscribe();
  }, []);

  const openAuthModal = useCallback((why?: string) => {
    setAuthModalWhy(why);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthModalWhy(undefined);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!isSupabaseConfigured) {
      throw new Error(
        "Supabase is not configured on this deployment. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your hosting environment variables and redeploy."
      );
    }

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : undefined;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  }, []);

  const sendEmailOtp = useCallback(async (email: string) => {
    if (!isSupabaseConfigured) {
      throw new Error(
        "Supabase is not configured on this deployment. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your hosting environment variables and redeploy."
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      throw new Error("Please enter a valid email address.");
    }

    const emailRedirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : undefined;

    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        shouldCreateUser: true,
        emailRedirectTo,
      },
    });

    if (error) {
      // Provide clean human error message matching bencho.dev
      const msg = error.message.toLowerCase();
      if (msg.includes("rate limit") || msg.includes("too many")) {
        throw new Error("Too many requests. Please wait a minute and try again.");
      }
      throw new Error(error.message);
    }

    return {};
  }, []);

  const verifyEmailOtp = useCallback(async (email: string, token: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanToken = token.replace(/\D/g, "");

    const { data, error } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanToken,
      type: "email",
    });

    if (error) {
      throw new Error("The verification code is incorrect or expired.");
    }

    if (data.session) {
      setSession(data.session);
      setUser(data.user);
      setIsAuthModalOpen(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  const toggleBench = useCallback(
    (blockId: string) => {
      // If user is not logged in, gate with the bencho auth prompt
      if (!user) {
        openAuthModal(BENCH_PROMPT);
        return;
      }

      setBenchedBlocks((prev) => {
        const next = prev.includes(blockId)
          ? prev.filter((id) => id !== blockId)
          : [...prev, blockId];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [user, openAuthModal]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthModalOpen,
        authModalWhy,
        openAuthModal,
        closeAuthModal,
        signInWithGoogle,
        sendEmailOtp,
        verifyEmailOtp,
        signOut,
        benchedBlocks,
        toggleBench,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
