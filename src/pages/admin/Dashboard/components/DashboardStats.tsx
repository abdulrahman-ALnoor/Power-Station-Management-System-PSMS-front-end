import { useTranslation } from 'react-i18next'
import { StatCard } from '@/components/ui/StatCard'
import { useLanguage } from '@/hooks/useLanguage'
import { formatCurrency } from '@/utils/currency'
import type { DashboardStatistics, EquipmentStatusSummary } from '@/services/dashboard.service.ts'
import {
  Users,
  Activity,
  BadgeInfo,
  Headset,
  CircleDollarSign,
  Wrench,
  ReceiptText,
} from 'lucide-react'

interface DashboardStatsProps {
  statistics: DashboardStatistics | null
  equipmentStatus: EquipmentStatusSummary | null
  isLoading?: boolean
}

export function DashboardStats({ statistics, equipmentStatus, isLoading }: DashboardStatsProps) {
  const { t } = useTranslation('dashboard')
  const { isRTL } = useLanguage()

  const cards = [
    {
      id: 'customers',
      titleKey: 'stats.totalCustomers',
      value: statistics?.customers_count ?? 0,
      icon: <Users size={24} />,
      iconColor: 'var(--color-primary)',
      iconBg: 'rgba(0,24,61,0.05)',
    },
    {
      id: 'meters',
      titleKey: 'stats.totalMeters',
      value: statistics?.meters_count ?? 0,
      icon: <Activity size={24} />,
      iconColor: 'var(--color-steel-blue)',
      iconBg: 'rgba(79,121,183,0.1)',
    },
    {
      id: 'employees',
      titleKey: 'stats.totalEmployees',
      value: statistics?.users_count ?? 0,
      icon: <BadgeInfo size={24} />,
      iconColor: 'var(--color-amber-gold, #E08A00)',
      iconBg: 'rgba(224,138,0,0.1)',
    },
    {
      id: 'serviceRequests',
      titleKey: 'stats.serviceRequests',
      value: statistics?.service_requests_count ?? 0,
      icon: <Headset size={24} />,
      iconColor: 'var(--color-primary)',
      iconBg: 'rgba(0,24,61,0.05)',
    },
    {
      id: 'monthlyRevenue',
      titleKey: 'stats.monthlyRevenue',
      value: statistics ? formatCurrency(statistics.monthly_revenue, isRTL) : '—',
      icon: <CircleDollarSign size={24} />,
      iconColor: 'var(--color-success)',
      iconBg: 'var(--color-success-light)',
    },
    {
      id: 'uncollected',
      titleKey: 'stats.unpaidInvoices',
      value: statistics ? formatCurrency(statistics.uncollected_this_month, isRTL) : '—',
      icon: <ReceiptText size={24} />,
      iconColor: 'var(--color-danger)',
      iconBg: 'rgba(186,26,26,0.1)',
    },
    {
      id: 'equipment',
      titleKey: 'stats.equipment',
      value: equipmentStatus?.total_equipment ?? 0,
      icon: <Wrench size={24} />,
      iconColor: 'var(--color-steel-blue)',
      iconBg: 'rgba(79,121,183,0.1)',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      {cards.map((stat) => (
        <StatCard
          key={stat.id}
          title={t(stat.titleKey)}
          value={isLoading ? '—' : stat.value}
          icon={stat.icon}
          iconColor={stat.iconColor}
          iconBg={stat.iconBg}
          className="transition-standard hover:-translate-y-1"
        />
      ))}
    </div>
  )
}
