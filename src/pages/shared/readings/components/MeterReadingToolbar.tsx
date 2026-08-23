import React from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Plus, Filter, RefreshCw } from 'lucide-react'

interface MeterReadingToolbarProps {
 searchQuery: string
 onSearchChange: (query: string) => void
 statusFilter: string
 onStatusFilterChange: (status: string) => void
 methodFilter: string
 onMethodFilterChange: (method: string) => void
 dateFilter: string
 onDateFilterChange: (dateRange: string) => void
 onAddClick?: () => void
 onRefresh: () => void
}

export function MeterReadingToolbar({
 searchQuery,
 onSearchChange,
 statusFilter,
 onStatusFilterChange,
 methodFilter,
 onMethodFilterChange,
 dateFilter,
 onDateFilterChange,
 onAddClick,
 onRefresh
}: MeterReadingToolbarProps) {
 const { t } = useTranslation('readings')

 return (
 <div className="bg-surface p-4 rounded-2xl shadow-sm border border-border space-y-4">
 {/* Top Row: Search and Actions */}
 <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
 {/* Search */}
 <div className="relative w-full sm:w-[280px] lg:w-[320px] shrink-0">
 <div className="absolute inset-y-0 start-0 pl-3 flex items-center pointer-events-none text-text-muted rtl:pr-3 rtl:pl-0">
 <Search size={18} />
 </div>
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => onSearchChange(e.target.value)}
 placeholder={t('toolbar.searchPlaceholder')}
 className="w-full bg-surface-low border border-border text-text-primary text-sm rounded-xl py-2.5 pl-10 pr-4 rtl:pr-10 rtl:pl-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow"
 />
 </div>

 {/* Actions */}
 <div className="flex items-center gap-2 w-full sm:w-auto">
 <button
 onClick={onRefresh}
 className="p-2.5 text-text-muted hover:text-text-primary :text-on-dark hover:bg-surface-container :bg-surface-container-high rounded-xl transition-colors shrink-0"
 aria-label={t('toolbar.actions.refresh')}
 >
 <RefreshCw size={18} />
 </button>
 

 {onAddClick && (
 <button
 onClick={onAddClick}
 className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-on-primary text-sm font-bold rounded-xl transition-colors shadow-sm active:scale-95"
 >
 <Plus size={18} />
 {t('toolbar.actions.addReading')}
 </button>
 )}
 </div>
 </div>

 {/* Bottom Row: Filters */}
 <div className="flex flex-wrap items-center gap-3">
 <div className="flex items-center gap-2 text-text-muted">
 <Filter size={16} />
 </div>

 <select
 value={statusFilter}
 onChange={(e) => onStatusFilterChange(e.target.value)}
 className="bg-surface-low border border-border text-text-primary text-sm rounded-xl py-2 px-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow cursor-pointer"
 >
 <option value="all">{t('toolbar.filters.status.all')}</option>
 <option value="pending">{t('toolbar.filters.status.pending')}</option>
 <option value="approved">{t('toolbar.filters.status.approved')}</option>
 <option value="rejected">{t('toolbar.filters.status.rejected')}</option>
 </select>

 <select
 value={methodFilter}
 onChange={(e) => onMethodFilterChange(e.target.value)}
 className="bg-surface-low border border-border text-text-primary text-sm rounded-xl py-2 px-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow cursor-pointer"
 >
 <option value="all">{t('toolbar.filters.method.all')}</option>
 <option value="manual">{t('toolbar.filters.method.manual')}</option>
 <option value="qr_scan">{t('toolbar.filters.method.qrScan')}</option>
 </select>

 <select
 value={dateFilter}
 onChange={(e) => onDateFilterChange(e.target.value)}
 className="bg-surface-low border border-border text-text-primary text-sm rounded-xl py-2 px-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow cursor-pointer"
 >
 <option value="all">{t('toolbar.filters.date.all')}</option>
 <option value="today">{t('toolbar.filters.date.today')}</option>
 <option value="this_week">{t('toolbar.filters.date.thisWeek')}</option>
 <option value="this_month">{t('toolbar.filters.date.thisMonth')}</option>
 </select>
 </div>
 </div>
 )
}
