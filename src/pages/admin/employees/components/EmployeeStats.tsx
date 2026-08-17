import { useTranslation } from 'react-i18next'
import { MOCK_STATS } from '../data/mockData'
import { EmployeeStat } from '../types'
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react'
import * as Icons from 'lucide-react'
import { cn } from '@/utils/cn'

function DynamicIcon({ name, className }: { name: string, className?: string }) {
  // Mapping the material icons used in the mock to Lucide icons
  const iconMap: Record<string, keyof typeof Icons> = {
    groups: 'Users',
    admin_panel_settings: 'ShieldCheck',
    construction: 'HardHat',
    pin_drop: 'MapPin',
    account_balance: 'Landmark',
  }

  const iconName = iconMap[name] || 'Circle'
  const Icon = Icons[iconName] as LucideIcon
  if (!Icon) return null
  return <Icon className={className} />
}

export function EmployeeStats() {
  const { t } = useTranslation('employees')

  const getVariantStyles = (variant: EmployeeStat['variant']) => {
    switch (variant) {
      case 'primary': return 'border-primary text-primary bg-primary/10'
      case 'steel-blue': return 'border-steel-blue text-steel-blue bg-steel-blue/10'
      case 'bright-gold': return 'border-bright-gold text-amber-500 bg-bright-gold/10'
      case 'secondary-container': return 'border-secondary-container text-yellow-700 bg-secondary-container/10'
      case 'primary-container': return 'border-primary-container text-primary-container bg-primary-container/10'
      default: return 'border-outline text-outline bg-surface-container'
    }
  }

  const getTrendStyles = (trend: EmployeeStat['trend']) => {
    if (!trend) return null
    if (trend.type === 'up') return 'text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400'
    if (trend.type === 'down') return 'text-red-500 bg-red-50 dark:bg-red-900/30 dark:text-red-400'
    return 'text-on-surface-variant bg-surface-container dark:bg-surface-container-high'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {MOCK_STATS.map((stat) => {
        const variantStyle = getVariantStyles(stat.variant)
        const borderColor = variantStyle.split(' ')[0]
        const iconColor = variantStyle.split(' ')[1]
        const iconBg = variantStyle.split(' ')[2]

        return (
          <div 
            key={stat.id} 
            className={cn(
              "bg-surface p-5 rounded-xl shadow-sm border-s-4 dark:bg-surface-container-low transition-colors duration-200",
              borderColor.replace('border-', 'border-s-') // Use logical inline-start border
            )}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", iconBg)}>
                <DynamicIcon name={stat.icon} className={iconColor} />
              </div>
              
              {stat.trend && (
                <span className={cn("font-bold text-xs flex items-center gap-1 px-2 py-1 rounded-full", getTrendStyles(stat.trend))}>
                  {stat.trend.value && <span className="dir-ltr">{stat.trend.value}</span>}
                  {stat.trend.labelKey && <span>{t(stat.trend.labelKey)}</span>}
                  {stat.trend.type === 'up' && <TrendingUp size={14} />}
                  {stat.trend.type === 'down' && <TrendingDown size={14} />}
                  {stat.trend.type === 'neutral' && !stat.trend.labelKey && <Minus size={14} />}
                </span>
              )}
            </div>
            
            <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">
              {t(stat.labelKey)}
            </p>
            <h3 className="font-display-lg text-display-lg font-bold text-primary dark:text-on-dark">
              {stat.value}
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
