import { useTranslation } from 'react-i18next'
import { MOCK_PERMISSIONS } from '../data/mockData'
import { ShieldCheck } from 'lucide-react'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'

function DynamicIcon({ name, className }: { name: string, className?: string }) {
  const iconMap: Record<string, keyof typeof Icons> = {
    verified_user: 'ShieldCheck',
    token: 'Badge',
    edit_square: 'FileEdit',
    account_balance_wallet: 'Wallet',
  }
  const iconName = iconMap[name] || 'Circle'
  const Icon = Icons[iconName] as LucideIcon
  if (!Icon) return null
  return <Icon className={className} size={18} />
}

export function PermissionsOverview() {
  const { t } = useTranslation('employees')

  return (
    <div className="bg-surface p-6 rounded-xl shadow-sm border border-border dark:bg-surface-container-low">
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="text-primary dark:text-primary-fixed" size={24} />
        <h3 className="font-headline-md text-headline-md text-primary dark:text-on-dark font-bold">
          {t('permissions.sectionTitle')}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_PERMISSIONS.map((group) => {
          // Admin gets a slightly different styling based on Stitch design (primary-container/5)
          const isAdmin = group.id === 'pg1'
          
          return (
            <div 
              key={group.id} 
              className={cn(
                "border border-border rounded-lg p-4 transition-colors",
                isAdmin ? "bg-primary-container/5 dark:bg-primary/20" : "bg-transparent"
              )}
            >
              <h4 className="font-bold text-primary dark:text-on-dark mb-3 flex items-center gap-2">
                <DynamicIcon name={group.icon} />
                {t(group.titleKey)}
              </h4>
              
              <ul className="space-y-2 text-[12px] text-on-surface-variant dark:text-outline">
                {group.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-2">
                    <span 
                      className={cn(
                        "w-1.5 h-1.5 rounded-full shrink-0", 
                        item.granted ? "bg-green-500" : "bg-red-400"
                      )} 
                    />
                    <span>{t(item.textKey)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
