import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Database, CheckCircle2, PowerOff, Wrench, AlertCircle } from 'lucide-react'
import { cn } from '@/utils/cn'
import { fetchMeterStats, type MeterStatsResponse } from '@/services/meters.service'

export function MeterStats() {
  const { t } = useTranslation('meters')
  const [data, setData] = useState<MeterStatsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    setIsLoading(true)
    setError(null)
    fetchMeterStats()
      .then((res) => {
        if (!cancelled) setData(res)
      })
      .catch(() => {
        if (!cancelled) setError(t('errors.statsFailed'))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [t])

  const stats = [
    {
      id: 's1',
      labelKey: 'stats.total.label',
      subtextKey: 'stats.total.subtext',
      value: data?.total_meters ?? 0,
      icon: Database,
      variant: 'primary' as const
    },
    {
      id: 's2',
      labelKey: 'stats.active.label',
      subtextKey: 'stats.active.subtext',
      value: data?.active ?? 0,
      icon: CheckCircle2,
      variant: 'green' as const
    },
    {
      id: 's3',
      labelKey: 'stats.disconnected.label',
      subtextKey: 'stats.disconnected.subtext',
      value: data?.disconnected ?? 0,
      icon: PowerOff,
      variant: 'amber' as const
    },
    {
      id: 's4',
      labelKey: 'stats.maintenance.label',
      subtextKey: 'stats.maintenance.subtext',
      value: data?.maintenance ?? 0,
      icon: Wrench,
      variant: 'steel-blue' as const
    },
    {
      id: 's5',
      labelKey: 'stats.damaged.label',
      subtextKey: 'stats.damaged.subtext',
      value: data?.damaged ?? 0,
      icon: AlertCircle,
      variant: 'error' as const
    }
  ]

  const getVariantStyles = (variant: (typeof stats)[number]['variant']) => {
    switch (variant) {
      case 'primary': return 'border-primary text-primary bg-primary/10'
      case 'green': return 'border-green-500 text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400'
      case 'amber': return 'border-amber-gold text-amber-gold bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400'
      case 'error': return 'border-error text-error bg-error/10 dark:bg-error/20 dark:text-red-400'
      case 'steel-blue': return 'border-steel-blue text-steel-blue bg-steel-blue/10 dark:text-blue-400'
      default: return 'border-outline text-outline bg-surface-container'
    }
  }

  if (error) {
    return <div className="p-4 rounded-xl bg-error/10 text-error text-label-sm">{error}</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {stats.map((stat) => {
        const variantStyle = getVariantStyles(stat.variant)
        const borderColor = variantStyle.split(' ')[0]
        const iconColor = variantStyle.split(' ')[1]
        const iconBg = variantStyle.split(' ').slice(2).join(' ')

        return (
          <div
            key={stat.id}
            className={cn(
              'bg-surface-white p-6 rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] border-s-4 dark:bg-surface-container-low transition-colors duration-200',
              borderColor.replace('border-', 'border-s-')
            )}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn('p-2 rounded-lg flex items-center justify-center', iconBg)}>
                <stat.icon className={iconColor} size={24} />
              </div>
              <span className="text-label-sm text-on-surface-variant dark:text-outline">{t(stat.labelKey)}</span>
            </div><div className="font-display-lg text-display-lg font-bold text-primary dark:text-on-dark mb-1">
              {isLoading ? '—' : stat.value}
            </div>
            <div className="text-label-sm text-on-surface-variant dark:text-outline line-clamp-1" title={t(stat.subtextKey)}>
              {t(stat.subtextKey)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
