import { useEffect, useState } from 'react'

import {
  ArrowRight,
  Search,
  Wallet,
  CheckCircle2,
  Clock,
  ReceiptText,
  Loader2,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import {
  fetchCollectionsReport,
  type CollectionRecord,
  type CollectionsReportResponse,
} from '@/services/invoices.service'

import { formatCurrency } from '@/utils/currency'
import { useLanguage } from '@/hooks/useLanguage'

export function CollectionsReportPage() {
  const { isRTL } = useLanguage()

  const navigate = useNavigate()

  const [collections, setCollections] = useState<
    CollectionRecord[]
  >([])

  const [report, setReport] =
    useState<CollectionsReportResponse | null>(
      null,
    )

  const [isLoading, setIsLoading] =
    useState(true)

  const [search, setSearch] =
    useState('')

  const loadCollections = async (
    page = 1,
    searchValue = search,
  ) => {
    try {
      setIsLoading(true)

      const response =
        await fetchCollectionsReport({
          page,
          per_page: 10,
          search:
            searchValue.trim() || undefined,
        })

      setCollections(
        response.collections.data,
      )

      setReport(response)
    } catch (error) {
      console.error(
        'Failed to load collections:',
        error,
      )

      setCollections([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadCollections(1, '')
  }, [])

  // =========================
  // البحث
  // =========================
  const handleSearch = (
    value: string,
  ) => {
    setSearch(value)

    void loadCollections(
      1,
      value,
    )
  }

  const stats = report?.stats

  if (
    isLoading &&
    collections.length === 0
  ) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2
          className="animate-spin text-primary"
          size={36}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* =========================
          رأس الصفحة
      ========================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-on-surface dark:text-on-dark">
            التحصيلات
          </h1>

          <p className="text-on-surface-variant mt-2">
            عرض جميع الفواتير التي تم تحصيل مبالغ منها
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-outline-variant hover:bg-surface-container transition-colors"
        >
          <ArrowRight
            size={20}
            className={
              isRTL
                ? ''
                : 'rotate-180'
            }
          />

          <span>
            رجوع
          </span>
        </button>
      </div>

      {/* =========================
          الإحصائيات
      ========================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatsCard
          title="إجمالي التحصيلات"
          value={formatCurrency(
            Number(
              stats?.total_collected ?? 0,
            ),
            isRTL,
          )}
          icon={
            <Wallet size={26} />
          }
          color="success"
        />

        <StatsCard
          title="عدد التحصيلات"
          value={String(
            stats?.collections_count ?? 0,
          )}
          icon={
            <ReceiptText size={26} />
          }
          color="primary"
        />

        <StatsCard
          title="مدفوعة بالكامل"
          value={String(
            stats?.fully_paid_count ?? 0,
          )}
          icon={
            <CheckCircle2 size={26} />
          }
          color="success"
        />

        <StatsCard
          title="مدفوعة جزئيًا"
          value={String(
            stats?.partially_paid_count ?? 0,
          )}
          icon={
            <Clock size={26} />
          }
          color="warning"
        />

      </div>

      {/* =========================
          البحث
      ========================= */}
      <div className="bg-surface-white dark:bg-surface-container-low p-5 rounded-2xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)]">

        <div className="relative w-full">

          <Search
            size={20}
            className="absolute inset-inline-start-4 top-1/2 -translate-y-1/2 text-outline"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              handleSearch(
                event.target.value,
              )
            }
            placeholder="ابحث باسم العميل أو رقم الفاتورة..."
            className="w-full h-12 ps-12 pe-4 rounded-xl border border-outline-variant dark:border-border-muted bg-surface-container-lowest dark:bg-surface text-on-surface dark:text-on-dark focus:outline-none focus:ring-1 focus:ring-primary"
          />

        </div>
      </div>

      {/* =========================
          جدول التحصيلات
      ========================= */}
      <div className="bg-surface-white dark:bg-surface-container-low rounded-2xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-surface-container-lowest dark:bg-surface">

              <tr className="border-b border-outline-variant dark:border-border-muted">

                <th className="text-start px-6 py-4 text-sm font-bold">
                  رقم الفاتورة
                </th>

                <th className="text-start px-6 py-4 text-sm font-bold">
                  العميل
                </th>

                <th className="text-start px-6 py-4 text-sm font-bold">
                  المبلغ المحصل
                </th>

                <th className="text-start px-6 py-4 text-sm font-bold">
                  المبلغ المتبقي
                </th>

                <th className="text-start px-6 py-4 text-sm font-bold">
                  الحالة
                </th>

                <th className="text-start px-6 py-4 text-sm font-bold">
                  التاريخ
                </th>

              </tr>

            </thead>

            <tbody>

              {collections.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 text-outline"
                  >
                    لا توجد تحصيلات
                  </td>
                </tr>
              ) : (
                collections.map(
                  (collection) => (
                    <CollectionRow
                      key={collection.id}
                      collection={collection}
                      isRTL={isRTL}
                    />
                  ),
                )
              )}

            </tbody>

          </table>

        </div>

        {/* =========================
            Pagination
        ========================= */}
        {report &&
          report.collections.last_page > 1 && (

            <div className="flex items-center justify-center gap-2 p-5 border-t border-outline-variant dark:border-border-muted">

              <button
                type="button"
                disabled={
                  report.collections.current_page <=
                  1
                }
                onClick={() =>
                  loadCollections(
                    report.collections
                      .current_page - 1,
                    search,
                  )
                }
                className="px-4 py-2 rounded-lg border border-outline-variant disabled:opacity-50"
              >
                السابق
              </button>

              <span className="text-sm text-outline px-3">
                صفحة{' '}
                {
                  report.collections
                    .current_page
                }
                {' من '}
                {
                  report.collections
                    .last_page
                }
              </span>

              <button
                type="button"
                disabled={
                  report.collections.current_page >=
                  report.collections.last_page
                }
                onClick={() =>
                  loadCollections(
                    report.collections
                      .current_page + 1,
                    search,
                  )
                }
                className="px-4 py-2 rounded-lg border border-outline-variant disabled:opacity-50"
              >
                التالي
              </button>

            </div>
          )}

      </div>

    </div>
  )
}


