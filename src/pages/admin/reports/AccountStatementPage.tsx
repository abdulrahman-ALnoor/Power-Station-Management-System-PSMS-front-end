import { useEffect, useState } from 'react'
import {
  fetchCustomers,
} from '@/services/customers.service'
import {
  ArrowRight,
  Search,
  FileText,
  Wallet,
  CircleDollarSign,
  User,
  Loader2,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import {
  fetchAccountStatement,
  type AccountStatementResponse,
  type AccountStatementInvoice,
} from '@/services/invoices.service'

import { formatCurrency } from '@/utils/currency'
import { useLanguage } from '@/hooks/useLanguage'

interface CustomerOption {
  id: number
  name: string
}

export function AccountStatementPage() {
  const { isRTL } = useLanguage()

  const navigate = useNavigate()

  const [customers, setCustomers] = useState<
    CustomerOption[]
  >([])

  const [selectedCustomerId, setSelectedCustomerId] =
    useState<number | null>(null)

  const [report, setReport] =
    useState<AccountStatementResponse | null>(
      null,
    )

  const [isLoading, setIsLoading] =
    useState(false)

  const [isCustomersLoading, setIsCustomersLoading] =
    useState(true)

  // ========================================
  // تحميل العملاء
  // ========================================
useEffect(() => {
  const loadCustomers = async () => {
    try {
      const data = await fetchCustomers()

      setCustomers(
        data.map((customer) => ({
          id: customer.id,
          name: customer.full_name,
        })),
      )
    } catch (error) {
      console.error(
        'Failed to load customers:',
        error,
      )

      setCustomers([])
    } finally {
      setIsCustomersLoading(false)
    }
  }

  void loadCustomers()
}, [])

  // ========================================
  // تحميل كشف الحساب
  // ========================================

const loadAccountStatement = async (
  customerId: number,
  page = 1,
) => {
  try {
    console.log(
      'Loading account statement for:',
      customerId,
    )

    setIsLoading(true)

    const response =
      await fetchAccountStatement(
        customerId,
        {
          page,
          per_page: 10,
        },
      )

    console.log(
      'Account statement data:',
      response,
    )

    setReport(response)
  } catch (error) {
    console.error(
      'Failed to load account statement:',
      error,
    )

    setReport(null)
  } finally {
    setIsLoading(false)
  }
}


const handleCustomerChange = (
  customerId: number,
) => {
  console.log(
    'Selected Customer ID:',
    customerId,
  )

  setSelectedCustomerId(customerId)

  if (customerId > 0) {
    void loadAccountStatement(customerId)
  } else {
    setReport(null)
  }
}


const summary = report?.summary
  return (
    <div className="space-y-6">

      {/* =========================
          رأس الصفحة
      ========================= */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-on-surface dark:text-on-dark">
            كشف الحساب
          </h1>

          <p className="text-on-surface-variant mt-2">
            عرض كشف حساب العميل والفواتير والمدفوعات
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
          اختيار العميل
      ========================= */}

      <div className="bg-surface-white dark:bg-surface-container-low p-5 rounded-2xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)]">

        <label className="block text-sm font-bold text-on-surface dark:text-on-dark mb-3">
          اختر العميل
        </label>

        <div className="relative">

          <User
            size={20}
            className="absolute inset-inline-start-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
          />

          <select
            value={
              selectedCustomerId ?? ''
            }
            disabled={isCustomersLoading}
            onChange={(event) =>
              handleCustomerChange(
                Number(
                  event.target.value,
                ),
              )
            }
            className="w-full h-12 ps-12 pe-4 rounded-xl border border-outline-variant dark:border-border-muted bg-surface-container-lowest dark:bg-surface text-on-surface dark:text-on-dark focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">
              {isCustomersLoading
                ? 'جاري تحميل العملاء...'
                : 'اختر العميل لعرض كشف الحساب'}
            </option>

            {customers.map(
              (customer) => (
                <option
                  key={customer.id}
                  value={customer.id}
                >
                  {customer.name}
                </option>
              ),
            )}

          </select>

        </div>

      </div>

      {/* =========================
          العميل المختار
      ========================= */}

      {report?.customer && (

        <div className="bg-primary/10 dark:bg-primary/20 rounded-2xl p-5 flex items-center gap-4">

          <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center">

            <User size={24} />

          </div>

          <div>

            <p className="text-sm text-on-surface-variant">
              العميل
            </p>

            <h2 className="text-xl font-bold text-on-surface dark:text-on-dark">
              {report.customer.name}
            </h2>

          </div>

        </div>

      )}

      {/* =========================
          الإحصائيات
      ========================= */}

      {report && (

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

          <StatsCard
            title="إجمالي الفواتير"
            value={formatCurrency(
              Number(
                summary?.total_invoices ?? 0,
              ),
              isRTL,
            )}
            icon={
              <FileText size={26} />
            }
            color="primary"
          />

          <StatsCard
            title="إجمالي المدفوع"
            value={formatCurrency(
              Number(
                summary?.total_paid ?? 0,
              ),
              isRTL,
            )}
            icon={
              <Wallet size={26} />
            }
            color="success"
          />

          <StatsCard
            title="إجمالي المتبقي"
            value={formatCurrency(
              Number(
                summary?.total_remaining ?? 0,
              ),
              isRTL,
            )}
            icon={
              <CircleDollarSign size={26} />
            }
            color="warning"
          />

        </div>

      )}

      {/* =========================
          حالة التحميل
      ========================= */}

      {isLoading && (

        <div className="min-h-[250px] flex items-center justify-center">

          <Loader2
            className="animate-spin text-primary"
            size={36}
          />

        </div>

      )}

      {/* =========================
          جدول الفواتير
      ========================= */}

      {!isLoading && report && (

        <div className="bg-surface-white dark:bg-surface-container-low rounded-2xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-surface-container-lowest dark:bg-surface">

                <tr className="border-b border-outline-variant dark:border-border-muted">

                  <th className="text-start px-6 py-4 text-sm font-bold">
                    رقم الفاتورة
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

                  <th className="text-start px-6 py-4 text-sm font-bold">
                    التاريخ
                  </th>

                </tr>

              </thead>

              <tbody>

                {report.invoices.data.length === 0 ? (

                  <tr>

                    <td
                      colSpan={6}
                      className="text-center py-12 text-outline"
                    >
                      لا توجد فواتير لهذا العميل
                    </td>

                  </tr>

                ) : (

                  report.invoices.data.map(
                    (invoice) => (

                      <AccountStatementRow
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

          {/* Pagination */}

          {report.invoices.last_page > 1 && (

            <div className="flex items-center justify-center gap-2 p-5 border-t border-outline-variant dark:border-border-muted">

              <button
                type="button"
                disabled={
                  report.invoices.current_page <=
                  1
                }
                onClick={() => {

                  if (
                    selectedCustomerId
                  ) {
                    void loadAccountStatement(
                      selectedCustomerId,
                      report.invoices.current_page - 1,
                    )
                  }

                }}
                className="px-4 py-2 rounded-lg border border-outline-variant disabled:opacity-50"
              >
                السابق
              </button>

              <span className="text-sm text-outline px-3">

                صفحة{' '}

                {
                  report.invoices
                    .current_page
                }

                {' من '}

                {
                  report.invoices
                    .last_page
                }

              </span>

              <button
                type="button"
                disabled={
                  report.invoices.current_page >=
                  report.invoices.last_page
                }
                onClick={() => {

                  if (
                    selectedCustomerId
                  ) {
                    void loadAccountStatement(
                      selectedCustomerId,
                      report.invoices.current_page + 1,
                    )
                  }

                }}
                className="px-4 py-2 rounded-lg border border-outline-variant disabled:opacity-50"
              >
                التالي
              </button>

            </div>

          )}

        </div>

      )}

      {/* =========================
          قبل اختيار العميل
      ========================= */}

      {!selectedCustomerId &&
        !isCustomersLoading && (

          <div className="min-h-[250px] bg-surface-white dark:bg-surface-container-low rounded-2xl flex flex-col items-center justify-center text-center p-6">

            <Search
              size={40}
              className="text-outline mb-4"
            />

            <h3 className="text-lg font-bold text-on-surface dark:text-on-dark">

              اختر عميلًا

            </h3>

            <p className="text-outline mt-2">

              اختر العميل لعرض كشف الحساب الخاص به

            </p>

          </div>

        )}

    </div>
  )
}


// ============================================================
// Account Statement Row
// ============================================================

interface AccountStatementRowProps {
  invoice: AccountStatementInvoice
  isRTL: boolean
}

function AccountStatementRow({
  invoice,
  isRTL,
}: AccountStatementRowProps) {

  const totalAmount = Number(
    invoice.consumption_charge
      ?.total_amount ?? 0,
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

        {formatCurrency(
          totalAmount,
          isRTL,
        )}

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
            invoice.status === 'paid'
              ? 'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
          }
        >
          {invoice.status === 'paid'
            ? 'مدفوعة'
            : 'مدفوعة جزئيًا'}
        </span>

      </td>

      <td className="px-6 py-4 text-outline">

        {new Date(
          invoice.created_at,
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