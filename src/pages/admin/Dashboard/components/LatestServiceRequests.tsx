import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'
import type { DashboardLatestServiceRequest } from '@/services/dashboard.service.ts'
import type { StatusVariant } from '@/types/common'

interface LatestServiceRequestsProps {
  requests: DashboardLatestServiceRequest[]
}

const priorityVariant = (priority: string): StatusVariant => {
  switch (priority) {
    case 'urgent': return 'danger'
    case 'high': return 'warning'
    case 'low': return 'neutral'
    default: return 'info'
  }
}

const statusVariant = (status: string): StatusVariant => {
  switch (status) {
    case 'completed': case 'resolved': return 'success'
    case 'in_progress': return 'info'
    case 'cancelled': return 'danger'
    default: return 'neutral'
  }
}

export function LatestServiceRequests({ requests }: LatestServiceRequestsProps) {
  const { t } = useTranslation('dashboard')
  const { isRTL } = useLanguage()
  const navigate = useNavigate()

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
      <div className={cn("p-6 border-b border-border flex justify-between items-center", isRTL ? "flex-row-reverse" : "flex-row")}>
        <h4 className="font-headline text-headline text-primary">
          {t('serviceRequests.title')}
        </h4>
        <button
          onClick={() => navigate('/admin/requests')}
          className="text-primary hover:underline text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
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
            {requests.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-outline">{t('readings.viewAll') && '—'}</td></tr>
            )}
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-[var(--color-surface-container-lowest)] transition-colors">
                <td className="p-4 font-bold text-primary whitespace-nowrap">{req.request_number}</td>
                <td className="p-4 text-text whitespace-nowrap">{req.customer_name || '-'}</td>
                <td className="p-4 text-text whitespace-nowrap">{req.request_type}</td>
                <td className="p-4 whitespace-nowrap">
                  <Badge variant={priorityVariant(req.priority)} className="text-[10px] px-2 py-0.5">
                    {req.priority}
                  </Badge>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <Badge variant={statusVariant(req.status)} className="text-[10px] px-2 py-0.5">
                    {req.status}
                  </Badge>
                </td>
                <td className="p-4 text-outline whitespace-nowrap">
                  {new Date(req.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
