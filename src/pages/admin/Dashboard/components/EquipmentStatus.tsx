import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'
import type { EquipmentStatusSummary } from '@/services/dashboard.service.ts'

interface EquipmentStatusProps {
  data: EquipmentStatusSummary | null
}

export function EquipmentStatus({ data }: EquipmentStatusProps) {
  const { t } = useTranslation('dashboard')
  const { isRTL } = useLanguage()

  const total = data?.total_equipment ?? 0
  const inUse = data?.used_equipment ?? 0
  const needsMaintenance = (data?.maintenance_equipment ?? 0) + (data?.damaged_equipment ?? 0)
  const available = Math.max(0, total - inUse - needsMaintenance - (data?.lost_equipment ?? 0))

  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0)

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm p-6 flex flex-col justify-between h-full">
      <div>
        <h4 className="font-headline text-headline text-primary mb-6">
          {t('equipmentStatus.title')}
        </h4>
        <div className="space-y-6">

          {/* Total */}
          <div>
            <div className={cn("flex justify-between text-xs font-semibold mb-2 text-text", isRTL ? "flex-row-reverse" : "flex-row")}>
              <span>{t('equipmentStatus.total')}</span>
              <span>{total} {t('equipmentStatus.countPieces')}</span>
            </div>
            <div className="w-full bg-[var(--color-surface-container-high)] h-2 rounded-full overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
              <div className="bg-[var(--color-accent)] h-full" style={{ width: '100%' }}></div>
            </div>
          </div>

          {/* In Use */}
          <div>
            <div className={cn("flex justify-between text-xs font-semibold mb-2 text-text", isRTL ? "flex-row-reverse" : "flex-row")}>
              <span>{t('equipmentStatus.inUse')}</span>
              <span>{inUse} {t('equipmentStatus.countPieces')}</span>
            </div>
            <div className="w-full bg-[var(--color-surface-container-high)] h-2 rounded-full overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
              <div className="bg-green-500 h-full" style={{ width: `${pct(inUse)}%` }}></div>
            </div>
          </div>

          {/* Needs Maintenance */}
          <div>
            <div className={cn("flex justify-between text-xs font-semibold mb-2 text-text", isRTL ? "flex-row-reverse" : "flex-row")}>
              <span>{t('equipmentStatus.needsMaintenance')}</span>
              <span>{needsMaintenance} {t('equipmentStatus.countPieces')}</span>
            </div>
            <div className="w-full bg-[var(--color-surface-container-high)] h-2 rounded-full overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
              <div className="bg-red-500 h-full" style={{ width: `${pct(needsMaintenance)}%` }}></div>
            </div>
          </div>

          {/* Available */}
          <div>
            <div className={cn("flex justify-between text-xs font-semibold mb-2 text-text", isRTL ? "flex-row-reverse" : "flex-row")}>
              <span>{t('equipmentStatus.available')}</span>
              <span>{available} {t('equipmentStatus.countPieces')}</span>
            </div>
            <div className="w-full bg-[var(--color-surface-container-high)] h-2 rounded-full overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
              <div className="bg-[var(--color-steel-blue)] h-full" style={{ width: `${pct(available)}%` }}></div>
            </div>
          </div>

        </div>
      </div>

      <button className="mt-8 w-full py-2.5 border border-primary text-primary rounded-lg hover:bg-[var(--color-surface-container-lowest)] transition-colors duration-300 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]">
        {t('equipmentStatus.generateReport')}
      </button>
    </div>
  )
}
