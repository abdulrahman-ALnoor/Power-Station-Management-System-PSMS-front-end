// ============================================================
// Pagination — Data table pagination control
// ============================================================

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useLanguage } from '@/hooks/useLanguage'
import type { PaginationMeta } from '@/types/common'

interface PaginationProps {
  meta?: PaginationMeta
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ meta, onPageChange, className }: PaginationProps) {
  const { t, isRTL } = useLanguage()

  // Safely default values if meta is missing or incomplete
  const currentPage = meta?.currentPage ?? 1
  const lastPage = meta?.lastPage ?? 1
  const perPage = meta?.perPage ?? 10
  const total = meta?.total ?? 0

  const startItem = total === 0 ? 0 : (currentPage - 1) * perPage + 1
  const endItem = Math.min(currentPage * perPage, total)

  // Generate page numbers to show
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const delta = 1
    const range: number[] = []
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(lastPage - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    const pages: (number | 'ellipsis')[] = [1]
    if (range[0] > 2) pages.push('ellipsis')
    pages.push(...range)
    if (range[range.length - 1] < lastPage - 1) pages.push('ellipsis')
    if (lastPage > 1) pages.push(lastPage)
    return pages
  }

  if (lastPage <= 1) return null

  const NavFirst = isRTL ? ChevronsRight : ChevronsLeft
  const NavPrev  = isRTL ? ChevronRight : ChevronLeft
  const NavNext  = isRTL ? ChevronLeft : ChevronRight
  const NavLast  = isRTL ? ChevronsLeft : ChevronsRight

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-3 py-3',
        className,
      )}
    >
      {/* Count summary */}
      <p className="text-table" style={{ color: 'var(--color-text-muted)' }}>
        {t('common:table.showing')} <span className="font-medium">{startItem}</span>{' '}
        {t('common:table.to')} <span className="font-medium">{endItem}</span>{' '}
        {t('common:table.of')} <span className="font-medium">{total}</span>{' '}
        {t('common:table.results')}
      </p>

      {/* Page buttons */}
      <nav
        className="flex items-center gap-1"
        aria-label="Pagination"
        dir="ltr" // Pagination buttons always LTR for number ordering
      >
        {/* First */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="pagination-btn"
          aria-label="First page"
        >
          <NavFirst size={14} />
        </button>

        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn"
          aria-label="Previous page"
        >
          <NavPrev size={14} />
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, i) =>
          page === 'ellipsis' ? (
            <span
              key={`ellipsis-${i}`}
              className="w-9 h-9 flex items-center justify-center text-table"
              style={{ color: 'var(--color-text-muted)' }}
            >
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-current={currentPage === page ? 'page' : undefined}
              className={cn(
                'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
                currentPage === page
                  ? 'text-white'
                  : 'hover:bg-gray-100',
              )}
              style={
                currentPage === page
                  ? { background: 'var(--color-primary)', color: 'white' }
                  : { color: 'var(--color-text)' }
              }
            >
              {page}
            </button>
          ),
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          className="pagination-btn"
          aria-label="Next page"
        >
          <NavNext size={14} />
        </button>

        {/* Last */}
        <button
          onClick={() => onPageChange(lastPage)}
          disabled={currentPage === lastPage}
          className="pagination-btn"
          aria-label="Last page"
        >
          <NavLast size={14} />
        </button>
      </nav>
    </div>
  )
}
