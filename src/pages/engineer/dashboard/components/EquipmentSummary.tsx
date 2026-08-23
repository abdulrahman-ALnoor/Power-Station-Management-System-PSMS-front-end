import { useTranslation } from 'react-i18next'
import { mockEquipmentSummary } from '../data/mockData'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'

export function EquipmentSummary() {
 const { t } = useTranslation('engineer')
 const { isRTL } = useLanguage()

 const { total, available, inMaintenance, damaged } = mockEquipmentSummary

 const getPercentage = (value: number) => {
 return total > 0 ? (value / total) * 100 : 0
 }

 return (
 <div className="bg-surface rounded-xl border border-border shadow-sm p-6 flex flex-col h-[350px]">
 <h4 className="font-headline text-headline text-primary mb-6">
 {t('dashboard.equipmentSummary.title')}
 </h4>
 <div className="flex flex-col gap-6 flex-1 justify-center">

 <div>
 <div className={cn("flex justify-between text-xs font-semibold mb-2 text-text", isRTL ? "flex-row-reverse" : "flex-row")}>
 <span>{t('dashboard.equipmentSummary.available')}</span>
 <span>{available}</span>
 </div>
 <div className="w-full bg-[var(--color-surface-container-high)] h-2 rounded-full overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
 <div className="bg-emerald-500 h-full" style={{ width: `${getPercentage(available)}%` }}></div>
 </div>
 </div>

 <div>
 <div className={cn("flex justify-between text-xs font-semibold mb-2 text-text", isRTL ? "flex-row-reverse" : "flex-row")}>
 <span>{t('dashboard.equipmentSummary.maintenance')}</span>
 <span>{inMaintenance}</span>
 </div>
 <div className="w-full bg-[var(--color-surface-container-high)] h-2 rounded-full overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
 <div className="bg-amber-500 h-full" style={{ width: `${getPercentage(inMaintenance)}%` }}></div>
 </div>
 </div>

 <div>
 <div className={cn("flex justify-between text-xs font-semibold mb-2 text-text", isRTL ? "flex-row-reverse" : "flex-row")}>
 <span>{t('dashboard.equipmentSummary.damaged')}</span>
 <span>{damaged}</span>
 </div>
 <div className="w-full bg-[var(--color-surface-container-high)] h-2 rounded-full overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
 <div className="bg-red-500 h-full" style={{ width: `${getPercentage(damaged)}%` }}></div>
 </div>
 </div>

 </div>
 </div>
 )
}
