import React from 'react'
import {
 BarChart,
 Bar,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 ResponsiveContainer,
} from 'recharts'
import { TrendingUp, BarChart2, AlertCircle } from 'lucide-react'

interface MonthlyRevenueChartProps {
 data: { month: string; month_label: string; days: { day: number; revenue: number }[] } | null
 isLoading?: boolean
 error?: string | null
}

export function MonthlyRevenueChart({ data, isLoading, error }: MonthlyRevenueChartProps) {
 const Header = () => (
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
 <TrendingUp size={20} />
 </div>
 <div>
 <h3 className="text-lg font-bold text-text">الإيرادات الشهرية</h3>
 <p className="text-sm text-text-muted">الإيرادات المحصلة يومياً خلال الشهر الحالي</p>
 </div>
 </div>
 {data?.month_label && (
 <div className="px-4 py-2 bg-surface-container rounded-lg border border-border">
 <span className="text-sm font-bold text-text">{data.month_label}</span>
 </div>
 )}
 </div>
 )

 if (isLoading) {
 return (
 <div className="card h-full flex flex-col min-h-[400px] animate-pulse">
 <Header />
 <div className="flex-1 bg-surface-container rounded-xl"></div>
 </div>
 )
 }

 if (error) {
 return (
 <div className="card h-full flex flex-col min-h-[400px]">
 <Header />
 <div className="flex-1 flex flex-col items-center justify-center text-danger">
 <AlertCircle className="w-16 h-16 mb-4 opacity-50" />
 <p className="font-medium text-lg">تعذر تحميل بيانات الإيرادات</p>
 </div>
 </div>
 )
 }

 if (!data || data.days.length === 0 || data.days.every(d => d.revenue === 0)) {
 return (
 <div className="card h-full flex flex-col min-h-[400px]">
 <Header />
 <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
 <BarChart2 className="w-16 h-16 mb-4 opacity-20" />
 <p className="font-medium text-lg">لا توجد إيرادات مسجلة خلال الشهر الحالي</p>
 </div>
 </div>
 )
 }

 const formatCurrency = (value: number) => {
 return new Intl.NumberFormat('ar-SA', {
 style: 'currency',
 currency: 'SAR',
 maximumFractionDigits: 0,
 }).format(value).replace('SAR', 'ر.س')
 }

 const CustomTooltip = ({ active, payload, label }: any) => {
 if (active && payload && payload.length) {
 return (
 <div className="bg-surface border border-border shadow-lg rounded-lg p-3" dir="rtl">
 <p className="font-bold text-text mb-1">{`التاريخ: ${label} ${data.month_label.split(' ')[0]}`}</p>
 <p className="text-primary font-bold text-lg">
 <span className="text-sm font-normal text-text-muted ml-1">الإيرادات:</span>
 {formatCurrency(payload[0].value)}
 </p>
 </div>
 )
 }
 return null
 }

 return (
 <div className="card h-full flex flex-col min-h-[400px]">
 <Header />

 <div className="h-[360px] w-full mt-4" dir="ltr">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart
 data={data.days}
 margin={{
 top: 10,
 right: 10,
 left: 40,
 bottom: 0,
 }}
 >
 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
 <XAxis
 dataKey="day"
 axisLine={false}
 tickLine={false}
 tick={{ fill: '#64748B', fontSize: 12 }}
 dy={10}
 />
 <YAxis
 axisLine={false}
 tickLine={false}
 tick={{ fill: '#64748B', fontSize: 12 }}
 tickFormatter={(value) => `${(value / 1000)}k`}
 dx={-10}
 />
 <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F1F5F9' }} />
 <Bar
 dataKey="revenue"
 fill="#0EA5E9"
 radius={[4, 4, 0, 0]}
 maxBarSize={40}
 />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>
 )
}
