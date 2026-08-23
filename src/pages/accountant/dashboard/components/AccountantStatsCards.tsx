import { Receipt, CheckCircle, Clock, DollarSign, Wallet, TrendingUp } from 'lucide-react'
import { AccountantDashboardStats } from '../../../../services/accountant/dashboardService'
import { cn } from '@/utils/cn'

interface AccountantStatsCardsProps {
 stats: AccountantDashboardStats
}

export function AccountantStatsCards({ stats }: AccountantStatsCardsProps) {
 return (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 <StatCard
 title="إجمالي الفواتير"
 value={stats.totalInvoices}
 icon={<Receipt size={24} />}
 colorClass="text-info"
 bgClass="bg-info-light"
 />
 <StatCard
 title="الفواتير المدفوعة"
 value={stats.paidInvoices}
 icon={<CheckCircle size={24} />}
 colorClass="text-success"
 bgClass="bg-success-light"
 />
 <StatCard
 title="الفواتير المتأخرة"
 value={stats.overdueInvoices}
 icon={<Clock size={24} />}
 colorClass="text-danger"
 bgClass="bg-danger-light"
 />
 <StatCard
 title="إجمالي المبالغ المستحقة"
 value={`${stats.totalDueAmount.toLocaleString()} ر.س`}
 icon={<TrendingUp size={24} />}
 colorClass="text-primary"
 bgClass="bg-primary/10"
 />
 <StatCard
 title="إجمالي المبالغ المحصلة"
 value={`${stats.totalCollectedAmount.toLocaleString()} ر.س`}
 icon={<Wallet size={24} />}
 colorClass="text-success"
 bgClass="bg-success-light"
 />
 <StatCard
 title="إجمالي المتبقي"
 value={`${stats.totalRemainingAmount.toLocaleString()} ر.س`}
 icon={<DollarSign size={24} />}
 colorClass="text-warning"
 bgClass="bg-warning-light"
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
 value: string | number
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
 <p className="text-xl lg:text-2xl font-bold text-text leading-none">{value}</p>
 </div>
 </div>
 )
}
