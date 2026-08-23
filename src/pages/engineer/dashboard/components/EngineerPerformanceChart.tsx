import { useTranslation } from 'react-i18next'
import {
 AreaChart,
 Area,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 ResponsiveContainer,
 Legend,
} from 'recharts'
import { mockEngineerPerformance } from '../data/mockData'
import { useLanguage } from '@/hooks/useLanguage'

export function EngineerPerformanceChart() {
 const { t } = useTranslation('engineer')
 const { isRTL } = useLanguage()

 return (
 <div className="bg-surface rounded-xl border border-border shadow-sm p-6 flex flex-col h-[400px]">
 <h4 className="font-headline text-headline text-primary mb-4">
 {t('dashboard.charts.performance')}
 </h4>
 <div className="flex-1 w-full" dir="ltr">
 <ResponsiveContainer width="100%" height="100%">
 <AreaChart
 data={mockEngineerPerformance}
 margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
 >
 <defs>
 <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
 <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
 </linearGradient>
 <linearGradient id="colorAssigned" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
 <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
 </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
 <XAxis
 dataKey="date"
 axisLine={false}
 tickLine={false}
 tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
 dy={10}
 />
 <YAxis
 axisLine={false}
 tickLine={false}
 tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
 orientation={isRTL ? 'right' : 'left'}
 />
 <Tooltip
 contentStyle={{
 backgroundColor: 'var(--color-surface)',
 borderColor: 'var(--color-border)',
 color: 'var(--color-text)',
 borderRadius: '8px',
 direction: isRTL ? 'rtl' : 'ltr',
 }}
 itemStyle={{ color: 'var(--color-text)' }}
 />
 <Legend
 verticalAlign="top"
 height={36}
 iconType="circle"
 formatter={(value) => (
 <span className="text-text mx-1">{t(`dashboard.charts.${value}`)}</span>
 )}
 />
 <Area
 type="monotone"
 dataKey="completed"
 name="completed"
 stroke="#10b981"
 fillOpacity={1}
 fill="url(#colorCompleted)"
 strokeWidth={2}
 />
 <Area
 type="monotone"
 dataKey="assigned"
 name="assigned"
 stroke="#3b82f6"
 fillOpacity={1}
 fill="url(#colorAssigned)"
 strokeWidth={2}
 />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 </div>
 )
}
