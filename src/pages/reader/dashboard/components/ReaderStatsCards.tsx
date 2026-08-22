import { ClipboardList, Gauge, ClockAlert, Wrench } from 'lucide-react'
import { ReaderDashboardStats } from '../types/readerDashboard.types'
import { cn } from '@/utils/cn'

interface ReaderStatsCardsProps {
  stats: ReaderDashboardStats
}

export function ReaderStatsCards({ stats }: ReaderStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="إجمالي القراءات" 
        value={stats.totalReadings} 
        icon={<ClipboardList size={24} />} 
        colorClass="text-info"
        bgClass="bg-info-light"
      />
      <StatCard 
        title="قراءات اليوم" 
        value={stats.todayReadings} 
        icon={<Gauge size={24} />} 
        colorClass="text-success"
        bgClass="bg-success-light"
      />
      <StatCard 
        title="قراءات متأخرة" 
        value={stats.overdueReadings} 
        icon={<ClockAlert size={24} />} 
        colorClass="text-warning"
        bgClass="bg-warning-light"
      />
      <StatCard 
        title="طلبات الخدمة" 
        value={stats.serviceRequests} 
        icon={<Wrench size={24} />} 
        colorClass="text-danger"
        bgClass="bg-danger-light"
      />
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  icon, 
  colorClass, 
  bgClass 
}: { 
  title: string
  value: number
  icon: React.ReactNode
  colorClass: string
  bgClass: string
}) {
  return (
    <div className="card flex items-center gap-4">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", bgClass, colorClass)}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-text-muted mb-1">{title}</p>
        <p className="text-2xl font-bold text-text leading-none">{value}</p>
      </div>
    </div>
  )
}
