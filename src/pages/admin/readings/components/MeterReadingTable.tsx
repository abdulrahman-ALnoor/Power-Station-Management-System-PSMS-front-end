import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, Edit2, Trash2, CheckCircle2, XCircle, Clock, SearchX, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import {
  fetchReadingList,
  mapMeterReading,
  deleteReading,
  updateReading,
} from '@/services/meterReadings.service'
import type { MeterReading, ReadingStatus } from '../types'

interface MeterReadingTableProps {
  onViewDetails: (reading: MeterReading) => void
  onEdit: (reading: MeterReading) => void
  search?: string
  status?: string
  thisMonthOnly?: boolean
  refreshKey?: number
  onChanged?: () => void
}

export function MeterReadingTable({
  onViewDetails,
  onEdit,
  search,
  status,
  thisMonthOnly,
  refreshKey,
  onChanged,
}: MeterReadingTableProps) {
  const { t } = useTranslation('readings')
  const { isRTL } = useLanguage()

  const [items, setItems] = useState<MeterReading[]>([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)

  useEffect(() => {
    setPage(1)
  }, [search, status, thisMonthOnly])

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    const now = new Date()
    fetchReadingList({
      page,
      search: search || undefined,
      status: (status as ReadingStatus) || undefined,
      year: thisMonthOnly ? now.getFullYear() : undefined,
      month: thisMonthOnly ? now.getMonth() + 1 : undefined,
    })
      .then((res) => {
        if (cancelled) return
        setItems(res.data.map(mapMeterReading))
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
  }, [page, search, status, thisMonthOnly, refreshKey, t])

  const formatNumber = (val: number) => new Intl.NumberFormat('en-US').format(val)
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'YER' }).format(val)

  const handleDelete = async (reading: MeterReading) => {
    if (!window.confirm(t('deleteConfirm'))) return
    setBusyId(reading.id)
    try {
      await deleteReading(reading.id)
      setItems((prev) => prev.filter((it) => it.id !== reading.id))
      onChanged?.()
    } catch {
      window.alert(t('errors.deleteFailed'))
    } finally {
      setBusyId(null)
    }
  }

  const handleSetStatus = async (reading: MeterReading, nextStatus: ReadingStatus) => {
    setBusyId(reading.id)
    try {
      await updateReading(reading.id, {
        current_reading: reading.current_reading,
        reading_date: reading.reading_date,
        reading_method: reading.reading_method ?? undefined,
        notes: reading.notes,
        status: nextStatus,
      })
      setItems((prev) => prev.map((it) => (it.id === reading.id ? { ...it, status: nextStatus } : it)))
      onChanged?.()
    } catch {
      window.alert(t('errors.saveFailed'))
    } finally {
      setBusyId(null)
    }
  }

  const getStatusBadge = (readingStatus: MeterReading['status']) => {
    switch (readingStatus) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-success/10 text-success">
            <CheckCircle2 size={12} />
            {t('status.approved')}
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-error/10 text-error">
            <XCircle size={12} />
            {t('status.rejected')}
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-warning/10 text-warning dark:bg-amber-500/10 dark:text-amber-500">
            <Clock size={12} />
            {t('status.pending')}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-outline/10 text-outline">
            {t('status.unspecified')}
          </span>
        )
    }
  }

  const getMethodText = (method: MeterReading['reading_method']) => {
    switch (method) {
      case 'manual': return t('method.manual')
      case 'qr_scan': return t('method.qr_scan')
      default: return t('method.unspecified')
    }
  }

  if (!isLoading && !error && items.length === 0) {
    return (
      <div className="bg-surface-white dark:bg-surface-container-low rounded-2xl shadow-sm border border-outline/10 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-surface-variant dark:bg-surface-container flex items-center justify-center text-outline/50 mb-4">
          <SearchX size={32} />
        </div>
        <h3 className="font-headline-sm font-bold text-on-surface dark:text-on-dark mb-1">
          {t('table.emptyState.title')}
        </h3>
        <p className="text-label-md text-outline dark:text-outline/70">
          {t('table.emptyState.description')}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-surface-white dark:bg-surface-container-low rounded-2xl shadow-sm border border-outline/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-start" dir={isRTL ? 'rtl' : 'ltr'}>
          <thead className="bg-surface-container-lowest dark:bg-surface-container/30 text-outline dark:text-outline/80 font-label-md font-bold uppercase tracking-wider border-b border-outline/10">
            <tr>
              <th className="px-6 py-4 text-start">{t('table.columns.readingId')}</th>
              <th className="px-6 py-4 text-start">{t('table.columns.meterNumber')}</th>
              <th className="px-6 py-4 text-start">{t('table.columns.customer')}</th>
              <th className="px-6 py-4 text-start whitespace-nowrap">{t('table.columns.previousReading')}</th>
              <th className="px-6 py-4 text-start whitespace-nowrap">{t('table.columns.currentReading')}</th>
              <th className="px-6 py-4 text-start">{t('table.columns.consumption')}</th>
              <th className="px-6 py-4 text-start">{t('table.columns.readingCost')}</th>
              <th className="px-6 py-4 text-start">{t('table.columns.readingDate')}</th>
              <th className="px-6 py-4 text-start">{t('table.columns.status')}</th>
              <th className="px-6 py-4 text-center">{t('table.columns.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline/10">
            {isLoading && (
              <tr><td colSpan={10} className="px-6 py-10 text-center text-outline">{t('loading')}</td></tr>
            )}
            {!isLoading && error && (
              <tr><td colSpan={10} className="px-6 py-10 text-center text-error">{error}</td></tr>
            )}
            {!isLoading && !error && items.map((reading) => (
              <tr
                key={reading.id}
                className="hover:bg-surface-container-lowest dark:hover:bg-surface-container/20 transition-colors group"
              >
                <td className="px-6 py-4 text-on-surface-variant dark:text-outline">
                  #{reading.id}
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-on-surface dark:text-on-dark">
                    {reading.meter?.meter_number || reading.meter_id}
                  </div>
                  <div className="text-xs text-outline dark:text-outline/60 mt-0.5">
                    {getMethodText(reading.reading_method)}
                  </div>
                </td>
                <td className="px-6 py-4 text-on-surface-variant dark:text-outline max-w-[160px] truncate" title={reading.meter?.customerName || undefined}>
                  {reading.meter?.customerName || '-'}
                </td>
                <td className="px-6 py-4 text-on-surface-variant dark:text-outline" dir="ltr">
                  {formatNumber(reading.previous_reading)}
                </td>
                <td className="px-6 py-4 font-medium text-on-surface dark:text-on-dark" dir="ltr">
                  {formatNumber(reading.current_reading)}
                </td>
                <td className="px-6 py-4 font-bold text-accent dark:text-accent-amber" dir="ltr">
                  {formatNumber(reading.consumption)}
                </td>
                <td className="px-6 py-4 font-bold text-teal-600 dark:text-teal-400" dir="ltr">
                  {formatCurrency(reading.reading_cost)}
                </td>
                <td className="px-6 py-4 text-on-surface-variant dark:text-outline whitespace-nowrap" dir="ltr">
                  {reading.reading_date}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(reading.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => onViewDetails(reading)}
                      className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-primary/10 transition-colors"
                      title={t('actions.viewDetails')}
                    >
                      <Eye size={17} />
                    </button>
                    <button
                      onClick={() => onEdit(reading)}
                      className="p-1.5 rounded-lg text-outline hover:text-amber-600 hover:bg-amber-500/10 transition-colors"
                      title={t('actions.edit')}
                    >
                      <Edit2 size={17} />
                    </button>
                    {reading.status !== 'approved' && (
                      <button
                        disabled={busyId === reading.id}
                        onClick={() => handleSetStatus(reading, 'approved')}
                        className="p-1.5 rounded-lg text-outline hover:text-success hover:bg-success/10 transition-colors disabled:opacity-50"
                        title={t('actions.approve')}
                      >
                        <CheckCircle2 size={17} />
                      </button>
                    )}
                    {reading.status !== 'rejected' && (
                      <button
                        disabled={busyId === reading.id}
                        onClick={() => handleSetStatus(reading, 'rejected')}
                        className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error/10 transition-colors disabled:opacity-50"
                        title={t('actions.reject')}
                      >
                        <XCircle size={17} />
                      </button>
                    )}
                    <button
                      disabled={busyId === reading.id}
                      onClick={() => handleDelete(reading)}
                      className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error/10 transition-colors disabled:opacity-50"
                      title={t('actions.delete')}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && !error && (
        <div className="p-4 border-t border-outline/10 flex flex-wrap justify-between items-center gap-4 bg-surface-container-lowest dark:bg-surface-container/30">
          <span className="text-label-sm text-outline dark:text-outline/70">
            {t('pagination.showing', { count: items.length, total })}
          </span>
          <div className="flex items-center gap-1">
            <button
              className="p-2 rounded-lg text-outline hover:bg-surface-container-low disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <span className="px-3 text-label-sm text-outline">{page} / {lastPage}</span>
            <button
              className="p-2 rounded-lg text-outline hover:bg-surface-container-low disabled:opacity-50"
              disabled={page >= lastPage}
              onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
            >
              {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
