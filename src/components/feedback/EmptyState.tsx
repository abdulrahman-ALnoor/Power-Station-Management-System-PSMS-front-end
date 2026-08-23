// ============================================================
// EmptyState — Empty data placeholder
// ============================================================

import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useLanguage } from '@/hooks/useLanguage'

interface EmptyStateProps {
 icon?: ReactNode
 title?: string
 description?: string
 action?: ReactNode
 className?: string
}

export function EmptyState({
 icon,
 title,
 description,
 action,
 className,
}: EmptyStateProps) {
 const { t } = useLanguage()

 return (
 <div
 className={cn(
 'flex flex-col items-center justify-center gap-4 py-16 text-center',
 className,
 )}
 role="status"
 >
 {/* Icon */}
 <div
 className="w-16 h-16 rounded-2xl flex items-center justify-center"
 style={{
 background: 'var(--color-surface-container)',
 color: 'var(--color-text-disabled)',
 }}
 >
 {icon ?? <Inbox size={28} />}
 </div>

 {/* Title */}
 <h3 className="text-headline" style={{ color: 'var(--color-text)' }}>
 {title ?? t('common:states.emptyTitle')}
 </h3>

 {/* Description */}
 {description && (
 <p
 className="text-body max-w-sm"
 style={{ color: 'var(--color-text-muted)' }}
 >
 {description ?? t('common:states.emptyDescription')}
 </p>
 )}

 {/* Action */}
 {action && <div className="mt-2">{action}</div>}
 </div>
 )
}
