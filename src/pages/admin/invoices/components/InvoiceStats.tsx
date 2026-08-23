import { useTranslation } from 'react-i18next'
import { formatCurrency } from '@/utils/currency'
import { useLanguage } from '@/hooks/useLanguage'
import { FileText, CheckCircle2, AlertCircle, DollarSign, TrendingUp, CreditCard } from 'lucide-react'
import type { InvoiceStatsResponse } from '@/services/invoices.service'

interface InvoiceStatsProps {
  stats: InvoiceStatsResponse | null
}

export function InvoiceStats({ stats }: InvoiceStatsProps) {
  const { t } = useTranslation('invoices')
  const { isRTL } = useLanguage()
  const values = stats ?? {
    total_revenue: 0,
    total_invoices: 0,
    paid_invoices_count: 0,
    partially_paid_count: 0,
    overdue_amount: 0,
    this_month_collect: 0,
  }

  const kpis = [
    { id: 'totalInvoices', label: t('stats.totalInvoices'), value: String(values.total_invoices), icon: FileText, color: 'primary' },
    { id: 'paidInvoices', label: t('stats.paidInvoices'), value: String(values.paid_invoices_count), icon: CheckCircle2, color: 'green' },
    { id: 'partiallyPaidInvoices', label: t('stats.partiallyPaidInvoices'), value: String(values.partially_paid_count), icon: AlertCircle, color: 'amber' },
    { id: 'totalCollections', label: t('stats.totalCollections'), value: formatCurrency(values.total_revenue, isRTL), icon: TrendingUp, color: 'green' },
    { id: 'totalOutstanding', label: t('stats.totalOutstanding'), value: formatCurrency(values.overdue_amount, isRTL), icon: CreditCard, color: 'amber' },
    { id: 'monthlyCollections', label: t('stats.monthlyCollections', { defaultValue: 'تحصيلات الشهر' }), value: formatCurrency(values.this_month_collect, isRTL), icon: DollarSign, color: 'primary' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        const styles = kpi.color === 'green'
          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 border-green-500'
          : kpi.color === 'amber'
            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 border-amber-500'
            : 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed border-primary'
        return (
          <div key={kpi.id} className={`p-6 rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] flex flex-col justify-between bg-surface-container-lowest dark:bg-surface-container-low border-b-4 ${styles.split(' ').pop()}`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${styles.split(' ').slice(0, 5).join(' ')}`}>
                <Icon size={24} />
              </div>
            </div>
            <div>
              <p className="text-label-md text-outline dark:text-outline font-bold mb-1">{kpi.label}</p>
              <h3 className="font-display-sm text-display-sm font-bold text-on-surface dark:text-on-dark break-words">{kpi.value}</h3>
            </div>
          </div>
        )
      })}
    </div>
  )
}
