"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Listen for auth state change after exchange
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace("/");
      }
    });

    // Also check current session in case it already exchanged
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/");
      }
    });

    // Fallback redirect after 3 seconds if not signed in
    const timer = setTimeout(() => {
      router.replace("/");
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-[var(--color-text)] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[var(--color-muted)] font-medium">Completing sign in…</p>
      </div>
    </div>
  );
}
