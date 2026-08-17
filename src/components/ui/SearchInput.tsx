// ============================================================
// SearchInput — Search field with icon
// ============================================================

import { forwardRef, type InputHTMLAttributes } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, value, ...rest }, ref) => {
    return (
      <div className="relative flex items-center">
        {/* Search icon */}
        <span
          className="absolute inset-block-0 start-0 flex items-center ps-3 pointer-events-none"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <Search size={16} aria-hidden="true" />
        </span>

        <input
          ref={ref}
          type="search"
          value={value}
          className={cn(
            'w-full h-10 ps-10 pe-8 rounded-lg border text-body transition-colors',
            'bg-white placeholder:text-[var(--color-text-disabled)]',
            'focus:outline-none focus:ring-2 focus:border-[var(--color-steel-blue)]',
            'focus:ring-[var(--color-steel-blue)]/20 border-[var(--color-border)]',
            className,
          )}
          style={{ color: 'var(--color-text)' }}
          {...rest}
        />

        {/* Clear button */}
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute inset-block-0 end-0 flex items-center pe-3 hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-text-muted)' }}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>
    )
  },
)

SearchInput.displayName = 'SearchInput'
