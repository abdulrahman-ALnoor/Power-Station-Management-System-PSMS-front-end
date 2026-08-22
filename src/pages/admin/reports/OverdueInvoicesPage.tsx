import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import {
  ArrowRight,
  Search,
  Clock,
  FileWarning,
  Wallet,
  Loader2,
} from 'lucide-react'

import { useLanguage } from '@/hooks/useLanguage'
import { formatCurrency } from '@/utils/currency'

import {
  fetchOverdueInvoices,
  type OverdueInvoice,
  type OverdueInvoicesResponse,
} from '@/services/invoices.service'

export function OverdueInvoicesPage() {
  const { isRTL } = useLanguage()

  const navigate = useNavigate()

  const [invoices, setInvoices] = useState<
    OverdueInvoice[]
  >([])

  const [pagination, setPagination] =
    useState<OverdueInvoicesResponse>({
      data: [],
      current_page: 1,
      last_page: 1,
      total: 0,
    })

  const [isLoading, setIsLoading] =
    useState(true)

  const [search, setSearch] =
    useState('')

  const loadOverdueInvoices = async (
    page = 1,
    searchValue = search,
  ) => {
    try {
      setIsLoading(true)

      const response =
        await fetchOverdueInvoices({
          page,
          per_page: 10,
          search: searchValue || undefined,
        })

      setInvoices(response.data)

      setPagination(response)
    } catch (error) {
      console.error(
        'Failed to load overdue invoices:',
        error,
      )

      setInvoices([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadOverdueInvoices()
  }, [])

  // =========================
  // البحث
  // =========================
  const handleSearch = (
    value: string,
  ) => {
    setSearch(value)

    void loadOverdueInvoices(
      1,
      value,
    )
  }

  const totalRemaining = invoices.reduce(
    (total, invoice) =>
      total +
      Number(
        invoice.remaining_balance ?? 0,
      ),
    0,
  )

  const totalPaid = invoices.reduce(
    (total, invoice) =>
      total +
      Number(
        invoice.paid_amount ?? 0,
      ),
    0,
  )

  if (isLoading && invoices.length === 0) {
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
            الفواتير المتأخرة
          </h1>

          <p className="text-on-surface-variant mt-2">
            عرض جميع الفواتير التي تحتوي على مبالغ متبقية
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* عدد الفواتير */}
        <StatsCard
          title="عدد الفواتير المتأخرة"
          value={String(pagination.total)}
          icon={
            <FileWarning size={26} />
          }
          color="error"
        />

        {/* إجمالي المتبقي */}
        <StatsCard
          title="إجمالي المبالغ المتبقية"
          value={formatCurrency(
            totalRemaining,
            isRTL,
          )}
          icon={
            <Clock size={26} />
          }
          color="warning"
        />

        {/* إجمالي المدفوع */}
        <StatsCard
          title="إجمالي المبالغ المدفوعة"
          value={formatCurrency(
            totalPaid,
            isRTL,
          )}
          icon={
            <Wallet size={26} />
          }
          color="success"
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
          جدول الفواتير
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
                  إجمالي الفاتورة
                </th>

                <th className="text-start px-6 py-4 text-sm font-bold">
                  المدفوع
                </th>

                <th className="text-start px-6 py-4 text-sm font-bold">
                  المتبقي
                </th>

                <th className="text-start px-6 py-4 text-sm font-bold">
                  الحالة
                </th>

              </tr>

            </thead>

            <tbody>

              {invoices.length === 0 ? (

                <tr>

                  <td
                    colSpan={6}
                    className="text-center py-12 text-outline"
                  >
                    لا توجد فواتير متأخرة
                  </td>

                </tr>

              ) : (

                invoices.map(
                  (invoice) => (
                    <InvoiceRow
                      key={invoice.id}
                      invoice={invoice}
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
        {pagination.last_page > 1 && (

          <div className="flex items-center justify-center gap-2 p-5 border-t border-outline-variant dark:border-border-muted">

            <button
              type="button"
              disabled={
                pagination.current_page <= 1
              }
              onClick={() =>
                loadOverdueInvoices(
                  pagination.current_page - 1,
                  search,
                )
              }
              className="px-4 py-2 rounded-lg border border-outline-variant disabled:opacity-50"
            >
              السابق
            </button>

            <span className="text-sm text-outline px-3">

              صفحة{' '}

              {pagination.current_page}

              {' من '}

              {pagination.last_page}

            </span>

            <button
              type="button"
              disabled={
                pagination.current_page >=
                pagination.last_page
              }
              onClick={() =>
                loadOverdueInvoices(
                  pagination.current_page + 1,
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

/* ============================================================
   صف الفاتورة
============================================================ */

interface InvoiceRowProps {
  invoice: OverdueInvoice
  isRTL: boolean
}

function InvoiceRow({
  invoice,
  isRTL,
}: InvoiceRowProps) {

  const totalAmount = Number(
    invoice.consumption_charge?.total_amount ?? 0,
  )

  const paidAmount = Number(
    invoice.paid_amount ?? 0,
  )

  const remainingAmount = Number(
    invoice.remaining_balance ?? 0,
  )

  return (
    <tr className="border-b border-outline-variant/50 dark:border-border-muted/50 hover:bg-surface-container-lowest dark:hover:bg-surface transition-colors">

      <td className="px-6 py-4 font-medium">
        {invoice.invoice_number}
      </td>

      <td className="px-6 py-4">
        {invoice.customer?.full_name ??
          'غير معروف'}
      </td>

      <td className="px-6 py-4">
        {formatCurrency(
          totalAmount,
          isRTL,
        )}
      </td>

      <td className="px-6 py-4">
        {formatCurrency(
          paidAmount,
          isRTL,
        )}
      </td>

      <td className="px-6 py-4 font-bold text-error">
        {formatCurrency(
          remainingAmount,
          isRTL,
        )}
      </td>

      <td className="px-6 py-4">

        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">

          مدفوعة جزئيًا

        </span>

      </td>

    </tr>
  )
}

/* ============================================================
   بطاقة الإحصائيات
============================================================ */

interface StatsCardProps {
  title: string
  value: string
  icon: React.ReactNode
  color:
    | 'error'
    | 'warning'
    | 'success'
}

function StatsCard({
  title,
  value,
  icon,
  color,
}: StatsCardProps) {

  const colorClasses = {
    error:
      'bg-error/10 text-error',

    warning:
      'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',

    success:
      'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
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