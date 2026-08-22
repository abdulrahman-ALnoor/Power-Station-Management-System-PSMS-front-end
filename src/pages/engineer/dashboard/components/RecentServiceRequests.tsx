import { useTranslation } from 'react-i18next'
import { mockRecentRequests } from '../data/mockData'
import { Badge } from '@/components/ui/Badge'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'

export function RecentServiceRequests() {
  const { t } = useTranslation('engineer')
  const { isRTL } = useLanguage()

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'critical': return 'danger'
      case 'high': return 'warning'
      case 'medium': return 'info'
      case 'low': return 'success'
      default: return 'neutral'
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'success'
      case 'in_progress': return 'primary'
      case 'assigned': return 'info'
      case 'pending': return 'warning'
      case 'cancelled': return 'danger'
      default: return 'neutral'
    }
  }

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
      <div className={cn("p-6 border-b border-border flex justify-between items-center", isRTL ? "flex-row-reverse" : "flex-row")}>
        <h4 className="font-headline text-headline text-primary">
          {t('dashboard.recentRequests.title')}
        </h4>
      </div>
      
      <div className="overflow-x-auto">
        <table className={cn("w-full text-sm", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
          <thead>
            <tr className="bg-[var(--color-surface-container-low)] text-[var(--color-text-muted)] font-semibold border-b border-border">
              <th className="p-4 whitespace-nowrap">{t('dashboard.recentRequests.columns.requestNumber')}</th>
              <th className="p-4 whitespace-nowrap">{t('dashboard.recentRequests.columns.requestType')}</th>
              <th className="p-4 whitespace-nowrap">{t('dashboard.recentRequests.columns.customer')}</th>
              <th className="p-4 whitespace-nowrap">{t('dashboard.recentRequests.columns.meterNumber')}</th>
              <th className="p-4 whitespace-nowrap">{t('dashboard.recentRequests.columns.priority')}</th>
              <th className="p-4 whitespace-nowrap">{t('dashboard.recentRequests.columns.status')}</th>
              <th className="p-4 whitespace-nowrap">{t('dashboard.recentRequests.columns.date')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {mockRecentRequests.map((req) => (
              <tr key={req.id} className="hover:bg-[var(--color-surface-container-lowest)] transition-colors">
                <td className="p-4 font-bold text-primary whitespace-nowrap">{req.requestNumber}</td>
                <td className="p-4 text-text whitespace-nowrap">{req.requestType}</td>
                <td className="p-4 text-text whitespace-nowrap">{req.customerName}</td>
                <td className="p-4 text-text whitespace-nowrap">{req.meterNumber}</td>
                <td className="p-4 whitespace-nowrap">
                  <Badge variant={getPriorityVariant(req.priority)} className="text-[10px] px-2 py-0.5 uppercase">
                    {req.priority}
                  </Badge>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <Badge variant={getStatusVariant(req.status)} className="text-[10px] px-2 py-0.5 uppercase">
                    {req.status}
                  </Badge>
                </td>
                <td className="p-4 text-text-muted whitespace-nowrap">{new Date(req.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
