import { useTranslation } from 'react-i18next'
import { StatCard } from '@/components/ui/StatCard'
import { mockEngineerStats } from '../data/mockData'
import {
 ClipboardList,
 CheckCircle,
 Clock,
 AlertTriangle,
 XCircle,
 Wrench,
} from 'lucide-react'

export function EngineerDashboardStats() {
 const { t } = useTranslation('engineer')

 return (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
 <StatCard
 title={t('dashboard.stats.totalRequests')}
 value={mockEngineerStats.totalServiceRequests.toString()}
 icon={<ClipboardList size={24} />}
 iconClassName="bg-blue-50 text-blue-600 "
 className="transition-standard hover:-translate-y-1"
 />
 <StatCard
 title={t('dashboard.stats.completedRequests')}
 value={mockEngineerStats.completedRequests.toString()}
 icon={<CheckCircle size={24} />}
 iconClassName="bg-green-50 text-green-600 "
 className="transition-standard hover:-translate-y-1"
 />
 <StatCard
 title={t('dashboard.stats.pendingRequests')}
 value={mockEngineerStats.pendingRequests.toString()}
 icon={<Clock size={24} />}
 iconClassName="bg-amber-50 text-amber-600 "
 className="transition-standard hover:-translate-y-1"
 />
 <StatCard
 title={t('dashboard.stats.overdueRequests')}
 value={mockEngineerStats.overdueRequests.toString()}
 icon={<AlertTriangle size={24} />}
 iconClassName="bg-red-50 text-red-600 "
 className="transition-standard hover:-translate-y-1"
 />
 <StatCard
 title={t('dashboard.stats.cancelledRequests')}
 value={mockEngineerStats.cancelledRequests.toString()}
 icon={<XCircle size={24} />}
 iconClassName="bg-red-50 text-red-600 "
 className="transition-standard hover:-translate-y-1"
 />
 <StatCard
 title={t('dashboard.stats.readyEquipment')}
 value={mockEngineerStats.readyEquipment.toString()}
 icon={<Wrench size={24} />}
 iconClassName="bg-purple-50 text-purple-600 "
 className="transition-standard hover:-translate-y-1"
 />
 </div>
 )
}
