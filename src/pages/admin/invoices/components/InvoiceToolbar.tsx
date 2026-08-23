import { useTranslation } from 'react-i18next'
import { Search, Download, RefreshCw, Plus } from 'lucide-react'

export function InvoiceToolbar() {
 const { t } = useTranslation('invoices')

 return (
 <div className="bg-surface p-6 rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] flex flex-wrap items-center justify-between gap-4">
 
 {/* Filters and Search */}
 <div className="flex flex-wrap items-center gap-4 flex-grow w-full md:w-auto">
 {/* Search */}
 <div className="relative flex-1 min-w-[240px] max-w-full md:max-w-[420px]">
 <Search className="absolute inset-inline-start-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5 pointer-events-none" />
 <input 
 type="text" 
 placeholder={t('toolbar.searchPlaceholder')}
 className="w-full ps-12 pe-4 py-2 h-[44px] md:h-[48px] bg-surface-low border border-border-variant rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary :border-primary-fixed :ring-primary-fixed text-body-md text-text-primary transition-all"
 />
 </div>

 {/* Filters */}
 <select 
 className="w-full md:w-[180px] h-[44px] md:h-[48px] bg-surface-low border border-border-variant rounded-xl px-4 py-2 text-body-md text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary :border-primary-fixed :ring-primary-fixed cursor-pointer transition-all"
 aria-label={t('toolbar.status')}
 >
 <option value="">{t('toolbar.status')}</option>
 <option value="paid">{t('status.paid')}</option>
 <option value="partially_paid">{t('status.partially_paid')}</option>
 </select>
 </div>

 {/* Actions */}
 <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0 justify-end">
 <button 
 className="flex items-center gap-2 px-6 py-2 h-[44px] md:h-[48px] bg-primary text-on-primary rounded-xl font-bold hover:bg-primary-container :bg-primary :text-white transition-colors shadow-md active:scale-95"
 >
 <Plus size={20} />
 <span>{t('toolbar.createInvoice')}</span>
 </button>
 
 <button 
 className="p-2 h-[44px] w-[44px] md:h-[48px] md:w-[48px] flex items-center justify-center border border-border-variant text-text-primary-variant rounded-xl hover:bg-surface-container :bg-surface transition-colors"
 aria-label={t('toolbar.export')}
 title={t('toolbar.export')}
 >
 <Download size={20} />
 </button>
 
 <button 
 className="p-2 h-[44px] w-[44px] md:h-[48px] md:w-[48px] flex items-center justify-center border border-border-variant text-text-primary-variant rounded-xl hover:bg-surface-container :bg-surface transition-colors"
 aria-label={t('toolbar.refresh')}
 title={t('toolbar.refresh')}
 >
 <RefreshCw size={20} />
 </button>
 </div>
 </div>
 )
}
