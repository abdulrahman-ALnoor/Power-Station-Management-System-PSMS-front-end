import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, BellRing } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'
import { fetchNotifications, type NotificationApiRecord } from '@/services/notifications.service'

export function SystemNotifications() {
  const { t } = useTranslation('dashboard')
  const { isRTL } = useLanguage()

  const [notifications, setNotifications] = useState<NotificationApiRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchNotifications()
      .then((res) => {
        if (!cancelled) setNotifications(res.slice(0, 5))
      })
      .catch(() => {
        /* fail silently — this is a secondary widget */
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const isUrgent = (n: NotificationApiRecord) => n.status === 'failed' || n.notification_type === 'alert'

  return (
    <div className="bg-surface p-6 rounded-xl border border-border shadow-sm flex flex-col gap-8 h-full">

      <div>
        <h4 className="font-headline text-headline text-primary mb-6">
          {t('notifications.title')}
        </h4>
        <div className="space-y-4">
          {isLoading && <p className="text-outline text-sm">…</p>}
          {!isLoading && notifications.length === 0 && (
            <p className="text-outline text-sm">—</p>
          )}
          {notifications.map((notif) => {
            const urgent = isUrgent(notif)
            return (
              <div
                key={notif.id}
                className={cn(
                  "flex gap-3 items-start pr-3",
                  isRTL ? "border-r-4" : "border-l-4 pl-3 pr-0",
                  urgent ? "border-[var(--color-danger)]" : "border-[var(--color-accent)]"
                )}
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                {urgent ? (
                  <AlertTriangle size={20} className="text-[var(--color-danger)] mt-0.5 shrink-0" />
                ) : (
                  <BellRing size={20} className="text-[var(--color-amber-gold)] mt-0.5 shrink-0" />
                )}
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="font-semibold text-sm text-text">
                    {notif.customer?.name || notif.notification_type}
                  </p>
                  <p className="text-[11px] text-outline mt-0.5">
                    {notif.message}
                  </p>
                  <span className={cn(
                    "text-[10px] font-bold mt-1 block",
                    urgent ? "text-[var(--color-danger)]" : "text-outline font-normal"
                  )}>
                    {new Date(notif.created_at).toLocaleString(isRTL ? 'ar-SA' : 'en-US')}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
