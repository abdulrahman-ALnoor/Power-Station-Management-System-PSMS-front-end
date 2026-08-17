// ============================================================
// Select — Native select field with PSMS styling
// ============================================================

import { forwardRef, type SelectHTMLAttributes, useId } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { SelectOption } from '@/types/common'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: SelectOption[]
  placeholder?: string
  fullWidth?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder,
      fullWidth = false,
      className,
      id,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId()
    const selectId = id ?? generatedId

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={selectId}
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

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={!!error}
            className={cn(
              'w-full h-10 ps-3 pe-10 rounded-lg border text-body appearance-none',
              'bg-white transition-colors cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              error
                ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]/30'
                : 'border-[var(--color-border)] focus:border-[var(--color-steel-blue)] focus:ring-[var(--color-steel-blue)]/20',
              className,
            )}
            style={{ color: 'var(--color-text)' }}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Chevron icon */}
          <span
            className="absolute inset-block-0 end-0 flex items-center pe-3 pointer-events-none"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <ChevronDown size={16} aria-hidden="true" />
          </span>
        </div>

        {error && (
          <p className="text-label" style={{ color: 'var(--color-danger)' }} role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-label" style={{ color: 'var(--color-text-muted)' }}>
            {helperText}
          </p>
        )}
      </div>
    )
  },
)

Select.displayName = 'Select'
