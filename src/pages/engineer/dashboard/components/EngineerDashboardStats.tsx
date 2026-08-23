import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StatCard } from '@/components/ui/StatCard'
import { engineerDashboardService, EngineerDashboardStatsData } from '@/services/engineer/dashboardService'
import {
  ClipboardList,
  CheckCircle,
  Clock,
  Activity,
  XCircle,
  Wrench,
} from 'lucide-react'

export function EngineerDashboardStats() {
  const { t } = useTranslation('engineer')
  const [stats, setStats] = useState<EngineerDashboardStatsData>({
    totalServiceRequests: 0,
    completedRequests: 0,
    pendingRequests: 0,
    inProgressRequests: 0,
    cancelledRequests: 0,
    readyEquipment: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    engineerDashboardService.getDashboardStats()
      .then((data) => {
        if (mounted) setStats(data)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-24 bg-surface rounded-xl border border-border"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        title={t('dashboard.stats.totalRequests')}
        value={stats.totalServiceRequests.toString()}
        icon={<ClipboardList size={24} />}
        iconClassName="bg-blue-50 text-blue-600"
        className="transition-standard hover:-translate-y-1"
      />
      <StatCard
        title={t('dashboard.stats.completedRequests')}
        value={stats.completedRequests.toString()}
        icon={<CheckCircle size={24} />}
        iconClassName="bg-green-50 text-green-600"
        className="transition-standard hover:-translate-y-1"
      />
      <StatCard
        title={t('dashboard.stats.pendingRequests')}
        value={stats.pendingRequests.toString()}
        icon={<Clock size={24} />}
        iconClassName="bg-amber-50 text-amber-600"
        className="transition-standard hover:-translate-y-1"
      />
      <StatCard
        title="طلبات قيد التنفيذ"
        value={stats.inProgressRequests.toString()}
        icon={<Activity size={24} />}
        iconClassName="bg-indigo-50 text-indigo-600"
        className="transition-standard hover:-translate-y-1"
      />
      <StatCard
        title={t('dashboard.stats.cancelledRequests')}
        value={stats.cancelledRequests.toString()}
        icon={<XCircle size={24} />}
        iconClassName="bg-red-50 text-red-600"
        className="transition-standard hover:-translate-y-1"
      />
      <StatCard
        title={t('dashboard.stats.readyEquipment')}
        value={stats.readyEquipment.toString()}
        icon={<Wrench size={24} />}
        iconClassName="bg-purple-50 text-purple-600"
        className="transition-standard hover:-translate-y-1"
      />
    </div>
  )
}
