import { useEffect, useState } from 'react'

import {
  ArrowRight,
  FileText,
  Wallet,
  CircleDollarSign,
  ReceiptText,
  Loader2,
  BarChart3,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

import {
  fetchRevenueReport,
  fetchMonthlyRevenue,
  type RevenueReport,
  type MonthlyRevenueItem,
} from '@/services/invoices.service'

import { formatCurrency } from '@/utils/currency'
import { useLanguage } from '@/hooks/useLanguage'

export function RevenueReportPage() {
  const { isRTL } = useLanguage()

  const navigate = useNavigate()

  const [report, setReport] =
    useState<RevenueReport | null>(null)

  const [monthlyData, setMonthlyData] =
    useState<MonthlyRevenueItem[]>([])

  const [isLoading, setIsLoading] =
    useState(true)

  useEffect(() => {
    const loadReportData = async () => {
      try {
        const [
          reportData,
          monthlyRevenueData,
        ] = await Promise.all([
          fetchRevenueReport(),
          fetchMonthlyRevenue(),
        ])

        setReport(reportData)

        setMonthlyData(
          monthlyRevenueData,
        )
      } catch (error) {
        console.error(
          'Failed to load revenue report:',
          error,
        )
      } finally {
        setIsLoading(false)
      }
    }

    void loadReportData()
  }, [])

  const formattedMonthlyData =
    monthlyData.map((item) => ({
      month: item.month,

      monthName: new Intl.DateTimeFormat(
        isRTL ? 'ar' : 'en',
        {
          month: 'short',
        },
      ).format(
        new Date(
          new Date().getFullYear(),
          Number(item.month) - 1,
          1,
        ),
      ),

      invoicesAmount: Number(
        item.invoices_amount ?? 0,
      ),

      collectionsAmount: Number(
        item.collections_amount ?? 0,
      ),
    }))

  if (isLoading) {
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-on-surface dark:text-on-dark">
            تقرير الإيرادات
          </h1>

          <p className="text-on-surface-variant mt-2">
            نظرة شاملة على الإيرادات والتحصيلات الشهرية
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-outline-variant dark:border-border-muted hover:bg-surface-container dark:hover:bg-surface-container-low transition-colors"
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
          بطاقات الإحصائيات
      ========================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        <ReportCard
          title="إجمالي الفواتير"
          value={
            formatCurrency(
              Number(
                report?.total_invoices ?? 0,
              ),
              isRTL,
            )
          }
          icon={
            <FileText size={26} />
          }
          iconClassName="
            bg-primary/10
            text-primary
            dark:bg-primary/20
            dark:text-primary-fixed
          "
        />

        <ReportCard
          title="إجمالي التحصيلات"
          value={
            formatCurrency(
              Number(
                report?.total_collected ?? 0,
              ),
              isRTL,
            )
          }
          icon={
            <Wallet size={26} />
          }
          iconClassName="
            bg-green-100
            text-green-600
            dark:bg-green-900/30
            dark:text-green-500
          "
        />

        <ReportCard
          title="إجمالي المتبقي"
          value={
            formatCurrency(
              Number(
                report?.total_remaining ?? 0,
              ),
              isRTL,
            )
          }
          icon={
            <CircleDollarSign size={26} />
          }
          iconClassName="
            bg-amber-100
            text-amber-600
            dark:bg-amber-900/30
            dark:text-amber-500
          "
        />

        <ReportCard
          title="عدد الفواتير"
          value={
            String(
              report?.total_invoices_count ?? 0,
            )
          }
          icon={
            <ReceiptText size={26} />
          }
          iconClassName="
            bg-purple-100
            text-purple-600
            dark:bg-purple-900/30
            dark:text-purple-400
          "
        />

      </div>

      {/* =========================
          الرسم البياني الشهري
      ========================= */}
      <div className="bg-surface-white dark:bg-surface-container-low rounded-2xl p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.05)]">

        <div className="flex items-center gap-3 mb-8">

          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <BarChart3 size={25} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-on-surface dark:text-on-dark">
              الإيرادات والتحصيلات الشهرية
            </h2>

            <p className="text-sm text-on-surface-variant mt-1">
              مقارنة الفواتير الصادرة بالمبالغ المحصلة لكل شهر
            </p>
          </div>

        </div>

        <div
          className="h-[400px] w-full"
          dir="ltr"
        >

          {formattedMonthlyData.length === 0 ? (

            <div className="h-full flex items-center justify-center text-on-surface-variant">
              لا توجد بيانات شهرية لعرضها
            </div>

          ) : (

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={formattedMonthlyData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 20,
                  bottom: 20,
                }}
                barGap={8}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />

                <XAxis
                  dataKey="monthName"
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                  tick={{
                    fill: '#64748b',
                    fontSize: 13,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={55}
                  tick={{
                    fill: '#64748b',
                    fontSize: 12,
                  }}
                  tickFormatter={(value) => {
                    const number =
                      Number(value)

                    if (
                      number >= 1000000
                    ) {
                      return `${(
                        number / 1000000
                      ).toFixed(1)}M`
                    }

                    if (
                      number >= 1000
                    ) {
                      return `${Math.round(
                        number / 1000,
                      )}K`
                    }

                    return String(number)
                  }}
                />

                <Tooltip
                  cursor={{
                    fill: 'rgba(0,0,0,0.04)',
                  }}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow:
                      '0 4px 12px rgba(0,0,0,0.12)',
                  }}
                  formatter={(value) =>
                    formatCurrency(
                      Number(value),
                      isRTL,
                    )
                  }
                />

                <Legend
                  verticalAlign="bottom"
                  align="center"
                />

                <Bar
                  dataKey="invoicesAmount"
                  name="الفواتير"
                  fill="#2563eb"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={50}
                />

                <Bar
                  dataKey="collectionsAmount"
                  name="التحصيلات"
                  fill="#16a34a"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={50}
                />

              </BarChart>

            </ResponsiveContainer>

          )}

        </div>

      </div>

    </div>
  )
}

interface ReportCardProps {
  title: string
  value: string
  icon: React.ReactNode
  iconClassName: string
}

function ReportCard({
  title,
  value,
  icon,
  iconClassName,
}: ReportCardProps) {
  return (
    <div className="bg-surface-white dark:bg-surface-container-low rounded-2xl p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">

      <div className="flex items-center justify-between mb-5">

        <div
          className={`
            w-12
            h-12
            rounded-xl
            flex
            items-center
            justify-center
            ${iconClassName}
          `}
        >
          {icon}
        </div>

      </div>

      <p className="text-sm text-on-surface-variant mb-2">
        {title}
      </p>

      <h2 className="text-2xl font-bold text-on-surface dark:text-on-dark break-words">
        {value}
      </h2>

    </div>
  )
}