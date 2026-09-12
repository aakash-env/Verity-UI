"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { BrandLogo } from "@/components/marketing/Logo";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { ArrowLeft, X, AlertCircle } from "lucide-react";
import Link from "next/link";

export function AuthModal() {
  const {
    isAuthModalOpen,
    authModalWhy,
    closeAuthModal,
    signInWithGoogle,
    sendEmailOtp,
    verifyEmailOtp,
  } = useAuth();

  const [step, setStep] = useState<"who" | "code">("who");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailInputRef = useRef<HTMLInputElement>(null);

  // Focus management & Escape key handling
  useEffect(() => {
    if (!isAuthModalOpen) {
      setStep("who");
      setEmail("");
      setCode("");
      setError(null);
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      if (step === "who") {
        emailInputRef.current?.focus();
      }
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeAuthModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAuthModalOpen, step, closeAuthModal]);

  // Auto verify when 6 digits are typed
  useEffect(() => {
    if (step === "code" && code.length === 6 && !loading) {
      handleVerifyCode(code);
    }
  }, [code, step]);

  if (!isAuthModalOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Could not sign in with Google. Please try again.");
      setLoading(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    try {
      setLoading(true);
      setError(null);
      await sendEmailOtp(email);
      setStep("code");
      setCode("");
    } catch (err: any) {
      setError(err.message || "Failed to send code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (token: string) => {
    try {
      setLoading(true);
      setError(null);
      await verifyEmailOtp(email, token);
    } catch (err: any) {
      setError(err.message || "Incorrect or expired code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (loading) return;
    try {
      setLoading(true);
      setError(null);
      await sendEmailOtp(email);
      setCode("");
    } catch (err: any) {
      setError(err.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop Scrim */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeAuthModal}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sign in"
        className="relative z-10 w-full max-w-[390px] rounded-[24px] bg-[#16171b] border border-white/10 p-6 sm:p-7 shadow-2xl text-white select-none animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Back Button (Step 2) */}
        {step === "code" && (
          <button
            type="button"
            onClick={() => {
              setStep("who");
              setError(null);
            }}
            className="absolute top-5 left-5 size-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Back to email input"
          >
            <ArrowLeft className="size-4" />
          </button>
        )}

        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-5 right-5 size-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mt-2 mb-6">
          <div className="size-11 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center mb-3">
            <BrandLogo size={22} />
          </div>

          <h2 className="text-xl font-semibold tracking-tight text-white">
            {step === "who" ? "Join Verity" : "Check your email"}
          </h2>

          {step === "who" && authModalWhy && (
            <div className="mt-3 w-full rounded-xl bg-white/[0.04] border border-white/5 p-2.5 text-xs text-neutral-300 leading-relaxed text-center">
              {authModalWhy}
            </div>
          )}

          {step === "code" && (
            <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
              We sent a 6-digit code to{" "}
              <strong className="text-neutral-200 font-medium">{email}</strong>.
            </p>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-2.5 text-xs text-red-400 animate-in fade-in duration-150">
            <AlertCircle className="size-4 shrink-0" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* STEP 1: Identification (Google OAuth + Email) */}
        {step === "who" && (
          <div className="flex flex-col gap-4">
            {/* Google OAuth */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-11 rounded-full border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.07] transition-all flex items-center justify-center gap-2.5 text-sm font-medium text-white cursor-pointer active:scale-[0.99] disabled:opacity-50"
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-mono">
                or
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Email Form */}
            <form onSubmit={handleSendEmail} className="flex flex-col gap-3">
              <input
                ref={emailInputRef}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full h-11 rounded-xl bg-white/[0.04] border border-white/10 px-3.5 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
                disabled={loading}
              />

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full h-11 rounded-xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "One moment..." : "Continue"}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: 6-Digit OTP Verification */}
        {step === "code" && (
          <div className="flex flex-col items-center gap-4">
            <div className="py-2 scale-90 sm:scale-100">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={setCode}
                aria-invalid={!!error}
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
            </div>

            <button
              type="button"
              onClick={() => handleVerifyCode(code)}
              disabled={loading || code.length < 6}
              className="w-full h-11 rounded-xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Sign in"}
            </button>

            <div className="text-center text-xs text-neutral-400">
              Nothing arrived?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="text-white hover:underline font-medium cursor-pointer"
              >
                Send again
              </button>
            </div>
          </div>
        )}

        {/* Footer Notice */}
        <div className="mt-5 text-center text-[11px] text-neutral-500 leading-normal">
          By continuing you agree to our{" "}
          <Link
            href="/privacy"
            className="text-neutral-400 hover:text-white underline underline-offset-2"
          >
            Privacy notice
          </Link>
          .
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}
