import { Link } from 'react-router-dom'
import { ReaderReading } from '../types/readerDashboard.types'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/utils/cn'
import { useLanguage } from '@/hooks/useLanguage'

interface LatestReadingsCardProps {
 readings: ReaderReading[]
}

export function LatestReadingsCard({ readings }: LatestReadingsCardProps) {
 const { t } = useLanguage('reader')

 return (
 <div className="card overflow-hidden p-0 flex flex-col">
 <div className="p-4 border-b border-border flex justify-between items-center bg-surface">
 <h2 className="text-headline">{t('latestReadings.title')}</h2>
 <Link
 to="/reader/readings"
 className="text-sm font-medium text-info hover:underline"
 >
 {t('latestReadings.viewAll')}
 </Link>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-sm text-right whitespace-nowrap">
 <thead className="bg-surface-low text-text-muted border-b border-border">
 <tr>
 <th className="px-4 py-3 font-semibold">{t('latestReadings.table.meterNumber')}</th>
 <th className="px-4 py-3 font-semibold">{t('latestReadings.table.customerName')}</th>
 <th className="px-4 py-3 font-semibold">{t('latestReadings.table.previousReading')}</th>
 <th className="px-4 py-3 font-semibold">{t('latestReadings.table.currentReading')}</th>
 <th className="px-4 py-3 font-semibold">{t('latestReadings.table.consumption')}</th>
 <th className="px-4 py-3 font-semibold">{t('latestReadings.table.date')}</th>
 <th className="px-4 py-3 font-semibold">{t('latestReadings.table.status')}</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-border bg-surface">
 {readings.map(reading => (
 <tr key={reading.id} className="hover:bg-surface-low transition-colors">
 <td className="px-4 py-3 font-medium text-text">{reading.meterNumber}</td>
 <td className="px-4 py-3 text-text-muted">{reading.customerName}</td>
 <td className="px-4 py-3 text-text">{reading.previousReading.toLocaleString()}</td>
 <td className="px-4 py-3 text-text font-medium">{reading.currentReading.toLocaleString()}</td>
 <td className="px-4 py-3 text-text" dir="ltr" style={{ textAlign: 'right' }}>{reading.consumption}</td>
 <td className="px-4 py-3 text-text-muted">{reading.date}</td>
 <td className="px-4 py-3">
 <StatusBadge status={reading.status} />
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )
}

function StatusBadge({ status }: { status: ReaderReading['status'] }) {
 const { t } = useLanguage('reader')
 if (status === 'completed') {
 return (
 <Badge variant="success">{t('latestReadings.statuses.completed')}</Badge>
 )
 }
 if (status === 'review') {
 return (
 <Badge variant="warning">{t('latestReadings.statuses.review')}</Badge>
 )
 }
 return (
 <Badge variant="danger">{t('latestReadings.statuses.late')}</Badge>
 )
}
