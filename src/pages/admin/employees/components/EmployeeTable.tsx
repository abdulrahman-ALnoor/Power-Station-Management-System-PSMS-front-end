import { useTranslation } from 'react-i18next'
import { MOCK_EMPLOYEES } from '../data/mockData'
import { Eye, Edit2, Trash2, Phone, Mail, ChevronRight, ChevronLeft } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'

interface EmployeeTableProps {
  onViewClick: (id: string) => void
}

export function EmployeeTable({ onViewClick }: EmployeeTableProps) {
  const { t } = useTranslation('employees')
  const { isRTL } = useLanguage()

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'inactive':
        return 'bg-surface-dim text-on-surface-variant dark:bg-surface-container-high dark:text-outline'
      default:
        return 'bg-surface-dim text-on-surface-variant'
    }
  }

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-border dark:bg-surface-container-low overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-start border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-border dark:bg-surface-container dark:border-border-muted">
              <th className="px-6 py-4 font-label-sm text-label-sm text-primary dark:text-on-dark text-start">{t('table.employee')}</th>
              <th className="px-6 py-4 font-label-sm text-label-sm text-primary dark:text-on-dark text-start">{t('table.contactInfo')}</th>
              <th className="px-6 py-4 font-label-sm text-label-sm text-primary dark:text-on-dark text-start">{t('table.role')}</th>
              <th className="px-6 py-4 font-label-sm text-label-sm text-primary dark:text-on-dark text-start">{t('table.status')}</th>
              <th className="px-6 py-4 font-label-sm text-label-sm text-primary dark:text-on-dark text-center">{t('table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-border-muted">
            {MOCK_EMPLOYEES.map((employee) => (
              <tr 
                key={employee.id} 
                className="hover:bg-surface-container-low/50 dark:hover:bg-surface-container/50 transition-colors cursor-pointer group"
                onClick={() => onViewClick(employee.id)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold dark:bg-primary-fixed/20 dark:text-primary-fixed">
                      {employee.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-body-md font-bold text-primary dark:text-on-dark">{employee.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {employee.phone && (
                      <div className="flex items-center gap-2 text-on-surface-variant text-[13px] dir-ltr justify-end sm:justify-start">
                        {/* Force LTR for phone numbers but align properly depending on language, wait standard logical flow is better */}
                        <div className={cn("flex items-center gap-2", isRTL ? "flex-row-reverse w-full justify-end" : "")}>
                          <Phone size={14} className={isRTL ? "ms-1" : "me-1"} />
                          <span className="dir-ltr">{employee.phone}</span>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-on-surface-variant text-[13px]">
                      <Mail size={14} className={isRTL ? "ms-1" : "me-1"} />
                      <span>{employee.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-body-md text-on-surface dark:text-on-dark">
                    {employee.roles && employee.roles.length > 0 
                      ? t(`toolbar.roles.${employee.roles[0]}`) 
                      : '-'}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className={cn("px-3 py-1 rounded-full text-xs font-bold", getStatusStyle(employee.status))}>
                    {t(`status.${employee.status}`)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      className="p-2 rounded-lg hover:bg-primary/10 text-primary dark:hover:bg-primary-fixed/20 dark:text-primary-fixed transition-colors"
                      title={t('actions.view')}
                      onClick={(e) => { e.stopPropagation(); onViewClick(employee.id) }}
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      className="p-2 rounded-lg hover:bg-steel-blue/10 text-steel-blue transition-colors"
                      title={t('actions.edit')}
                      onClick={(e) => { e.stopPropagation(); /* edit handler */ }}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      className="p-2 rounded-lg hover:bg-error/10 text-error transition-colors"
                      title={t('actions.delete')}
                      onClick={(e) => { e.stopPropagation(); /* delete handler */ }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination - Matching Stitch design */}
      <div className="px-6 py-4 flex items-center justify-between bg-surface-container-lowest border-t border-border dark:bg-surface-container dark:border-border-muted">
        <p className="text-[12px] text-on-surface-variant">
          {t('pagination.showing', { count: 10, total: 482 })}
        </p>
        <div className="flex gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded border border-border text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors dark:border-border-muted">
            {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary font-medium">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded border border-border text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors dark:border-border-muted">2</button>
          <button className="w-8 h-8 flex items-center justify-center rounded border border-border text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors dark:border-border-muted">3</button>
          <button className="w-8 h-8 flex items-center justify-center rounded border border-border text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors dark:border-border-muted">
            {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  )
}
