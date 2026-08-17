import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Zap, User, Wrench, Printer, FileText, MapPin, Calendar, QrCode } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { Meter } from '../types'
import { cn } from '@/utils/cn'

interface MeterDetailsDrawerProps {
  meter: Meter | null
  isOpen: boolean
  onClose: () => void
}

export function MeterDetailsDrawer({ meter, isOpen, onClose }: MeterDetailsDrawerProps) {
  const { t } = useTranslation('meters')
  const { isRTL } = useLanguage()
  const [shouldRender, setShouldRender] = useState(false)

  // Delay unmount for animation
  useEffect(() => {
    if (isOpen) setShouldRender(true)
    else {
      const timer = setTimeout(() => setShouldRender(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!shouldRender || !meter) return null

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'maintenance': return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'damaged': return 'bg-error/10 text-error dark:bg-error/20 dark:text-red-400'
      case 'disconnected': return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      default: return 'bg-surface-dim text-on-surface-variant'
    }
  }

  // Animation classes
  const drawerClasses = cn(
    "fixed top-0 h-full w-full sm:w-[480px] bg-surface-white dark:bg-surface-container z-[70] shadow-[-10px_0_30px_rgba(0,0,0,0.1)] transition-transform duration-300 flex flex-col",
    isRTL ? "right-0" : "left-0",
    isOpen 
      ? "translate-x-0" 
      : (isRTL ? "translate-x-full" : "-translate-x-full")
  )

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      
      <div className={drawerClasses} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="p-6 border-b border-surface-container-high dark:border-border-muted flex justify-between items-center bg-primary text-surface-white dark:bg-surface-container-low dark:text-on-dark">
          <div className="flex items-center gap-3">
            <Zap size={24} />
            <h3 className="font-headline-md text-headline-md font-bold">{t('drawer.title')}</h3>
          </div>
          <button 
            className="p-2 hover:bg-white/10 dark:hover:bg-surface-container-high rounded-full transition-colors" 
            onClick={onClose}
            aria-label={t('drawer.close')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* Header Identity */}
          <div className="flex items-center gap-4 bg-surface-container-low dark:bg-surface-container p-4 rounded-xl border border-surface-container-high dark:border-border-muted">
            <div className="w-16 h-16 shrink-0 rounded-lg bg-primary-fixed dark:bg-primary flex items-center justify-center text-primary dark:text-on-dark">
              <Zap size={32} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-headline-md text-primary dark:text-on-dark truncate">{meter.meter_number}</h4>
              <p className="text-label-sm text-on-surface-variant dark:text-outline truncate flex items-center gap-1 mt-1">
                <QrCode size={14} /> {meter.qr_code}
              </p>
            </div>
            <div className="shrink-0">
              <span className={cn("px-3 py-1 rounded-full text-label-sm font-semibold", getStatusStyle(meter.status || ''))}>
                {meter.status ? t(`status.${meter.status}`) : '-'}
              </span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-4">
            <h5 className="font-headline-md text-[18px] text-primary dark:text-on-dark flex items-center gap-2">
              <User size={20} /> {t('table.customer')}
            </h5>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-3 bg-surface dark:bg-surface-container-lowest rounded-lg">
                <label className="text-label-sm text-on-surface-variant dark:text-outline block mb-1">{t('table.customer')}</label>
                <p className="font-semibold text-on-surface dark:text-on-dark truncate" title={meter.customerName}>{meter.customerName}</p>
              </div>
            </div>
          </div>

          {/* Installation Info */}
          <div className="space-y-4">
            <h5 className="font-headline-md text-[18px] text-primary dark:text-on-dark flex items-center gap-2">
              <Wrench size={20} /> {t('modal.sectionInstallation')}
            </h5>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-surface dark:bg-surface-container-lowest rounded-lg">
                <label className="text-label-sm text-on-surface-variant dark:text-outline flex items-center gap-1 mb-1">
                  <Calendar size={14} /> {t('table.installationDate')}
                </label>
                <p className="font-semibold text-on-surface dark:text-on-dark">{meter.installation_date || '-'}</p>
              </div>
              <div className="p-3 bg-surface dark:bg-surface-container-lowest rounded-lg">
                <label className="text-label-sm text-on-surface-variant dark:text-outline flex items-center gap-1 mb-1">
                  <User size={14} /> {t('table.installedBy')}
                </label>
                <p className="font-semibold text-on-surface dark:text-on-dark">{meter.installedByName || meter.installed_by || '-'}</p>
              </div>
              <div className="p-3 bg-surface dark:bg-surface-container-lowest rounded-lg col-span-2">
                <label className="text-label-sm text-on-surface-variant dark:text-outline flex items-center gap-1 mb-1">
                  <MapPin size={14} /> {t('table.installationLocation')}
                </label>
                <p className="font-semibold text-on-surface dark:text-on-dark">{meter.installation_location || '-'}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-surface-container-high dark:border-border-muted grid grid-cols-2 gap-4 bg-surface-container-lowest dark:bg-surface-container">
          <button className="px-4 py-3 bg-surface-container-high dark:bg-surface text-on-surface dark:text-on-dark font-bold rounded-xl hover:bg-surface-container-highest dark:hover:bg-surface-container-high transition-all flex items-center justify-center gap-2">
            <Printer size={20} /> <span className="truncate">{t('drawer.printReport')}</span>
          </button>
          <button className="px-4 py-3 bg-primary dark:bg-primary-fixed dark:text-primary text-surface-white font-bold rounded-xl hover:bg-primary-container dark:hover:bg-primary dark:hover:text-white transition-all flex items-center justify-center gap-2 shadow-md">
            <FileText size={20} /> <span className="truncate">{t('drawer.viewInvoices')}</span>
          </button>
        </div>
      </div>
    </>
  )
}
