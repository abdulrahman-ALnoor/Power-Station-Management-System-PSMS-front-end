import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, Edit2, Trash2, ChevronLeft, ChevronRight, QrCode } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'
import { fetchMeterList, mapMeter, deleteMeter } from '@/services/meters.service'
import type { Meter, MeterStatus } from '../types'

interface MeterTableProps {
  onRowClick: (id: number) => void
  onEditClick?: (id: number) => void
  search?: string
  status?: string
  refreshKey?: number
  onDeleted?: () => void
}

export function MeterTable({ onRowClick, onEditClick, search, status, refreshKey, onDeleted }: MeterTableProps) {
  const { t } = useTranslation('meters')
  const { isRTL } = useLanguage()

  const [items, setItems] = useState<Meter[]>([])
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
    fetchMeterList({
      page,
      search: search || undefined,
      status: (status as MeterStatus) || undefined,
    })
      .then((res) => {
        if (cancelled) return
        setItems(res.data.map(mapMeter))
        setLastPage(res.last_page)
        setTotal(res.total)
      })
      .catch(() => {
        if (!cancelled) setError(t('errors.loadFailed'))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => { cancelled = true }
  }, [page, search, status, refreshKey, t])

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    if (!window.confirm(t('deleteConfirm'))) return
    setDeletingId(id)
    try {
      await deleteMeter(id)
      setItems((prev) => prev.filter((it) => it.id !== id))
      onDeleted?.()
    } catch {
      window.alert(t('errors.deleteFailed'))
    } finally {
      setDeletingId(null)
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'maintenance': return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'damaged': return 'bg-error/10 text-error dark:bg-error/20 dark:text-red-400'
      case 'disconnected': return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      default: return 'bg-surface-dim text-on-surface-variant'
    }
  }

 const getStatusIndicator = (status: string) => {
 switch (status) {
 case 'active': return 'bg-green-600'
 case 'maintenance': return 'bg-blue-600'
 case 'damaged': return 'bg-error'
 case 'disconnected': return 'bg-amber-600'
 default: return 'bg-outline'
 }
 }

  return (
    <div className="bg-surface-white dark:bg-surface-container-low rounded-b-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-start border-collapse">
          <thead>
            <tr className="bg-surface-container-low dark:bg-surface-container border-b border-surface-container-high dark:border-border-muted">
              <th className="px-6 py-4 font-headline-md text-[14px] text-on-surface-variant dark:text-outline uppercase tracking-wider text-start">{t('table.meterNumber')}</th>
              <th className="px-6 py-4 font-headline-md text-[14px] text-on-surface-variant dark:text-outline uppercase tracking-wider text-start">{t('table.customer')}</th>
              <th className="px-6 py-4 font-headline-md text-[14px] text-on-surface-variant dark:text-outline uppercase tracking-wider text-start">{t('table.installationDate')}</th>
              <th className="px-6 py-4 font-headline-md text-[14px] text-on-surface-variant dark:text-outline uppercase tracking-wider text-start">{t('table.installationLocation')}</th>
              <th className="px-6 py-4 font-headline-md text-[14px] text-on-surface-variant dark:text-outline uppercase tracking-wider text-start">{t('table.status')}</th>
              <th className="px-6 py-4 font-headline-md text-[14px] text-on-surface-variant dark:text-outline uppercase tracking-wider text-start">{t('table.installedBy')}</th>
              <th className="px-6 py-4 font-headline-md text-[14px] text-on-surface-variant dark:text-outline uppercase tracking-wider text-center">{t('table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high dark:divide-border-muted">
            {isLoading && (
              <tr><td colSpan={7} className="px-6 py-10 text-center text-on-surface-variant dark:text-outline">{t('loading')}</td></tr>
            )}
            {!isLoading && error && (
              <tr><td colSpan={7} className="px-6 py-10 text-center text-error">{error}</td></tr>
            )}
            {!isLoading && !error && items.length === 0 && (
              <tr>
                <td colSpan={7} className="py-24">
                  <div className="flex flex-col items-center justify-center text-center">
                    <h3 className="font-headline-md text-headline-md text-primary dark:text-on-dark mb-2">{t('emptyState.title')}</h3>
                    <p className="text-on-surface-variant dark:text-outline max-w-md">{t('emptyState.description')}</p>
                  </div>
                </td>
              </tr>
            )}
            {!isLoading && !error && items.map((meter) => (
              <tr
                key={meter.id}
                className="hover:bg-surface-container-lowest dark:hover:bg-surface-container/50 transition-colors cursor-pointer group"
                onClick={() => onRowClick(meter.id)}
              >
                <td className="px-6 py-4 font-body-md text-primary dark:text-on-dark font-bold">
                  <div className="flex items-center gap-2">
                    <QrCode size={16} />
                    <span>{meter.meter_number}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-table-cell text-on-surface-variant dark:text-outline max-w-[180px] truncate" title={meter.customerName || undefined}>
                  {meter.customerName || '-'}
                </td>
                <td className="px-6 py-4 font-table-cell text-on-surface-variant dark:text-outline" dir="ltr">{meter.installation_date || '-'}</td>
                <td className="px-6 py-4 font-table-cell text-on-surface-variant dark:text-outline max-w-[200px] truncate" title={meter.installation_location || undefined}>{meter.installation_location || '-'}</td>
                <td className="px-6 py-4 font-table-cell">
                  <span className={cn("px-3 py-1 rounded-full text-label-sm font-semibold flex items-center gap-1 w-fit", getStatusStyle(meter.status || ''))}>
                    <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", getStatusIndicator(meter.status || ''))} />
                    {meter.status ? t(`status.${meter.status}`) : '-'}
                  </span>
                </td>
                <td className="px-6 py-4 font-table-cell text-on-surface-variant dark:text-outline">{meter.installedByName || '-'}</td>
                <td className="px-6 py-4 font-table-cell whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="text-outline hover:text-primary dark:hover:text-primary-fixed transition-colors p-1"
                      title={t('table.view')}
                      onClick={() => onRowClick(meter.id)}
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      className="text-outline hover:text-amber-gold dark:hover:text-amber-500 transition-colors p-1"
                      title={t('table.edit')}
                      onClick={() => onEditClick?.(meter.id)}
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      className="text-outline hover:text-error dark:hover:text-error-container transition-colors p-1 disabled:opacity-50"
                      title={t('table.delete')}
                      disabled={deletingId === meter.id}
                      onClick={(e) => handleDelete(e, meter.id)}
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
      <div className="p-6 border-t border-surface-container-high dark:border-border-muted flex flex-wrap justify-between items-center gap-4 bg-surface-container-lowest dark:bg-surface-container">
        <span className="text-label-sm text-on-surface-variant dark:text-outline">
          {t('pagination.showing', { count: items.length, total })}
        </span>
        <div className="flex items-center gap-1">
          <button
            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50 dark:hover:bg-surface"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          <span className="px-3 text-label-sm text-outline">{page} / {lastPage}</span>
          <button
            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50 dark:hover:bg-surface"
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
