// ============================================================
// Breadcrumb — Page breadcrumb trail
// ============================================================

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { useLanguage } from '@/hooks/useLanguage'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const { isRTL } = useLanguage()
  const SepIcon = isRTL ? ChevronLeft : ChevronRight

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-1 flex-wrap', className)}
    >
      <ol
        className={cn(
          'flex items-center gap-1 flex-wrap text-table',
          isRTL ? 'flex-row-reverse' : 'flex-row',
        )}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && (
                <SepIcon
                  size={14}
                  className="shrink-0"
                  style={{ color: 'var(--color-border-muted)' }}
                  aria-hidden="true"
                />
              )}
              {isLast || !item.href ? (
                <span
                  className="font-medium"
                  style={{
                    color: isLast ? 'var(--color-text)' : 'var(--color-text-muted)',
                  }}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="hover:underline transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
