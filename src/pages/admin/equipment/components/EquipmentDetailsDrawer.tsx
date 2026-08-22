import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Calendar } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { Equipment } from '../types'
import { cn } from '@/utils/cn'

interface EquipmentDetailsDrawerProps {
 equipment: Equipment | null
 isOpen: boolean
 onClose: () => void
}

export function EquipmentDetailsDrawer({ equipment, isOpen, onClose }: EquipmentDetailsDrawerProps) {
 const { t } = useTranslation('equipment')
 const { isRTL } = useLanguage()
 const [shouldRender, setShouldRender] = useState(false)

 useEffect(() => {
 if (isOpen) setShouldRender(true)
 else {
 const timer = setTimeout(() => setShouldRender(false), 300)
 return () => clearTimeout(timer)
 }
 }, [isOpen])

 if (!shouldRender || !equipment) return null

 const getStatusStyle = (status: string | null) => {
 switch (status) {
 case 'available': return 'bg-green-50 text-green-600 '
 case 'maintenance': return 'bg-amber-50 text-amber-gold '
 case 'damaged': return 'bg-error-container text-error '
 case 'lost': return 'bg-error-container text-error '
 default: return 'bg-surface-dim text-text-primary-variant'
 }
 }

 const drawerClasses = cn(
 "fixed top-0 h-full w-full sm:w-[480px] bg-surface z-[70] shadow-2xl transition-transform duration-300 flex flex-col",
 isRTL ? "right-0" : "left-0",
 isOpen 
 ? "translate-x-0" 
 : (isRTL ? "translate-x-full" : "-translate-x-full")
 )

 const formatDate = (dateString: string) => {
 return new Date(dateString).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')
 }

 return (
 <>
 <div 
 className={cn(
 "fixed inset-0 bg-primary/40 backdrop-blur-sm z-[60] transition-opacity duration-300",
 isOpen ? "opacity-100" : "opacity-0"
 )}
 onClick={onClose}
 />
 
 <div className={drawerClasses} dir={isRTL ? 'rtl' : 'ltr'}>
 {/* Header */}
 <div className="p-6 border-b border-border-variant flex justify-between items-center bg-primary text-on-primary ">
 <h3 className="font-headline-md font-bold">{t('drawer.title')}</h3>
 <button 
 className="hover:bg-surface/10 :bg-surface-container-high p-2 rounded-full transition-colors" 
 onClick={onClose}
 aria-label={t('drawer.close')}
 >
 <X size={20} />
 </button>
 </div>

 {/* Content */}
 <div className="flex-grow overflow-y-auto p-6 space-y-8">
 
 {/* Equipment Profile */}
 <div className="space-y-4">
 <div className="w-full h-48 bg-surface-container-low rounded-xl overflow-hidden relative flex items-center justify-center">
 <div className="w-full h-full bg-primary/5 flex items-center justify-center">
 <span className="text-text-muted text-label-sm">{t('drawer.imagePlaceholder')}</span>
 </div>
 <span className={cn("absolute top-4 inset-inline-end-4 px-3 py-1 rounded-full text-[12px] font-bold shadow-md", getStatusStyle(equipment.status))}>
 {equipment.status ? t(`status.${equipment.status}`) : '-'}
 </span>
 </div>
 <div>
 <h4 className="font-headline-md font-bold text-primary ">{equipment.equipment_name}</h4>
 <div className="grid grid-cols-2 gap-4 mt-4">
 <div className="bg-surface-low p-3 rounded-lg border border-border-variant ">
 <p className="text-label-sm text-text-muted mb-1">{t('drawer.equipmentId')}</p>
 <p className="font-bold text-text-primary ">{equipment.id}</p>
 </div>
 <div className="bg-surface-low p-3 rounded-lg border border-border-variant ">
 <p className="text-label-sm text-text-muted mb-1">{t('drawer.serialNumber')}</p>
 <p className="font-bold text-text-primary ">{equipment.serial_number || '-'}</p>
 </div>
 <div className="bg-surface-low p-3 rounded-lg border border-border-variant ">
 <p className="text-label-sm text-text-muted mb-1">{t('drawer.createdAt')}</p>
 <p className="font-bold text-text-primary flex items-center gap-2">
 <Calendar size={14} className="text-text-muted" />
 <span dir="ltr">{formatDate(equipment.created_at)}</span>
 </p>
 </div>
 <div className="bg-surface-low p-3 rounded-lg border border-border-variant ">
 <p className="text-label-sm text-text-muted mb-1">{t('drawer.createdBy')}</p>
 <p className="font-bold text-text-primary ">{equipment.createdBy?.name || '-'}</p>
 </div>
 </div>
 </div>
 </div>

 {/* Assigned User */}
 <div className="space-y-4">
 <h5 className="font-body-md font-bold border-b border-border-variant pb-2 text-text-primary ">
 {t('drawer.assignedUser')}
 </h5>
 {equipment.user ? (
 <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl">
 {equipment.user.initials ? (
 <div className="w-12 h-12 rounded-full bg-primary-fixed text-primary flex items-center justify-center text-title-md font-bold shrink-0">
 {equipment.user.initials}
 </div>
 ) : (
 <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center shrink-0">
 <span className="material-symbols-outlined text-text-primary-variant">person</span>
 </div>
 )}
 <div>
 <p className="font-bold text-primary ">{equipment.user.name}</p>
 <p className="text-label-sm text-text-muted mt-1">ID: {equipment.user.id}</p>
 </div>
 </div>
 ) : (
 <div className="bg-surface-low border border-dashed border-border-variant p-6 rounded-xl flex items-center justify-center text-text-muted">
 {t('drawer.unassignedUser')}
 </div>
 )}
 </div>

 {/* Notes */}
 <div className="space-y-4">
 <h5 className="font-body-md font-bold border-b border-border-variant pb-2 text-text-primary ">
 {t('drawer.notes')}
 </h5>
 <div className="bg-surface-low p-4 rounded-xl border border-border-variant ">
 {equipment.notes ? (
 <p className="text-body-md text-text-primary-variant whitespace-pre-wrap leading-relaxed">
 {equipment.notes}
 </p>
 ) : (
 <p className="text-body-md text-text-muted italic">لا توجد ملاحظات</p>
 )}
 </div>
 </div>

 <div className="pt-2">
 <p className="text-label-sm text-text-muted flex gap-2">
 <span>{t('drawer.updatedAt')}:</span>
 <span dir="ltr">{formatDate(equipment.updated_at)}</span>
 </p>
 </div>

 </div>

 {/* Footer Actions */}
 <div className="p-6 border-t border-border-variant bg-surface-low flex gap-3 shrink-0">
 <button className="flex-1 bg-primary text-on-primary py-3 rounded-lg font-bold hover:bg-primary-container :bg-primary :text-white transition-colors">
 {t('drawer.editData')}
 </button>
 <button className="flex-1 border border-error text-error py-3 rounded-lg font-bold hover:bg-error/5 :bg-error-container/20 transition-colors">
 {t('drawer.withdrawEquipment')}
 </button>
 </div>
 </div>
 </>
 )
}
