// ============================================================
// Input — Text input field
// Supports: label, error, helper text, start/end addons
// ============================================================

import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useId,
} from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  addonStart?: ReactNode
  addonEnd?: ReactNode
  fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      addonStart,
      addonEnd,
      fullWidth = false,
      className,
      id,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-label"
            style={{ color: 'var(--color-text)' }}
          >
            {label}
            {rest.required && (
              <span className="ms-1" style={{ color: 'var(--color-danger)' }} aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative flex items-center">
          {/* Start addon */}
          {addonStart && (
            <span
              className="absolute inset-block-0 start-0 flex items-center ps-3 pointer-events-none"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {addonStart}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-describedby={[error && errorId, helperText && helperId]
              .filter(Boolean)
              .join(' ') || undefined}
            aria-invalid={!!error}
            className={cn(
              'w-full h-10 rounded-lg border text-body transition-colors',
              'bg-white placeholder:text-[var(--color-text-disabled)]',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              addonStart ? 'ps-10' : 'ps-3',
              addonEnd ? 'pe-10' : 'pe-3',
              error
                ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]/30'
                : 'border-[var(--color-border)] focus:border-[var(--color-steel-blue)] focus:ring-[var(--color-steel-blue)]/20',
              className,
            )}
            style={{ color: 'var(--color-text)' }}
            {...rest}
          />

          {/* End addon */}
          {addonEnd && (
            <span
              className="absolute inset-block-0 end-0 flex items-center pe-3 pointer-events-none"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {addonEnd}
            </span>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p id={errorId} className="text-label" style={{ color: 'var(--color-danger)' }} role="alert">
            {error}
          </p>
        )}

        {/* Helper text */}
        {!error && helperText && (
          <p id={helperId} className="text-label" style={{ color: 'var(--color-text-muted)' }}>
            {helperText}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
