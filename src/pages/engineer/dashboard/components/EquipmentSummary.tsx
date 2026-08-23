import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'
import { engineerDashboardService, EngineerEquipmentStats } from '@/services/engineer/dashboardService'

export function EquipmentSummary() {
  const { t } = useTranslation('engineer')
  const { isRTL } = useLanguage()

  const [stats, setStats] = useState<EngineerEquipmentStats>({
    total: 0,
    active: 0,
    maintenance: 0,
    damaged: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    engineerDashboardService.getEquipmentStats()
      .then((data) => {
        if (mounted) setStats(data)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [])

  const { total, active, maintenance, damaged } = stats

  const getPercentage = (value: number) => {
    return total > 0 ? (value / total) * 100 : 0
  }

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm p-6 flex flex-col h-[350px]">
      <h4 className="font-headline text-headline text-primary mb-6">
        {t('dashboard.equipmentSummary.title')}
      </h4>
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-text-muted animate-pulse">
          جاري التحميل...
        </div>
      ) : (
        <div className="flex flex-col gap-6 flex-1 justify-center">
          <div>
            <div className={cn("flex justify-between text-xs font-semibold mb-2 text-text", isRTL ? "flex-row-reverse" : "flex-row")}>
              <span>{t('dashboard.equipmentSummary.available')}</span>
              <span>{active}</span>
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
              <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${getPercentage(active)}%` }}></div>
            </div>
          </div>

          <div>
            <div className={cn("flex justify-between text-xs font-semibold mb-2 text-text", isRTL ? "flex-row-reverse" : "flex-row")}>
              <span>{t('dashboard.equipmentSummary.maintenance')}</span>
              <span>{maintenance}</span>
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
              <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${getPercentage(maintenance)}%` }}></div>
            </div>
          </div>

          <div>
            <div className={cn("flex justify-between text-xs font-semibold mb-2 text-text", isRTL ? "flex-row-reverse" : "flex-row")}>
              <span>{t('dashboard.equipmentSummary.damaged')}</span>
              <span>{damaged}</span>
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
              <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${getPercentage(damaged)}%` }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
