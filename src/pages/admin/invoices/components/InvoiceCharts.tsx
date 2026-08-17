import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/hooks/useLanguage'
import { getMonthlyChartData, getStatusDistributionData, MOCK_INVOICES } from '../data/mockData'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from 'recharts'
import { formatCurrency } from '@/utils/currency'

export function InvoiceCharts() {
  const { t } = useTranslation('invoices')
  const { isRTL } = useLanguage()

  const monthlyData = getMonthlyChartData(MOCK_INVOICES, isRTL)
  const statusData = getStatusDistributionData(MOCK_INVOICES)

  // Determine colors based on theme. We'll use hardcoded semantic tokens that adapt to light/dark
  // using Tailwind classes isn't directly supported inside recharts SVG elements without getComputedStyle,
  // so we'll provide standard hex codes that look good in both or use standard CSS variables if configured.
  // We'll use CSS variable equivalents for Tailwind colors:
  const primaryColor = '#2563eb' // text-primary
  const successColor = '#16a34a' // text-green-600
  const warningColor = '#d97706' // text-amber-600

  const PIE_COLORS = [successColor, warningColor]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Monthly Comparison Chart */}
      <div className="lg:col-span-2 bg-surface-white dark:bg-surface-container-low p-6 rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)]">
        <h3 className="font-headline-md font-bold text-on-surface dark:text-on-dark mb-6">
          {t('charts.monthlyComparison')}
        </h3>
        <div className="h-[300px] w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis 
                dataKey="monthStr" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(val) => {
                  if (val >= 1000) return `${(val / 1000).toFixed(0)}k`
                  return val
                }}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => [formatCurrency(value, isRTL)]}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="invoicesAmount" name={t('charts.invoices')} fill={primaryColor} radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="collectionsAmount" name={t('charts.collections')} fill={successColor} radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Distribution Donut Chart */}
      <div className="bg-surface-white dark:bg-surface-container-low p-6 rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)]">
        <h3 className="font-headline-md font-bold text-on-surface dark:text-on-dark mb-6">
          {t('charts.statusDistribution')}
        </h3>
        <div className="h-[300px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => [value, t('stats.totalInvoices')]}
              />
              <Legend 
                formatter={(value) => t(`status.${value}`)}
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
