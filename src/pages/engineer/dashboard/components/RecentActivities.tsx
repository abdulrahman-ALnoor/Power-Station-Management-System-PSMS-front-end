import { useTranslation } from 'react-i18next'
import { mockEngineerActivities } from '../data/mockData'
import { CheckCircle, Clock, Info, UserCheck } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'

export function RecentActivities() {
  const { t } = useTranslation('engineer')
  const { isRTL } = useLanguage()

  const getIcon = (type: string) => {
    switch (type) {
      case 'assignment': return <UserCheck size={18} className="text-blue-500" />
      case 'status_change': return <Clock size={18} className="text-amber-500" />
      case 'completion': return <CheckCircle size={18} className="text-emerald-500" />
      default: return <Info size={18} className="text-slate-500" />
    }
  }

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm p-6 flex flex-col">
      <h4 className="font-headline text-headline text-primary mb-6">
        {t('dashboard.recentActivities.title')}
      </h4>
      <div className="flex flex-col gap-6 relative">
        <div className={cn(
          "absolute top-2 bottom-2 w-px bg-border",
          isRTL ? "right-3.5" : "left-3.5"
        )}></div>
        
        {mockEngineerActivities.map((activity) => (
          <div key={activity.id} className="flex gap-4 relative z-10">
            <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center shrink-0">
              {getIcon(activity.type)}
            </div>
            <div className={cn("flex flex-col gap-1 flex-1", isRTL ? "text-right" : "text-left")}>
              <p className="text-sm font-bold text-text">{activity.title}</p>
              <p className="text-xs text-text-muted">{activity.description}</p>
              <span className="text-[10px] text-outline mt-1">
                {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
