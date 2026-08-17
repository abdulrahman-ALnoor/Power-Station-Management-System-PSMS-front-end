// ============================================================
// Badge — Status/label badge
// Variants match StatusVariant from types/common
// ============================================================

import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'
import type { StatusVariant } from '@/types/common'

interface BadgeProps {
  variant?: StatusVariant
  children: ReactNode
  dot?: boolean
  className?: string
}

const VARIANT_STYLES: Record<StatusVariant, React.CSSProperties> = {
  success: { background: 'var(--color-success-light)', color: 'var(--color-success)' },
  warning: { background: 'var(--color-warning-light)', color: 'var(--color-warning)' },
  danger:  { background: 'var(--color-danger-light)', color: 'var(--color-danger)' },
  info:    { background: 'var(--color-info-light)', color: 'var(--color-info)' },
  neutral: { background: 'var(--color-surface-high)', color: 'var(--color-text-muted)' },
  accent:  { background: 'var(--color-accent)', color: 'var(--color-on-accent)' },
}

export function Badge({ variant = 'neutral', children, dot = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5',
        'text-label rounded-full font-semibold whitespace-nowrap',
        className,
      )}
      style={VARIANT_STYLES[variant]}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: 'currentColor' }}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}
