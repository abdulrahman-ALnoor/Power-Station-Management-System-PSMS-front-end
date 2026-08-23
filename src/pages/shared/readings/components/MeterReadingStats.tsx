import React from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Clock, XCircle, Gauge, Zap, DollarSign } from 'lucide-react'
import { MeterReadingStatsData } from '../types'

interface MeterReadingStatsProps {
 stats: MeterReadingStatsData
}

export function MeterReadingStats({ stats }: MeterReadingStatsProps) {
 const { t } = useTranslation('readings')

 const formatNumber = (val: number) => new Intl.NumberFormat('en-US').format(val)
 const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'YER' }).format(val)

 const statCards = [
 {
 id: 'totalReadings',
 title: t('stats.totalReadings'),
 value: formatNumber(stats.totalReadings),
 icon: <Gauge size={24} />,
 colorClass: 'text-primary ',
 bgClass: 'bg-primary/10'
 },
 {
 id: 'approvedReadings',
 title: t('stats.approvedReadings'),
 value: formatNumber(stats.approvedReadings),
 icon: <CheckCircle2 size={24} />,
 colorClass: 'text-success',
 bgClass: 'bg-success/10'
 },
 {
 id: 'pendingReadings',
 title: t('stats.pendingReadings'),
 value: formatNumber(stats.pendingReadings),
 icon: <Clock size={24} />,
 colorClass: 'text-warning ',
 bgClass: 'bg-warning/10 '
 },
 {
 id: 'rejectedReadings',
 title: t('stats.rejectedReadings'),
 value: formatNumber(stats.rejectedReadings),
 icon: <XCircle size={24} />,
 colorClass: 'text-error',
 bgClass: 'bg-error/10'
 },
 {
 id: 'totalConsumption',
 title: t('stats.totalConsumption'),
 value: `${formatNumber(stats.totalConsumption)} kWh`,
 icon: <Zap size={24} />,
 colorClass: 'text-accent ',
 bgClass: 'bg-accent/10 '
 },
 {
 id: 'totalReadingCost',
 title: t('stats.totalReadingCost'),
 value: formatCurrency(stats.totalReadingCost),
 icon: <DollarSign size={24} />,
 colorClass: 'text-teal-600 ',
 bgClass: 'bg-teal-500/10'
 },
 ]

 return (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
 {statCards.map(card => (
 <div key={card.id} className="bg-surface p-4 rounded-2xl shadow-sm border border-border flex flex-col justify-between h-full hover:shadow-md transition-shadow">
 <div className="flex items-center gap-3 mb-2">
 <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.bgClass} ${card.colorClass}`}>
 {card.icon}
 </div>
 <p className="text-label-sm font-bold text-text-muted leading-tight">
 {card.title}
 </p>
 </div>
 <div className="mt-1">
 <h4 className="text-headline-sm font-black text-text-primary break-words">
 {card.value}
 </h4>
 </div>
 </div>
 ))}
 </div>
 )
}
