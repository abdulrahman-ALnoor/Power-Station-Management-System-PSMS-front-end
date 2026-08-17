import { useTranslation } from 'react-i18next'
import { X, Camera } from 'lucide-react'

interface AddEmployeeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddEmployeeModal({ isOpen, onClose }: AddEmployeeModalProps) {
  const { t } = useTranslation('employees')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-surface w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 dark:bg-surface-container-low"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="bg-primary p-6 text-on-primary flex justify-between items-center">
          <h3 id="modal-title" className="font-headline-md text-headline-md font-bold">
            {t('modal.addTitle')}
          </h3>
          <button 
            className="text-on-primary/70 hover:text-on-primary transition-colors"
            onClick={onClose}
            aria-label={t('common.close')}
          >
            <X size={24} />
          </button>
        </div>
        
        <form className="p-8 space-y-6" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm font-bold text-primary dark:text-on-dark px-1">
                {t('modal.fullName')} <span className="text-error">*</span>
              </label>
              <input 
                type="text" 
                className="w-full border border-border-muted rounded-lg px-4 py-2 bg-background focus:ring-2 focus:ring-primary focus:border-primary dark:bg-surface dark:border-border dark:text-on-dark outline-none transition-colors" 
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm font-bold text-primary dark:text-on-dark px-1">
                {t('modal.email')} <span className="text-error">*</span>
              </label>
              <input 
                type="email" 
                className="w-full border border-border-muted rounded-lg px-4 py-2 bg-background focus:ring-2 focus:ring-primary focus:border-primary dark:bg-surface dark:border-border dark:text-on-dark outline-none transition-colors" 
                required
              />
            </div>
            
            <div className="space-y-1 md:col-span-2">
              <label className="font-label-sm text-label-sm font-bold text-primary dark:text-on-dark px-1">
                {t('modal.phone')}
              </label>
              <input 
                type="tel" 
                maxLength={30}
                className="w-full border border-border-muted rounded-lg px-4 py-2 bg-background focus:ring-2 focus:ring-primary focus:border-primary dark:bg-surface dark:border-border dark:text-on-dark outline-none transition-colors text-start" 
                dir="ltr"
              />
            </div>

            <div className="space-y-1">
              <label className="font-label-sm text-label-sm font-bold text-primary dark:text-on-dark px-1">
                {t('modal.password')} <span className="text-error">*</span>
              </label>
              <input 
                type="password" 
                className="w-full border border-border-muted rounded-lg px-4 py-2 bg-background focus:ring-2 focus:ring-primary focus:border-primary dark:bg-surface dark:border-border dark:text-on-dark outline-none transition-colors text-start" 
                dir="ltr"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-label-sm text-label-sm font-bold text-primary dark:text-on-dark px-1">
                {t('modal.passwordConfirmation')} <span className="text-error">*</span>
              </label>
              <input 
                type="password" 
                className="w-full border border-border-muted rounded-lg px-4 py-2 bg-background focus:ring-2 focus:ring-primary focus:border-primary dark:bg-surface dark:border-border dark:text-on-dark outline-none transition-colors text-start" 
                dir="ltr"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm font-bold text-primary dark:text-on-dark px-1">
                {t('modal.role')} <span className="text-error">*</span>
              </label>
              <select required className="w-full border border-border-muted rounded-lg px-4 py-2 bg-background focus:ring-2 focus:ring-primary focus:border-primary dark:bg-surface dark:border-border dark:text-on-dark outline-none transition-colors cursor-pointer">
                <option value="manager">{t('toolbar.roles.manager')}</option>
                <option value="engineer">{t('toolbar.roles.engineer')}</option>
                <option value="reader">{t('toolbar.roles.reader')}</option>
                <option value="accountant">{t('toolbar.roles.accountant')}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-label-sm text-label-sm font-bold text-primary dark:text-on-dark px-1">
                {t('modal.status')} <span className="text-error">*</span>
              </label>
              <select required className="w-full border border-border-muted rounded-lg px-4 py-2 bg-background focus:ring-2 focus:ring-primary focus:border-primary dark:bg-surface dark:border-border dark:text-on-dark outline-none transition-colors cursor-pointer">
                <option value="active">{t('status.active')}</option>
                <option value="inactive">{t('status.inactive')}</option>
              </select>
            </div>
            
          </div>
          
          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border dark:border-border-muted">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-on-surface-variant font-bold hover:bg-surface-container transition-colors dark:text-outline dark:hover:bg-surface-high"
            >
              {t('modal.cancel')}
            </button>
            <button 
              type="submit" 
              className="px-8 py-2 rounded-lg bg-primary text-on-primary font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 dark:bg-primary-fixed dark:text-primary dark:shadow-none"
            >
              {t('modal.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
