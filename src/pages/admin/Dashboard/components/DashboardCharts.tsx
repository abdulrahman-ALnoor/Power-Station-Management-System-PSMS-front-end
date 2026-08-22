import { useTranslation } from 'react-i18next'
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useLanguage } from '@/hooks/useLanguage'
import type { ChartSeries, ElectricityConsumptionChart as ElectricityChartData } from '@/services/dashboard.service.ts'

interface DashboardChartsProps {
  monthlyRevenueChart: ChartSeries | null
  electricityChart: ElectricityChartData | null
}

export function DashboardCharts({ monthlyRevenueChart, electricityChart }: DashboardChartsProps) {
  const { t } = useTranslation('dashboard')
  useLanguage()

  const revenueData = (monthlyRevenueChart?.labels ?? []).map((label, i) => ({
    name: label,
    revenue: monthlyRevenueChart?.values[i] ?? 0,
    isLast: i === (monthlyRevenueChart?.labels.length ?? 1) - 1,
  }))

  const consumptionData = (electricityChart?.labels ?? []).map((label, i) => ({
    name: String(label),
    consumption: electricityChart?.values[i] ?? 0,
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

      {/* Monthly Revenue Chart */}
      <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-headline text-headline text-primary">
            {t('charts.monthlyRevenueTitle')}
          </h4>
        </div>

        <div className="h-64 w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'var(--color-outline)' }}
                dy={10}
              />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]} barSize={20}>
                {revenueData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isLast ? 'var(--color-accent)' : 'var(--color-surface-dim)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Electricity Consumption Chart */}
      <div className="bg-surface p-6 rounded-xl border border-border shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h4 className="font-headline text-headline text-primary">
            {t('charts.electricityConsumptionTitle')}
          </h4>
          {electricityChart && (
            <span className="text-xs text-outline">
              {electricityChart.total_consumption.toLocaleString()} {electricityChart.unit}
            </span>
          )}
        </div>

        <div className="h-64 w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={consumptionData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'var(--color-outline)' }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ stroke: 'var(--color-steel-blue)', strokeWidth: 1 }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Area
                type="monotone"
                dataKey="consumption"
                stroke="var(--color-steel-blue)"
                fill="var(--color-steel-blue)"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}
