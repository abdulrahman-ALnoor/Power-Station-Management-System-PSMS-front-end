import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ReaderConsumptionData } from '../types/readerDashboard.types'

interface ReadingConsumptionChartProps {
  data: ReaderConsumptionData[]
}

export function ReadingConsumptionChart({ data }: ReadingConsumptionChartProps) {
  return (
    <div className="card flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-headline">إجمالي القراءات</h2>
        <p className="text-sm text-text-muted mt-1">إحصائيات القراءات خلال الأسبوع</p>
      </div>
      
      <div className="flex-1 min-h-[250px] w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
            />
            <Tooltip 
              cursor={{ fill: 'var(--color-border)', opacity: 0.4 }}
              contentStyle={{ 
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                borderRadius: '8px',
                color: 'var(--color-text)',
                boxShadow: 'var(--shadow-dropdown)'
              }}
              itemStyle={{ color: 'var(--color-text)' }}
            />
            <Bar 
              dataKey="consumption" 
              fill="var(--color-interactive)" 
              radius={[4, 4, 0, 0]} 
              barSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
