import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  SearchX,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import { useLanguage } from '@/hooks/useLanguage'

import {
  fetchReadingList,
  mapMeterReading,
  deleteReading,
  updateReading,
} from '@/services/meterReadings.service'

import {
  showSuccess,
  showError,
  showConfirm,
} from '@/utils/toast'

import type {
  MeterReading,
  ReadingStatus,
} from '../types'

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
      year: thisMonthOnly
        ? now.getFullYear()
        : undefined,
      month: thisMonthOnly
        ? now.getMonth() + 1
        : undefined,
    })
      .then((res) => {
        if (cancelled) return

        setItems(
          res.data.map(mapMeterReading),
        )

        setLastPage(res.last_page)
        setTotal(res.total)
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            t('errors.loadFailed'),
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
  }, [
    page,
    search,
    status,
    thisMonthOnly,
    refreshKey,
    t,
  ])

  const formatNumber = (
    val: number,
  ) =>
    new Intl.NumberFormat(
      'en-US',
    ).format(val)

  const formatCurrency = (
    val: number,
  ) =>
    new Intl.NumberFormat(
      'en-US',
      {
        style: 'currency',
        currency: 'YER',
      },
    ).format(val)

  // ==========================================
  // حذف القراءة
  // ==========================================

  const handleDelete = (
    reading: MeterReading,
  ) => {
    showConfirm(
      'هل أنت متأكد من حذف قراءة العداد؟ لا يمكن التراجع عن هذه العملية.',

      async () => {
        setBusyId(reading.id)

        try {
          await deleteReading(
            reading.id,
          )

          setItems((prev) =>
            prev.filter(
              (it) =>
                it.id !== reading.id,
            ),
          )

          onChanged?.()

          showSuccess(
            'تم حذف قراءة العداد بنجاح.',
            'تم الحذف بنجاح',
          )
        } catch {
          showError(
            'تعذر حذف قراءة العداد. يرجى المحاولة مرة أخرى.',
            'فشل الحذف',
          )
        } finally {
          setBusyId(null)
        }
      },

      'تأكيد الحذف',
    )
  }

  // ==========================================
  // اعتماد أو رفض القراءة
  // ==========================================

