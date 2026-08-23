import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'

import {
  showSuccess,
  showError,
  showConfirm,
} from '@/utils/toast'

import type { Employee, EmployeeStatus } from '../types'
//import { showSuccess } from '@/utils/toast'
//import {showSuccess,  showError } from '@/utils/toast'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'

import {
  fetchEmployees,
  mapEmployee,
  deleteEmployee,
} from '@/services/employees.service'

//import type { Employee } from '../types'

interface EmployeeTableProps {
  onViewClick: (id: string) => void
  onEditClick: (employee: Employee) => void
  search?: string
  role?: string
  status?: string
  refreshKey?: number
  onDeleted?: () => void
}

export function EmployeeTable({
  onViewClick,
  onEditClick,
  search,
  role,
  status,
  refreshKey,
  onDeleted,
}: EmployeeTableProps) {
  const { t } = useTranslation('employees')
  const { isRTL } = useLanguage()

  const [employees, setEmployees] = useState<Employee[]>([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    setPage(1)
  }, [search, role, status])

  useEffect(() => {
    let cancelled = false

    setIsLoading(true)
    setError(null)

    fetchEmployees({
  page,
  search: search || undefined,
  role: role || undefined,
  status: status
    ? (status as EmployeeStatus)
    : undefined,
})
      .then((res) => {
        if (cancelled) return

        setEmployees(res.data.map(mapEmployee))
        setLastPage(res.last_page)
        setTotal(res.total)
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            'تعذر تحميل الموظفين. تأكد من تشغيل الخادم الخلفي.',
          )
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [page, search, role, status, refreshKey])

const handleDelete = (
  e: React.MouseEvent,
  id: string,
  employeeName: string,
) => {
  e.stopPropagation()

  showConfirm(
    `هل أنت متأكد من حذف الموظف "${employeeName}"؟ لا يمكن التراجع عن هذه العملية.`,

    async () => {
      setDeletingId(id)

      try {
        await deleteEmployee(id)

        // حذف الموظف من الجدول مباشرة
        setEmployees((prev) =>
          prev.filter((emp) => emp.id !== id),
        )

        // تحديث الصفحة والإحصائيات
        onDeleted?.()

        // رسالة نجاح
        showSuccess(
          `تم حذف الموظف "${employeeName}" بنجاح.`,
          'تم الحذف بنجاح',
        )
      } catch (err) {
        console.error('Delete employee error:', err)

        showError(
          'تعذر حذف الموظف. يرجى المحاولة مرة أخرى.',
          'فشلت عملية الحذف',
        )
      } finally {
        setDeletingId(null)
      }
    },

    'تأكيد حذف الموظف',
    'نعم، حذف الموظف',
    'bg-red-600 hover:bg-red-700',
  )
}
  const getStatusStyle = (employeeStatus: string) => {
    switch (employeeStatus) {
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
              <th className="px-6 py-4 font-label-sm text-label-sm text-primary dark:text-on-dark text-start">
                {t('table.employee')}
              </th>

              <th className="px-6 py-4 font-label-sm text-label-sm text-primary dark:text-on-dark text-start">
                {t('table.contactInfo')}
              </th>

              <th className="px-6 py-4 font-label-sm text-label-sm text-primary dark:text-on-dark text-start">
                {t('table.role')}
              </th>

              <th className="px-6 py-4 font-label-sm text-label-sm text-primary dark:text-on-dark text-start">
                {t('table.status')}
              </th>

              <th className="px-6 py-4 font-label-sm text-label-sm text-primary dark:text-on-dark text-center">
                {t('table.actions')}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border dark:divide-border-muted">
            {isLoading && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-on-surface-variant dark:text-outline"
                >
                  جاري التحميل...
                </td>
              </tr>
            )}

            {!isLoading && error && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-error"
                >
                  {error}
                </td>
              </tr>
            )}

            {!isLoading &&
              !error &&
              employees.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-on-surface-variant dark:text-outline"
                  >
                    لا يوجد موظفون
                  </td>
                </tr>
              )}

            {!isLoading &&
              !error &&
              employees.map((employee) => (
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
                        <p className="font-body-md font-bold text-primary dark:text-on-dark">
                          {employee.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {employee.phone && (
                        <div
                          className={cn(
                            'flex items-center gap-2 text-on-surface-variant text-[13px]',
                            isRTL
                              ? 'flex-row-reverse w-full justify-end'
                              : '',
                          )}
                        >
                          <Phone
                            size={14}
                            className={isRTL ? 'ms-1' : 'me-1'}
                          />

                          <span className="dir-ltr">
                            {employee.phone}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-on-surface-variant text-[13px]">
                        <Mail
                          size={14}
                          className={isRTL ? 'ms-1' : 'me-1'}
                        />

                        <span>{employee.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-body-md text-on-surface dark:text-on-dark">
                      {employee.roles &&
                      employee.roles.length > 0
                        ? t(
                            `toolbar.roles.${employee.roles[0]}`,
                            employee.roles[0],
                          )
                        : '-'}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'px-3 py-1 rounded-full text-xs font-bold',
                        getStatusStyle(employee.status),
                      )}
                    >
                      {t(`status.${employee.status}`)}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        className="p-2 rounded-lg hover:bg-primary/10 text-primary dark:hover:bg-primary-fixed/20 dark:text-primary-fixed transition-colors"
                        title={t('actions.view')}
                        onClick={(e) => {
                          e.stopPropagation()
                          onViewClick(employee.id)
                        }}
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        type="button"
                        className="p-2 rounded-lg hover:bg-steel-blue/10 text-steel-blue transition-colors"
                        title={t('actions.edit')}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEditClick(employee)
                        }}
                      >
                        <Edit2 size={18} />
                      </button>

                      <button
  className="p-2 rounded-lg hover:bg-error/10 text-error transition-colors disabled:opacity-50"
  title={t('actions.delete')}
  disabled={deletingId === employee.id}
  onClick={(e) =>
    handleDelete(
      e,
      employee.id,
      employee.name,
    )
  }
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

      <div className="px-6 py-4 flex items-center justify-between bg-surface-container-lowest border-t border-border dark:bg-surface-container dark:border-border-muted">
        <p className="text-[12px] text-on-surface-variant">
          {t('pagination.showing', {
            count: employees.length,
            total,
          })}
        </p>

        <div className="flex gap-1 items-center">
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded border border-border text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors dark:border-border-muted disabled:opacity-40"
            disabled={page <= 1}
            onClick={() =>
              setPage((p) => Math.max(1, p - 1))
            }
          >
            {isRTL ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>

          <span className="px-3 text-[12px] text-on-surface-variant">
            {page} / {lastPage}
          </span>

          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded border border-border text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors dark:border-border-muted disabled:opacity-40"
            disabled={page >= lastPage}
            onClick={() =>
              setPage((p) =>
                Math.min(lastPage, p + 1),
              )
            }
          >
            {isRTL ? (
              <ChevronLeft size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}