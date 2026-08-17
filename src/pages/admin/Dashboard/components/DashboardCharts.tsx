import { useTranslation } from 'react-i18next'
import { getMockMonthlyRevenue } from '@/data/mock/dashboard'
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useLanguage } from '@/hooks/useLanguage'

export function DashboardCharts() {
  const { t } = useTranslation('dashboard')
  const { isRTL } = useLanguage()
  const monthlyRevenue = getMockMonthlyRevenue()

  // Format data with translated month names
  const formattedRevenueData = monthlyRevenue.map((item) => ({
    name: t(item.nameKey),
    revenue: item.revenue,
    isCurrentMonth: item.nameKey === 'months.dec', // Hardcode December as the highlighted month matching design
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      
      {/* Monthly Revenue Chart */}
      <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-headline text-headline text-primary">
            {t('charts.monthlyRevenueTitle')}
          </h4>
          <select 
            className="border-none bg-[var(--color-surface-container-low)] rounded-lg text-sm px-4 py-1 outline-none text-text focus:ring-2 focus:ring-primary"
            aria-label="Filter Revenue"
          >
            <option>{t('charts.filterLast12Months')}</option>
            <option>{t('charts.filterCurrentYear')}</option>
          </select>
        </div>
        
        <div className="h-64 w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={formattedRevenueData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
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
              <Bar 
                dataKey="revenue" 
                radius={[4, 4, 0, 0]} 
                barSize={30}
              >
                {formattedRevenueData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isCurrentMonth ? 'var(--color-accent)' : 'var(--color-surface-dim)'} 
                    className={entry.isCurrentMonth ? '' : 'hover:fill-[var(--color-accent)] transition-all duration-300'}
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
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-outline">
              <span className="w-3 h-1 bg-[var(--color-steel-blue)] rounded-full"></span> 
              {t('charts.residential')}
            </span>
            <span className="flex items-center gap-1 text-xs text-outline">
              <span className="w-3 h-1 bg-[var(--color-accent)] rounded-full"></span> 
              {t('charts.commercial')}
            </span>
          </div>
        </div>
        
        <div className="h-64 relative flex items-center justify-center">
          {/* We will add a placeholder for the Area chart since we don't have explicit data for it in the mock, 
              but to match the design we can render horizontal grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pt-4">
            <div className="border-b border-border w-full h-0"></div>
            <div className="border-b border-border w-full h-0"></div>
            <div className="border-b border-border w-full h-0"></div>
            <div className="border-b border-border w-full h-0"></div>
          </div>
          <p className="text-outline text-sm italic relative z-10">
            {/* Can integrate Recharts AreaChart later when data structure is finalized */}
          </p>
        </div>
      </div>

    </div>
  )
}
