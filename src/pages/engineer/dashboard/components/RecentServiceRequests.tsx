import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/Badge'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'
import { engineerDashboardService, EngineerRecentRequest } from '@/services/engineer/dashboardService'

export function RecentServiceRequests() {
  const { t } = useTranslation('engineer')
  const { isRTL } = useLanguage()
  const [requests, setRequests] = useState<EngineerRecentRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    engineerDashboardService.getLatestRequests()
      .then((data) => {
        if (mounted) setRequests(data)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [])

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'emergency':
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

      {loading ? (
        <div className="p-8 text-center text-text-muted animate-pulse">جاري تحميل الطلبات...</div>
      ) : requests.length === 0 ? (
        <div className="p-8 text-center text-text-muted">لا توجد طلبات خدمة مسندة مؤخراً.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className={cn("w-full text-sm", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
            <thead>
              <tr className="bg-surface-container-low text-text-muted font-semibold border-b border-border">
                <th className="p-4 whitespace-nowrap">{t('dashboard.recentRequests.columns.requestNumber')}</th>
                <th className="p-4 whitespace-nowrap">{t('dashboard.recentRequests.columns.requestType')}</th>
                <th className="p-4 whitespace-nowrap">{t('dashboard.recentRequests.columns.customer')}</th>
                <th className="p-4 whitespace-nowrap">{t('dashboard.recentRequests.columns.meterNumber')}</th>
                <th className="p-4 whitespace-nowrap">{t('dashboard.recentRequests.columns.priority')}</th>
                <th className="p-4 whitespace-nowrap">{t('dashboard.recentRequests.columns.status')}</th>
                <th className="p-4 whitespace-nowrap">{t('dashboard.recentRequests.columns.date')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="p-4 font-bold text-primary whitespace-nowrap">{req.request_number}</td>
                  <td className="p-4 text-text whitespace-nowrap">{t(`serviceRequests.type.${req.request_type}`, req.request_type === 'new_connection' ? 'توصيل جديد' : (req.request_type === 'disconnection' ? 'فصل الخدمة' : 'صيانة'))}</td>
                  <td className="p-4 text-text whitespace-nowrap">{req.customer_name}</td>
                  <td className="p-4 text-text whitespace-nowrap" dir="ltr">{req.meter_number}</td>
                  <td className="p-4 whitespace-nowrap">
                    <Badge variant={getPriorityVariant(req.priority)} className="text-[11px] px-2.5 py-0.5">
                      {t(`serviceRequests.priority.${req.priority}`, req.priority === 'emergency' ? 'طارئة' : (req.priority === 'high' ? 'عالية' : (req.priority === 'low' ? 'منخفضة' : 'متوسطة')))}
                    </Badge>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <Badge variant={getStatusVariant(req.status)} className="text-[11px] px-2.5 py-0.5">
                      {t(`serviceRequests.status.${req.status}`, req.status === 'completed' ? 'مكتمل' : (req.status === 'in_progress' ? 'قيد التنفيذ' : (req.status === 'assigned' ? 'مسند' : (req.status === 'cancelled' ? 'ملغى' : 'قيد الانتظار'))))}
                    </Badge>
                  </td>
                  <td className="p-4 text-text-muted whitespace-nowrap">
                    {new Date(req.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
