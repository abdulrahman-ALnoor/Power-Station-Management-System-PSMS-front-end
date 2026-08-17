// ============================================================
// ErrorState — Error display with retry
// ============================================================

import type { ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/hooks/useLanguage'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
  children?: ReactNode
}

export function ErrorState({
  title,
  description,
  onRetry,
  className,
  children,
}: ErrorStateProps) {
  const { t } = useLanguage()

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-16 text-center',
        className,
      )}
      role="alert"
    >
      {/* Icon */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{
          background: 'var(--color-danger-light)',
          color: 'var(--color-danger)',
        }}
      >
        <AlertCircle size={28} />
      </div>

      {/* Title */}
      <h3 className="text-headline" style={{ color: 'var(--color-text)' }}>
        {title ?? t('common:states.errorTitle')}
      </h3>

      {/* Description */}
      {(description ?? t('common:states.errorDescription')) && (
        <p
          className="text-body max-w-sm"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {description ?? t('common:states.errorDescription')}
        </p>
      )}

      {children}

      {/* Retry button */}
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {t('common:states.retry')}
        </Button>
      )}
    </div>
  )
}
