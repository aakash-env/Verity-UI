"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const handleAuthCallback = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const error = url.searchParams.get("error");
        const errorDescription = url.searchParams.get("error_description");

        if (error) {
          console.error("OAuth error:", error, errorDescription);
          if (active) setErrorMsg(errorDescription || error);
          setTimeout(() => {
            if (active) window.location.href = "/";
          }, 2000);
          return;
        }

        // Exchange code for session explicitly if code exists in URL
        if (code) {
          const { data, error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error("Exchange code error:", exchangeError);
            if (active) setErrorMsg(exchangeError.message);
            setTimeout(() => {
              if (active) window.location.href = "/";
            }, 2000);
            return;
          }

          if (data?.session) {
            window.location.href = "/";
            return;
          }
        }

        // If no code or already exchanged, check active session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          window.location.href = "/";
          return;
        }

        // Fallback redirect after a brief moment
        setTimeout(() => {
          if (active) window.location.href = "/";
        }, 1500);
      } catch (err: any) {
        console.error("Auth callback exception:", err);
        if (active) setErrorMsg(err.message || "Authentication failed");
        setTimeout(() => {
          if (active) window.location.href = "/";
        }, 2000);
      }
    };

    handleAuthCallback();

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="flex flex-col items-center gap-3">
        {errorMsg ? (
          <p className="text-sm text-red-400 font-medium px-4 text-center">
            {errorMsg}
          </p>
        ) : (
          <>
            <div className="w-6 h-6 border-2 border-[var(--color-text)] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[var(--color-muted)] font-medium">
              Completing sign in…
            </p>
          </>
        )}
      </div>
    </div>
  );
}
