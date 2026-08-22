import { useTranslation } from 'react-i18next'
import { StatCard } from '@/components/ui/StatCard'
import { ServiceRequest } from '../types'
import {
 ClipboardList,
 Clock,
 UserCheck,
 PlayCircle,
 CheckCircle,
 XCircle,
} from 'lucide-react'

interface ServiceRequestStatsProps {
 requests: ServiceRequest[]
}

export function ServiceRequestStats({ requests }: ServiceRequestStatsProps) {
 const { t } = useTranslation('engineer')

 const total = requests.length
 const pending = requests.filter((r) => r.status === 'pending').length
 const assigned = requests.filter((r) => r.status === 'assigned').length
 const inProgress = requests.filter((r) => r.status === 'in_progress').length
 const completed = requests.filter((r) => r.status === 'completed').length
 const cancelled = requests.filter((r) => r.status === 'cancelled').length

 return (
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
 <StatCard
 title={t('serviceRequests.stats.total')}
 value={total.toString()}
 icon={<ClipboardList size={20} />}
 iconClassName="bg-blue-50 text-blue-600 "
 className="transition-standard hover:-translate-y-1"
 />
 <StatCard
 title={t('serviceRequests.stats.pending')}
 value={pending.toString()}
 icon={<Clock size={20} />}
 iconClassName="bg-amber-50 text-amber-600 "
 className="transition-standard hover:-translate-y-1"
 />
 <StatCard
 title={t('serviceRequests.stats.assigned')}
 value={assigned.toString()}
 icon={<UserCheck size={20} />}
 iconClassName="bg-indigo-50 text-indigo-600 "
 className="transition-standard hover:-translate-y-1"
 />
 <StatCard
 title={t('serviceRequests.stats.inProgress')}
 value={inProgress.toString()}
 icon={<PlayCircle size={20} />}
 iconClassName="bg-orange-50 text-orange-600 "
 className="transition-standard hover:-translate-y-1"
 />
 <StatCard
 title={t('serviceRequests.stats.completed')}
 value={completed.toString()}
 icon={<CheckCircle size={20} />}
 iconClassName="bg-green-50 text-green-600 "
 className="transition-standard hover:-translate-y-1"
 />
 <StatCard
 title={t('serviceRequests.stats.cancelled')}
 value={cancelled.toString()}
 icon={<XCircle size={20} />}
 iconClassName="bg-red-50 text-red-600 "
 className="transition-standard hover:-translate-y-1"
 />
 </div>
 )
}
