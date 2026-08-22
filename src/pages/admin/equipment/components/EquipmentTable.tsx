import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'
import { fetchEquipmentList, mapEquipment, deleteEquipment } from '@/services/equipment.service'
import {
  showSuccess,
  showError,
  showConfirm,
} from '@/utils/toast'
import type { Equipment } from '../types'

interface EquipmentTableProps {
  onRowClick: (id: number) => void
  onEditClick?: (id: number) => void
  search?: string
  status?: string
  refreshKey?: number
  onDeleted?: () => void
}

export function EquipmentTable({ onRowClick, onEditClick, search, status, refreshKey, onDeleted }: EquipmentTableProps) {
  const { t } = useTranslation('equipment')
  const { isRTL } = useLanguage()

  const [items, setItems] = useState<Equipment[]>([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    setPage(1)
  }, [search, status])

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)
    fetchEquipmentList({ page, search: search || undefined, status: (status as any) || undefined })
      .then((res) => {
        if (cancelled) return
        setItems(res.data.map(mapEquipment))
        setLastPage(res.last_page)
        setTotal(res.total)
      })
      .catch(() => {
        if (!cancelled) setError('تعذر تحميل المعدات. تأكد من تشغيل الخادم الخلفي.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => { cancelled = true }
  }, [page, search, status, refreshKey])

const handleDelete = (
  e: MouseEvent<HTMLButtonElement>,
  id: number,
) => {
  e.stopPropagation()

  showConfirm(
    'هل أنت متأكد من حذف هذه المعدة؟ لا يمكن التراجع عن هذه العملية.',
    async () => {
      setDeletingId(id)

      try {
        await deleteEquipment(id)

        // حذف المعدة من الجدول مباشرة
        setItems((prev) =>
          prev.filter((item) => item.id !== id),
        )

        // تحديث العدد
        setTotal((prev) =>
          Math.max(0, prev - 1),
        )

        // تحديث الجدول والإحصائيات
        onDeleted?.()

        // رسالة نجاح الحذف
        showSuccess(
          'تم حذف المعدة من النظام بنجاح.',
          'تم الحذف بنجاح',
        )
      } catch {
        // رسالة خطأ إذا فشل الحذف
        showError(
          'تعذر حذف المعدة. يرجى المحاولة مرة أخرى.',
          'فشلت عملية الحذف',
        )
      } finally {
        setDeletingId(null)
      }
    },
    'تأكيد حذف المعدة',
  )
}
  

  const getStatusStyle = (status: string | null) => {
    switch (status) {
      case 'available': return 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-500'
      case 'maintenance': return 'bg-amber-50 text-amber-gold dark:bg-amber-900/30 dark:text-amber-500'
      case 'damaged': return 'bg-error-container text-error dark:bg-error-container/20 dark:text-error'
      case 'lost': return 'bg-error-container text-error dark:bg-error-container/20 dark:text-error'
      default: return 'bg-surface-dim text-on-surface-variant'
    }
  }

  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    return d.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')
  }

  return (
    <div className="bg-surface-white dark:bg-surface-container-low rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-start border-collapse">
          <thead>
            <tr className="bg-surface-container-low dark:bg-surface-container border-b border-outline-variant dark:border-border-muted">
              <th className="px-6 py-4 font-body-md font-bold text-on-surface dark:text-on-dark text-start whitespace-nowrap">{t('table.id')}</th>
              <th className="px-6 py-4 font-body-md font-bold text-on-surface dark:text-on-dark text-start whitespace-nowrap">{t('table.equipmentName')}</th>
              <th className="px-6 py-4 font-body-md font-bold text-on-surface dark:text-on-dark text-start whitespace-nowrap">{t('table.serialNumber')}</th>
              <th className="px-6 py-4 font-body-md font-bold text-on-surface dark:text-on-dark text-start whitespace-nowrap">{t('table.assignedUser')}</th>
              <th className="px-6 py-4 font-body-md font-bold text-on-surface dark:text-on-dark text-start whitespace-nowrap">{t('table.status')}</th>
              <th className="px-6 py-4 font-body-md font-bold text-on-surface dark:text-on-dark text-start whitespace-nowrap">{t('table.createdBy')}</th>
              <th className="px-6 py-4 font-body-md font-bold text-on-surface dark:text-on-dark text-start whitespace-nowrap">{t('table.createdAt')}</th>
              <th className="px-6 py-4 font-body-md font-bold text-on-surface dark:text-on-dark text-center whitespace-nowrap">{t('table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant dark:divide-border-muted">
            {isLoading && (
              <tr><td colSpan={8} className="px-6 py-10 text-center text-on-surface-variant dark:text-outline">جاري التحميل...</td></tr>
            )}
            {!isLoading && error && (
              <tr><td colSpan={8} className="px-6 py-10 text-center text-error">{error}</td></tr>
            )}
            {!isLoading && !error && items.length === 0 && (
              <tr><td colSpan={8} className="px-6 py-10 text-center text-on-surface-variant dark:text-outline">لا توجد معدات</td></tr>
            )}
            {!isLoading && !error && items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-surface-container-low dark:hover:bg-surface-container/50 transition-colors cursor-pointer group"
                onClick={() => onRowClick(item.id)}
              >
                <td className="px-6 py-4 font-table-cell font-bold text-primary dark:text-on-dark whitespace-nowrap">{item.id}</td>
                <td className="px-6 py-4 font-table-cell text-on-surface dark:text-on-dark whitespace-nowrap">{item.equipment_name}</td>
                <td className="px-6 py-4 font-table-cell text-outline dark:text-outline whitespace-nowrap">{item.serial_number || '-'}</td>

                <td className="px-6 py-4 font-table-cell whitespace-nowrap">
                  {item.user ? (
                    <div className="flex items-center gap-2">
                      <span className="text-on-surface dark:text-on-dark">{item.user.name}</span>
                    </div>
                  ) : (
                    <span className="text-outline">{t('table.unassigned')}</span>
                  )}
                </td>

                <td className="px-6 py-4 font-table-cell whitespace-nowrap">
                  <span className={cn("px-3 py-1 rounded-full text-[12px] font-bold", getStatusStyle(item.status))}>
                    {item.status ? t(`status.${item.status}`) : '-'}
                  </span>
                </td>

                <td className="px-6 py-4 font-table-cell text-on-surface dark:text-on-dark whitespace-nowrap">
                  {item.createdBy ? item.createdBy.name : '-'}
                </td>

                <td className="px-6 py-4 font-table-cell text-outline dark:text-outline whitespace-nowrap" dir="ltr">
                  {formatDate(item.created_at)}
                </td>

                <td className="px-6 py-4 font-table-cell whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="text-outline hover:text-primary dark:hover:text-primary-fixed transition-colors p-1"
                      title={t('table.view')}
                      onClick={() => onRowClick(item.id)}
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      className="text-outline hover:text-amber-gold dark:hover:text-amber-500 transition-colors p-1"
                      title={t('table.edit')}
                      onClick={() => onEditClick?.(item.id)}
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      className="text-outline hover:text-error dark:hover:text-error-container transition-colors p-1 disabled:opacity-50"
                      title={t('table.delete')}
                      disabled={deletingId === item.id}
                      onClick={(e) => handleDelete(e, item.id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 bg-surface-container-lowest dark:bg-surface-container flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant dark:border-border-muted">
        <p className="text-label-sm text-outline">
          {t('pagination.showing', { count: items.length, total })}
        </p>
        <div className="flex items-center gap-1">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant dark:border-border-muted text-on-surface-variant dark:text-outline hover:bg-surface-container dark:hover:bg-surface transition-colors disabled:opacity-40"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          <span className="px-3 text-label-sm text-outline">{page} / {lastPage}</span>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant dark:border-border-muted text-on-surface-variant dark:text-outline hover:bg-surface-container dark:hover:bg-surface transition-colors disabled:opacity-40"
            disabled={page >= lastPage}
            onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
          >
            {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  )
}