// ============================================================
// Collection Row
// ============================================================

interface CollectionRowProps {
  collection: CollectionRecord
  isRTL: boolean
}

function CollectionRow({
  collection,
  isRTL,
}: CollectionRowProps) {

  const paidAmount = Number(
    collection.paid_amount ?? 0,
  )

  const remainingAmount = Number(
    collection.remaining_balance ?? 0,
  )

  return (
    <tr className="border-b border-outline-variant/50 dark:border-border-muted/50 hover:bg-surface-container-lowest dark:hover:bg-surface transition-colors">

      <td className="px-6 py-4 font-medium">
        {collection.invoice_number}
      </td>

      <td className="px-6 py-4">
        {collection.customer?.name ??
          'غير معروف'}
      </td>

      <td className="px-6 py-4 font-bold text-green-600 dark:text-green-500">
        {formatCurrency(
          paidAmount,
          isRTL,
        )}
      </td>

      <td className="px-6 py-4">
        {formatCurrency(
          remainingAmount,
          isRTL,
        )}
      </td>

      <td className="px-6 py-4">

        <span
          className={
            collection.status === 'paid'
              ? 'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
          }
        >
          {collection.status === 'paid'
            ? 'مدفوعة بالكامل'
            : 'مدفوعة جزئيًا'}
        </span>

      </td>

      <td className="px-6 py-4 text-outline">
        {new Date(
          collection.created_at,
        ).toLocaleDateString(
          isRTL
            ? 'ar-YE'
            : 'en-US',
        )}
      </td>

    </tr>
  )
}


// ============================================================
// Stats Card
// ============================================================

interface StatsCardProps {
  title: string
  value: string
  icon: React.ReactNode
  color:
    | 'primary'
    | 'success'
    | 'warning'
}

function StatsCard({
  title,
  value,
  icon,
  color,
}: StatsCardProps) {

  const colorClasses = {
    primary:
      'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-fixed',

    success:
      'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',

    warning:
      'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  }

  return (
    <div className="bg-surface-white dark:bg-surface-container-low rounded-2xl p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.05)]">

      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${colorClasses[color]}`}
      >
        {icon}
      </div>

      <p className="text-sm text-on-surface-variant mb-2">
        {title}
      </p>

      <h2 className="text-2xl font-bold text-on-surface dark:text-on-dark">
        {value}
      </h2>

    </div>
  )
}