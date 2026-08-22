import { useState, useEffect } from 'react'
import { Plus, AlertCircle, Loader2, CheckCircle2, Search, QrCode, Camera } from 'lucide-react'
import { Modal } from '@/components/overlays/Modal'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'
import { MeterQrScanner } from '../../../shared/readings/components/MeterQrScanner'
import { parseMeterQrData } from '../../../shared/readings/utils/qrMeterParser'

import { 
  MockMeterInfo, 
  ReadingMethod,
  CreateMeterReadingPayload
} from '../../dashboard/types/readerForms.types'
import { getReaderMeters, submitMeterReading } from '@/services/readerForms.service'

interface AddReadingModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function AddReadingModal({ isOpen, onClose, onSuccess }: AddReadingModalProps) {
  const { isRTL } = useLanguage()

  // Data fetching state
  const [meters, setMeters] = useState<MockMeterInfo[]>([])
  const [isFetchingMeters, setIsFetchingMeters] = useState(false)

  // Form state
  const [selectedMeterId, setSelectedMeterId] = useState<number | ''>('')
  const [currentReading, setCurrentReading] = useState<string>('')
  const [readingDate, setReadingDate] = useState(() => new Date().toISOString().split('T')[0])
  const [readingMethod, setReadingMethod] = useState<ReadingMethod>('manual')
  const [notes, setNotes] = useState('')

  // Submit states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // QR states
  const [selectionMethod, setSelectionMethod] = useState<'manual' | 'qr_scan'>('manual')
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [qrError, setQrError] = useState<string | null>(null)

  // Computed / Derived state
  const selectedMeter = meters.find(m => m.id === selectedMeterId)
  
  const currentReadingNum = currentReading ? Number(currentReading) : null
  const previousReadingNum = selectedMeter ? selectedMeter.previousReading : null
  
  const consumption = (currentReadingNum !== null && previousReadingNum !== null)
    ? Math.max(0, currentReadingNum - previousReadingNum)
    : 0

  const readingCost = selectedMeter ? consumption * selectedMeter.pricePerKwh : 0

  // Validation
  const hasValidationError = (currentReadingNum !== null && previousReadingNum !== null) 
    ? currentReadingNum < previousReadingNum
    : false

  // Fetch meters on open
  useEffect(() => {
    if (isOpen) {
      setIsFetchingMeters(true)
      setIsSuccess(false)
      // Reset form
      setSelectedMeterId('')
      setCurrentReading('')
      setNotes('')
      setReadingMethod('manual')
      setReadingDate(new Date().toISOString().split('T')[0])
      setSelectionMethod('manual')
      setQrError(null)

      getReaderMeters()
        .then(data => setMeters(data))
        .finally(() => setIsFetchingMeters(false))
    }
  }, [isOpen])

