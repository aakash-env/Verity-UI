'use client'

import * as React from 'react'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp'
import { AlertCircle, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react'

interface InputOtpDemoProps {
  inModal?: boolean
}

export function InputOtpDemo({ inModal = false }: InputOtpDemoProps) {
  const [value, setValue] = React.useState('')
  const [hasError, setHasError] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const handleOtpChange = (nextValue: string) => {
    setValue(nextValue)
    if (hasError) setHasError(false)

    if (nextValue.length === 6) {
      if (nextValue === '849201') {
        setIsSuccess(true)
        setHasError(false)
      } else {
        setHasError(true)
        setIsSuccess(false)
      }
    } else {
      setIsSuccess(false)
    }
  }

  const simulatePaste = (e: React.MouseEvent) => {
    e.stopPropagation()
    setValue('849201')
    setIsSuccess(true)
    setHasError(false)
  }

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation()
    setValue('')
    setIsSuccess(false)
    setHasError(false)
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`relative flex flex-col items-center justify-center select-none w-full ${
        inModal ? 'max-w-lg p-6 sm:p-8' : 'h-full px-4 py-6'
      }`}
    >
      {/* Header Info */}
      <div className="mb-5 sm:mb-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-foreground/[0.06] text-muted mb-2 border border-foreground/5">
          <Sparkles className="size-3 text-foreground/70" />
          <span>Verification Code</span>
        </div>
        <p className="text-xs sm:text-sm text-muted">
          Enter the 6-digit security code sent to your device
        </p>
      </div>

      {/* Input OTP Component */}
      <div className="flex flex-col items-center">
        <InputOTP
          maxLength={6}
          value={value}
          onChange={handleOtpChange}
          aria-invalid={hasError}
          success={isSuccess}
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

        {/* State Messages */}
        <div className="h-6 mt-3.5 flex items-center justify-center">
          {hasError && (
            <div
              className="flex items-center gap-1.5 text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1 duration-200"
              aria-live="polite"
            >
              <AlertCircle className="size-3.5 shrink-0" />
              <span>Invalid code. Hint: try 849201</span>
            </div>
          )}
          {isSuccess && (
            <div
              className="flex items-center gap-1.5 text-xs font-medium text-emerald-500 animate-in fade-in slide-in-from-top-1 duration-200"
              aria-live="polite"
            >
              <CheckCircle2 className="size-3.5 shrink-0" />
              <span>Code verified successfully!</span>
            </div>
          )}
          {!hasError && !isSuccess && value.length === 0 && (
            <span className="text-[11px] text-muted/60 tracking-wider uppercase font-mono">
              Try typing or click paste
            </span>
          )}
        </div>
      </div>

      {/* Quick Action Controls */}
      <div className="mt-5 sm:mt-6 flex items-center gap-2">
        <button
          type="button"
          onClick={simulatePaste}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-foreground/[0.06] hover:bg-foreground/[0.1] text-foreground transition-all duration-150 border border-foreground/5 active:scale-95 cursor-pointer"
        >
          <Sparkles className="size-3 text-foreground/70" />
          <span>Paste Demo (849201)</span>
        </button>
        {value.length > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-foreground/[0.04] hover:bg-foreground/[0.08] text-muted hover:text-foreground transition-all duration-150 border border-foreground/5 active:scale-95 cursor-pointer"
            title="Clear input"
          >
            <RotateCcw className="size-3" />
            <span>Clear</span>
          </button>
        )}
      </div>
    </div>
  )
}
