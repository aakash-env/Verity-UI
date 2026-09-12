"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { BrandLogo } from "@/components/marketing/Logo";
import Link from "next/link";

export function AuthModal() {
  const { isAuthModalOpen } = useAuth();
  if (!isAuthModalOpen) return null;
  return <AuthModalContent />;
}

function AuthModalContent() {
  const {
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
  const codeInputRef = useRef<HTMLInputElement>(null);

  // Focus management & Escape key handling
  useEffect(() => {
    const timer = setTimeout(() => {
      if (step === "who") {
        emailInputRef.current?.focus();
      } else {
        codeInputRef.current?.focus();
      }
    }, 60);

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
  }, [step, closeAuthModal]);

  const handleVerifyCode = useCallback(
    async (token: string) => {
      try {
        setLoading(true);
        setError(null);
        await verifyEmailOtp(email, token);
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "That code did not work. Please try again.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [email, verifyEmailOtp]
  );

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Could not sign in with Google. Please try again.";
      setError(msg);
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
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Could not send a code. Please try again.";
      setError(msg);
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
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Could not send a code. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Scrim backdrop */}
      <div className="au-scrim" onClick={closeAuthModal} aria-hidden="true" />

      {/* Modal Dialog Wrap */}
      <div className="au-wrap" role="dialog" aria-modal="true" aria-label="Sign in">
        <div className="au-card" onClick={(e) => e.stopPropagation()}>
          {/* Back button (when in OTP code step) */}
          {step === "code" && (
            <button
              className="au-back"
              type="button"
              onClick={() => {
                setStep("who");
                setError(null);
              }}
              aria-label="Back"
            >
              <BackIcon />
            </button>
          )}

          {/* Close button */}
          <button
            className="au-shut"
            type="button"
            onClick={closeAuthModal}
            aria-label="Close"
          >
            <CloseIcon />
          </button>

          <div className="au-panel">
            <div className="au-well">
              {/* Header with Project Logo & Title */}
              <header className="au-head">
                <span className="au-crest" aria-hidden="true">
                  <BrandLogo size={38} interactive={false} />
                </span>
                <h2 className="au-title">Join Verity</h2>
              </header>

              {/* Contextual prompt if present (e.g. from benching) */}
              {authModalWhy && step === "who" && (
                <p className="au-why">{authModalWhy}</p>
              )}

              <div className="au-foot">
                {step === "who" && (
                  <>
                    {/* Google OAuth Button */}
                    <div className="au-vias">
                      <button
                        type="button"
                        className="au-via"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                      >
                        <span className="flex items-center justify-center">
                          <GoogleIcon />
                        </span>
                        <span>Continue with Google</span>
                      </button>
                    </div>

                    {/* Divider */}
                    <p className="au-or">
                      <span>or</span>
                    </p>
                  </>
                )}

                {/* Form: Email or OTP */}
                <form
                  className="au-form"
                  onSubmit={
                    step === "who"
                      ? handleSendEmail
                      : (e) => {
                        e.preventDefault();
                        if (code.length === 6) handleVerifyCode(code);
                      }
                  }
                  noValidate
                >
                  {step === "who" ? (
                    <label className="au-field">
                      <input
                        ref={emailInputRef}
                        type="email"
                        className="au-in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email address"
                        aria-label="Email address"
                        disabled={loading}
                        autoComplete="email"
                        data-bad={!!error}
                      />
                    </label>
                  ) : (
                    <label className="au-code" aria-label="Six-digit code">
                      <input
                        ref={codeInputRef}
                        className="au-code-in"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        value={code}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                          setCode(val);
                          if (val.length === 6 && !loading) {
                            handleVerifyCode(val);
                          }
                        }}
                        disabled={loading}
                        autoFocus
                      />
                      <span className="au-cells" aria-hidden="true">
                        {[0, 1, 2, 3, 4, 5].map((idx) => (
                          <span
                            key={idx}
                            className="au-cell"
                            data-at={
                              idx === Math.min(code.length, 5)
                                ? "true"
                                : undefined
                            }
                            data-on={!!code[idx] ? "true" : undefined}
                          >
                            {code[idx] ?? ""}
                          </span>
                        ))}
                      </span>
                    </label>
                  )}

                  {error && (
                    <p className="au-err" role="alert">
                      {error}
                    </p>
                  )}

                  <button
                    className="au-go"
                    type="submit"
                    disabled={
                      loading ||
                      (step === "who" ? !email.trim() : code.length < 6)
                    }
                  >
                    {loading
                      ? "One moment…"
                      : step === "who"
                        ? "Continue"
                        : "Sign in"}
                  </button>
                </form>

                {step === "code" && (
                  <p className="au-swap">
                    Nothing arrived?{" "}
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={loading}
                    >
                      Send again
                    </button>
                  </p>
                )}

                {/* Footer legal disclaimer */}
                <p className="au-fine">
                  By continuing you agree to our{" "}
                  <Link href="/privacy">Privacy notice</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}



function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
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

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
