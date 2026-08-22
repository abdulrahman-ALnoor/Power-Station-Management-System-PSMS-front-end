import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { ReaderReadingProgress } from '../types/readerDashboard.types'

interface ReadingProgressCardProps {
  progress: ReaderReadingProgress
}

export function ReadingProgressCard({ progress }: ReadingProgressCardProps) {
  const data = [
    { name: 'Completed', value: progress.completed },
    { name: 'Remaining', value: progress.total - progress.completed },
  ]

  return (
    <div className="card flex flex-col h-full">
      <h2 className="text-headline mb-4">تقدم قراءة العدادات اليوم</h2>
      
      <div className="flex-1 flex flex-col items-center justify-center relative min-h-[200px]">
        <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="90%"
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === 0 ? 'var(--color-success)' : 'var(--color-surface-container)'} 
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Center Text */}
        <div className="absolute flex flex-col items-center justify-center pointer-events-none">
          <span className="text-4xl font-bold text-text">
            {progress.percentage}%
          </span>
        </div>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-sm font-medium text-text-muted">
          {progress.completed} / {progress.total} عداد مكتمل
        </p>
      </div>
    </div>
  )
}
