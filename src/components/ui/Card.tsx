// ============================================================
// Card — Base content container
// ============================================================

import { type ReactNode, type HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
 children: ReactNode
 padding?: 'none' | 'sm' | 'md' | 'lg'
 hoverable?: boolean
}

const PADDING_STYLES = {
 none: 'p-0',
 sm: 'p-4',
 md: 'p-6',
 lg: 'p-8',
}

export function Card({
 children,
 padding = 'md',
 hoverable = false,
 className,
 ...rest
}: CardProps) {
 return (
 <div
 className={cn(
 'card',
 PADDING_STYLES[padding],
 hoverable && 'cursor-pointer',
 className,
 )}
 {...rest}
 >
 {children}
 </div>
 )
}

/** Card header section */
export function CardHeader({
 children,
 className,
 ...rest
}: HTMLAttributes<HTMLDivElement>) {
 return (
 <div
 className={cn('flex items-center justify-between gap-4 mb-4', className)}
 {...rest}
 >
 {children}
 </div>
 )
}

/** Card title */
export function CardTitle({
 children,
 className,
 ...rest
}: HTMLAttributes<HTMLHeadingElement>) {
 return (
 <h2
 className={cn('text-headline', className)}
 style={{ color: 'var(--color-text)' }}
 {...rest}
 >
 {children}
 </h2>
 )
}
