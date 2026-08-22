import { useTranslation } from 'react-i18next'
import { Layers, CheckCircle2, Wrench, AlertTriangle, SearchX } from 'lucide-react'
import { getEquipmentStats, MOCK_EQUIPMENT } from '../data/mockData'

const ICON_MAP: Record<string, React.ElementType> = {
 'layers': Layers,
 'check_circle': CheckCircle2,
 'build': Wrench,
 'report_problem': AlertTriangle,
 'search_off': SearchX
}

export function EquipmentStats() {
 const { t } = useTranslation('equipment')
 const stats = getEquipmentStats(MOCK_EQUIPMENT)

 return (
 <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
 {stats.map((stat) => {
 const Icon = ICON_MAP[stat.iconKey] || Layers

 // Map semantic variants to exact Tailwind classes representing the Design System
 let colors = { bg: '', iconBg: '', iconText: '', border: '' }
 
 switch (stat.variant) {
 case 'primary':
 colors = {
 bg: 'bg-surface-low ',
 iconBg: 'bg-primary/10 ',
 iconText: 'text-primary ',
 border: 'border-b-4 border-primary '
 }
 break
 case 'success':
 colors = {
 bg: 'bg-surface-low ',
 iconBg: 'bg-green-100 ',
 iconText: 'text-green-600 ',
 border: 'border-b-4 border-green-500 '
 }
 break
 case 'warning':
 colors = {
 bg: 'bg-surface-low ',
 iconBg: 'bg-amber-100 ',
 iconText: 'text-amber-600 ',
 border: 'border-b-4 border-amber-500 '
 }
 break
 case 'error':
 colors = {
 bg: 'bg-surface-low ',
 iconBg: 'bg-error/10 ',
 iconText: 'text-error ',
 border: 'border-b-4 border-error '
 }
 break
 default:
 colors = {
 bg: 'bg-surface-low ',
 iconBg: 'bg-surface-container ',
 iconText: 'text-text-primary-variant ',
 border: 'border-b-4 border-border '
 }
 }

 return (
 <div 
 key={stat.id} 
 className={`p-6 rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] flex flex-col justify-between ${colors.bg} ${colors.border}`}
 >
 <div className="flex items-start justify-between mb-4">
 <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.iconBg} ${colors.iconText}`}>
 <Icon size={24} />
 </div>
 </div>
 
 <div>
 <p className="text-label-md text-text-muted font-bold mb-1">
 {t(stat.labelKey)}
 </p>
 <div className="flex items-baseline gap-2">
 <h3 className="font-display-sm text-display-sm font-bold text-text-primary ">
 {stat.value}
 </h3>
 </div>
 </div>
 </div>
 )
 })}
 </div>
 )
}
