import { useTranslation } from 'react-i18next'
import { getMockServiceRequests } from '@/data/mock/dashboard'
import { Badge } from '@/components/ui/Badge'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'

export function LatestServiceRequests() {
 const { t } = useTranslation('dashboard')
 const { isRTL } = useLanguage()
 const requests = getMockServiceRequests()

 return (
 <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
 <div className={cn("p-6 border-b border-border flex justify-between items-center", isRTL ? "flex-row-reverse" : "flex-row")}>
 <h4 className="font-headline text-headline text-primary">
 {t('serviceRequests.title')}
 </h4>
 <button className="text-primary hover:underline text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
 {t('serviceRequests.viewAll')}
 </button>
 </div>
 
 <div className="overflow-x-auto">
 <table className={cn("w-full text-sm", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
 <thead>
 <tr className="bg-[var(--color-surface-container-low)] text-[var(--color-text-muted)] font-semibold border-b border-border">
 <th className="p-4 whitespace-nowrap">{t('serviceRequests.table.requestId')}</th>
 <th className="p-4 whitespace-nowrap">{t('serviceRequests.table.customer')}</th>
 <th className="p-4 whitespace-nowrap">{t('serviceRequests.table.type')}</th>
 <th className="p-4 whitespace-nowrap">{t('serviceRequests.table.priority')}</th>
 <th className="p-4 whitespace-nowrap">{t('serviceRequests.table.status')}</th>
 <th className="p-4 whitespace-nowrap">{t('serviceRequests.table.date')}</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-[var(--color-border)]">
 {requests.map((req) => (
 <tr key={req.id} className="hover:bg-[var(--color-surface-container-lowest)] transition-colors">
 <td className="p-4 font-bold text-primary whitespace-nowrap">{req.id}</td>
 <td className="p-4 text-text whitespace-nowrap">{req.customer}</td>
 <td className="p-4 text-text whitespace-nowrap">{t(req.typeKey)}</td>
 <td className="p-4 whitespace-nowrap">
 <Badge variant={req.priorityVariant} className="text-[10px] px-2 py-0.5">
 {t(req.priorityKey)}
 </Badge>
 </td>
 <td className="p-4 whitespace-nowrap">
 <Badge variant={req.statusVariant} className="text-[10px] px-2 py-0.5">
 {t(req.statusKey)}
 </Badge>
 </td>
 <td className="p-4 text-text-muted whitespace-nowrap">{req.date}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )
}
