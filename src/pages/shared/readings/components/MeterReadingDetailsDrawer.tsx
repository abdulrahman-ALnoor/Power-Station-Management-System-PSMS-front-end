import React from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { X, Calendar, User, FileText, CheckCircle2, XCircle, Clock, Hash } from 'lucide-react'
import { MeterReading } from '../types'
import { useLanguage } from '@/hooks/useLanguage'

interface MeterReadingDetailsDrawerProps {
 reading: MeterReading | null
 isOpen: boolean
 onClose: () => void
}

export function MeterReadingDetailsDrawer({ reading, isOpen, onClose }: MeterReadingDetailsDrawerProps) {
 const { t } = useTranslation('readings')
 const { isRTL } = useLanguage()

 if (!isOpen || !reading) return null

 const formatNumber = (val: number) => new Intl.NumberFormat('en-US').format(val)
 const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'YER' }).format(val)

 const getStatusBadge = (status: MeterReading['status']) => {
 switch (status) {
 case 'approved':
 return (
 <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-success/10 text-success">
 <CheckCircle2 size={16} />
 {t('status.approved')}
 </span>
 )
 case 'rejected':
 return (
 <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-error/10 text-error">
 <XCircle size={16} />
 {t('status.rejected')}
 </span>
 )
 case 'pending':
 return (
 <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-warning/10 text-warning ">
 <Clock size={16} />
 {t('status.pending')}
 </span>
 )
 default:
 return (
 <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-outline/10 text-text-muted">
 {t('status.unspecified')}
 </span>
 )
 }
 }

 const getMethodText = (method: MeterReading['reading_method']) => {
 switch (method) {
 case 'manual': return t('method.manual')
 case 'qr_scan': return t('method.qr_scan')
 default: return t('method.unspecified')
 }
 }

 return createPortal(
 <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
 {/* BACKDROP */}
 <div 
 onClick={onClose}
 style={{
 position: 'absolute',
 inset: 0,
 backgroundColor: 'rgba(0,0,0,0.4)',
 zIndex: 0,
 }}
 />
 
 {/* DRAWER */}
 <aside 
 className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} bottom-0 w-full max-w-md shadow-2xl flex flex-col transition-transform transform`}
 style={{ 
 zIndex: 1,
 backgroundColor: '#ffffff',
 opacity: 1,
 filter: 'none'
 }}
 dir={isRTL ? 'rtl' : 'ltr'}
 >
 <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
 <div>
 <h2 className="font-headline-sm font-bold text-text-primary flex items-center gap-2">
 <Hash size={20} className="text-primary" />
 {t('details.title')} #{reading.id}
 </h2>
 </div>
 <button 
 onClick={onClose}
 className="p-2 rounded-full hover:bg-surface-container :bg-surface-container transition-colors text-text-muted"
 >
 <X size={20} />
 </button>
 </div>

 <div className="flex-1 overflow-y-auto p-6 space-y-8">
 
 <div className="flex items-center justify-between">
 <div>
 <p className="text-label-sm font-bold text-text-muted mb-1">
 {t('table.columns.meterNumber')}
 </p>
 <p className="font-title-lg font-black text-text-primary ">
 {reading.meter?.meter_number || reading.meter_id}
 </p>
 </div>
 <div>
 {getStatusBadge(reading.status)}
 </div>
 </div>

 <div className="bg-surface-low rounded-xl p-5 border border-border grid grid-cols-2 gap-4">
 <div>
 <p className="text-label-xs text-text-muted mb-1">{t('table.columns.previousReading')}</p>
 <p className="font-bold text-text-primary " dir="ltr">{formatNumber(reading.previous_reading)}</p>
 </div>
 <div>
 <p className="text-label-xs text-text-muted mb-1">{t('table.columns.currentReading')}</p>
 <p className="font-bold text-text-primary " dir="ltr">{formatNumber(reading.current_reading)}</p>
 </div>
 <div className="col-span-2 pt-2 border-t border-border">
 <div className="flex justify-between items-center">
 <p className="text-label-sm font-bold text-text-muted ">{t('table.columns.consumption')}</p>
 <p className="font-black text-lg text-accent " dir="ltr">{formatNumber(reading.consumption)} kWh</p>
 </div>
 </div>
 </div>

 <div className="space-y-4">
 <div className="flex justify-between items-center py-3 border-b border-border">
 <span className="text-label-md text-text-muted ">{t('table.columns.pricePerKwh')}</span>
 <span className="font-bold text-text-primary " dir="ltr">{formatCurrency(reading.price_per_kwh)}</span>
 </div>
 <div className="flex justify-between items-center py-3 border-b border-border">
 <span className="text-label-md font-bold text-text-muted ">{t('table.columns.readingCost')}</span>
 <span className="font-black text-teal-600 " dir="ltr">{formatCurrency(reading.reading_cost)}</span>
 </div>
 <div className="flex justify-between items-center py-3 border-b border-border">
 <span className="text-label-md text-text-muted ">{t('table.columns.method')}</span>
 <span className="font-medium text-text-primary ">{getMethodText(reading.reading_method)}</span>
 </div>
 <div className="flex justify-between items-center py-3 border-b border-border">
 <span className="text-label-md text-text-muted flex items-center gap-2"><Calendar size={16}/> {t('table.columns.readingDate')}</span>
 <span className="font-medium text-text-primary ">{reading.reading_date}</span>
 </div>
 </div>

 {reading.notes && (
 <div className="bg-surface-container/50 rounded-xl p-4">
 <div className="flex items-center gap-2 text-text-muted mb-2">
 <FileText size={16} />
 <span className="text-label-sm font-bold">{t('details.notes')}</span>
 </div>
 <p className="text-sm text-text-primary-variant leading-relaxed whitespace-pre-wrap">
 {reading.notes}
 </p>
 </div>
 )}

 <div className="text-xs text-text-muted space-y-2 pt-4">
 {reading.createdBy && (
 <div className="flex items-center gap-2">
 <User size={14} />
 {t('details.createdBy')}: {reading.createdBy.name}
 </div>
 )}
 <div className="flex items-center gap-2">
 <Clock size={14} />
 {t('details.createdAt')}: {new Date(reading.created_at).toLocaleString()}
 </div>
 <div className="flex items-center gap-2">
 <Clock size={14} />
 {t('details.updatedAt')}: {new Date(reading.updated_at).toLocaleString()}
 </div>
 </div>
 
 </div>
 </aside>
 </div>,
 document.body
 )
}
