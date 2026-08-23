// ============================================================
// PageHeader — Top section of each admin page
// Includes: title, breadcrumb, action area
// ============================================================

import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { useLanguage } from '@/hooks/useLanguage'

interface PageHeaderProps {
 title: string
 subtitle?: string
 actions?: ReactNode
 className?: string
}

export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
 const { isRTL } = useLanguage()

 return (
 <div
 className={cn(
 'flex flex-col sm:flex-row sm:items-start gap-4 mb-6',
 isRTL ? 'sm:flex-row-reverse' : 'sm:flex-row',
 className,
 )}
 >
 <div className={cn('flex-1 min-w-0', isRTL ? 'text-right' : 'text-left')}>
 <h1 className="text-display" style={{ color: 'var(--color-primary)' }}>
 {title}
 </h1>
 {subtitle && (
 <p className="text-body mt-1" style={{ color: 'var(--color-text-muted)' }}>
 {subtitle}
 </p>
 )}
 </div>

 {actions && (
 <div
 className={cn(
 'flex items-center gap-2 shrink-0',
 isRTL ? 'flex-row-reverse' : 'flex-row',
 )}
 >
 {actions}
 </div>
 )}
 </div>
 )
}
