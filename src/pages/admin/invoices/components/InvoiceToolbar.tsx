import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Search,
  RefreshCw,
  Plus,
} from 'lucide-react'

interface InvoiceToolbarProps {
  onCreateInvoice: () => void
  onRefresh: () => void
  onSearch: (value: string) => void
  onStatusChange: (value: string) => void
  isRefreshing?: boolean
}

export function InvoiceToolbar({
  onCreateInvoice,
  onRefresh,
  onSearch,
  onStatusChange,
  isRefreshing = false,
}: InvoiceToolbarProps) {
  const { t } = useTranslation('invoices')

  const [searchValue, setSearchValue] = useState('')
  const [statusValue, setStatusValue] = useState('')

  return (
    <div className="bg-surface-white dark:bg-surface-container-low p-6 rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] flex flex-wrap items-center justify-between gap-4">

      {/* البحث والفلاتر */}
      <div className="flex flex-wrap items-center gap-4 flex-grow w-full md:w-auto">

        {/* البحث */}
        <div className="relative flex-1 min-w-[240px] max-w-full md:max-w-[420px]">

          <Search
            className="absolute inset-inline-start-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5 pointer-events-none"
          />

          <input
            type="text"
            value={searchValue}
            onChange={(event) => {
              const value = event.target.value

              setSearchValue(value)
              onSearch(value)
            }}
            placeholder={t('toolbar.searchPlaceholder')}
            className="w-full ps-12 pe-4 py-2 h-[44px] md:h-[48px] bg-surface-container-lowest dark:bg-surface border border-outline-variant dark:border-border-muted rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:focus:border-primary-fixed dark:focus:ring-primary-fixed text-body-md text-on-surface dark:text-on-dark transition-all"
          />

        </div>

        {/* فلترة الحالة */}
        <select
          value={statusValue}
          onChange={(event) => {
            const value = event.target.value

            setStatusValue(value)
            onStatusChange(value)
          }}
          className="w-full md:w-[180px] h-[44px] md:h-[48px] bg-surface-container-lowest dark:bg-surface border border-outline-variant dark:border-border-muted rounded-xl px-4 py-2 text-body-md text-on-surface dark:text-on-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:focus:border-primary-fixed dark:focus:ring-primary-fixed cursor-pointer transition-all"
          aria-label={t('toolbar.status')}
        >

          <option value="">
            {t('toolbar.status')}
          </option>

          <option value="paid">
            {t('status.paid')}
          </option>

          <option value="partially_paid">
            {t('status.partially_paid')}
          </option>

        </select>

      </div>

      {/* الأزرار */}
      <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0 justify-end">

        {/* إنشاء فاتورة */}
        <button
          type="button"
          onClick={onCreateInvoice}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-6 py-2 h-[44px] md:h-[48px] bg-primary text-on-primary rounded-xl font-bold hover:bg-primary-container dark:bg-primary-fixed dark:text-primary dark:hover:bg-primary dark:hover:text-white transition-colors shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >

          <Plus size={20} />

          <span>
            {t('toolbar.createInvoice')}
          </span>

        </button>

        {/* تحديث */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 h-[44px] w-[44px] md:h-[48px] md:w-[48px] flex items-center justify-center border border-outline-variant dark:border-border-muted text-on-surface-variant dark:text-outline rounded-xl hover:bg-surface-container dark:hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={t('toolbar.refresh')}
          title={t('toolbar.refresh')}
        >

          <RefreshCw
            size={20}
            className={
              isRefreshing
                ? 'animate-spin'
                : ''
            }
          />

        </button>

      </div>

    </div>
  )
}
