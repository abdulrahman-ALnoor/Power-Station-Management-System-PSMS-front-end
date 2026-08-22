import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'
import { X, Search } from 'lucide-react'

interface AddMeterModalProps {
 isOpen: boolean
 onClose: () => void
}

export function AddMeterModal({ isOpen, onClose }: AddMeterModalProps) {
 const { t } = useTranslation('meters')

 if (!isOpen) return null

 return createPortal(
 <>
 {/* Backdrop */}
 <div
 className="fixed inset-0"
 style={{
 backgroundColor: 'rgba(15, 23, 42, 0.45)',
 zIndex: 9998,
 }}
 onClick={onClose}
 />

 {/* Modal Wrapper */}
 <div
 className="fixed inset-0 flex items-center justify-center p-6"
 style={{
 zIndex: 9999,
 pointerEvents: 'none',
 }}
 >
 {/* Modal Panel */}
 <div
 className="relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-y-auto max-h-[calc(100vh-48px)] flex flex-col bg-surface text-slate-900 "
 style={{
 pointerEvents: 'auto',
 }}
 >
 {/* Header */}
 <div className="border-b border-slate-200 p-6 flex justify-between items-start shrink-0">
 <div>
 <h3 className="font-headline-md text-headline-md font-bold text-primary ">
 {t('modal.addTitle')}
 </h3>
 <p className="text-slate-500 text-sm mt-1">
 {t('modal.subtitle')}
 </p>
 </div>
 <button
 className="p-2 hover:bg-slate-100 :bg-slate-800 rounded-full transition-colors text-slate-500 "
 onClick={onClose}
 type="button"
 >
 <X size={20} />
 </button>
 </div>

 {/* Body */}
 <div className="overflow-y-auto">
 <form
 className="p-6 md:p-8 space-y-8"
 onSubmit={(e) => {
 e.preventDefault()
 onClose()
 }}
 >
 {/* Section 1: Meter Information */}
 <section className="space-y-4">
 <h4 className="font-bold text-primary border-b border-slate-200 pb-2">
 {t('modal.sectionMeter')}
 </h4>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
 <div className="space-y-2">
 <label className="block font-medium text-sm text-slate-800 ">
 {t('modal.meterNumber')} <span className="text-error">*</span>
 </label>
 <input
 type="text"
 required
 placeholder="MT-000000"
 className="w-full px-4 h-11 bg-surface rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 "
 />
 </div>

 <div className="space-y-2 md:col-span-2">
 <label className="block font-medium text-sm text-slate-800 ">
 {t('modal.searchCustomer')} <span className="text-error">*</span>
 </label>
 <div className="relative">
 <Search className="absolute inset-inline-end-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 pointer-events-none" />
 <input
 type="text"
 required
 placeholder={t('modal.searchCustomerPlaceholder')}
 className="w-full pe-10 ps-4 h-11 bg-surface rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-slate-900 transition-all"
 />
 </div>
 </div>
 </div>
 </section>

 {/* Section 2: Installation Information */}
 <section className="space-y-4">
 <h4 className="font-bold text-primary border-b border-slate-200 pb-2">
 {t('modal.sectionInstallation')}
 </h4>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
 <div className="space-y-2">
 <label className="block font-medium text-sm text-slate-800 ">
 {t('modal.installationDate')}
 </label>
 <input
 type="date"
 className="w-full px-4 h-11 bg-surface rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 "
 />
 </div>

 <div className="space-y-2">
 <label className="block font-medium text-sm text-slate-800 ">
 {t('modal.installedBy')} <span className="text-error">*</span>
 </label>
 <div className="relative">
 <Search className="absolute inset-inline-end-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 pointer-events-none" />
 <input
 type="text"
 required
 placeholder={t('modal.installedByPlaceholder')}
 className="w-full pe-10 ps-4 h-11 bg-surface rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-slate-900 transition-all"
 />
 </div>
 </div>

 <div className="space-y-2 md:col-span-2">
 <label className="block font-medium text-sm text-slate-800 ">
 {t('modal.installationLocation')}
 </label>
 <textarea
 rows={3}
 className="w-full px-4 py-3 min-h-[100px] bg-surface rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 resize-none"
 />
 </div>
 </div>
 </section>

 {/* Section 3: Status */}
 <section className="space-y-4">
 <h4 className="font-bold text-primary border-b border-slate-200 pb-2">
 {t('modal.sectionStatus')}
 </h4>
 <div className="space-y-2 md:w-1/2">
 <label className="block font-medium text-sm text-slate-800 ">
 {t('modal.status')} <span className="text-error">*</span>
 </label>
 <select
 required
 defaultValue="active"
 className="w-full px-4 h-11 bg-surface rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none cursor-pointer text-slate-900 "
 >
 <option value="active">{t('status.active')}</option>
 <option value="disconnected">{t('status.disconnected')}</option>
 <option value="maintenance">{t('status.maintenance')}</option>
 <option value="damaged">{t('status.damaged')}</option>
 </select>
 </div>
 </section>

 {/* Actions */}
 <div className="flex gap-4 pt-6 border-t border-slate-200 mt-8">
 <button
 type="submit"
 className="flex-1 h-12 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 shadow-md active:scale-95 transition-all"
 >
 {t('modal.confirmAdd')}
 </button>
 <button
 type="button"
 onClick={onClose}
 className="flex-1 h-12 bg-slate-200 text-slate-900 font-bold rounded-lg border border-slate-300 hover:bg-slate-300 :bg-slate-700 transition-all"
 >
 {t('modal.cancel')}
 </button>
 </div>
 </form>
 </div>
 </div>
 </div>
 </>,
 document.body
 )
}
