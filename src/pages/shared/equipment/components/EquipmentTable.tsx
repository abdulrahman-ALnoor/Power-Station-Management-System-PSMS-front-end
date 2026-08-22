import { useTranslation } from 'react-i18next'
import { Equipment } from '../types'
import { EquipmentStatusBadge } from './EquipmentStatusBadge'

interface EquipmentTableProps {
 data: Equipment[]
 isLoading: boolean
 onRowClick: (equipment: Equipment) => void
}

export function EquipmentTable({ data, isLoading, onRowClick }: EquipmentTableProps) {
 const { t } = useTranslation('engineer')

 if (isLoading) {
 return (
 <div className="bg-surface rounded-2xl border border-border shadow-sm p-8 text-center">
 <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
 <p className="text-text-muted">جاري تحميل البيانات...</p>
 </div>
 )
 }

 if (data.length === 0) {
 return (
 <div className="bg-surface rounded-2xl border border-border shadow-sm p-12 flex flex-col items-center justify-center text-center">
 <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
 <span className="text-2xl opacity-50">📦</span>
 </div>
 <h3 className="text-lg font-bold text-text mb-1">{t('equipment.emptyState')}</h3>
 <p className="text-text-muted max-w-sm">
 {t('equipment.emptyStateDesc')}
 </p>
 </div>
 )
 }

 return (
 <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-sm text-left">
 <thead className="bg-surface-low text-text-muted font-medium border-b border-border">
 <tr>
 <th className="px-6 py-4 text-start">{t('equipment.table.name')}</th>
 <th className="px-6 py-4 text-start">{t('equipment.table.serialNumber')}</th>
 <th className="px-6 py-4 text-start">{t('equipment.table.status')}</th>
 <th className="px-6 py-4 text-start">{t('equipment.table.assignedUser')}</th>
 <th className="px-6 py-4 text-start">{t('equipment.table.notes')}</th>
 <th className="px-6 py-4 text-start">{t('equipment.table.createdAt')}</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 {data.map((item) => (
 <tr 
 key={item.id} 
 onClick={() => onRowClick(item)}
 className="hover:bg-surface-low transition-colors cursor-pointer group"
 >
 <td className="px-6 py-4 text-start">
 <span className="font-bold text-text group-hover:text-accent transition-colors">
 {item.equipment_name}
 </span>
 </td>
 <td className="px-6 py-4 text-start text-text-muted">
 {item.serial_number || t('equipment.details.notSpecified')}
 </td>
 <td className="px-6 py-4 text-start">
 <EquipmentStatusBadge status={item.status} />
 </td>
 <td className="px-6 py-4 text-start">
 <div className="flex items-center gap-2">
 {item.user ? (
 <span className="text-text font-medium">{item.user.name}</span>
 ) : (
 <span className="text-text-muted italic">{t('equipment.details.unassigned')}</span>
 )}
 </div>
 </td>
 <td className="px-6 py-4 text-start text-text-muted max-w-[200px] truncate">
 {item.notes || <span className="italic opacity-70">{t('equipment.details.noNotes')}</span>}
 </td>
 <td className="px-6 py-4 text-start text-text-muted">
 {new Date(item.created_at).toLocaleDateString()}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )
}
