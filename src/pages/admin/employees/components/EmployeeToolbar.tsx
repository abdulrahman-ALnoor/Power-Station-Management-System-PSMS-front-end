import { useTranslation } from 'react-i18next'
import { Search, Download, RefreshCw, UserPlus } from 'lucide-react'

interface EmployeeToolbarProps {
  onAddClick: () => void
}

export function EmployeeToolbar({ onAddClick }: EmployeeToolbarProps) {
  const { t } = useTranslation('employees')

  return (
    <div className="bg-surface p-4 rounded-xl shadow-sm border border-border dark:bg-surface-container-low flex flex-wrap gap-3 items-center justify-between">
      
      {/* Filters and Search */}
      <div className="flex flex-wrap gap-3 items-center flex-1">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute inset-inline-end-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5 pointer-events-none" />
          <input 
            type="text" 
            placeholder={t('toolbar.searchPlaceholder')}
            className="w-full pe-10 ps-4 py-2 border border-border-muted rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-body-md bg-background dark:bg-surface dark:border-border dark:text-on-dark transition-colors outline-none"
          />
        </div>

        {/* Filters */}
        <select 
          className="border border-border-muted rounded-lg px-4 py-2 font-body-md text-body-md bg-background dark:bg-surface dark:border-border dark:text-on-dark shrink-0 min-w-[140px] outline-none focus:ring-2 focus:ring-primary"
          aria-label={t('toolbar.jobTitle')}
        >
          <option value="">{t('toolbar.jobTitle')}</option>
          <option value="manager">{t('toolbar.roles.manager')}</option>
          <option value="engineer">{t('toolbar.roles.engineer')}</option>
          <option value="reader">{t('toolbar.roles.reader')}</option>
          <option value="accountant">{t('toolbar.roles.accountant')}</option>
        </select>

        <select 
          className="border border-border-muted rounded-lg px-4 py-2 font-body-md text-body-md bg-background dark:bg-surface dark:border-border dark:text-on-dark shrink-0 min-w-[140px] outline-none focus:ring-2 focus:ring-primary"
          aria-label={t('toolbar.status')}
        >
          <option value="">{t('toolbar.status')}</option>
          <option value="active">{t('status.active')}</option>
          <option value="inactive">{t('status.inactive')}</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 shrink-0">
        <button 
          className="flex items-center gap-2 border border-border-muted text-on-surface-variant px-4 py-2 rounded-lg hover:bg-surface-container dark:border-border dark:hover:bg-surface-high transition-colors"
          title={t('toolbar.refresh')}
        >
          <RefreshCw size={18} />
        </button>
        
        <button 
          onClick={onAddClick}
          className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 dark:bg-primary dark:text-white shrink-0 min-w-max"
        >
          <UserPlus size={20} />
          <span>{t('toolbar.addEmployee')}</span>
        </button>
      </div>
    </div>
  )
}
