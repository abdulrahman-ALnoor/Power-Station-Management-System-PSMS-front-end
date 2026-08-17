// ============================================================
// LoadingState — Full-area loading indicator
// ============================================================

import { cn } from '@/utils/cn'
import { useLanguage } from '@/hooks/useLanguage'

interface LoadingStateProps {
  label?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_MAP = {
  sm: 'w-6 h-6 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
}

export function LoadingState({ label, size = 'md', className }: LoadingStateProps) {
  const { t } = useLanguage()

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-12',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div
        className={cn(
          'rounded-full animate-spin border-t-transparent',
          SIZE_MAP[size],
        )}
        style={{
          borderColor: 'var(--color-border)',
          borderTopColor: 'var(--color-primary)',
        }}
        aria-hidden="true"
      />
      <p className="text-table" style={{ color: 'var(--color-text-muted)' }}>
        {label ?? t('common:states.loadingTitle')}
      </p>
    </div>
  )
}
