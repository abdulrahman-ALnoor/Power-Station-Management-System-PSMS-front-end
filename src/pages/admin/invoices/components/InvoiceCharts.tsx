import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/hooks/useLanguage'

import {
  fetchMonthlyRevenue,
  fetchStatusDistribution,
  type MonthlyRevenueItem,
  type StatusDistributionItem,
} from '@/services/invoices.service'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

import { formatCurrency } from '@/utils/currency'

export function InvoiceCharts() {
  const { t } = useTranslation('invoices')
  const { isRTL } = useLanguage()

  // =========================
  // بيانات الرسم الشهري
  // =========================
  const [monthlyData, setMonthlyData] = useState<
    MonthlyRevenueItem[]
  >([])

  // =========================
  // بيانات توزيع حالات الفواتير
  // =========================
  const [statusData, setStatusData] = useState<
    StatusDistributionItem[]
  >([])

  const [isLoading, setIsLoading] = useState(true)

  // =========================
  // جلب البيانات الحقيقية
  // =========================
  useEffect(() => {
    const loadChartData = async () => {
      try {
        const [
          monthlyRevenue,
          statusDistribution,
        ] = await Promise.all([
          fetchMonthlyRevenue(),
          fetchStatusDistribution(),
        ])

        setMonthlyData(monthlyRevenue)

        setStatusData(statusDistribution)
      } catch (error) {
        console.error(
          'Failed to load chart data:',
          error,
        )
      } finally {
        setIsLoading(false)
      }
    }

    void loadChartData()
  }, [])

  // =========================
  // تحويل رقم الشهر إلى اسم الشهر
  // =========================
  const formattedMonthlyData = monthlyData.map(
    (item) => ({
      month: item.month,

      monthStr: new Intl.DateTimeFormat(
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
        item.invoices_amount,
      ),

      collectionsAmount: Number(
        item.collections_amount,
      ),
    }),
  )

  // =========================
  // ألوان الرسوم
  // =========================
  const primaryColor = '#2563eb'
  const successColor = '#16a34a'
  const warningColor = '#d97706'

  const PIE_COLORS = [
    successColor,
    warningColor,
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* =========================
          الرسم الدائري
      ========================= */}
      <div className="order-2 lg:order-1 min-h-[390px] bg-surface-white dark:bg-surface-container-low p-6 rounded-2xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] flex flex-col">

        <h3 className="font-headline-md font-bold text-on-surface dark:text-on-dark text-center">
          {t('charts.statusDistribution')}
        </h3>

        <div className="flex-1 min-h-[300px] w-full">

          {isLoading ? (
            <div className="h-full flex items-center justify-center text-outline">
              جاري تحميل البيانات...
            </div>
          ) : (
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>

                <Pie
                  data={statusData}
                  cx="50%"
                  cy="46%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                >
                  {statusData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        PIE_COLORS[
                          index % PIE_COLORS.length
                        ]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow:
                      '0 4px 12px rgba(0,0,0,0.12)',
                  }}
                  formatter={(value) => [
                    Number(value),
                    t('stats.totalInvoices'),
                  ]}
                />

                <Legend
                  verticalAlign="bottom"
                  align="center"
                  formatter={(value) =>
                    t(`status.${value}`)
                  }
                />

              </PieChart>
            </ResponsiveContainer>
          )}

        </div>
      </div>

      {/* =========================
          رسم الأعمدة
      ========================= */}
      <div className="order-1 lg:order-2 lg:col-span-2 min-h-[390px] bg-surface-white dark:bg-surface-container-low p-6 rounded-2xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] flex flex-col">

        <h3 className="font-headline-md font-bold text-on-surface dark:text-on-dark text-center">
          {t('charts.monthlyComparison')}
        </h3>

        <div
          className="flex-1 min-h-[300px] w-full"
          dir="ltr"
        >

          {isLoading ? (
            <div className="h-full flex items-center justify-center text-outline">
              جاري تحميل البيانات...
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
                  left: 0,
                  bottom: 10,
                }}
                barGap={8}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />

                <XAxis
                  dataKey="monthStr"
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
                  width={45}
                  tick={{
                    fill: '#64748b',
                    fontSize: 13,
                  }}
                  tickFormatter={(value) => {
                    if (Number(value) >= 1000) {
                      return `${Math.round(
                        Number(value) / 1000,
                      )}k`
                    }

                    return value
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
                  formatter={(value) => [
                    formatCurrency(
                      Number(value),
                      isRTL,
                    ),
                  ]}
                />

                <Legend
                  verticalAlign="bottom"
                  align="center"
                />

                <Bar
                  dataKey="invoicesAmount"
                  name={t('charts.invoices')}
                  fill={primaryColor}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={42}
                />

                <Bar
                  dataKey="collectionsAmount"
                  name={t('charts.collections')}
                  fill={successColor}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={42}
                />

              </BarChart>

            </ResponsiveContainer>
          )}

        </div>
      </div>

    </div>
  )
}