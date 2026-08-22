import { useTranslation } from 'react-i18next'
import { getMockNotifications, getMockActivities } from '@/data/mock/dashboard'
import { AlertTriangle, BellRing } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'

export function SystemNotifications() {
 const { t } = useTranslation('dashboard')
 const { isRTL } = useLanguage()
 const notifications = getMockNotifications()
 const activities = getMockActivities()

 return (
 <div className="bg-surface p-6 rounded-xl border border-border shadow-sm flex flex-col gap-8 h-full">
 
 {/* Notifications */}
 <div>
 <h4 className="font-headline text-headline text-primary mb-6">
 {t('notifications.title')}
 </h4>
 <div className="space-y-4">
 {notifications.map((notif) => (
 <div 
 key={notif.id}
 className={cn(
 "flex gap-3 items-start pr-3",
 isRTL ? "border-r-4" : "border-l-4 pl-3 pr-0",
 notif.variant === 'danger' ? "border-[var(--color-danger)]" : "border-[var(--color-accent)]"
 )}
 dir={isRTL ? 'rtl' : 'ltr'}
 >
 {notif.variant === 'danger' ? (
 <AlertTriangle size={20} className="text-[var(--color-danger)] mt-0.5 shrink-0" />
 ) : (
 <BellRing size={20} className="text-[var(--color-amber-gold)] mt-0.5 shrink-0" />
 )}
 <div className={isRTL ? "text-right" : "text-left"}>
 <p className="font-semibold text-sm text-text">
 {t(notif.titleKey)}
 </p>
 <p className="text-[11px] text-text-muted mt-0.5">
 {t(notif.descriptionKey)}
 </p>
 <span className={cn(
 "text-[10px] font-bold mt-1 block",
 notif.variant === 'danger' ? "text-[var(--color-danger)]" : "text-text-muted font-normal"
 )}>
 {t(notif.timeKey)}
 </span>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Activities Timeline */}
 <div>
 <h4 className="font-headline text-headline text-primary mb-6">
 {t('activities.title')}
 </h4>
 <div 
 className={cn(
 "relative",
 isRTL 
 ? "pr-6 before:content-[''] before:absolute before:right-2 before:top-0 before:bottom-0 before:w-0.5 before:bg-[var(--color-outline-variant)]"
 : "pl-6 before:content-[''] before:absolute before:left-2 before:top-0 before:bottom-0 before:w-0.5 before:bg-[var(--color-outline-variant)]"
 )}
 dir={isRTL ? 'rtl' : 'ltr'}
 >
 {activities.map((act, idx) => (
 <div key={act.id} className={cn("relative", idx !== activities.length - 1 ? "mb-6" : "")}>
 <div 
 className={cn(
 "absolute top-1 w-3 h-3 rounded-full border-2 border-surface",
 isRTL ? "-right-[21px]" : "-left-[21px]"
 )}
 style={{ background: act.color }}
 ></div>
 <div className={isRTL ? "text-right" : "text-left"}>
 <p className="font-semibold text-sm text-text">
 {t(act.titleKey)}
 </p>
 <p className="text-[11px] text-text-muted mt-0.5">
 {t(act.descriptionKey)}
 </p>
 </div>
 </div>
 ))}
 </div>
 </div>

 </div>
 )
}
