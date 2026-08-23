import { useTranslation } from 'react-i18next'
import { MOCK_EQUIPMENT } from '../data/mockData'
import { Eye, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'

interface EquipmentTableProps {
 onRowClick: (id: number) => void
}

export function EquipmentTable({ onRowClick }: EquipmentTableProps) {
 const { t } = useTranslation('equipment')
 const { isRTL } = useLanguage()

 const getStatusStyle = (status: string | null) => {
 switch (status) {
 case 'available': return 'bg-green-50 text-green-600 '
 case 'maintenance': return 'bg-amber-50 text-amber-gold '
 case 'damaged': return 'bg-error-container text-error '
 case 'lost': return 'bg-error-container text-error '
 default: return 'bg-surface-dim text-text-primary-variant'
 }
 }

 // Helper to format date just for display
 const formatDate = (dateString: string) => {
 const d = new Date(dateString)
 return d.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')
 }

 return (
 <div className="bg-surface rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-start border-collapse">
 <thead>
 <tr className="bg-surface-container-low border-b border-border-variant ">
 <th className="px-6 py-4 font-body-md font-bold text-text-primary text-start whitespace-nowrap">{t('table.id')}</th>
 <th className="px-6 py-4 font-body-md font-bold text-text-primary text-start whitespace-nowrap">{t('table.equipmentName')}</th>
 <th className="px-6 py-4 font-body-md font-bold text-text-primary text-start whitespace-nowrap">{t('table.serialNumber')}</th>
 <th className="px-6 py-4 font-body-md font-bold text-text-primary text-start whitespace-nowrap">{t('table.assignedUser')}</th>
 <th className="px-6 py-4 font-body-md font-bold text-text-primary text-start whitespace-nowrap">{t('table.status')}</th>
 <th className="px-6 py-4 font-body-md font-bold text-text-primary text-start whitespace-nowrap">{t('table.createdBy')}</th>
 <th className="px-6 py-4 font-body-md font-bold text-text-primary text-start whitespace-nowrap">{t('table.createdAt')}</th>
 <th className="px-6 py-4 font-body-md font-bold text-text-primary text-center whitespace-nowrap">{t('table.actions')}</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-outline-variant ">
 {MOCK_EQUIPMENT.map((item) => (
 <tr 
 key={item.id} 
 className="hover:bg-surface-container-low :bg-surface-container/50 transition-colors cursor-pointer group"
 onClick={() => onRowClick(item.id)}
 >
 <td className="px-6 py-4 font-table-cell font-bold text-primary whitespace-nowrap">{item.id}</td>
 <td className="px-6 py-4 font-table-cell text-text-primary whitespace-nowrap">{item.equipment_name}</td>
 <td className="px-6 py-4 font-table-cell text-text-muted whitespace-nowrap">{item.serial_number || '-'}</td>
 
 <td className="px-6 py-4 font-table-cell whitespace-nowrap">
 {item.user ? (
 <div className="flex items-center gap-2">
 {item.user.initials && (
 <div className="w-7 h-7 rounded-full bg-primary-fixed text-primary flex items-center justify-center text-[10px] font-bold">
 {item.user.initials}
 </div>
 )}
 <span className="text-text-primary ">{item.user.name}</span>
 </div>
 ) : (
 <span className="text-text-muted">{t('table.unassigned')}</span>
 )}
 </td>
 
 <td className="px-6 py-4 font-table-cell whitespace-nowrap">
 <span className={cn("px-3 py-1 rounded-full text-[12px] font-bold", getStatusStyle(item.status))}>
 {item.status ? t(`status.${item.status}`) : '-'}
 </span>
 </td>

 <td className="px-6 py-4 font-table-cell text-text-primary whitespace-nowrap">
 {item.createdBy ? item.createdBy.name : '-'}
 </td>
 
 <td className="px-6 py-4 font-table-cell text-text-muted whitespace-nowrap" dir="ltr">
 {formatDate(item.created_at)}
 </td>
 
 <td className="px-6 py-4 font-table-cell whitespace-nowrap">
 <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
 <button className="text-text-muted hover:text-primary :text-primary-fixed transition-colors p-1" title={t('table.view')}>
 <Eye size={20} />
 </button>
 <button className="text-text-muted hover:text-amber-gold :text-amber-500 transition-colors p-1" title={t('table.edit')}>
 <Edit2 size={20} />
 </button>
 <button className="text-text-muted hover:text-error :text-error-container transition-colors p-1" title={t('table.delete')}>
 <Trash2 size={20} />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* Pagination */}
 <div className="px-6 py-4 bg-surface-low flex flex-wrap items-center justify-between gap-4 border-t border-border-variant ">
 <p className="text-label-sm text-text-muted">
 {t('pagination.showing', { count: MOCK_EQUIPMENT.length, total: MOCK_EQUIPMENT.length })}
 </p>
 <div className="flex items-center gap-1">
 <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-variant text-text-primary-variant hover:bg-surface-container :bg-surface transition-colors">
 {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
 </button>
 <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-on-primary font-bold ">1</button>
 <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-variant text-text-primary-variant hover:bg-surface-container :bg-surface transition-colors font-bold" disabled>2</button>
 <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-variant text-text-primary-variant hover:bg-surface-container :bg-surface transition-colors font-bold" disabled>3</button>
 <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-variant text-text-primary-variant hover:bg-surface-container :bg-surface transition-colors">
 {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
 </button>
 </div>
 </div>
 </div>
 )
}
