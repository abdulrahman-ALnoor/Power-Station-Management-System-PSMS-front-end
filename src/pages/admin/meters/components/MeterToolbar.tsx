import { useTranslation } from 'react-i18next'
import { Search, Download, RefreshCw, Plus, Filter } from 'lucide-react'

interface MeterToolbarProps {
  onAddClick: () => void
}

export function MeterToolbar({ onAddClick }: MeterToolbarProps) {
  const { t } = useTranslation('meters')

  return (
    <div className="p-6 border-b border-surface-container-high dark:border-border-muted flex flex-col md:flex-row gap-4 md:items-center justify-between">
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-3 flex-1 w-full xl:w-auto">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute inset-inline-end-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5 pointer-events-none" />
          <input 
            type="text" 
            placeholder={t('toolbar.searchPlaceholder')}
            className="w-full pe-10 ps-4 py-2 bg-surface-container-low dark:bg-surface border-none rounded-lg focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary-fixed/30 font-body-md text-body-md text-on-surface dark:text-on-dark transition-all outline-none"
          />
        </div>

        {/* Filters */}
        <select 
          className="shrink-0 min-w-[140px] bg-surface-container-low dark:bg-surface border-none rounded-lg px-4 py-2 font-body-md text-on-surface-variant focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary-fixed/30 cursor-pointer outline-none"
          aria-label={t('toolbar.status')}
        >
          <option value="">{t('toolbar.status')}</option>
          <option value="active">{t('status.active')}</option>
          <option value="disconnected">{t('status.disconnected')}</option>
          <option value="maintenance">{t('status.maintenance')}</option>
          <option value="damaged">{t('status.damaged')}</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button 
          className="flex items-center gap-2 px-4 py-2 text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-surface rounded-lg transition-all font-body-md"
        >
          <RefreshCw size={20} />
          <span className="hidden sm:inline">{t('toolbar.refresh')}</span>
        </button>
        
        <button 
          onClick={onAddClick}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary-container dark:bg-primary-fixed dark:text-primary dark:hover:bg-primary dark:hover:text-white transition-all font-body-md shadow-md active:scale-95"
        >
          <Plus size={20} />
          <span>{t('toolbar.addMeter')}</span>
        </button>
      </div>
    </div>
  )
}
