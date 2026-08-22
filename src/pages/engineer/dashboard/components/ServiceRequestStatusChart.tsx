import { useTranslation } from 'react-i18next'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { mockServiceRequestStatus } from '../data/mockData'
import { useLanguage } from '@/hooks/useLanguage'

export function ServiceRequestStatusChart() {
  const { t } = useTranslation('engineer')
  const { isRTL } = useLanguage()

  // Translate labels for the legend/tooltip
  const data = mockServiceRequestStatus.map((item) => ({
    ...item,
    name: t(`dashboard.charts.${item.name}`, item.name),
  }))

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm p-6 flex flex-col h-[350px]">
      <h4 className="font-headline text-headline text-primary mb-4">
        {t('dashboard.charts.requestStatus')}
      </h4>
      <div className="flex-1 w-full relative" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
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
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => <span className="text-text mx-1">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
