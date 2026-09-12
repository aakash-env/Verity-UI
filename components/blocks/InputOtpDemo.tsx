'use client'

import * as React from 'react'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

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

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`relative flex flex-col items-center justify-center select-none w-full ${inModal ? 'max-w-lg p-6 sm:p-8' : 'h-full px-4 py-6'
        }`}
    >
      {/* Input OTP Component */}
      <div className="flex flex-col items-center gap-8 sm:gap-9">
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
        <div className="h-6 flex items-center justify-center">
          {hasError && (
            <div
              className="flex items-center gap-1.5 text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1 duration-200"
              aria-live="polite"
            >
              <AlertCircle className="size-3.5 shrink-0" />
              <span>Invalid code. Please try again.</span>
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
          {!hasError && !isSuccess && (
            <span className="text-xs text-muted/60 tracking-wide">
              Type 849201
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
