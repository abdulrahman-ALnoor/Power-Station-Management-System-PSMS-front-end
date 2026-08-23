import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fetchEmployeeStats, type EmployeeStatsResponse } from '@/services/employees.service'
import { EmployeeStat } from '../types'
import { Users, ShieldCheck, HardHat, Landmark, Gauge } from 'lucide-react'
import { cn } from '@/utils/cn'

export function EmployeeStats() {
  const { t } = useTranslation('employees')
  const [data, setData] = useState<EmployeeStatsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    setIsLoading(true)
    fetchEmployeeStats()
      .then((res) => {
        if (!cancelled) setData(res)
      })
      .catch(() => {
        if (!cancelled) setError('تعذر تحميل إحصائيات الموظفين')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const stats: { id: string; labelKey: string; value: string; subtextKey: string; icon: any; variant: EmployeeStat['variant'] }[] = [
    { id: 's1', labelKey: 'stats.total.label', value: (data?.total_employees ?? 0).toString(), subtextKey: 'stats.total.subtext', icon: Users, variant: 'primary' },
    { id: 's2', labelKey: 'stats.admins.label', value: (data?.by_role?.admin ?? 0).toString(), subtextKey: 'stats.admins.subtext', icon: ShieldCheck, variant: 'secondary-container' },
    { id: 's3', labelKey: 'stats.engineers.label', value: (data?.by_role?.engineer ?? 0).toString(), subtextKey: 'stats.engineers.subtext', icon: HardHat, variant: 'bright-gold' },
    { id: 's4', labelKey: 'stats.readers.label', value: (data?.by_role?.reader ?? 0).toString(), subtextKey: 'stats.readers.subtext', icon: Gauge, variant: 'steel-blue' },
    { id: 's5', labelKey: 'stats.accountants.label', value: (data?.by_role?.accountant ?? 0).toString(), subtextKey: 'stats.accountants.subtext', icon: Landmark, variant: 'primary-container' },
  ]

 const getVariantStyles = (variant: EmployeeStat['variant']) => {
 switch (variant) {
 case 'primary': return 'border-primary text-primary bg-primary/10'
 case 'steel-blue': return 'border-steel-blue text-steel-blue bg-steel-blue/10'
 case 'bright-gold': return 'border-bright-gold text-amber-500 bg-bright-gold/10'
 case 'secondary-container': return 'border-secondary-container text-yellow-700 bg-secondary-container/10'
 case 'primary-container': return 'border-primary-container text-primary-container bg-primary-container/10'
 default: return 'border-border text-text-muted bg-surface-container'
 }
 }

  if (error) {
    return <div className="p-4 rounded-xl bg-error/10 text-error text-label-sm">{error}</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {stats.map((stat) => {
        const variantStyle = getVariantStyles(stat.variant)
        const borderColor = variantStyle.split(' ')[0]
        const iconColor = variantStyle.split(' ')[1]
        const iconBg = variantStyle.split(' ')[2]

        return (
          <div
            key={stat.id}
            className={cn(
              "bg-surface p-5 rounded-xl shadow-sm border-s-4 dark:bg-surface-container-low transition-colors duration-200",
              borderColor.replace('border-', 'border-s-')
            )}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", iconBg)}>
                <stat.icon className={iconColor} size={22} />
              </div>
            </div>

            <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">
              {t(stat.labelKey)}
            </p>
            <h3 className="font-display-lg text-display-lg font-bold text-primary dark:text-on-dark">
              {isLoading ? '—' : stat.value}
            </h3>
            <p className="text-[10px] text-outline mt-2">
              {t(stat.subtextKey)}
            </p>
          </div>
        )
      })}
    </div>
  )
}
