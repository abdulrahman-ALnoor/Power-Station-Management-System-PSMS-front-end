import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'
import type { DashboardLatestReading } from '@/services/dashboard.service.ts'

interface LatestReadingsProps {
  readings: DashboardLatestReading[]
}

export function LatestReadings({ readings }: LatestReadingsProps) {
  const { t } = useTranslation('dashboard')
  const { isRTL } = useLanguage()
  const navigate = useNavigate()

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
      <div className={cn("p-6 border-b border-border flex justify-between items-center", isRTL ? "flex-row-reverse" : "flex-row")}>
        <h4 className="font-headline text-headline text-primary">
          {t('readings.title')}
        </h4>
        <button
          onClick={() => navigate('/admin/readings')}
          className="text-primary hover:underline text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          {t('readings.viewAll')}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className={cn("w-full text-sm", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
          <thead>
            <tr className="bg-[var(--color-surface-container-low)] text-[var(--color-text-muted)] font-semibold border-b border-border">
              <th className="p-4 whitespace-nowrap">{t('readings.table.meterId')}</th>
              <th className="p-4 whitespace-nowrap">{t('readings.table.customer')}</th>
              <th className="p-4 whitespace-nowrap">{t('readings.table.reading')}</th>
              <th className="p-4 whitespace-nowrap">{t('readings.table.consumption')}</th>
              <th className="p-4 whitespace-nowrap">{t('readings.table.reader')}</th>
              <th className="p-4 whitespace-nowrap">{t('readings.table.date')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {readings.map((r) => (
              <tr key={r.id} className="hover:bg-[var(--color-surface-container-lowest)] transition-colors">
                <td className="p-4 text-text whitespace-nowrap">{r.meter_number || '-'}</td>
                <td className="p-4 text-text whitespace-nowrap">{r.customer_name || '-'}</td>
                <td className="p-4 text-text font-semibold whitespace-nowrap">{r.reading}</td>
                <td className={cn("p-4 font-bold whitespace-nowrap", r.consumption >= 0 ? "text-[var(--color-success)]" : "text-[var(--color-danger)]")}>
                  {r.consumption}
                </td>
                <td className="p-4 text-text whitespace-nowrap">{r.reader_name || '-'}</td>
                <td className="p-4 text-outline whitespace-nowrap">
                  {new Date(r.reading_date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
