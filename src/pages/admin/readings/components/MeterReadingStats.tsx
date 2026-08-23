import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Clock, XCircle, Gauge, Zap, DollarSign } from 'lucide-react'
import { fetchReadingStats } from '@/services/meterReadings.service'
import type { MeterReadingStatsData } from '../types'

const EMPTY_STATS: MeterReadingStatsData = {
  totalReadings: 0,
  approvedReadings: 0,
  pendingReadings: 0,
  rejectedReadings: 0,
  totalConsumption: 0,
  totalReadingCost: 0,
}

interface MeterReadingStatsProps {
  refreshKey?: number
}

export function MeterReadingStats({ refreshKey }: MeterReadingStatsProps) {
  const { t } = useTranslation('readings')
  const [stats, setStats] = useState<MeterReadingStatsData>(EMPTY_STATS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)
    fetchReadingStats()
      .then((res) => {
        if (cancelled) return
        setStats({
          totalReadings: res.total_readings,
          approvedReadings: res.approved_readings,
          pendingReadings: res.pending_readings,
          rejectedReadings: res.rejected_readings,
          totalConsumption: Number(res.total_consumption),
          totalReadingCost: Number(res.expected_revenue),
        })
      })
      .catch(() => {
        if (!cancelled) setError(t('errors.statsFailed'))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => { cancelled = true }
  }, [refreshKey, t])

  const formatNumber = (val: number) => new Intl.NumberFormat('en-US').format(val)
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'YER' }).format(val)

  const statCards = [
    {
      id: 'totalReadings',
      title: t('stats.totalReadings'),
      value: formatNumber(stats.totalReadings),
      icon: <Gauge size={24} />,
      colorClass: 'text-primary dark:text-primary-light',
      bgClass: 'bg-primary/10'
    },
    {
      id: 'approvedReadings',
      title: t('stats.approvedReadings'),
      value: formatNumber(stats.approvedReadings),
      icon: <CheckCircle2 size={24} />,
      colorClass: 'text-success',
      bgClass: 'bg-success/10'
    },
    {
      id: 'pendingReadings',
      title: t('stats.pendingReadings'),
      value: formatNumber(stats.pendingReadings),
      icon: <Clock size={24} />,
      colorClass: 'text-warning dark:text-amber-500',
      bgClass: 'bg-warning/10 dark:bg-amber-500/10'
    },
    {
      id: 'rejectedReadings',
      title: t('stats.rejectedReadings'),
      value: formatNumber(stats.rejectedReadings),
      icon: <XCircle size={24} />,
      colorClass: 'text-error',
      bgClass: 'bg-error/10'
    },
    {
      id: 'totalConsumption',
      title: t('stats.totalConsumption'),
      value: `${formatNumber(stats.totalConsumption)} kWh`,
      icon: <Zap size={24} />,
      colorClass: 'text-accent dark:text-accent-amber',
      bgClass: 'bg-accent/10 dark:bg-accent-amber/10'
    },
    {
      id: 'totalReadingCost',
      title: t('stats.totalReadingCost'),
      value: formatCurrency(stats.totalReadingCost),
      icon: <DollarSign size={24} />,
      colorClass: 'text-teal-600 dark:text-teal-400',
      bgClass: 'bg-teal-500/10'
    },
  ]

  if (error) {
    return <div className="p-4 rounded-xl bg-error/10 text-error text-sm">{error}</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map(card => (
        <div key={card.id} className="bg-surface-white dark:bg-surface-container-low p-4 rounded-2xl shadow-sm border border-outline/10 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.bgClass} ${card.colorClass}`}>
              {card.icon}
            </div>
            <p className="text-label-sm font-bold text-outline dark:text-outline/80 leading-tight">
              {card.title}
            </p>
          </div>
          <div className="mt-1">
            <h4 className="text-headline-sm font-black text-on-surface dark:text-on-dark break-words">
              {isLoading ? '—' : card.value}
            </h4>
          </div>
        </div>
      ))}
    </div>
  )
}
