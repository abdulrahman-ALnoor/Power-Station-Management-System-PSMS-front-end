import { useTranslation } from 'react-i18next'
import { MOCK_METERS } from '../data/mockData'
import { ChevronLeft, ChevronRight, QrCode } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'

interface MeterTableProps {
 onRowClick: (id: number) => void
}

export function MeterTable({ onRowClick }: MeterTableProps) {
 const { t } = useTranslation('meters')
 const { isRTL } = useLanguage()

 const getStatusStyle = (status: string) => {
 switch (status) {
 case 'active': return 'bg-green-50 text-green-700 '
 case 'maintenance': return 'bg-blue-50 text-blue-700 '
 case 'damaged': return 'bg-error/10 text-error '
 case 'disconnected': return 'bg-amber-50 text-amber-700 '
 default: return 'bg-surface-dim text-text-primary-variant'
 }
 }

 const getStatusIndicator = (status: string) => {
 switch (status) {
 case 'active': return 'bg-green-600'
 case 'maintenance': return 'bg-blue-600'
 case 'damaged': return 'bg-error'
 case 'disconnected': return 'bg-amber-600'
 default: return 'bg-outline'
 }
 }

 return (
 <div className="bg-surface rounded-b-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-start border-collapse">
 <thead>
 <tr className="bg-surface-container-low border-b border-surface-container-high ">
 <th className="px-6 py-4 font-headline-md text-[14px] text-text-primary-variant uppercase tracking-wider text-start">{t('table.meterNumber')}</th>
 <th className="px-6 py-4 font-headline-md text-[14px] text-text-primary-variant uppercase tracking-wider text-start">{t('table.qrCode')}</th>
 <th className="px-6 py-4 font-headline-md text-[14px] text-text-primary-variant uppercase tracking-wider text-start">{t('table.installationDate')}</th>
 <th className="px-6 py-4 font-headline-md text-[14px] text-text-primary-variant uppercase tracking-wider text-start">{t('table.installationLocation')}</th>
 <th className="px-6 py-4 font-headline-md text-[14px] text-text-primary-variant uppercase tracking-wider text-start">{t('table.status')}</th>
 <th className="px-6 py-4 font-headline-md text-[14px] text-text-primary-variant uppercase tracking-wider text-start">{t('table.installedBy')}</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-surface-container-high ">
 {MOCK_METERS.map((meter) => (
 <tr 
 key={meter.id} 
 className="hover:bg-surface-low :bg-surface-container/50 transition-colors cursor-pointer group"
 onClick={() => onRowClick(meter.id)}
 >
 <td className="px-6 py-4 font-body-md text-primary font-bold">{meter.meter_number}</td>
 <td className="px-6 py-4 font-table-cell text-text-primary-variant ">
 <div className="flex items-center gap-2">
 <QrCode size={16} />
 <span>{meter.qr_code}</span>
 </div>
 </td>
 <td className="px-6 py-4 font-table-cell text-text-primary-variant ">{meter.installation_date || '-'}</td>
 <td className="px-6 py-4 font-table-cell text-text-primary-variant max-w-[200px] truncate" title={meter.installation_location || undefined}>{meter.installation_location || '-'}</td>
 <td className="px-6 py-4 font-table-cell">
 <span className={cn("px-3 py-1 rounded-full text-label-sm font-semibold flex items-center gap-1 w-fit", getStatusStyle(meter.status || ''))}>
 <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", getStatusIndicator(meter.status || ''))} /> 
 {meter.status ? t(`status.${meter.status}`) : '-'}
 </span>
 </td>
 <td className="px-6 py-4 font-table-cell text-text-primary-variant ">{meter.installedByName || meter.installed_by}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 {/* Empty State Example (Hidden normally) */}
 {MOCK_METERS.length === 0 && (
 <div className="py-24 flex flex-col items-center justify-center text-center">
 <h3 className="font-headline-md text-headline-md text-primary mb-2">{t('emptyState.title')}</h3>
 <p className="text-text-primary-variant max-w-md">{t('emptyState.description')}</p>
 </div>
 )}

 {/* Pagination */}
 <div className="p-6 border-t border-surface-container-high flex justify-between items-center bg-surface-low ">
 <div className="flex items-center gap-4">
 <span className="text-label-sm text-text-primary-variant ">
 {t('pagination.showing', { count: 10, total: '12,450' })}
 </span>
 <select className="bg-surface-container-low border-none rounded-lg px-2 py-1 text-label-sm focus:ring-0 cursor-pointer outline-none">
 <option>10</option>
 <option>25</option>
 <option>50</option>
 </select>
 </div>
 <div className="flex gap-1">
 <button className="p-2 rounded-lg text-text-primary-variant hover:bg-surface-container-low disabled:opacity-50 :bg-surface" disabled>
 {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
 </button>
 <button className="w-10 h-10 rounded-lg bg-primary text-surface-white font-bold ">1</button>
 <button className="w-10 h-10 rounded-lg hover:bg-surface-container-low text-text-primary-variant :bg-surface">2</button>
 <button className="w-10 h-10 rounded-lg hover:bg-surface-container-low text-text-primary-variant :bg-surface">3</button>
 <button className="p-2 rounded-lg text-text-primary-variant hover:bg-surface-container-low :bg-surface">
 {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
 </button>
 </div>
 </div>
 </div>
 )
}
