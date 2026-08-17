import { useTranslation } from 'react-i18next'
import { MOCK_METERS } from '../data/mockData'
import { MeterStat } from '../types'
import { Database, Gauge, CheckCircle2, PowerOff, Wrench, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/utils/cn'

export function MeterStats() {
  const { t } = useTranslation('meters')

  const total = MOCK_METERS.length
  const active = MOCK_METERS.filter(m => m.status === 'active').length
  const disconnected = MOCK_METERS.filter(m => m.status === 'disconnected').length
  const maintenance = MOCK_METERS.filter(m => m.status === 'maintenance').length
  const damaged = MOCK_METERS.filter(m => m.status === 'damaged').length

  const stats = [
    {
      id: 's1',
      labelKey: 'stats.total.label',
      value: total.toString(),
      subtextKey: 'stats.total.subtext',
      icon: Database,
      variant: 'primary'
    },
    {
      id: 's2',
      labelKey: 'stats.active.label',
      value: active.toString(),
      subtextKey: 'stats.active.subtext',
      icon: CheckCircle2,
      variant: 'green'
    },
    {
      id: 's3',
      labelKey: 'stats.disconnected.label',
      value: disconnected.toString(),
      subtextKey: 'stats.disconnected.subtext',
      icon: PowerOff,
      variant: 'amber'
    },
    {
      id: 's4',
      labelKey: 'stats.maintenance.label',
      value: maintenance.toString(),
      subtextKey: 'stats.maintenance.subtext',
      icon: Wrench,
      variant: 'steel-blue'
    },
    {
      id: 's5',
      labelKey: 'stats.damaged.label',
      value: damaged.toString(),
      subtextKey: 'stats.damaged.subtext',
      icon: AlertCircle,
      variant: 'error'
    }
  ]

  const getVariantStyles = (variant: MeterStat['variant']) => {
    switch (variant) {
      case 'primary': return 'border-primary text-primary bg-primary/10'
      case 'green': return 'border-green-500 text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400'
      case 'amber': return 'border-amber-gold text-amber-gold bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400'
      case 'error': return 'border-error text-error bg-error/10 dark:bg-error/20 dark:text-red-400'
      case 'steel-blue': return 'border-steel-blue text-steel-blue bg-steel-blue/10 dark:text-blue-400'
      case 'bright-gold': return 'border-bright-gold text-secondary bg-bright-gold/10 dark:text-yellow-500'
      default: return 'border-outline text-outline bg-surface-container'
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {stats.map((stat) => {
        const variantStyle = getVariantStyles(stat.variant as any)
        const borderColor = variantStyle.split(' ')[0]
        const iconColor = variantStyle.split(' ')[1]
        const iconBg = variantStyle.split(' ').slice(2).join(' ') // handles multiple bg classes (e.g. for dark mode)

        return (
          <div 
            key={stat.id} 
            className={cn(
              "bg-surface-white p-6 rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] border-s-4 dark:bg-surface-container-low transition-colors duration-200",
              borderColor.replace('border-', 'border-s-')
            )}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-2 rounded-lg flex items-center justify-center", iconBg)}>
                <stat.icon className={iconColor} size={24} />
              </div>
              
              {stat.trend && (
                <span className={cn(
                  "px-2 py-0.5 rounded-full flex items-center gap-1 font-bold text-[12px]",
                  stat.trend.type === 'up' ? "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400" :
                  stat.trend.type === 'down' ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                  "bg-surface-container text-on-surface-variant"
                )}>
                  {stat.trend.type === 'up' && <TrendingUp size={14} />}
                  {stat.trend.type === 'down' && <TrendingDown size={14} />}
                  <span className="dir-ltr">{stat.trend.value}</span>
                </span>
              )}
              {!stat.trend && <span className="text-label-sm text-on-surface-variant dark:text-outline">{t(stat.labelKey)}</span>}
            </div>
            
            <div className="font-display-lg text-display-lg font-bold text-primary dark:text-on-dark mb-1">
              {stat.value}
            </div>
            <div className="text-label-sm text-on-surface-variant dark:text-outline line-clamp-1" title={t(stat.subtextKey)}>
              {/* @ts-ignore */}
              {stat.trend ? t(stat.labelKey) : t(stat.subtextKey)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
