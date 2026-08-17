import { useTranslation } from 'react-i18next'
import { getMockEquipmentStatus } from '@/data/mock/dashboard'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'

export function EquipmentStatus() {
  const { t } = useTranslation('dashboard')
  const { isRTL } = useLanguage()
  const data = getMockEquipmentStatus()

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
              <span>{data.total} {t('equipmentStatus.countPieces')}</span>
            </div>
            <div className="w-full bg-[var(--color-surface-container-high)] h-2 rounded-full overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
              <div className="bg-[var(--color-accent)] h-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          
          {/* In Use */}
          <div>
            <div className={cn("flex justify-between text-xs font-semibold mb-2 text-text", isRTL ? "flex-row-reverse" : "flex-row")}>
              <span>{t('equipmentStatus.inUse')}</span>
              <span>{data.inUse.count} {t('equipmentStatus.countPieces')}</span>
            </div>
            <div className="w-full bg-[var(--color-surface-container-high)] h-2 rounded-full overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
              <div className="bg-green-500 h-full" style={{ width: `${data.inUse.percentage}%` }}></div>
            </div>
          </div>
          
          {/* Needs Maintenance */}
          <div>
            <div className={cn("flex justify-between text-xs font-semibold mb-2 text-text", isRTL ? "flex-row-reverse" : "flex-row")}>
              <span>{t('equipmentStatus.needsMaintenance')}</span>
              <span>{data.needsMaintenance.count} {t('equipmentStatus.countPieces')}</span>
            </div>
            <div className="w-full bg-[var(--color-surface-container-high)] h-2 rounded-full overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
              <div className="bg-red-500 h-full" style={{ width: `${data.needsMaintenance.percentage}%` }}></div>
            </div>
          </div>
          
          {/* Available */}
          <div>
            <div className={cn("flex justify-between text-xs font-semibold mb-2 text-text", isRTL ? "flex-row-reverse" : "flex-row")}>
              <span>{t('equipmentStatus.available')}</span>
              <span>{data.available.count} {t('equipmentStatus.countPieces')}</span>
            </div>
            <div className="w-full bg-[var(--color-surface-container-high)] h-2 rounded-full overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
              <div className="bg-[var(--color-steel-blue)] h-full" style={{ width: `${data.available.percentage}%` }}></div>
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