const handleSetStatus = (
  reading: MeterReading,
  nextStatus: ReadingStatus,
) => {
  const isApprove =
    nextStatus === 'approved'

  const confirmTitle = isApprove
    ? 'تأكيد اعتماد القراءة'
    : 'تأكيد رفض القراءة'

  const confirmMessage = isApprove
    ? 'هل أنت متأكد من اعتماد قراءة العداد هذه؟'
    : 'هل أنت متأكد من رفض قراءة العداد هذه؟'

  const successTitle = isApprove
    ? 'تم الاعتماد بنجاح'
    : 'تم الرفض بنجاح'

  const successMessage = isApprove
    ? 'تم اعتماد قراءة العداد بنجاح.'
    : 'تم رفض قراءة العداد بنجاح.'

  showConfirm(
    confirmMessage,

    async () => {
      setBusyId(reading.id)

      try {
        await updateReading(
          reading.id,
          {
            status: nextStatus,
          },
        )

        setItems((prev) =>
          prev.map((item) =>
            item.id === reading.id
              ? {
                  ...item,
                  status: nextStatus,
                }
              : item,
          ),
        )

        onChanged?.()

        showSuccess(
          successMessage,
          successTitle,
        )
      } catch {
        showError(
          'تعذر تنفيذ العملية. يرجى المحاولة مرة أخرى.',
          'فشلت العملية',
        )
      } finally {
        setBusyId(null)
      }
    },

    confirmTitle,

    isApprove
      ? 'اعتماد'
      : 'رفض',

    isApprove
      ? 'bg-primary hover:bg-primary/90'
      : 'bg-red-600 hover:bg-red-700',
  )
}
  // ==========================================
  // حالة القراءة
  // ==========================================

  const getStatusBadge = (
    readingStatus: MeterReading['status'],
  ) => {
    switch (readingStatus) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-bold text-success">
            <CheckCircle2 size={12} />

            {t('status.approved')}
          </span>
        )

      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-error/10 px-2.5 py-1 text-xs font-bold text-error">
            <XCircle size={12} />

            {t('status.rejected')}
          </span>
        )

      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2.5 py-1 text-xs font-bold text-warning dark:bg-amber-500/10 dark:text-amber-500">
            <Clock size={12} />

            {t('status.pending')}
          </span>
        )

      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-outline/10 px-2.5 py-1 text-xs font-bold text-outline">
            {t('status.unspecified')}
          </span>
        )
    }
  }

  // ==========================================
  // طريقة القراءة
  // ==========================================

  const getMethodText = (
    method: MeterReading['reading_method'],
  ) => {
    switch (method) {
      case 'manual':
        return t('method.manual')

      case 'qr_scan':
        return t('method.qr_scan')

      default:
        return t('method.unspecified')
    }
  }

  // ==========================================
  // حالة عدم وجود بيانات
  // ==========================================

  if (
    !isLoading &&
    !error &&
    items.length === 0
  ) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-outline/10 bg-surface-white p-12 text-center shadow-sm dark:bg-surface-container-low">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-variant text-outline/50 dark:bg-surface-container">
          <SearchX size={32} />
        </div>

        <h3 className="mb-1 font-headline-sm font-bold text-on-surface dark:text-on-dark">
          {t('table.emptyState.title')}
        </h3>

        <p className="text-label-md text-outline dark:text-outline/70">
          {t('table.emptyState.description')}
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-outline/10 bg-surface-white shadow-sm dark:bg-surface-container-low">

      <div className="overflow-x-auto">

        <table
          className="w-full text-sm text-start"
          dir={
            isRTL
              ? 'rtl'
              : 'ltr'
          }
        >
          <thead className="border-b border-outline/10 bg-surface-container-lowest font-label-md font-bold uppercase tracking-wider text-outline dark:bg-surface-container/30 dark:text-outline/80">

            <tr>
              <th className="px-6 py-4 text-start">
                {t('table.columns.readingId')}
              </th>

              <th className="px-6 py-4 text-start">
                {t('table.columns.meterNumber')}
              </th>

              <th className="px-6 py-4 text-start">
                {t('table.columns.customer')}
              </th>

              <th className="whitespace-nowrap px-6 py-4 text-start">
                {t('table.columns.previousReading')}
              </th>

              <th className="whitespace-nowrap px-6 py-4 text-start">
                {t('table.columns.currentReading')}
              </th>

              <th className="px-6 py-4 text-start">
                {t('table.columns.consumption')}
              </th>

              <th className="px-6 py-4 text-start">
                {t('table.columns.readingCost')}
              </th>

              <th className="px-6 py-4 text-start">
                {t('table.columns.readingDate')}
              </th>

              <th className="px-6 py-4 text-start">
                {t('table.columns.status')}
              </th>

              <th className="px-6 py-4 text-center">
                {t('table.columns.actions')}
              </th>
            </tr>

          </thead>

          <tbody className="divide-y divide-outline/10">

            {isLoading && (
              <tr>
                <td
                  colSpan={10}
                  className="px-6 py-10 text-center text-outline"
                >
                  {t('loading')}
                </td>
              </tr>
            )}

            {!isLoading &&
              error && (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-10 text-center text-error"
                  >
                    {error}
                  </td>
                </tr>
              )}

            {!isLoading &&
              !error &&
              items.map(
                (reading) => (
                  <tr
                    key={reading.id}
                    className="group transition-colors hover:bg-surface-container-lowest dark:hover:bg-surface-container/20"
                  >
                    <td className="px-6 py-4 text-on-surface-variant dark:text-outline">
                      #{reading.id}
                    </td>

                    <td className="px-6 py-4">

                      <div className="font-bold text-on-surface dark:text-on-dark">
                        {reading.meter?.meter_number ||
                          reading.meter_id}
                      </div>

                      <div className="mt-0.5 text-xs text-outline dark:text-outline/60">
                        {getMethodText(
                          reading.reading_method,
                        )}
                      </div>

                    </td>

                    <td
                      className="max-w-[160px] truncate px-6 py-4 text-on-surface-variant dark:text-outline"
                      title={
                        reading.meter
                          ?.customerName ||
                        undefined
                      }
                    >
                      {reading.meter
                        ?.customerName ||
                        '-'}
                    </td>

                    <td
                      className="px-6 py-4 text-on-surface-variant dark:text-outline"
                      dir="ltr"
                    >
                      {formatNumber(
                        reading.previous_reading,
                      )}
                    </td>

                    <td
                      className="px-6 py-4 font-medium text-on-surface dark:text-on-dark"
                      dir="ltr"
                    >
                      {formatNumber(
                        reading.current_reading,
                      )}
                    </td>

                    <td
                      className="px-6 py-4 font-bold text-accent dark:text-accent-amber"
                      dir="ltr"
                    >
                      {formatNumber(
                        reading.consumption,
                      )}
                    </td>

                    <td
                      className="px-6 py-4 font-bold text-teal-600 dark:text-teal-400"
                      dir="ltr"
                    >
                      {formatCurrency(
                        reading.reading_cost,
                      )}
                    </td>

                    <td
                      className="whitespace-nowrap px-6 py-4 text-on-surface-variant dark:text-outline"
                      dir="ltr"
                    >
                      {reading.reading_date}
                    </td>

                    <td className="px-6 py-4">
                      {getStatusBadge(
                        reading.status,
                      )}
                    </td>

                    {/* الإجراءات */}

                    <td className="px-6 py-4">

                      <div className="flex items-center justify-center gap-1.5">

                        {/* عرض التفاصيل */}

                        <button
                          type="button"
                          onClick={() =>
                            onViewDetails(
                              reading,
                            )
                          }
                          className="rounded-lg p-1.5 text-outline transition-colors hover:bg-primary/10 hover:text-primary"
                          title={t(
                            'actions.viewDetails',
                          )}
                        >
                          <Eye size={17} />
                        </button>

                        {/* تعديل */}

                        <button
                          type="button"
                          onClick={() =>
                            onEdit(
                              reading,
                            )
                          }
                          className="rounded-lg p-1.5 text-outline transition-colors hover:bg-amber-500/10 hover:text-amber-600"
                          title={t(
                            'actions.edit',
                          )}
                        >
                          <Edit2 size={17} />
                        </button>

                        {/* اعتماد */}

                        {reading.status !==
                          'approved' && (
                          <button
                            type="button"
                            disabled={
                              busyId ===
                              reading.id
                            }
                            onClick={() =>
                              handleSetStatus(
                                reading,
                                'approved',
                              )
                            }
                            className="rounded-lg p-1.5 text-outline transition-colors hover:bg-success/10 hover:text-success disabled:opacity-50"
                            title={t(
                              'actions.approve',
                            )}
                          >
                            <CheckCircle2
                              size={17}
                            />
                          </button>
                        )}

                        {/* رفض */}

                        {reading.status !==
                          'rejected' && (
                          <button
                            type="button"
                            disabled={
                              busyId ===
                              reading.id
                            }
                            onClick={() =>
                              handleSetStatus(
                                reading,
                                'rejected',
                              )
                            }
                            className="rounded-lg p-1.5 text-outline transition-colors hover:bg-error/10 hover:text-error disabled:opacity-50"
                            title={t(
                              'actions.reject',
                            )}
                          >
                            <XCircle
                              size={17}
                            />
                          </button>
                        )}

                        {/* حذف */}

                        <button
                          type="button"
                          disabled={
                            busyId ===
                            reading.id
                          }
                          onClick={() =>
                            handleDelete(
                              reading,
                            )
                          }
                          className="rounded-lg p-1.5 text-outline transition-colors hover:bg-error/10 hover:text-error disabled:opacity-50"
                          title={t(
                            'actions.delete',
                          )}
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

                    </td>

                  </tr>
                ),
              )}

          </tbody>

        </table>

      </div>

      {/* Pagination */}

      {!isLoading &&
        !error && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-outline/10 bg-surface-container-lowest p-4 dark:bg-surface-container/30">

            <span className="text-label-sm text-outline dark:text-outline/70">
              {t(
                'pagination.showing',
                {
                  count:
                    items.length,
                  total,
                },
              )}
            </span>

            <div className="flex items-center gap-1">

              <button
                type="button"
                className="rounded-lg p-2 text-outline hover:bg-surface-container-low disabled:opacity-50"
                disabled={
                  page <= 1
                }
                onClick={() =>
                  setPage((p) =>
                    Math.max(
                      1,
                      p - 1,
                    ),
                  )
                }
              >
                {isRTL
                  ? (
                    <ChevronRight
                      size={18}
                    />
                  )
                  : (
                    <ChevronLeft
                      size={18}
                    />
                  )}
              </button>

              <span className="px-3 text-label-sm text-outline">
                {page} / {lastPage}
              </span>

              <button
                type="button"
                className="rounded-lg p-2 text-outline hover:bg-surface-container-low disabled:opacity-50"
                disabled={
                  page >= lastPage
                }
                onClick={() =>
                  setPage((p) =>
                    Math.min(
                      lastPage,
                      p + 1,
                    ),
                  )
                }
              >
                {isRTL
                  ? (
                    <ChevronLeft
                      size={18}
                    />
                  )
                  : (
                    <ChevronRight
                      size={18}
                    />
                  )}
              </button>

            </div>

          </div>
        )}

    </div>
  )
}