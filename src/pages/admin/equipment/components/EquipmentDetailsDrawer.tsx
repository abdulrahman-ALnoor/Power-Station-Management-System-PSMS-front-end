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
      case 'available': return 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-500'
      case 'maintenance': return 'bg-amber-50 text-amber-gold dark:bg-amber-900/30 dark:text-amber-500'
      case 'damaged': return 'bg-error-container text-error dark:bg-error-container/20 dark:text-error'
      case 'lost': return 'bg-error-container text-error dark:bg-error-container/20 dark:text-error'
      default: return 'bg-surface-dim text-on-surface-variant'
    }
  }

  const drawerClasses = cn(
    "fixed top-0 h-full w-full sm:w-[480px] bg-surface-white dark:bg-surface-container z-[70] shadow-2xl transition-transform duration-300 flex flex-col",
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
          "fixed inset-0 bg-primary/40 dark:bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      
      <div className={drawerClasses} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="p-6 border-b border-outline-variant dark:border-border-muted flex justify-between items-center bg-primary text-on-primary dark:bg-surface-container-low dark:text-on-dark">
          <h3 className="font-headline-md font-bold">{t('drawer.title')}</h3>
          <button 
            className="hover:bg-white/10 dark:hover:bg-surface-container-high p-2 rounded-full transition-colors" 
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
            <div className="w-full h-48 bg-surface-container-low dark:bg-surface-container rounded-xl overflow-hidden relative flex items-center justify-center">
              <div className="w-full h-full bg-primary/5 dark:bg-primary-fixed/5 flex items-center justify-center">
                 <span className="text-outline text-label-sm">{t('drawer.imagePlaceholder')}</span>
              </div>
              <span className={cn("absolute top-4 inset-inline-end-4 px-3 py-1 rounded-full text-[12px] font-bold shadow-md", getStatusStyle(equipment.status))}>
                {equipment.status ? t(`status.${equipment.status}`) : '-'}
              </span>
            </div>
            <div>
              <h4 className="font-headline-md font-bold text-primary dark:text-on-dark">{equipment.equipment_name}</h4>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-surface-container-lowest dark:bg-surface-container-low p-3 rounded-lg border border-outline-variant dark:border-border-muted">
                  <p className="text-label-sm text-outline mb-1">{t('drawer.equipmentId')}</p>
                  <p className="font-bold text-on-surface dark:text-on-dark">{equipment.id}</p>
                </div>
                <div className="bg-surface-container-lowest dark:bg-surface-container-low p-3 rounded-lg border border-outline-variant dark:border-border-muted">
                  <p className="text-label-sm text-outline mb-1">{t('drawer.serialNumber')}</p>
                  <p className="font-bold text-on-surface dark:text-on-dark">{equipment.serial_number || '-'}</p>
                </div>
                <div className="bg-surface-container-lowest dark:bg-surface-container-low p-3 rounded-lg border border-outline-variant dark:border-border-muted">
                  <p className="text-label-sm text-outline mb-1">{t('drawer.createdAt')}</p>
                  <p className="font-bold text-on-surface dark:text-on-dark flex items-center gap-2">
                    <Calendar size={14} className="text-outline" />
                    <span dir="ltr">{formatDate(equipment.created_at)}</span>
                  </p>
                </div>
                <div className="bg-surface-container-lowest dark:bg-surface-container-low p-3 rounded-lg border border-outline-variant dark:border-border-muted">
                  <p className="text-label-sm text-outline mb-1">{t('drawer.createdBy')}</p>
                  <p className="font-bold text-on-surface dark:text-on-dark">{equipment.createdBy?.name || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned User */}
          <div className="space-y-4">
            <h5 className="font-body-md font-bold border-b border-outline-variant dark:border-border-muted pb-2 text-on-surface dark:text-on-dark">
              {t('drawer.assignedUser')}
            </h5>
            {equipment.user ? (
              <div className="flex items-center gap-4 bg-surface-container-low dark:bg-surface-container p-4 rounded-xl">
                {equipment.user.initials ? (
                  <div className="w-12 h-12 rounded-full bg-primary-fixed dark:bg-primary-fixed/20 text-primary dark:text-primary-fixed flex items-center justify-center text-title-md font-bold shrink-0">
                    {equipment.user.initials}
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-surface-variant dark:bg-surface-container-high flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-on-surface-variant">person</span>
                  </div>
                )}
                <div>
                  <p className="font-bold text-primary dark:text-on-dark">{equipment.user.name}</p>
                  <p className="text-label-sm text-outline mt-1">ID: {equipment.user.id}</p>
                </div>
              </div>
            ) : (
              <div className="bg-surface-container-lowest dark:bg-surface-container-low border border-dashed border-outline-variant dark:border-border-muted p-6 rounded-xl flex items-center justify-center text-outline">
                {t('drawer.unassignedUser')}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h5 className="font-body-md font-bold border-b border-outline-variant dark:border-border-muted pb-2 text-on-surface dark:text-on-dark">
              {t('drawer.notes')}
            </h5>
            <div className="bg-surface-container-lowest dark:bg-surface-container-low p-4 rounded-xl border border-outline-variant dark:border-border-muted">
              {equipment.notes ? (
                <p className="text-body-md text-on-surface-variant dark:text-on-dark whitespace-pre-wrap leading-relaxed">
                  {equipment.notes}
                </p>
              ) : (
                <p className="text-body-md text-outline italic">لا توجد ملاحظات</p>
              )}
            </div>
          </div>

          <div className="pt-2">
            <p className="text-label-sm text-outline flex gap-2">
              <span>{t('drawer.updatedAt')}:</span>
              <span dir="ltr">{formatDate(equipment.updated_at)}</span>
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-outline-variant dark:border-border-muted bg-surface-container-lowest dark:bg-surface-container-low flex gap-3 shrink-0">
          <button className="flex-1 bg-primary text-on-primary py-3 rounded-lg font-bold hover:bg-primary-container dark:bg-primary-fixed dark:text-primary dark:hover:bg-primary dark:hover:text-white transition-colors">
            {t('drawer.editData')}
          </button>
          <button className="flex-1 border border-error text-error py-3 rounded-lg font-bold hover:bg-error/5 dark:hover:bg-error-container/20 transition-colors">
            {t('drawer.withdrawEquipment')}
          </button>
        </div>
      </div>
    </>
  )
}
