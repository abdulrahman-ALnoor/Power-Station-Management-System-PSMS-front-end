// ============================================================
// StatCard — Dashboard statistics card
// Design: icon + title + large value + trend indicator
// Based on Stitch Integrated Design System (Al-Barq Identity)
// ============================================================

import type { ReactNode } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useLanguage } from '@/hooks/useLanguage'

type TrendDirection = 'up' | 'down' | 'neutral'

interface StatCardProps {
 title: string
 value: string | number
 icon: ReactNode
 iconColor?: string
 iconBg?: string
 iconClassName?: string
 trend?: {
 direction: TrendDirection
 value: string
 label?: string
 }
 className?: string
}

const TREND_CONFIG: Record<
 TrendDirection,
 { color: string; Icon: typeof TrendingUp }
> = {
 up: { color: 'var(--color-success)', Icon: TrendingUp },
 down: { color: 'var(--color-danger)', Icon: TrendingDown },
 neutral: { color: 'var(--color-warning)', Icon: Minus },
}

export function StatCard({
 title,
 value,
 icon,
 iconColor = 'var(--color-primary)',
 iconBg = 'var(--color-surface-container)',
 iconClassName,
 trend,
 className,
}: StatCardProps) {
 const { isRTL } = useLanguage()

 return (
 <div
 className={cn('card flex flex-col gap-4', className)}
 role="region"
 aria-label={title}
 >
 {/* Top: icon + title */}
 <div
 className={cn(
 'flex items-start gap-3',
 isRTL ? 'flex-row-reverse' : 'flex-row',
 )}
 >
 {/* Icon container */}
 <div
 className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0", iconClassName)}
 style={!iconClassName ? { background: iconBg, color: iconColor } : undefined}
 >
 {icon}
 </div>

 {/* Title */}
 <div className={cn('min-w-0 flex-1', isRTL ? 'text-right' : 'text-left')}>
 <p className="text-table" style={{ color: 'var(--color-text-muted)' }}>
 {title}
 </p>
 </div>
 </div>

 {/* Value */}
 <div className={cn(isRTL ? 'text-right' : 'text-left')}>
 <p
 className="font-bold leading-none"
 style={{ fontSize: '2rem', color: 'var(--color-text)' }}
 >
 {value}
 </p>
 </div>

 {/* Trend indicator */}
 {trend && (
 <div
 className={cn(
 'flex items-center gap-1.5 text-table',
 isRTL ? 'flex-row-reverse justify-end' : 'flex-row',
 )}
 >
 {(() => {
 const { color, Icon } = TREND_CONFIG[trend.direction]
 return (
 <>
 <Icon size={14} style={{ color }} aria-hidden="true" />
 <span className="font-medium" style={{ color }}>
 {trend.value}
 </span>
 </>
 )
 })()}
 {trend.label && (
 <span style={{ color: 'var(--color-text-muted)' }}>{trend.label}</span>
 )}
 </div>
 )}
 </div>
 )
}
