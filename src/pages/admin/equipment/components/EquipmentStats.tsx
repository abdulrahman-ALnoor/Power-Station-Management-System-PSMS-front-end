import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Layers, CheckCircle2, Wrench, AlertTriangle, SearchX } from 'lucide-react'
import { fetchEquipmentStats, type EquipmentStatsResponse } from '@/services/equipment.service'
import type { EquipmentStat } from '../types'

const ICON_MAP: Record<string, React.ElementType> = {
 'layers': Layers,
 'check_circle': CheckCircle2,
 'build': Wrench,
 'report_problem': AlertTriangle,
 'search_off': SearchX
}

export function EquipmentStats() {
  const { t } = useTranslation('equipment')
  const [data, setData] = useState<EquipmentStatsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchEquipmentStats()
      .then((res) => {
        if (!cancelled) setData(res)
      })
      .catch(() => {
        if (!cancelled) setError('تعذر تحميل إحصائيات المعدات')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const byStatus = data?.by_status ?? {}
  const stats: EquipmentStat[] = [
    { id: 'total', labelKey: 'stats.total', value: data?.total_equipment ?? 0, iconKey: 'layers', variant: 'primary' },
    { id: 'available', labelKey: 'stats.available', value: byStatus.available ?? 0, iconKey: 'check_circle', variant: 'success' },
    { id: 'maintenance', labelKey: 'stats.maintenance', value: byStatus.maintenance ?? 0, iconKey: 'build', variant: 'warning' },
    { id: 'damaged', labelKey: 'stats.damaged', value: byStatus.damaged ?? 0, iconKey: 'report_problem', variant: 'error' },
    { id: 'lost', labelKey: 'stats.lost', value: byStatus.lost ?? 0, iconKey: 'search_off', variant: 'error' },
  ]

  if (error) {
    return <div className="p-4 rounded-xl bg-error/10 text-error text-label-sm">{error}</div>
  }

 return (
 <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
 {stats.map((stat) => {
 const Icon = ICON_MAP[stat.iconKey] || Layers

        let colors: { bg: string; iconBg: string; iconText: string; border: string }

        switch (stat.variant) {
          case 'primary':
            colors = {
              bg: 'bg-surface-container-lowest dark:bg-surface-container-low',
              iconBg: 'bg-primary/10 dark:bg-primary/20',
              iconText: 'text-primary dark:text-primary-fixed',
              border: 'border-b-4 border-primary dark:border-primary-fixed'
            }
            break
          case 'success':
            colors = {
              bg: 'bg-surface-container-lowest dark:bg-surface-container-low',
              iconBg: 'bg-green-100 dark:bg-green-900/30',
              iconText: 'text-green-600 dark:text-green-500',
              border: 'border-b-4 border-green-500 dark:border-green-600'
            }
            break
          case 'warning':
            colors = {
              bg: 'bg-surface-container-lowest dark:bg-surface-container-low',
              iconBg: 'bg-amber-100 dark:bg-amber-900/30',
              iconText: 'text-amber-600 dark:text-amber-500',
              border: 'border-b-4 border-amber-500 dark:border-amber-600'
            }
            break
          case 'error':
            colors = {
              bg: 'bg-surface-container-lowest dark:bg-surface-container-low',
              iconBg: 'bg-error/10 dark:bg-error/20',
              iconText: 'text-error dark:text-error',
              border: 'border-b-4 border-error dark:border-error'
            }
            break
          default:
            colors = {
              bg: 'bg-surface-container-lowest dark:bg-surface-container-low',
              iconBg: 'bg-surface-container dark:bg-surface',
              iconText: 'text-on-surface-variant dark:text-outline',
              border: 'border-b-4 border-outline dark:border-outline'
            }
        }

        return (
          <div
            key={stat.id}
            className={`p-6 rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] flex flex-col justify-between ${colors.bg} ${colors.border}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.iconBg} ${colors.iconText}`}>
                <Icon size={24} />
              </div>
            </div>

            <div>
              <p className="text-label-md text-outline dark:text-outline font-bold mb-1">
                {t(stat.labelKey)}
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="font-display-sm text-display-sm font-bold text-on-surface dark:text-on-dark">
                  {isLoading ? '—' : stat.value}
                </h3>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
