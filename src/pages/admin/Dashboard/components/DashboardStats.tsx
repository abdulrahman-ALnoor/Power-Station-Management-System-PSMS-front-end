import { useTranslation } from 'react-i18next'
import { StatCard } from '@/components/ui/StatCard'
import { getMockStats } from '@/data/mock/dashboard'
import { 
  Users, 
  Activity, 
  BadgeInfo, 
  Eye, 
  Headset, 
  Receipt, 
  CircleDollarSign, 
  Wrench 
} from 'lucide-react'

// Mapping IDs from mock to Lucide icons (since we need actual React nodes for icons)
const iconMap: Record<string, React.ReactNode> = {
  customers: <Users size={24} />,
  meters: <Activity size={24} />,
  employees: <BadgeInfo size={24} />,
  todayReadings: <Eye size={24} />,
  serviceRequests: <Headset size={24} />,
  unpaidInvoices: <Receipt size={24} />,
  monthlyRevenue: <CircleDollarSign size={24} />,
  equipment: <Wrench size={24} />,
}

export function DashboardStats() {
  const { t } = useTranslation('dashboard')
  const stats = getMockStats()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          title={t(stat.titleKey)}
          value={stat.value}
          icon={iconMap[stat.id]}
          iconColor={stat.iconColor}
          iconBg={stat.iconBg}
          trend={stat.trend}
          className="transition-standard hover:-translate-y-1"
        />
      ))}
    </div>
  )
}
