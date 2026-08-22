import { useTranslation } from 'react-i18next'
import { Receipt } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/currency'
import type { DashboardLatestInvoice } from '@/services/dashboard.service.ts'

interface RecentCollectionsProps {
  invoices: DashboardLatestInvoice[]
}

export function RecentCollections({ invoices }: RecentCollectionsProps) {
  const { t } = useTranslation('dashboard')
  const { isRTL } = useLanguage()

  return (
    <div className="xl:col-span-2 bg-surface p-6 rounded-xl border border-border shadow-sm">
      <h4 className="font-headline text-headline text-primary mb-6">
        {t('collections.title')}
      </h4>
      <div className="space-y-4">
        {invoices.length === 0 && (
          <p className="text-outline text-sm text-center py-6">—</p>
        )}
        {invoices.map((inv) => (
          <div
            key={inv.id}
            className={cn(
              "flex items-center justify-between p-4 border border-[var(--color-outline-variant)] rounded-lg hover:border-[var(--color-steel-blue)] transition-all duration-300",
              isRTL ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className={cn("flex items-center gap-4", isRTL ? "flex-row-reverse" : "flex-row")}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'rgba(79, 121, 183, 0.1)', color: 'var(--color-steel-blue)' }}
              >
                <Receipt size={20} />
              </div>
              <div className={isRTL ? "text-right" : "text-left"}>
                <p className="font-semibold text-sm text-primary">
                  {inv.invoice_number}
                </p>
                <p className="text-[10px] text-outline mt-0.5">
                  {inv.customer?.name || '-'}
                </p>
              </div>
            </div>

            <div className={isRTL ? "text-right" : "text-left"}>
              <p className="font-bold text-primary">
                {formatCurrency(inv.paid_amount, isRTL)}
              </p>
              <p className="text-[10px] text-outline mt-0.5">
                {new Date(inv.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
