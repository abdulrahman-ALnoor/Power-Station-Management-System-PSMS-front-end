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
      case 'active': return 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'maintenance': return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'damaged': return 'bg-error/10 text-error dark:bg-error/20 dark:text-red-400'
      case 'disconnected': return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      default: return 'bg-surface-dim text-on-surface-variant'
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
    <div className="bg-surface-white dark:bg-surface-container-low rounded-b-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-start border-collapse">
          <thead>
            <tr className="bg-surface-container-low dark:bg-surface-container border-b border-surface-container-high dark:border-border-muted">
              <th className="px-6 py-4 font-headline-md text-[14px] text-on-surface-variant dark:text-outline uppercase tracking-wider text-start">{t('table.meterNumber')}</th>
              <th className="px-6 py-4 font-headline-md text-[14px] text-on-surface-variant dark:text-outline uppercase tracking-wider text-start">{t('table.qrCode')}</th>
              <th className="px-6 py-4 font-headline-md text-[14px] text-on-surface-variant dark:text-outline uppercase tracking-wider text-start">{t('table.installationDate')}</th>
              <th className="px-6 py-4 font-headline-md text-[14px] text-on-surface-variant dark:text-outline uppercase tracking-wider text-start">{t('table.installationLocation')}</th>
              <th className="px-6 py-4 font-headline-md text-[14px] text-on-surface-variant dark:text-outline uppercase tracking-wider text-start">{t('table.status')}</th>
              <th className="px-6 py-4 font-headline-md text-[14px] text-on-surface-variant dark:text-outline uppercase tracking-wider text-start">{t('table.installedBy')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high dark:divide-border-muted">
            {MOCK_METERS.map((meter) => (
              <tr 
                key={meter.id} 
                className="hover:bg-surface-container-lowest dark:hover:bg-surface-container/50 transition-colors cursor-pointer group"
                onClick={() => onRowClick(meter.id)}
              >
                <td className="px-6 py-4 font-body-md text-primary dark:text-on-dark font-bold">{meter.meter_number}</td>
                <td className="px-6 py-4 font-table-cell text-on-surface-variant dark:text-outline">
                  <div className="flex items-center gap-2">
                    <QrCode size={16} />
                    <span>{meter.qr_code}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-table-cell text-on-surface-variant dark:text-outline">{meter.installation_date || '-'}</td>
                <td className="px-6 py-4 font-table-cell text-on-surface-variant dark:text-outline max-w-[200px] truncate" title={meter.installation_location || undefined}>{meter.installation_location || '-'}</td>
                <td className="px-6 py-4 font-table-cell">
                  <span className={cn("px-3 py-1 rounded-full text-label-sm font-semibold flex items-center gap-1 w-fit", getStatusStyle(meter.status || ''))}>
                    <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", getStatusIndicator(meter.status || ''))} /> 
                    {meter.status ? t(`status.${meter.status}`) : '-'}
                  </span>
                </td>
                <td className="px-6 py-4 font-table-cell text-on-surface-variant dark:text-outline">{meter.installedByName || meter.installed_by}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State Example (Hidden normally) */}
      {MOCK_METERS.length === 0 && (
        <div className="py-24 flex flex-col items-center justify-center text-center">
          <h3 className="font-headline-md text-headline-md text-primary dark:text-on-dark mb-2">{t('emptyState.title')}</h3>
          <p className="text-on-surface-variant dark:text-outline max-w-md">{t('emptyState.description')}</p>
        </div>
      )}

      {/* Pagination */}
      <div className="p-6 border-t border-surface-container-high dark:border-border-muted flex justify-between items-center bg-surface-container-lowest dark:bg-surface-container">
        <div className="flex items-center gap-4">
          <span className="text-label-sm text-on-surface-variant dark:text-outline">
            {t('pagination.showing', { count: 10, total: '12,450' })}
          </span>
          <select className="bg-surface-container-low dark:bg-surface border-none rounded-lg px-2 py-1 text-label-sm focus:ring-0 cursor-pointer dark:text-on-dark outline-none">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>
        <div className="flex gap-1">
          <button className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50 dark:hover:bg-surface" disabled>
            {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          <button className="w-10 h-10 rounded-lg bg-primary text-surface-white font-bold dark:bg-primary-fixed dark:text-primary">1</button>
          <button className="w-10 h-10 rounded-lg hover:bg-surface-container-low text-on-surface-variant dark:text-outline dark:hover:bg-surface">2</button>
          <button className="w-10 h-10 rounded-lg hover:bg-surface-container-low text-on-surface-variant dark:text-outline dark:hover:bg-surface">3</button>
          <button className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-surface">
            {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  )
}
