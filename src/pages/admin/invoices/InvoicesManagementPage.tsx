import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/hooks/useLanguage'
import { InvoiceStats } from './components/InvoiceStats'
import { InvoiceCharts } from './components/InvoiceCharts'
import { InvoiceToolbar } from './components/InvoiceToolbar'
import { InvoiceTable } from './components/InvoiceTable'
import { InvoiceDetailsDrawer } from './components/InvoiceDetailsDrawer'
import { InvoiceShortcutCards } from './components/InvoiceShortcutCards'
import { MOCK_INVOICES } from './data/mockData'

export function InvoicesManagementPage() {
  const { t } = useTranslation('invoices')
  const { isRTL } = useLanguage()
  
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null)

  const selectedInvoice =
    selectedInvoiceId !== null
      ? MOCK_INVOICES.find((invoice) => invoice.id === selectedInvoiceId) ?? null
      : null

  return (
    <>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-start">
            <h1 className="text-display-sm font-display-sm font-bold text-on-surface dark:text-on-dark">
              {t('pageTitle')}
            </h1>
            <p className="text-body-md text-outline mt-1">
              {t('pageSubtitle')}
            </p>
            <nav
              className="flex gap-2 text-label-sm text-outline mt-2"
              dir={isRTL ? 'rtl' : 'ltr'}
              aria-label={t('breadcrumb.invoices')}
            >
              <span>{t('breadcrumb.home')}</span>
              <span>/</span>
              <span>{t('breadcrumb.invoices')}</span>
            </nav>
          </div>
        </div>

        {/* Statistics */}
        <InvoiceStats />

        {/* Charts */}
        <InvoiceCharts />

        {/* Toolbar */}
        <InvoiceToolbar />

        {/* Invoices Table */}
        <InvoiceTable
          onRowClick={(id: number) => {
            setSelectedInvoiceId(id)
          }}
        />

        {/* Bottom Shortcuts */}
        <InvoiceShortcutCards />
      </div>

      {/* Invoice Details Drawer */}
      <InvoiceDetailsDrawer
        invoice={selectedInvoice}
        isOpen={selectedInvoiceId !== null}
        onClose={() => setSelectedInvoiceId(null)}
      />
    </>
  )
}
