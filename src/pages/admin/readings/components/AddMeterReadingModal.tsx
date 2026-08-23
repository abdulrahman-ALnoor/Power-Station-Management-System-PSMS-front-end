import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { X, Plus, AlertCircle, Search, QrCode, Camera } from 'lucide-react'
import { MeterReading, ReadingMethod } from '../../../shared/readings/types'
import { useLanguage } from '@/hooks/useLanguage'
import { MeterQrScanner } from '../../../shared/readings/components/MeterQrScanner'
import { parseMeterQrData } from '../../../shared/readings/utils/qrMeterParser'
import { meterLookupService } from '../../../../services/shared/meterLookupService'

interface AddMeterReadingModalProps {
 isOpen: boolean
 onClose: () => void
 onAdd: (reading: Omit<MeterReading, 'id' | 'created_at' | 'updated_at' | 'status' | 'created_by'>) => void
 readingToEdit?: MeterReading
}

export function AddMeterReadingModal({ isOpen, onClose, onAdd, readingToEdit }: AddMeterReadingModalProps) {
 const { t } = useTranslation('readings')
 const { isRTL } = useLanguage()

 const [meterId, setMeterId] = useState('')
 const [previousReading, setPreviousReading] = useState<number | ''>('')
 const [currentReading, setCurrentReading] = useState<number | ''>('')
 const [pricePerKwh, setPricePerKwh] = useState<number>(250) // Default for demo
 const [readingDate, setReadingDate] = useState(() => new Date().toISOString().split('T')[0])
 const [method, setMethod] = useState<ReadingMethod>('manual')
 const [notes, setNotes] = useState('')
 const [error, setError] = useState<string | null>(null)
 
 const [selectionMethod, setSelectionMethod] = useState<'manual' | 'qr_scan'>('manual')
 const [isScannerOpen, setIsScannerOpen] = useState(false)
 const [qrError, setQrError] = useState<string | null>(null)

 useEffect(() => {
 if (readingToEdit) {
 setMeterId(readingToEdit.meter_id.toString())
 setPreviousReading(readingToEdit.previous_reading)
 setCurrentReading(readingToEdit.current_reading)
 setPricePerKwh(readingToEdit.price_per_kwh)
 setReadingDate(readingToEdit.reading_date)
 setMethod(readingToEdit.reading_method || 'manual')
 setNotes(readingToEdit.notes || '')
 } else {
 setMeterId('')
 setPreviousReading('')
 setCurrentReading('')
 setReadingDate(new Date().toISOString().split('T')[0])
 setMethod('manual')
 setNotes('')
 setSelectionMethod('manual')
 setQrError(null)
 }
 }, [readingToEdit, isOpen])

 const consumption = (typeof currentReading === 'number' && typeof previousReading === 'number') 
 ? Math.max(0, currentReading - previousReading) 
 : 0

 const cost = consumption * pricePerKwh

 const formatNumber = (val: number) => new Intl.NumberFormat('en-US').format(val)
 const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'YER' }).format(val)

 useEffect(() => {
 if (typeof currentReading === 'number' && typeof previousReading === 'number') {
 if (currentReading < previousReading) {
 setError(t('addModal.validation.currentLessThanPrevious'))
 } else {
 setError(null)
 }
 } else {
 setError(null)
 }
 }, [currentReading, previousReading, t])

 const handleScanSuccess = async (decodedText: string) => {
 setIsScannerOpen(false)
 const parsed = parseMeterQrData(decodedText)
 
 if (!parsed) {
 setQrError(isRTL ? 'رمز QR غير صالح. حاول مسح رمز QR آخر' : 'Invalid QR code. Try scanning again.')
 return
 }

 const meter = await meterLookupService.lookupMeter(parsed)
 if (meter) {
 setMeterId(meter.id.toString())
 setPreviousReading(meter.previous_reading)
 setMethod('qr_scan')
 setQrError(null)
 } else {
 setQrError(isRTL ? 'لم يتم العثور على العداد. حاول مسح رمز QR آخر' : 'Meter not found. Try scanning again.')
 }
 }

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault()
 
 if (
 error ||
 !meterId ||
 previousReading === '' ||
 currentReading === '' ||
 previousReading === null ||
 currentReading === null ||
 pricePerKwh === null
 ) {
 return
 }
 onAdd({
 meter_id: parseInt(meterId, 10),
 previous_reading: Number(previousReading),
 current_reading: Number(currentReading),
 consumption,
 price_per_kwh: pricePerKwh,
 reading_cost: cost,
 reading_date: readingDate,
 reading_method: method,
 notes: notes || null
 })

 // Reset
 setMeterId('')
 setPreviousReading('')
 setCurrentReading('')
 setNotes('')
 }

 if (!isOpen) return null

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
 
 {/* MODAL */}
 <aside 
 className="absolute inset-0 flex items-center justify-center p-4 sm:p-6"
 style={{ zIndex: 1 }}
 dir={isRTL ? 'rtl' : 'ltr'}
 >
 <div 
 className="w-full max-w-2xl rounded-2xl shadow-2xl border border-border flex flex-col max-h-[calc(100vh-32px)] overflow-hidden bg-surface"
 style={{
 opacity: 1,
 filter: 'none'
 }}
 >
 
 <div className="flex items-center justify-between p-6 border-b border-border">
 <div>
 <h2 className="font-headline-sm text-xl font-semibold text-text-primary flex items-center gap-2">
 <Plus size={20} className="text-primary" />
 {readingToEdit ? (isRTL ? 'تعديل قراءة' : 'Edit Reading') : t('addModal.title')}
 </h2>
 <p className="text-sm text-text-muted mt-2">
 {readingToEdit ? (isRTL ? 'تعديل بيانات القراءة المحددة' : 'Edit selected reading data') : t('addModal.description')}
 </p>
 </div>
 <button 
 onClick={onClose}
 aria-label={isRTL ? 'إغلاق' : 'Close'}
 className="p-2 rounded-full hover:bg-surface-container transition-colors text-text-muted self-start mt-[-4px]"
 >
 <X size={20} />
 </button>
 </div>

 <div className="flex-1 overflow-y-auto p-6">
 <form id="add-reading-form" onSubmit={handleSubmit} className="space-y-6">
 
 {/* SECTION: Selection Method */}
 {!readingToEdit && (
 <div className="space-y-3 mb-6">
 <label className="block text-sm font-medium text-text-primary text-center">
 {isRTL ? 'طريقة اختيار العداد' : 'Meter Selection Method'}
 </label>
 <div className="flex bg-surface-low dark:bg-surface-elevated p-1 rounded-xl border border-border dark:border-border-subtle">
 <button
 type="button"
 onClick={() => setSelectionMethod('manual')}
 className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
 selectionMethod === 'manual' 
 ? 'bg-surface shadow-sm text-primary '
 : 'text-text-muted hover:text-text-primary'
 }`}
 >
 <Search size={18} />
 {isRTL ? 'البحث عن العداد' : 'Search Meter'}
 </button>
 <button
 type="button"
 onClick={() => setSelectionMethod('qr_scan')}
 className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
 selectionMethod === 'qr_scan' 
 ? 'bg-surface shadow-sm text-primary '
 : 'text-text-muted hover:text-text-primary'
 }`}
 >
 <QrCode size={18} />
 {isRTL ? 'مسح QR' : 'Scan QR'}
 </button>
 </div>
 </div>
 )}

 {/* SECTION 1: Meter Information */}
 <div className="space-y-4">
 <h3 className="text-sm font-semibold text-primary dark:text-info">
 {isRTL ? 'بيانات العداد' : 'Meter Information'}
 </h3>
 
 {selectionMethod === 'manual' ? (
 <div className="space-y-2">
 <label className="block text-sm font-medium text-text-primary ">
 {t('table.columns.meterNumber')} <span className="text-error">*</span>
 </label>
 <select
 required
 value={meterId}
 onChange={(e) => setMeterId(e.target.value)}
 className="w-full min-w-0 bg-surface-low dark:bg-surface-elevated border border-border dark:border-border-subtle text-text-primary text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-info transition-shadow cursor-pointer"
 >
 <option value="" disabled>{t('addModal.meterSelect')}</option>
 <option value="101">MET-10001</option>
 <option value="102">MET-10002</option>
 <option value="103">MET-10003</option>
 <option value="104">MET-10004</option>
 <option value="105">MET-10005</option>
 </select>
 </div>
 ) : (
 <div className="space-y-4 bg-surface-low dark:bg-surface-elevated p-6 rounded-xl border border-border dark:border-border-subtle text-center flex flex-col items-center">
 <div className="p-4 bg-primary/10 rounded-full text-primary mb-2">
 <QrCode size={32} />
 </div>
 
 {meterId && method === 'qr_scan' ? (
 <div className="w-full flex items-center justify-between p-4 bg-success/10 border border-success/20 rounded-lg">
 <span className="font-medium text-success flex flex-col items-start gap-1">
 <span className="text-xs opacity-80">{isRTL ? 'تم تحديد العداد عبر QR:' : 'Meter Selected via QR:'}</span>
 <span className="font-bold text-lg" dir="ltr">MET-1000{meterId.slice(-1)}</span>
 </span>
 <button
 type="button"
 onClick={() => {
 setMeterId('')
 setPreviousReading('')
 setMethod('manual')
 }}
 className="text-sm font-medium text-text-muted hover:text-error transition-colors px-3 py-1.5 rounded bg-surface shadow-sm border border-border dark:border-border-subtle"
 >
 {isRTL ? 'إلغاء التحديد' : 'Clear'}
 </button>
 </div>
 ) : (
 <>
 <p className="text-sm text-text-muted ">
 {isRTL ? 'استخدم كاميرا الجهاز لمسح رمز QR الخاص بالعداد' : 'Use your device camera to scan the meter QR code'}
 </p>
 <button
 type="button"
 onClick={() => {
 setQrError(null)
 setIsScannerOpen(true)
 }}
 className="mt-4 flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-on-primary font-semibold hover:bg-primary-dark transition-all shadow-sm hover:shadow-md"
 >
 <Camera size={20} />
 {isRTL ? 'فتح الكاميرا ومسح QR' : 'Open Camera & Scan'}
 </button>
 
 {qrError && (
 <div className="mt-4 p-3 rounded-lg bg-error/10 border border-error/20 w-full">
 <p className="text-sm text-error font-medium flex items-center justify-center gap-1.5">
 <AlertCircle size={16} />
 {qrError}
 </p>
 </div>
 )}
 </>
 )}
 </div>
 )}
 </div>

 {/* SECTION 2: Reading Information */}
 <div className="space-y-4 pt-6 border-t border-border">
 <h3 className="text-sm font-semibold text-primary dark:text-info">
 {isRTL ? 'بيانات القراءة' : 'Reading Information'}
 </h3>
 
 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
 <div className="space-y-2">
 <label className="block text-sm font-medium text-text-primary ">
 {t('table.columns.previousReading')} <span className="text-error">*</span>
 </label>
 <input
 required
 type="number"
 step="0.01"
 min="0"
 value={previousReading}
 onChange={(e) => setPreviousReading(e.target.value ? Number(e.target.value) : '')}
 dir="ltr"
 className="w-full bg-surface-low dark:bg-surface-elevated border border-border dark:border-border-subtle text-text-primary text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-info transition-shadow text-start"
 />
 </div>

 <div className="space-y-2">
 <label className="block text-sm font-medium text-text-primary ">
 {t('table.columns.currentReading')} <span className="text-error">*</span>
 </label>
 <input
 required
 type="number"
 step="0.01"
 min="0"
 value={currentReading}
 onChange={(e) => setCurrentReading(e.target.value ? Number(e.target.value) : '')}
 dir="ltr"
 className={`w-full bg-surface-low dark:bg-surface-elevated border text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 transition-shadow text-start ${
 error ? 'border-error text-error focus:border-error' : 'border-border dark:border-border-subtle text-text-primary focus:border-primary dark:focus:border-info'
 }`}
 />
 {error && (
 <p className="text-xs font-medium text-error flex items-center gap-1 mt-1">
 <AlertCircle size={12} />
 {error}
 </p>
 )}
 </div>

 <div className="space-y-2">
 <label className="block text-sm font-medium text-text-primary ">
 {t('table.columns.readingDate')} <span className="text-error">*</span>
 </label>
 <input
 required
 type="date"
 value={readingDate}
 onChange={(e) => setReadingDate(e.target.value)}
 dir="ltr"
 className="w-full bg-surface-low dark:bg-surface-elevated border border-border dark:border-border-subtle text-text-primary text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-info transition-shadow text-start"
 />
 </div>

 <div className="space-y-2">
 <label className="block text-sm font-medium text-text-primary ">
 {t('table.columns.pricePerKwh')} <span className="text-error">*</span>
 </label>
 <input
 required
 type="number"
 step="0.01"
 min="0"
 value={pricePerKwh}
 onChange={(e) => setPricePerKwh(Number(e.target.value))}
 dir="ltr"
 className="w-full bg-surface-low dark:bg-surface-elevated border border-border dark:border-border-subtle text-text-primary text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-info transition-shadow text-start"
 />
 </div>

 <div className="space-y-2 md:col-span-2">
 <label className="block text-sm font-medium text-text-primary ">
 {t('table.columns.method')}
 </label>
 <select
 value={method}
 onChange={(e) => setMethod(e.target.value as ReadingMethod)}
 className="w-full bg-surface-low dark:bg-surface-elevated border border-border dark:border-border-subtle text-text-primary text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-info transition-shadow cursor-pointer"
 >
 <option value="manual">{t('method.manual')}</option>
 <option value="qr_scan">{t('method.qr_scan')}</option>
 </select>
 </div>
 </div>
 </div>

 {/* SECTION 3: Reading Summary */}
 <div className="space-y-4 pt-6 border-t border-border">
 <h3 className="text-sm font-semibold text-primary dark:text-info">
 {isRTL ? 'ملخص القراءة' : 'Reading Summary'}
 </h3>
 
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div className="bg-surface-low dark:bg-surface-elevated border border-border dark:border-border-subtle rounded-xl p-4">
 <p className="text-sm font-medium text-text-muted mb-2">
 {t('addModal.preview.consumption')}
 </p>
 <p className="font-semibold text-lg text-text-primary " dir="ltr">
 {formatNumber(consumption)} <span className="text-sm">kWh</span>
 </p>
 </div>
 
 <div className="bg-surface-low dark:bg-surface-elevated border border-border dark:border-border-subtle rounded-xl p-4">
 <p className="text-sm font-medium text-text-muted mb-2">
 {t('addModal.preview.cost')}
 </p>
 <p className="font-semibold text-lg text-success " dir="ltr">
 {formatCurrency(cost)}
 </p>
 </div>
 </div>
 </div>

 {/* SECTION 4: Notes */}
 <div className="space-y-4 pt-6 border-t border-border">
 <h3 className="text-sm font-semibold text-primary dark:text-info">
 {isRTL ? 'الملاحظات' : 'Notes'}
 </h3>
 
 <div className="space-y-2">
 <label className="block text-sm font-medium text-text-primary ">
 {t('details.notes')}
 </label>
 <textarea
 value={notes}
 onChange={(e) => setNotes(e.target.value)}
 rows={4}
 className="w-full min-h-[100px] bg-surface-low dark:bg-surface-elevated border border-border dark:border-border-subtle text-text-primary text-sm rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-info transition-shadow resize-none"
 />
 </div>
 </div>

 </form>
 </div>

 <div className="p-6 pt-4 mt-2 border-t border-border bg-surface flex flex-col sm:flex-row items-center justify-end gap-3 shrink-0">
 <button
 type="button"
 onClick={onClose}
 className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-border dark:border-border-subtle text-text-primary font-semibold hover:bg-surface-low dark:hover:bg-surface-hover transition-colors min-h-[44px]"
 >
 {t('addModal.actions.cancel')}
 </button>
 <button
 type="submit"
 form="add-reading-form"
 disabled={!!error}
 className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
 >
 {readingToEdit ? (isRTL ? 'حفظ التعديلات' : 'Save Changes') : t('addModal.actions.add')}
 </button>
 </div>

 </div>
 </aside>
 
 {/* QR SCANNER OVERLAY */}
 <MeterQrScanner
 isOpen={isScannerOpen}
 onClose={() => setIsScannerOpen(false)}
 onScanSuccess={handleScanSuccess}
 />
 </div>,
 document.body
 )
}
