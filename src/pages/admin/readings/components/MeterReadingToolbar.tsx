import { useTranslation } from 'react-i18next'
import { Search, Plus, Filter, RefreshCw } from 'lucide-react'

interface MeterReadingToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
  thisMonthOnly: boolean
  onThisMonthOnlyChange: (value: boolean) => void
  onAddClick: () => void
  onRefresh: () => void
}

export function MeterReadingToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  thisMonthOnly,
  onThisMonthOnlyChange,
  onAddClick,
  onRefresh
}: MeterReadingToolbarProps) {
  const { t } = useTranslation('readings')

  return (
    <div className="bg-surface-white dark:bg-surface-container-low p-4 rounded-2xl shadow-sm border border-outline/10 space-y-4">

      {/* Top Row: Search and Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Search */}
        <div className="relative w-full sm:max-w-2xl">
          <div className="absolute inset-y-0 start-0 pl-3 flex items-center pointer-events-none text-outline/50 rtl:pr-3 rtl:pl-0">
            <Search size={18} />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('toolbar.searchPlaceholder')}
            className="w-full bg-surface-container-lowest dark:bg-surface-container/30 border border-outline/20 dark:border-outline/10 text-on-surface dark:text-on-dark text-sm rounded-xl py-2.5 pl-10 pr-4 rtl:pr-10 rtl:pl-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto">

          <button
            onClick={onRefresh}
            className="p-2.5 text-outline hover:text-on-surface dark:hover:text-on-dark hover:bg-surface-variant dark:hover:bg-surface-container-high rounded-xl transition-colors shrink-0"
            aria-label={t('toolbar.actions.refresh')}
          >
            <RefreshCw size={18} />
          </button>

          <button
            onClick={onAddClick}
            className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-on-primary text-sm font-bold rounded-xl transition-colors shadow-sm active:scale-95"
          >
            <Plus size={18} />
            {t('toolbar.actions.addReading')}
          </button>

        </div>
      </div>

      {/* Bottom Row: Filters */}
      <div className="flex flex-wrap items-center gap-3">

        <div className="flex items-center gap-2 text-outline/70">
          <Filter size={16} />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="bg-surface-container-lowest dark:bg-surface-container/30 border border-outline/20 dark:border-outline/10 text-on-surface dark:text-on-dark text-sm rounded-xl py-2 px-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow cursor-pointer"
        >
          <option value="all">
            {t('toolbar.filters.status.all')}
          </option>

          <option value="pending">
            {t('toolbar.filters.status.pending')}
          </option>

          <option value="approved">
            {t('toolbar.filters.status.approved')}
          </option>

          <option value="rejected">
            {t('toolbar.filters.status.rejected')}
          </option>
        </select>

        <select
          value={thisMonthOnly ? 'thisMonth' : 'all'}
          onChange={(e) =>
            onThisMonthOnlyChange(
              e.target.value === 'thisMonth'
            )
          }
          className="bg-surface-container-lowest dark:bg-surface-container/30 border border-outline/20 dark:border-outline/10 text-on-surface dark:text-on-dark text-sm rounded-xl py-2 px-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow cursor-pointer"
        >
          <option value="all">
            {t('toolbar.filters.month.all')}
          </option>

          <option value="thisMonth">
            {t('toolbar.filters.month.thisMonth')}
          </option>
        </select>

      </div>
    </div>
  )
}