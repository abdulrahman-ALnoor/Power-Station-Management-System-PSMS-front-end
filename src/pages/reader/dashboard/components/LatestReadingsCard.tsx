import { Link } from 'react-router-dom'
import { ReaderReading } from '../types/readerDashboard.types'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/utils/cn'

interface LatestReadingsCardProps {
  readings: ReaderReading[]
}

export function LatestReadingsCard({ readings }: LatestReadingsCardProps) {
  return (
    <div className="card overflow-hidden p-0 flex flex-col">
      <div className="p-4 border-b border-border flex justify-between items-center bg-surface">
        <h2 className="text-headline">آخر القراءات</h2>
        <Link 
          to="/reader/readings" 
          className="text-sm font-medium text-info hover:underline"
        >
          عرض الكل
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right whitespace-nowrap">
          <thead className="bg-surface-low text-text-muted border-b border-border">
            <tr>
              <th className="px-4 py-3 font-semibold">رقم العداد</th>
              <th className="px-4 py-3 font-semibold">اسم العميل</th>
              <th className="px-4 py-3 font-semibold">القراءة السابقة</th>
              <th className="px-4 py-3 font-semibold">القراءة الحالية</th>
              <th className="px-4 py-3 font-semibold">الاستهلاك</th>
              <th className="px-4 py-3 font-semibold">التاريخ</th>
              <th className="px-4 py-3 font-semibold">الحالة</th>
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
  if (status === 'completed') {
    return (
      <Badge variant="success">مكتملة</Badge>
    )
  }
  if (status === 'review') {
    return (
      <Badge variant="warning">مراجعة</Badge>
    )
  }
  return (
    <Badge variant="danger">متأخرة</Badge>
  )
}
