import { useTranslation } from 'react-i18next'
import { X, Laptop, Smartphone, CarFront } from 'lucide-react'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Employee } from '../types'
import { useLanguage } from '@/hooks/useLanguage'

interface EmployeePreviewDrawerProps {
  employee: Employee | null
  isOpen: boolean
  onClose: () => void
}

function DynamicIcon({ name, className }: { name: string, className?: string }) {
  const iconMap: Record<string, keyof typeof Icons> = {
    laptop: 'Laptop',
    smartphone: 'Smartphone',
    car_repair: 'CarFront',
  }
  const iconName = iconMap[name] || 'Circle'
  const Icon = Icons[iconName] as LucideIcon
  if (!Icon) return null
  return <Icon className={className} size={14} />
}

export function EmployeePreviewDrawer({ employee, isOpen, onClose }: EmployeePreviewDrawerProps) {
  const { t } = useTranslation('employees')
  const { isRTL } = useLanguage()

  if (!employee) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={cn(
          "fixed top-0 bottom-0 w-full sm:w-[500px] bg-surface shadow-2xl z-[60] overflow-y-auto transition-transform duration-300 dark:bg-surface-container",
          isRTL ? "left-0" : "right-0",
          isOpen 
            ? "translate-x-0" 
            : isRTL ? "-translate-x-full" : "translate-x-full"
        )}
      >
        <button 
          className="absolute top-4 inset-inline-start-4 w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors z-10 dark:bg-surface dark:hover:bg-surface-high"
          onClick={onClose}
        >
          <X className="text-primary dark:text-on-dark" size={24} />
        </button>
        
        <div className="p-8 pt-12">
          
          {/* Header / Avatar */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-primary-fixed mb-4 bg-primary/10 text-primary flex items-center justify-center text-4xl font-bold dark:border-primary dark:bg-primary-fixed/20 dark:text-primary-fixed">
                {employee.name.charAt(0)}
              </div>
              <span className={cn(
                "absolute bottom-4 w-6 h-6 border-2 border-surface rounded-full dark:border-surface-container",
                employee.status === 'active' ? 'bg-green-500' : 'bg-surface-dim',
                isRTL ? "left-0" : "right-0"
              )} />
            </div>
            <h2 className="font-headline-md text-headline-md font-bold text-primary dark:text-on-dark">{employee.name}</h2>
            <p className="text-steel-blue font-bold">
              {employee.roles && employee.roles.length > 0 
                ? t(`toolbar.roles.${employee.roles[0]}`) 
                : '-'}
            </p>
          </div>
          
          <div className="space-y-6">
            
            {/* Personal Info */}
            <section>
              <h4 className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-3 border-b border-border-muted pb-1 dark:border-border">
                {t('drawer.personalInfo')}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[12px] text-on-surface-variant dark:text-outline">{t('modal.email')}</p>
                  <p className="font-bold text-primary dark:text-on-dark">{employee.email}</p>
                </div>
                {employee.phone && (
                  <div>
                    <p className="text-[12px] text-on-surface-variant dark:text-outline">{t('modal.phone')}</p>
                    <p className="font-bold text-primary dark:text-on-dark dir-ltr text-start">{employee.phone}</p>
                  </div>
                )}
              </div>
            </section>
            
            {/* Permissions */}
            {employee.permissions && (
              <section>
                <h4 className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-3 border-b border-border-muted pb-1 dark:border-border">
                  {t('drawer.permissions')}
                </h4>
                <div className="space-y-2">
                  {employee.permissions.map(perm => (
                    <div key={perm.id} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border-muted/30 dark:bg-surface dark:border-border">
                      <span className="text-body-md text-on-surface dark:text-on-dark">{t(`permissions.${perm.nameKey}`)}</span>
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold",
                        perm.active 
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-surface-dim text-on-surface-variant dark:bg-surface-container-high dark:text-outline"
                      )}>
                        {perm.active ? t('drawer.active') : t('drawer.inactive')}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {/* Equipment */}
            {employee.equipment && (
              <section>
                <h4 className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-3 border-b border-border-muted pb-1 dark:border-border">
                  {t('drawer.equipment')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {employee.equipment.map(item => (
                    <span 
                      key={item.id} 
                      className="bg-surface-container px-3 py-1 rounded-full text-xs text-primary flex items-center gap-1 border border-border dark:bg-surface dark:text-on-dark dark:border-border-muted"
                    >
                      <DynamicIcon name={item.type} />
                      {t(`drawer.equip.${item.nameKey}`)}
                    </span>
                  ))}
                </div>
              </section>
            )}
            
          </div>
          
          {/* Action Buttons */}
          <div className="mt-12 flex gap-3">
            <button className="flex-1 bg-primary text-on-primary py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors dark:bg-primary-fixed dark:text-primary">
              {t('drawer.editData')}
            </button>
            <button className="flex-1 border border-error text-error py-3 rounded-lg font-bold hover:bg-error/5 transition-colors dark:border-red-400 dark:text-red-400">
              {t('drawer.suspendAccount')}
            </button>
          </div>
          
        </div>
      </div>
    </>
  )
}
