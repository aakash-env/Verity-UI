'use client'

import * as React from 'react'
import { OTPInput, OTPInputContext, REGEXP_ONLY_DIGITS } from 'input-otp'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react'
import { Minus } from 'lucide-react'

import { cn } from '@/lib/utils'

type Sweep = { id: number; from: number; to: number; tone: 'paste' | 'success' }

type InputOTPStatus = { invalid: boolean; success: boolean; sweep: Sweep | null }

const InputOTPStatusContext = React.createContext<InputOTPStatus>({
  invalid: false,
  success: false,
  sweep: null,
})

const SWEEP_TIMING = {
  paste: { duration: 0.4, stagger: 0.045 },
  success: { duration: 0.42, stagger: 0.048 },
} as const

const RING_TRAVEL = 0.42

function InputOTP({
  className,
  containerClassName,
  'aria-invalid': ariaInvalid,
  value,
  onChange,
  success = false,
  maxLength,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
  success?: boolean
}) {
  const layoutGroupId = React.useId()
  const invalid = ariaInvalid === true || ariaInvalid === 'true'
  const reduceMotion = useReducedMotion()
  const [sweep, setSweep] = React.useState<Sweep | null>(null)
  const filled = React.useRef(0)
  const sweepId = React.useRef(0)

  const startSweep = (from: number, to: number, tone: Sweep['tone']) => {
    sweepId.current += 1
    setSweep({ id: sweepId.current, from, to, tone })
  }

  const handleChange = (next: string) => {
    const from = filled.current
    filled.current = next.length

    if (!reduceMotion && next.length - from > 1) startSweep(from, next.length, 'paste')

    onChange?.(next)
  }

  React.useEffect(() => {
    if (typeof value === 'string') filled.current = value.length
  }, [value])

  React.useEffect(() => {
    if (!success || reduceMotion) return

    sweepId.current += 1
    setSweep({ id: sweepId.current, from: 0, to: maxLength, tone: 'success' })
  }, [success, maxLength, reduceMotion])

  React.useEffect(() => {
    if (!sweep) return

    const { duration, stagger } = SWEEP_TIMING[sweep.tone]
    const span = duration + stagger * (sweep.to - sweep.from)
    const timer = window.setTimeout(() => setSweep(null), span * 1000)

    return () => window.clearTimeout(timer)
  }, [sweep])

  return (
    <LayoutGroup id={layoutGroupId}>
      <InputOTPStatusContext.Provider value={{ invalid, success, sweep }}>
        <OTPInput
          data-slot="input-otp"
          data-success={success || undefined}
          aria-invalid={ariaInvalid}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          containerClassName={cn(
            'cn-input-otp flex items-center gap-3 has-disabled:opacity-50',
            containerClassName,
          )}
          spellCheck={false}
          className={cn('disabled:cursor-not-allowed', className)}
          {...props}
          inputMode="numeric"
          pattern={REGEXP_ONLY_DIGITS}
        />
      </InputOTPStatusContext.Provider>
    </LayoutGroup>
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn('flex items-center gap-3', className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  style,
  ...props
}: React.ComponentProps<'div'> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { invalid, success, sweep } = React.useContext(InputOTPStatusContext)
  const { char, isActive } = inputOTPContext?.slots[index] ?? {}
  const swept = sweep !== null && index >= sweep.from && index < sweep.to
  const isComplete = inputOTPContext?.slots.every((slot) => Boolean(slot.char)) ?? false
  const reduceMotion = useReducedMotion()

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        'relative flex size-12 sm:size-14 items-center justify-center rounded-xl bg-foreground/[0.06] text-xl sm:text-2xl font-semibold tabular-nums ring-1 ring-foreground/8 transition-[background-color,color] duration-150 ease-out outline-none data-[active=true]:z-10 data-[active=true]:bg-foreground/10 motion-reduce:transition-none',
        swept && sweep?.tone === 'success' && 'otp-bounce',
        className,
      )}
      style={
        { ...style, '--otp-trail-index': sweep ? index - sweep.from : 0 } as React.CSSProperties
      }
      {...props}
    >
      {swept && sweep ? (
        <span
          key={`${sweep.id}-${index}`}
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 rounded-xl',
            sweep.tone === 'success' ? 'otp-trail-success' : 'otp-trail',
          )}
        />
      ) : null}
      {isActive ? (
        <motion.span
          layoutId="input-otp-active-ring"
          initial={false}
          animate={{ opacity: isComplete ? 0 : 1 }}
          transition={{
            layout: reduceMotion
              ? { duration: 0 }
              : { type: 'spring', duration: sweep ? RING_TRAVEL : 0.3, bounce: 0.18 },
            opacity: reduceMotion ? { duration: 0 } : { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
          }}
          className={cn(
            'pointer-events-none absolute inset-0 rounded-xl ring-[3px]',
            invalid ? 'ring-red-500' : 'ring-foreground/75',
          )}
        />
      ) : null}
      <span
        className={cn(
          'relative grid place-items-center [perspective:240px]',
          isComplete && !success && 'otp-processing',
        )}
        style={{ '--otp-wave-index': index } as React.CSSProperties}
      >
        <span
          aria-hidden
          className={cn(
            'col-start-1 row-start-1 text-foreground/20 transition-opacity duration-150 ease-out motion-reduce:transition-none',
            char ? 'opacity-0' : 'opacity-100',
          )}
        >
          0
        </span>
        <AnimatePresence initial={false}>
          {char ? (
            <motion.span
              key={`${index}-${char}`}
              initial={
                reduceMotion
                  ? false
                  : {
                      opacity: 0,
                      transform: 'translateY(6px) rotateX(-35deg)',
                      filter: 'blur(2px)',
                    }
              }
              animate={{
                opacity: 1,
                transform: 'translateY(0px) rotateX(0deg)',
                filter: 'blur(0px)',
              }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      transform: 'translateY(-2px) rotateX(15deg)',
                      filter: 'blur(2px)',
                    }
              }
              transition={
                reduceMotion ? { duration: 0 } : { type: 'spring', duration: 0.3, bounce: 0.2 }
              }
              style={{ transformOrigin: 'center bottom', transformStyle: 'preserve-3d' }}
              className="col-start-1 row-start-1 text-foreground"
            >
              {char}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </span>
    </div>
  )
}

function InputOTPSeparator({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-otp-separator"
      className={cn('flex items-center text-foreground/40 [&_svg:not([class*="size-"])]:size-5', className)}
      role="separator"
      {...props}
    >
      <Minus className="size-4 text-foreground/40" />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator, REGEXP_ONLY_DIGITS }
