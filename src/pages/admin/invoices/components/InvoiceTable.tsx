import { useTranslation } from 'react-i18next'
import { MOCK_INVOICES } from '../data/mockData'
import { Eye, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { formatCurrency } from '@/utils/currency'
import { cn } from '@/utils/cn'

interface InvoiceTableProps {
  onRowClick: (id: number) => void
}

export function InvoiceTable({ onRowClick }: InvoiceTableProps) {
  const { t } = useTranslation('invoices')
  const { isRTL } = useLanguage()

  const getStatusStyle = (status: string | null) => {
    switch (status) {
      case 'paid': return 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-500'
      case 'partially_paid': return 'bg-amber-50 text-amber-gold dark:bg-amber-900/30 dark:text-amber-500'
      default: return 'bg-surface-dim text-on-surface-variant'
    }
  }

  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    return d.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')
  }

  return (
    <div className="bg-surface-white dark:bg-surface-container-low rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-start border-collapse">
          <thead>
            <tr className="bg-surface-container-low dark:bg-surface-container border-b border-outline-variant dark:border-border-muted">
              <th className="px-6 py-4 font-body-md font-bold text-on-surface dark:text-on-dark text-start whitespace-nowrap">{t('table.invoiceNumber')}</th>
              <th className="px-6 py-4 font-body-md font-bold text-on-surface dark:text-on-dark text-start whitespace-nowrap">{t('table.customerName')}</th>
              <th className="px-6 py-4 font-body-md font-bold text-on-surface dark:text-on-dark text-start whitespace-nowrap">{t('table.meterNumber')}</th>
              <th className="px-6 py-4 font-body-md font-bold text-on-surface dark:text-on-dark text-start whitespace-nowrap">{t('table.amount')}</th>
              <th className="px-6 py-4 font-body-md font-bold text-on-surface dark:text-on-dark text-start whitespace-nowrap">{t('table.paidAmount')}</th>
              <th className="px-6 py-4 font-body-md font-bold text-on-surface dark:text-on-dark text-start whitespace-nowrap">{t('table.remainingAmount')}</th>
              <th className="px-6 py-4 font-body-md font-bold text-on-surface dark:text-on-dark text-start whitespace-nowrap">{t('table.createdAt')}</th>
              <th className="px-6 py-4 font-body-md font-bold text-on-surface dark:text-on-dark text-start whitespace-nowrap">{t('table.status')}</th>
              <th className="px-6 py-4 font-body-md font-bold text-on-surface dark:text-on-dark text-center whitespace-nowrap">{t('table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant dark:divide-border-muted">
            {MOCK_INVOICES.map((item) => (
              <tr 
                key={item.id} 
                className="hover:bg-surface-container-low dark:hover:bg-surface-container/50 transition-colors cursor-pointer group"
                onClick={() => onRowClick(item.id)}
              >
                <td className="px-6 py-4 font-table-cell font-bold text-primary dark:text-on-dark whitespace-nowrap">{item.invoice_number}</td>
                <td className="px-6 py-4 font-table-cell text-on-surface dark:text-on-dark whitespace-nowrap">
                  {item.customer?.name || t('table.unassigned')}
                </td>
                <td className="px-6 py-4 font-table-cell text-outline dark:text-outline whitespace-nowrap">
                  {item.consumptionCharge?.meter?.meter_number || '-'}
                </td>
                <td className="px-6 py-4 font-table-cell text-on-surface dark:text-on-dark whitespace-nowrap font-medium" dir="ltr">
                  {formatCurrency(item.outstanding_before_payment, isRTL)}
                </td>
                <td className="px-6 py-4 font-table-cell text-green-600 dark:text-green-500 whitespace-nowrap font-medium" dir="ltr">
                  {formatCurrency(item.paid_amount, isRTL)}
                </td>
                <td className="px-6 py-4 font-table-cell text-amber-600 dark:text-amber-500 whitespace-nowrap font-medium" dir="ltr">
                  {formatCurrency(item.remaining_balance, isRTL)}
                </td>
                <td className="px-6 py-4 font-table-cell text-outline dark:text-outline whitespace-nowrap" dir="ltr">
                  {formatDate(item.created_at)}
                </td>
                <td className="px-6 py-4 font-table-cell whitespace-nowrap">
                  <span className={cn("px-3 py-1 rounded-full text-[12px] font-bold", getStatusStyle(item.status))}>
                    {item.status ? t(`status.${item.status}`) : t('status.unspecified')}
                  </span>
                </td>
                <td className="px-6 py-4 font-table-cell whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button className="text-outline hover:text-primary dark:hover:text-primary-fixed transition-colors p-1" title={t('table.view')}>
                      <Eye size={20} />
                    </button>
                    <button className="text-outline hover:text-amber-gold dark:hover:text-amber-500 transition-colors p-1" title={t('table.edit')}>
                      <Edit2 size={20} />
                    </button>
                    <button className="text-outline hover:text-error dark:hover:text-error-container transition-colors p-1" title={t('table.delete')}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 bg-surface-container-lowest dark:bg-surface-container flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant dark:border-border-muted">
        <p className="text-label-sm text-outline">
          {t('pagination.showing', { count: MOCK_INVOICES.length, total: MOCK_INVOICES.length })}
        </p>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant dark:border-border-muted text-on-surface-variant dark:text-outline hover:bg-surface-container dark:hover:bg-surface transition-colors">
            {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-on-primary font-bold dark:bg-primary-fixed dark:text-primary">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant dark:border-border-muted text-on-surface-variant dark:text-outline hover:bg-surface-container dark:hover:bg-surface transition-colors">
            {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  )
}