  const handleScanSuccess = (decodedText: string) => {
    setIsScannerOpen(false)
    const parsed = parseMeterQrData(decodedText)
    
    if (!parsed) {
      setQrError('رمز QR غير صالح. حاول مسح رمز QR آخر')
      return
    }

    // Lookup meter from the `meters` state
    let found = null
    if (parsed.meterId) {
      found = meters.find(m => m.id === parsed.meterId)
    } else if (parsed.meterNumber) {
      found = meters.find(m => m.meterNumber.toUpperCase() === parsed.meterNumber?.toUpperCase())
    }

    if (found) {
      setSelectedMeterId(found.id)
      setReadingMethod('qr_scan')
      setQrError(null)
    } else {
      setQrError('لم يتم العثور على العداد. حاول مسح رمز QR آخر')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (hasValidationError || isSubmitting || !selectedMeter || currentReadingNum === null) {
      return
    }

    setIsSubmitting(true)

    const payload: CreateMeterReadingPayload = {
      meter_id: selectedMeter.id,
      current_reading: currentReadingNum,
      consumption: consumption,
      price_per_kwh: selectedMeter.pricePerKwh,
      reading_cost: readingCost,
      reading_date: readingDate,
      reading_method: readingMethod,
      notes: notes || null
    }

    try {
      await submitMeterReading(payload)
      setIsSuccess(true)
      setTimeout(() => {
        onClose()
        if (onSuccess) onSuccess()
      }, 1500)
    } catch (err) {
      // Future: Handle API error here via toast or state
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format helpers
  const formatNumber = (val: number) => new Intl.NumberFormat('en-US').format(val)
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'YER' }).format(val)

  return (
    <Modal 
      open={isOpen} 
      onClose={isSubmitting ? () => {} : onClose}
      size="md"
      closeOnOverlayClick={!isSubmitting}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 shrink-0 border-b border-border pb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Plus size={24} />
        </div>
        <div>
          <h2 className="text-headline text-text font-bold">إضافة قراءة</h2>
          <p className="text-sm text-text-muted mt-1">
            إدخال قراءة جديدة للعداد المختار.
          </p>
        </div>
      </div>

      {isSuccess ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CheckCircle2 size={64} className="text-success mb-4" />
          <h3 className="text-headline text-text mb-2">تم الحفظ بنجاح</h3>
          <p className="text-text-muted">تم إرسال القراءة إلى النظام.</p>
        </div>
      ) : (
        <form id="add-reading-form" onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section: Method Selection */}
          <div className="space-y-3 mb-6">
            <label className="block text-sm font-medium text-text text-center">
              طريقة اختيار العداد
            </label>
            <div className="flex bg-surface-low p-1 rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setSelectionMethod('manual')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
                  selectionMethod === 'manual' 
                    ? "bg-surface shadow-sm text-primary"
                    : "text-text-muted hover:text-text"
                )}
              >
                <Search size={18} />
                اختيار يدوي
              </button>
              <button
                type="button"
                onClick={() => setSelectionMethod('qr_scan')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
                  selectionMethod === 'qr_scan' 
                    ? "bg-surface shadow-sm text-primary"
                    : "text-text-muted hover:text-text"
                )}
              >
                <QrCode size={18} />
                مسح QR
              </button>
            </div>
          </div>

          {/* Section 1: Meter Selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary">العداد</h3>
            
            {selectionMethod === 'manual' ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">
                  اختر العداد <span className="text-danger">*</span>
                </label>
                
                <div className="relative">
                  <select
                    required
                    disabled={isFetchingMeters || isSubmitting}
                    value={selectedMeterId}
                    onChange={(e) => setSelectedMeterId(Number(e.target.value))}
                    className={cn(
                      "w-full bg-surface-low border border-border text-text text-sm rounded-lg min-h-[44px] py-2.5 px-4",
                      "focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow cursor-pointer appearance-none disabled:opacity-50"
                    )}
                  >
                    <option value="" disabled>
                      {isFetchingMeters ? 'جاري تحميل العدادات...' : 'بحث واختيار عداد...'}
                    </option>
                    {meters.map(meter => (
                      <option key={meter.id} value={meter.id}>
                        {meter.meterNumber} - {meter.customer.name}
                      </option>
                    ))}
                  </select>
                  {isFetchingMeters && (
                    <div className="absolute top-1/2 -translate-y-1/2 end-3">
                      <Loader2 size={16} className="text-text-muted animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4 bg-surface-low p-6 rounded-xl border border-border text-center flex flex-col items-center">
                <div className="p-4 bg-primary/10 rounded-full text-primary mb-2">
                  <QrCode size={32} />
                </div>
                
                {selectedMeter && readingMethod === 'qr_scan' ? (
                  <div className="w-full flex items-center justify-between p-4 bg-success/10 border border-success/20 rounded-lg">
                    <span className="font-medium text-success flex flex-col items-start gap-1">
                      <span className="text-xs opacity-80">تم تحديد العداد بواسطة QR:</span>
                      <span className="font-bold text-lg" dir="ltr">{selectedMeter.meterNumber}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMeterId('')
                        setReadingMethod('manual')
                      }}
                      className="text-sm font-medium text-text-muted hover:text-danger transition-colors px-3 py-1.5 rounded bg-surface shadow-sm border border-border"
                    >
                      تغيير العداد
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-text-muted">
                      استخدم كاميرا الجهاز لمسح رمز QR الخاص بالعداد
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
                      مسح QR بالكاميرا
                    </button>
                    
                    {qrError && (
                      <div className="mt-4 p-3 rounded-lg bg-danger/10 border border-danger/20 w-full">
                        <p className="text-sm text-danger font-medium flex items-center justify-center gap-1.5">
                          <AlertCircle size={16} />
                          {qrError}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {selectedMeter && selectionMethod === 'manual' && (
              <div className="bg-surface-container rounded-lg p-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-text-muted">رقم العداد:</div>
                  <div className="text-text font-medium text-end">{selectedMeter.meterNumber}</div>
                  
                  <div className="text-text-muted">اسم العميل:</div>
                  <div className="text-text font-medium text-end">{selectedMeter.customer.name}</div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Reading Inputs */}
          {selectedMeter && (
            <div className="space-y-4 pt-6 border-t border-border">
              <h3 className="text-sm font-semibold text-primary">بيانات القراءة</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text">
                    القراءة السابقة
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formatNumber(selectedMeter.previousReading)}
                    dir="ltr"
                    className="w-full bg-surface-dim border border-border/50 text-text-muted text-sm rounded-lg min-h-[44px] py-2.5 px-4 text-start cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text">
                    القراءة الحالية <span className="text-danger">*</span>
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    disabled={isSubmitting}
                    value={currentReading}
                    onChange={(e) => setCurrentReading(e.target.value)}
                    dir="ltr"
                    className={cn(
                      "w-full bg-surface border text-sm rounded-lg min-h-[44px] py-2.5 px-4 text-start focus:ring-2 focus:ring-primary/20 transition-shadow",
                      hasValidationError 
                        ? "border-danger text-danger focus:border-danger" 
                        : "border-border text-text focus:border-primary"
                    )}
                  />
                  {hasValidationError && (
                    <p className="text-xs font-medium text-danger flex items-center gap-1 mt-1">
                      <AlertCircle size={12} />
                      القراءة الحالية أقل من السابقة
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text">
                    تاريخ القراءة <span className="text-danger">*</span>
                  </label>
                  <input
                    required
                    type="date"
                    disabled={isSubmitting}
                    value={readingDate}
                    onChange={(e) => setReadingDate(e.target.value)}
                    dir="ltr"
                    className="w-full bg-surface border border-border text-text text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow text-start"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text">
                    طريقة القراءة
                  </label>
                  <select
                    disabled={isSubmitting}
                    value={readingMethod}
                    onChange={(e) => setReadingMethod(e.target.value as ReadingMethod)}
                    className="w-full bg-surface border border-border text-text text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow cursor-pointer appearance-none"
                  >
                    <option value="manual">قراءة يدوية</option>
                    <option value="qr_scan">مسح QR</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Live Preview */}
          {selectedMeter && (
            <div className="space-y-4 pt-6 border-t border-border">
              <h3 className="text-sm font-semibold text-primary">ملخص الاستهلاك (معاينة)</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-surface-low border border-border rounded-xl p-4">
                  <p className="text-sm font-medium text-text-muted mb-2">الاستهلاك</p>
                  <p className="font-semibold text-lg text-text" dir="ltr">
                    {formatNumber(consumption)} <span className="text-sm text-text-muted">kWh</span>
                  </p>
                </div>
                
                <div className="bg-surface-low border border-border rounded-xl p-4">
                  <p className="text-sm font-medium text-text-muted mb-2">
                    تكلفة القراءة
                    <span className="block text-xs font-normal">سعر الكيلو واط: {formatCurrency(selectedMeter.pricePerKwh)}</span>
                  </p>
                  <p className="font-semibold text-lg text-success" dir="ltr">
                    {formatCurrency(readingCost)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Notes */}
          {selectedMeter && (
            <div className="space-y-4 pt-6 border-t border-border">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">
                  ملاحظات
                </label>
                <textarea
                  disabled={isSubmitting}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-surface border border-border text-text text-sm rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow resize-none"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-border text-text font-semibold hover:bg-surface-low transition-colors min-h-[44px]"
            >
              إلغاء
            </button>
            <button
              type="submit"
              form="add-reading-form"
              disabled={isSubmitting || hasValidationError || !selectedMeter || currentReadingNum === null}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px]"
            >
              {isSubmitting && <Loader2 size={18} className="animate-spin" />}
              حفظ القراءة
            </button>
          </div>
        </form>
      )}

      {/* QR SCANNER OVERLAY */}
      <MeterQrScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </Modal>
  )
}
