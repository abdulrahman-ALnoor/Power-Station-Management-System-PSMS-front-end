import { useTranslation } from 'react-i18next'
import { getInvoiceStats, MOCK_INVOICES } from '../data/mockData'
import { formatCurrency } from '@/utils/currency'
import { useLanguage } from '@/hooks/useLanguage'
import { FileText, CheckCircle2, AlertCircle, DollarSign, TrendingUp, CreditCard } from 'lucide-react'

export function InvoiceStats() {
  const { t } = useTranslation('invoices')
  const { isRTL } = useLanguage()
  const stats = getInvoiceStats(MOCK_INVOICES)

  const kpis = [
    {
      id: 'totalInvoices',
      label: t('stats.totalInvoices'),
      value: stats.totalInvoices.toString(),
      icon: FileText,
      colors: {
        bg: 'bg-surface-container-lowest dark:bg-surface-container-low',
        iconBg: 'bg-primary/10 dark:bg-primary/20',
        iconText: 'text-primary dark:text-primary-fixed',
        border: 'border-b-4 border-primary dark:border-primary-fixed'
      }
    },
    {
      id: 'paidInvoices',
      label: t('stats.paidInvoices'),
      value: stats.paidInvoices.toString(),
      icon: CheckCircle2,
      colors: {
        bg: 'bg-surface-container-lowest dark:bg-surface-container-low',
        iconBg: 'bg-green-100 dark:bg-green-900/30',
        iconText: 'text-green-600 dark:text-green-500',
        border: 'border-b-4 border-green-500 dark:border-green-600'
      }
    },
    {
      id: 'partiallyPaidInvoices',
      label: t('stats.partiallyPaidInvoices'),
      value: stats.partiallyPaidInvoices.toString(),
      icon: AlertCircle,
      colors: {
        bg: 'bg-surface-container-lowest dark:bg-surface-container-low',
        iconBg: 'bg-amber-100 dark:bg-amber-900/30',
        iconText: 'text-amber-600 dark:text-amber-500',
        border: 'border-b-4 border-amber-500 dark:border-amber-600'
      }
    },
    {
      id: 'totalInvoicedAmount',
      label: t('stats.totalInvoicedAmount'),
      value: formatCurrency(stats.totalInvoicedAmount, isRTL),
      icon: DollarSign,
      colors: {
        bg: 'bg-surface-container-lowest dark:bg-surface-container-low',
        iconBg: 'bg-primary/10 dark:bg-primary/20',
        iconText: 'text-primary dark:text-primary-fixed',
        border: 'border-b-4 border-primary dark:border-primary-fixed'
      }
    },
    {
      id: 'totalCollections',
      label: t('stats.totalCollections'),
      value: formatCurrency(stats.totalCollections, isRTL),
      icon: TrendingUp,
      colors: {
        bg: 'bg-surface-container-lowest dark:bg-surface-container-low',
        iconBg: 'bg-green-100 dark:bg-green-900/30',
        iconText: 'text-green-600 dark:text-green-500',
        border: 'border-b-4 border-green-500 dark:border-green-600'
      }
    },
    {
      id: 'totalOutstanding',
      label: t('stats.totalOutstanding'),
      value: formatCurrency(stats.totalOutstanding, isRTL),
      icon: CreditCard,
      colors: {
        bg: 'bg-surface-container-lowest dark:bg-surface-container-low',
        iconBg: 'bg-amber-100 dark:bg-amber-900/30',
        iconText: 'text-amber-600 dark:text-amber-500',
        border: 'border-b-4 border-amber-500 dark:border-amber-600'
      }
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon

        return (
          <div 
            key={kpi.id} 
            className={`p-6 rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] flex flex-col justify-between ${kpi.colors.bg} ${kpi.colors.border}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.colors.iconBg} ${kpi.colors.iconText}`}>
                <Icon size={24} />
              </div>
            </div>
            
            <div>
              <p className="text-label-md text-outline dark:text-outline font-bold mb-1">
                {kpi.label}
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="font-display-sm text-display-sm font-bold text-on-surface dark:text-on-dark break-words">
                  {kpi.value}
                </h3>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
