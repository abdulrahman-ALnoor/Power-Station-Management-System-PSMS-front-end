import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MoreVertical, SearchX, Clock, Eye, Edit2, Trash2, RefreshCw } from 'lucide-react'
import { MeterReading } from '../types'
import { useLanguage } from '@/hooks/useLanguage'
import { ReadingStatusBadge } from './ReadingStatusBadge'

interface MeterReadingTableProps {
 data: MeterReading[]
 onViewDetails: (reading: MeterReading) => void
 onChangeStatus?: (reading: MeterReading) => void
 onEdit?: (reading: MeterReading) => void
 onDelete?: (reading: MeterReading) => void
}

export function MeterReadingTable({ data, onViewDetails, onChangeStatus, onEdit, onDelete }: MeterReadingTableProps) {
 const { t } = useTranslation('readings')
 const { isRTL } = useLanguage()

 const [activeMenu, setActiveMenu] = useState<number | null>(null)
 const menuRef = useRef<HTMLDivElement>(null)

 useEffect(() => {
 function handleClickOutside(event: MouseEvent) {
 if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
 setActiveMenu(null)
 }
 }
 document.addEventListener('mousedown', handleClickOutside)
 return () => document.removeEventListener('mousedown', handleClickOutside)
 }, [])

 const formatNumber = (val: number) => new Intl.NumberFormat('en-US').format(val)
 const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'YER' }).format(val)



 const getMethodText = (method: MeterReading['reading_method']) => {
 switch (method) {
 case 'manual': return t('method.manual')
 case 'qr_scan': return t('method.qr_scan')
 default: return t('method.unspecified')
 }
 }

 if (data.length === 0) {
 return (
 <div className="bg-surface rounded-2xl shadow-sm border border-border p-12 flex flex-col items-center justify-center text-center">
 <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-text-muted mb-4">
 <SearchX size={32} />
 </div>
 <h3 className="font-headline-sm font-bold text-text-primary mb-1">
 {t('table.emptyState.title')}
 </h3>
 <p className="text-label-md text-text-muted ">
 {t('table.emptyState.description')}
 </p>
 </div>
 )
 }

 return (
 <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-sm text-start" dir={isRTL ? 'rtl' : 'ltr'}>
 <thead className="bg-surface-low text-text-muted font-label-md font-bold uppercase tracking-wider border-b border-border">
 <tr>
 <th className="px-6 py-4 text-start">{t('table.columns.readingId')}</th>
 <th className="px-6 py-4 text-start">{t('table.columns.meterNumber')}</th>
 <th className="px-6 py-4 text-start whitespace-nowrap">{t('table.columns.previousReading')}</th>
 <th className="px-6 py-4 text-start whitespace-nowrap">{t('table.columns.currentReading')}</th>
 <th className="px-6 py-4 text-start">{t('table.columns.consumption')}</th>
 <th className="px-6 py-4 text-start">{t('table.columns.readingCost')}</th>
 <th className="px-6 py-4 text-start">{t('table.columns.readingDate')}</th>
 <th className="px-6 py-4 text-start">{t('table.columns.status')}</th>
 <th className="px-6 py-4 text-end">{t('table.columns.actions')}</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-outline/10">
 {data.map((reading) => (
 <tr
 key={reading.id}
 className="hover:bg-surface-low :bg-surface-container/20 transition-colors group"
 >
 <td className="px-6 py-4 text-text-primary-variant ">
 #{reading.id}
 </td>
 <td className="px-6 py-4">
 <div className="font-bold text-text-primary ">
 {reading.meter?.meter_number || reading.meter_id}
 </div>
 <div className="text-xs text-text-muted mt-0.5">
 {getMethodText(reading.reading_method)}
 </div>
 </td>
 <td className="px-6 py-4 text-text-primary-variant " dir="ltr">
 {formatNumber(reading.previous_reading)}
 </td>
 <td className="px-6 py-4 font-medium text-text-primary " dir="ltr">
 {formatNumber(reading.current_reading)}
 </td>
 <td className="px-6 py-4 font-bold text-accent " dir="ltr">
 {formatNumber(reading.consumption)}
 </td>
 <td className="px-6 py-4 font-bold text-teal-600 " dir="ltr">
 {formatCurrency(reading.reading_cost)}
 </td>
 <td className="px-6 py-4 text-text-primary-variant whitespace-nowrap">
 {reading.reading_date}
 </td>
 <td className="px-6 py-4">
 <ReadingStatusBadge status={reading.status} />
 </td>
 <td className="px-6 py-4 text-end relative">
 <button
 onClick={() => setActiveMenu(activeMenu === reading.id ? null : reading.id)}
 className={`p-2 rounded-lg transition-colors ${
 activeMenu === reading.id
 ? 'text-primary bg-primary/10'
 : 'text-text-muted hover:text-primary hover:bg-primary/10'
 }`}
 title={t('actions.options', 'الخيارات')}
 >
 <MoreVertical size={18} />
 </button>

 {/* Dropdown Menu */}
 {activeMenu === reading.id && (
 <div
 ref={menuRef}
 className={`absolute z-50 mt-2 w-48 bg-surface rounded-xl shadow-lg border border-border py-1 ${
 isRTL ? 'left-8' : 'right-8'
 }`}
 style={{ top: '100%', marginTop: '-10px' }}
 >
 <button
 onClick={() => {
 onViewDetails(reading)
 setActiveMenu(null)
 }}
 className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-start text-text-primary hover:bg-surface-low :bg-surface-container/50 transition-colors"
 >
 <Eye size={16} className="text-text-muted" />
 {t('actions.viewDetails', 'عرض التفاصيل')}
 </button>

 {onChangeStatus && (
 <button
 onClick={() => {
 onChangeStatus(reading)
 setActiveMenu(null)
 }}
 className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-start text-text-primary hover:bg-surface-low :bg-surface-container/50 transition-colors"
 >
 <RefreshCw size={16} className="text-text-muted" />
 {t('actions.changeStatus', 'تغيير الحالة')}
 </button>
 )}

 {onEdit && (
 <button
 onClick={() => {
 onEdit(reading)
 setActiveMenu(null)
 }}
 className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-start text-text-primary hover:bg-surface-low :bg-surface-container/50 transition-colors"
 >
 <Edit2 size={16} className="text-text-muted" />
 {t('actions.edit', 'تعديل')}
 </button>
 )}

 {onDelete && (
 <button
 onClick={() => {
 onDelete(reading)
 setActiveMenu(null)
 }}
 className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-start text-error hover:bg-error/10 transition-colors"
 >
 <Trash2 size={16} />
 {t('actions.delete', 'حذف')}
 </button>
 )}
 </div>
 )}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )
}
