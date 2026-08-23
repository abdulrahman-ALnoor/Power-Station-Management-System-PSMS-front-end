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
  initialMeterId?: number
  initialReadingMethod?: ReadingMethod
}

export function AddReadingModal({
  isOpen,
  onClose,
  onSuccess,
  initialMeterId,
  initialReadingMethod = 'manual'
}: AddReadingModalProps) {
  const { isRTL } = useLanguage()

  // Data fetching state
  const [meters, setMeters] = useState<MockMeterInfo[]>([])
  const [isFetchingMeters, setIsFetchingMeters] = useState(false)

  // Form state
  const [selectedMeterId, setSelectedMeterId] = useState<number | ''>(initialMeterId || '')
  const [currentReading, setCurrentReading] = useState<string>('')
  const [readingDate, setReadingDate] = useState(() => new Date().toISOString().split('T')[0])
  const [readingMethod, setReadingMethod] = useState<ReadingMethod>(initialReadingMethod)
  const [notes, setNotes] = useState('')

  // Submit & Error states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  // QR states
  const [selectionMethod, setSelectionMethod] = useState<'manual' | 'qr_scan'>(initialReadingMethod === 'qr_scan' ? 'qr_scan' : 'manual')
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

  // Fetch meters on open
  useEffect(() => {
    if (isOpen) {
      setIsFetchingMeters(true)
      setIsSuccess(false)
      setApiError(null)
      setQrError(null)
      
      if (!initialMeterId) {
        setSelectedMeterId('')
        setCurrentReading('')
        setNotes('')
        setReadingMethod('manual')
        setSelectionMethod('manual')
      } else {
        setSelectedMeterId(initialMeterId)
        setReadingMethod(initialReadingMethod)
        setSelectionMethod(initialReadingMethod === 'qr_scan' ? 'qr_scan' : 'manual')
      }
      
      setReadingDate(new Date().toISOString().split('T')[0])

      getReaderMeters()
        .then(data => setMeters(data))
        .finally(() => setIsFetchingMeters(false))
    }
  }, [isOpen, initialMeterId, initialReadingMethod])

  const handleScanSuccess = (decodedText: string) => {
    setIsScannerOpen(false)
    const parsed = parseMeterQrData(decodedText)

    if (!parsed) {
      setQrError('رمز QR غير صالح. يرجى مسح رمز QR خاص بالعدادات.')
      return
    }

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
      setQrError(`لم يتم العثور على العداد (${parsed.meterNumber || parsed.meterId}) في النظام.`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting || !selectedMeter || currentReadingNum === null) {
      return
    }

    setIsSubmitting(true)
    setApiError(null)

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
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || 'حدث خطأ أثناء حفظ القراءة'
      setApiError(errMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

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
          <h2 className="text-headline text-text font-bold">إضافة قراءة عداد</h2>
          <p className="text-sm text-text-muted mt-1">
            إدخال قراءة جديدة للعداد المختار يدويًا أو عبر مسح QR Code.
          </p>
        </div>
      </div>

      {isSuccess ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CheckCircle2 size={64} className="text-success mb-4 animate-bounce" />
          <h3 className="text-headline text-text mb-2 font-bold">تم حفظ القراءة بنجاح</h3>
          <p className="text-text-muted">تم إرسال القراءة وحساب الاستهلاك بالـ Backend.</p>
        </div>
      ) : (
        <form id="add-reading-form" onSubmit={handleSubmit} className="space-y-6">

          {apiError && (
            <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger flex items-start gap-3">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <div className="text-sm font-semibold">{apiError}</div>
            </div>
          )}

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
                مسح QR Code
              </button>
            </div>
          </div>

          {/* Section 1: Meter Selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary">العداد والعميل</h3>

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
                    onChange={(e) => {
                      setSelectedMeterId(Number(e.target.value))
                      setReadingMethod('manual')
                    }}
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
                      <span className="text-xs opacity-80">تم التعرف على العداد بواسطة QR:</span>
                      <span className="font-bold text-lg" dir="ltr">{selectedMeter.meterNumber} ({selectedMeter.customer.name})</span>
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
                      className="mt-2 flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-on-primary font-semibold hover:bg-primary-dark transition-all shadow-sm"
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

            {selectedMeter && (
              <div className="bg-surface-container rounded-lg p-3 text-sm border border-border/50">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-text-muted">رقم العداد:</div>
                  <div className="text-text font-medium text-end" dir="ltr">{selectedMeter.meterNumber}</div>

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
                    placeholder="أدخل قيمة القراءة الحالية"
                    dir="ltr"
                    className="w-full bg-surface border border-border text-sm rounded-lg min-h-[44px] py-2.5 px-4 text-start focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow text-text"
                  />
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

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-text">
                    طريقة القراءة
                  </label>
                  <select
                    disabled={isSubmitting}
                    value={readingMethod}
                    onChange={(e) => setReadingMethod(e.target.value as ReadingMethod)}
                    className="w-full bg-surface border border-border text-text text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow cursor-pointer appearance-none"
                  >
                    <option value="manual">قراءة يدوية (manual)</option>
                    <option value="qr_scan">مسح QR Code (qr_scan)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Notes */}
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
                  placeholder="ملاحظات إضافية حول القراءة إن وجدت..."
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
              disabled={isSubmitting || !selectedMeter || currentReadingNum === null}
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
