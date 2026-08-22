import { useTranslation } from 'react-i18next'
import { Package, CheckCircle, Wrench, AlertTriangle, HelpCircle } from 'lucide-react'
import { Equipment } from '../types'

interface EquipmentStatsProps {
 equipment: Equipment[]
}

export function EquipmentStats({ equipment }: EquipmentStatsProps) {
 const { t } = useTranslation('engineer')

 const total = equipment.length
 const available = equipment.filter(e => e.status === 'available').length
 const maintenance = equipment.filter(e => e.status === 'maintenance').length
 const damaged = equipment.filter(e => e.status === 'damaged').length
 const lost = equipment.filter(e => e.status === 'lost').length

 const stats = [
 {
 label: t('equipment.stats.total'),
 value: total,
 icon: Package,
 color: 'text-blue-500',
 bgColor: 'bg-blue-50 ',
 },
 {
 label: t('equipment.stats.available'),
 value: available,
 icon: CheckCircle,
 color: 'text-emerald-500',
 bgColor: 'bg-emerald-50 ',
 },
 {
 label: t('equipment.stats.maintenance'),
 value: maintenance,
 icon: Wrench,
 color: 'text-amber-500',
 bgColor: 'bg-amber-50 ',
 },
 {
 label: t('equipment.stats.damaged'),
 value: damaged,
 icon: AlertTriangle,
 color: 'text-red-500',
 bgColor: 'bg-red-50 ',
 },
 {
 label: t('equipment.stats.lost'),
 value: lost,
 icon: HelpCircle,
 color: 'text-slate-500',
 bgColor: 'bg-slate-50 ',
 },
 ]

 return (
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
 {stats.map((stat, index) => (
 <div
 key={index}
 className="bg-surface rounded-2xl p-4 border border-border shadow-sm flex items-center gap-4"
 >
 <div className={`p-3 rounded-xl shrink-0 ${stat.bgColor} ${stat.color}`}>
 <stat.icon size={24} strokeWidth={2} />
 </div>
 <div>
 <p className="text-sm font-medium text-text-muted mb-1">{stat.label}</p>
 <h4 className="text-2xl font-bold text-text">{stat.value}</h4>
 </div>
 </div>
 ))}
 </div>
 )
}
