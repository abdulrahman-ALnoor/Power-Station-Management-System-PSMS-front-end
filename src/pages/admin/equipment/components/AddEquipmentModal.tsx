import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useLanguage } from '@/hooks/useLanguage'

interface AddEquipmentModalProps {
 isOpen: boolean
 onClose: () => void
}

export function AddEquipmentModal({ isOpen, onClose }: AddEquipmentModalProps) {
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

 if (!shouldRender) return null

 const handleBackdropClick = (e: React.MouseEvent) => {
 if (e.target === e.currentTarget) {
 onClose()
 }
 }

 const inputClasses = "w-full px-4 py-2 bg-surface-low border border-border-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary :border-primary-fixed :ring-primary-fixed text-body-md text-text-primary transition-all placeholder:text-text-muted"
 const labelClasses = "block text-label-sm font-bold text-text-primary mb-2"

 return (
 <div 
 className={cn(
 "fixed inset-0 z-[70] overflow-y-auto transition-opacity duration-300",
 isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
 )}
 >
 <div 
 className="fixed inset-0 bg-primary/40 backdrop-blur-sm"
 onClick={handleBackdropClick}
 />
 
 <div className="relative min-h-screen flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
 <div 
 className={cn(
 "bg-surface w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300",
 isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
 )}
 >
 {/* Header */}
 <div className="p-6 border-b border-border-variant flex items-center justify-between">
 <h3 className="font-headline-md font-bold text-primary ">{t('modal.title')}</h3>
 <button 
 className="text-text-muted hover:text-text-primary :text-white p-2 rounded-full hover:bg-surface-container :bg-surface-container-high transition-colors"
 onClick={onClose}
 aria-label={t('drawer.close')}
 >
 <X size={20} />
 </button>
 </div>

 {/* Form */}
 <form 
 className="p-6 grid grid-cols-2 gap-6"
 onSubmit={(e) => { e.preventDefault(); onClose(); }}
 >
 <div className="col-span-2 sm:col-span-1">
 <label className={labelClasses}>{t('modal.equipmentName')}</label>
 <input type="text" className={inputClasses} placeholder={t('modal.equipmentNamePlaceholder')} required />
 </div>

 <div className="col-span-2 sm:col-span-1">
 <label className={labelClasses}>{t('modal.serialNumber')}</label>
 <input type="text" className={inputClasses} placeholder={t('modal.serialNumberPlaceholder')} />
 </div>

 <div className="col-span-2 sm:col-span-1">
 <label className={labelClasses}>{t('modal.initialStatus')}</label>
 <select className={inputClasses}>
 <option value="available">{t('status.available')}</option>
 <option value="maintenance">{t('status.maintenance')}</option>
 <option value="damaged">{t('status.damaged')}</option>
 <option value="lost">{t('status.lost')}</option>
 </select>
 </div>

 <div className="col-span-2 sm:col-span-1">
 <label className={labelClasses}>{t('modal.assignTo')}</label>
 <select className={inputClasses}>
 <option value="">{t('modal.assignToPlaceholder')}</option>
 <option value="12">أحمد منصور</option>
 <option value="15">خالد العتيبي</option>
 </select>
 </div>

 <div className="col-span-2">
 <label className={labelClasses}>{t('modal.notes')}</label>
 <textarea className={inputClasses} rows={4} placeholder={t('modal.notesPlaceholder')} />
 </div>

 {/* Actions */}
 <div className="col-span-2 flex justify-end gap-3 mt-4 pt-6 border-t border-border-variant ">
 <button 
 type="button"
 onClick={onClose}
 className="px-6 py-2 border border-border-variant text-text-primary rounded-lg font-bold hover:bg-surface-container :bg-surface-container-high transition-colors"
 >
 {t('modal.cancel')}
 </button>
 <button 
 type="submit"
 className="px-10 py-2 bg-primary text-on-primary rounded-lg font-bold hover:bg-primary-container :bg-primary :text-white transition-colors shadow-md"
 >
 {t('modal.save')}
 </button>
 </div>
 </form>
 </div>
 </div>
 </div>
 )
}
