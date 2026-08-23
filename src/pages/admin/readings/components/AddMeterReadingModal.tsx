import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import {
  X,
  Plus,
  Edit2,
  Search,
  QrCode,
  Camera,
  AlertCircle,
} from 'lucide-react'

import { useLanguage } from '@/hooks/useLanguage'

import {
  createReading,
  updateReading,
} from '@/services/meterReadings.service'

import {
  fetchMeterList,
  mapMeter,
} from '@/services/meters.service'

import {
  showSuccess,
  showError,
} from '@/utils/toast'

import type { Meter } from '@/pages/admin/meters/types'

import type {
  MeterReading,
  ReadingMethod,
  CreateReadingPayload,
} from '../types'

import type { ApiError } from '@/types/api'

// Components
import { MeterQrScanner } from '../../../shared/readings/components/MeterQrScanner'
import { parseMeterQrData } from '../../../shared/readings/utils/qrMeterParser'

interface AddMeterReadingModalProps {
  isOpen: boolean
  onClose: () => void
  onSaved?: () => void
  reading?: MeterReading | null
}

export function AddMeterReadingModal({
  isOpen,
  onClose,
  onSaved,
  reading,
}: AddMeterReadingModalProps) {
  const { t } = useTranslation('readings')
  const { isRTL } = useLanguage()

  const isEditMode = Boolean(reading)

  // ==============================
  // البيانات
  // ==============================
  const [meters, setMeters] = useState<Meter[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form states
  const [meterId, setMeterId] = useState('')
  const [previousReading, setPreviousReading] = useState<number | ''>('')
  const [currentReading, setCurrentReading] = useState<number | ''>('')
  const [pricePerKwh, setPricePerKwh] = useState<number>(250)
  const [readingDate, setReadingDate] = useState(() => new Date().toISOString().split('T')[0])
  const [method, setMethod] = useState<ReadingMethod>('manual')
  const [notes, setNotes] = useState('')

  // QR Scanner states
  const [selectionMethod, setSelectionMethod] = useState<'manual' | 'qr_scan'>('manual')
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [qrError, setQrError] = useState<string | null>(null)

  // ==============================
  // تحميل العدادات عند الإضافة
  // ==============================
  useEffect(() => {
    if (!isOpen || isEditMode) {
      return
    }

    fetchMeterList({ page: 1 })
      .then((res) => {
        setMeters(res.data.map(mapMeter))
      })
      .catch(() => {
        setError(t('errors.loadMetersFailed'))
      })
  }, [isOpen, isEditMode, t])

  // ==============================
  // تعبئة النموذج عند التعديل / إعادة الضبط عند الإضافة
  // ==============================
  useEffect(() => {
    if (!isOpen) return

    if (reading) {
      setMeterId(String(reading.meter_id))
      setPreviousReading(reading.previous_reading ?? '')
      setCurrentReading(reading.current_reading ?? '')
      setPricePerKwh(reading.price_per_kwh || 250)
      setReadingDate(reading.reading_date?.slice(0, 10) || new Date().toISOString().split('T')[0])
      setMethod(reading.reading_method ?? 'manual')
      setNotes(reading.notes ?? '')
    } else {
      setMeterId('')
      setPreviousReading('')
      setCurrentReading('')
      setPricePerKwh(250)
      setReadingDate(new Date().toISOString().split('T')[0])
      setMethod('manual')
      setNotes('')
      setSelectionMethod('manual')
    }

    setError(null)
    setQrError(null)
  }, [isOpen, reading])

  // ==============================
  // معاينة الاستهلاك والتكلفة (تقديرية فقط — الباك اند يحسبها فعلياً عند الحفظ)
  // ==============================
  const numericPreviousReading = typeof previousReading === 'number' ? previousReading : 0
  const numericCurrentReading = typeof currentReading === 'number' ? currentReading : 0
  const consumption = Math.max(0, numericCurrentReading - numericPreviousReading)
  const cost = consumption * pricePerKwh

  const formatNumber = (val: number) => new Intl.NumberFormat('en-US').format(val)
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'YER' }).format(val)

  // ==============================
  // نتيجة مسح QR
  // ==============================
  const handleScanSuccess = (decodedText: string) => {
    const parsed = parseMeterQrData(decodedText)

    if (!parsed) {
      setQrError(isRTL ? 'رمز QR غير صالح.' : 'Invalid QR code.')
      return
    }

    const matchedMeter = parsed.meterId
      ? meters.find((m) => m.id === parsed.meterId)
      : meters.find(
          (m) => m.meter_number.toLowerCase() === (parsed.meterNumber ?? '').toLowerCase(),
        )

    if (!matchedMeter) {
      setQrError(
        isRTL
          ? 'لم يتم العثور على عداد مطابق لرمز QR الممسوح.'
          : 'No matching meter found for the scanned QR code.',
      )
      return
    }

    setMeterId(String(matchedMeter.id))
    setMethod('qr_scan')
    setQrError(null)
    setIsScannerOpen(false)
  }

  if (!isOpen) {
    return null
  }

  // ==============================
  // حفظ القراءة
  // ==============================
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!isEditMode && !meterId) {
      setError(t('addModal.meterSelect'))
      return
    }

    if (
      previousReading !== '' &&
      currentReading !== '' &&
      Number(currentReading) < Number(previousReading)
    ) {
      setError(t('addModal.validation.currentLessThanPrevious'))
      return
    }

    setIsSubmitting(true)

    try {
      if (isEditMode && reading) {
        // ==============================
        // تعديل القراءة
        // ==============================
        await updateReading(reading.id, {
          current_reading: Number(currentReading),
          reading_date: readingDate,
          reading_method: method,
          notes: notes.trim() || null,
        })
      } else {
        // ==============================
        // إضافة قراءة جديدة
        // ==============================
        const payload: CreateReadingPayload = {
          meter_id: Number(meterId),
          current_reading: Number(currentReading),
          reading_date: readingDate,
          reading_method: method,
          notes: notes.trim() || null,
        }

        await createReading(payload)
      }

      // ==============================
      // تحديث البيانات وإغلاق النافذة
      // ==============================
      onSaved?.()
      onClose()

      showSuccess(
        isEditMode
          ? 'تم تعديل قراءة العداد بنجاح.'
          : 'تمت إضافة قراءة العداد بنجاح.',
        isEditMode ? 'تم التعديل بنجاح' : 'تمت الإضافة بنجاح',
      )
    } catch (err) {
      const apiError = err as ApiError

      // ==============================
      // استخراج رسالة التحقق
      // ==============================
      const validationMessage = apiError.errors
        ? Object.values(apiError.errors).flat().join(' ')
        : undefined

      const errorMessage = validationMessage || apiError?.message || t('errors.saveFailed')

      setError(errorMessage)
      showError(errorMessage, 'فشلت العملية')
    } finally {
      setIsSubmitting(false)
    }
  }

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 0 }}
      />

      {/* MODAL */}
      <aside
        className="absolute inset-0 flex items-center justify-center p-4 sm:p-6"
        style={{ zIndex: 1 }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="flex max-h-[calc(100vh-32px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-outline/10 bg-white shadow-2xl dark:bg-surface-container-low">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-outline/10 p-6">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-semibold text-on-surface dark:text-on-dark">
                {isEditMode ? (
                  <Edit2 size={20} className="text-primary" />
                ) : (
                  <Plus size={20} className="text-primary" />
                )}

                {isEditMode ? t('addModal.editTitle') : t('addModal.title')}
              </h2>

              <p className="mt-2 text-sm text-outline dark:text-outline/80">
                {isEditMode ? t('addModal.editDescription') : t('addModal.description')}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={isRTL ? 'إغلاق' : 'Close'}
              className="mt-[-4px] self-start rounded-full p-2 text-outline transition-colors hover:bg-surface-variant dark:hover:bg-surface-container"
            >
              <X size={20} />
            </button>
          </div>

          {/* المحتوى */}
          <div className="flex-1 overflow-y-auto p-6">
            <form
              key={reading?.id ?? 'new'}
              id="add-reading-form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* SECTION: Selection Method */}
              {!isEditMode && (
                <div className="space-y-3 mb-6">
                  <label className="block text-sm font-medium text-on-surface dark:text-on-dark text-center">
                    {isRTL ? 'طريقة اختيار العداد' : 'Meter Selection Method'}
                  </label>

                  <div className="flex bg-surface-container-lowest dark:bg-surface-container/30 p-1 rounded-xl border border-outline/20 dark:border-outline/10">
                    <button
                      type="button"
                      onClick={() => setSelectionMethod('manual')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                        selectionMethod === 'manual'
                          ? 'bg-white dark:bg-surface-container shadow-sm text-primary'
                          : 'text-outline hover:text-on-surface dark:hover:text-on-dark'
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
                          ? 'bg-white dark:bg-surface-container shadow-sm text-primary'
                          : 'text-outline hover:text-on-surface dark:hover:text-on-dark'
                      }`}
                    >
                      <QrCode size={18} />
                      {isRTL ? 'مسح QR' : 'Scan QR'}
                    </button>
                  </div>
                </div>
              )}

              {/* رسالة الخطأ */}
              {error && (
                <div className="rounded-lg bg-error/10 p-3 text-sm text-error">
                  {error}
                </div>
              )}

              {/* بيانات العداد */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-primary dark:text-primary-light">
                  {isRTL ? 'بيانات العداد' : 'Meter Information'}
                </h3>

                {isEditMode ? (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                      {t('table.columns.meterNumber')}
                    </label>

                    <div className="flex min-h-[44px] w-full items-center rounded-lg border border-outline/20 bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface dark:border-outline/10 dark:bg-surface-container/30 dark:text-on-dark">
                      {reading?.meter?.meter_number}
                      {reading?.meter?.customerName ? ` — ${reading.meter.customerName}` : ''}
                    </div>
                  </div>
                ) : selectionMethod === 'manual' ? (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                      {t('table.columns.meterNumber')}{' '}
                      <span className="text-error">*</span>
                    </label>

                    <select
                      required
                      value={meterId}
                      onChange={(e) => setMeterId(e.target.value)}
                      className="w-full min-w-0 cursor-pointer rounded-lg border border-outline/20 bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface min-h-[44px] transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-outline/10 dark:bg-surface-container/30 dark:text-on-dark"
                    >
                      <option value="" disabled>
                        {t('addModal.meterSelect')}
                      </option>

                      {meters.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.meter_number}
                          {m.customerName ? ` — ${m.customerName}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-4 bg-surface-container-lowest dark:bg-surface-container/30 p-6 rounded-xl border border-outline/20 dark:border-outline/10 text-center flex flex-col items-center">
                    <div className="p-4 bg-primary/10 rounded-full text-primary mb-2">
                      <QrCode size={32} />
                    </div>

                    {meterId && method === 'qr_scan' ? (
                      <div className="w-full flex items-center justify-between p-4 bg-success/10 border border-success/20 rounded-lg">
                        <span className="font-medium text-success flex flex-col items-start gap-1">
                          <span className="text-xs opacity-80">
                            {isRTL ? 'تم تحديد العداد عبر QR:' : 'Meter Selected via QR:'}
                          </span>

                          <span className="font-bold text-lg" dir="ltr">
                            {meters.find((m) => m.id.toString() === meterId)?.meter_number ||
                              `ID: ${meterId}`}
                          </span>
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            setMeterId('')
                            setPreviousReading('')
                            setMethod('manual')
                          }}
                          className="text-sm font-medium text-outline hover:text-error transition-colors px-3 py-1.5 rounded bg-white dark:bg-surface-container shadow-sm border border-outline/20 dark:border-outline/10"
                        >
                          {isRTL ? 'إلغاء التحديد' : 'Clear'}
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-outline dark:text-outline/80">
                          {isRTL
                            ? 'استخدم كاميرا الجهاز لمسح رمز QR الخاص بالعداد'
                            : 'Use your device camera to scan the meter QR code'}
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

              {/* بيانات القراءة */}
              <div className="space-y-4 border-t border-outline/10 pt-6">
                <h3 className="text-sm font-semibold text-primary dark:text-primary-light">
                  {isRTL ? 'بيانات القراءة' : 'Reading Information'}
                </h3>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                      {t('table.columns.previousReading')}
                    </label>

                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={previousReading}
                      onChange={(e) =>
                        setPreviousReading(e.target.value ? Number(e.target.value) : '')
                      }
                      dir="ltr"
                      className="min-h-[44px] w-full rounded-lg border border-outline/20 bg-surface-container-lowest px-4 py-2.5 text-start text-sm text-on-surface transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-outline/10 dark:bg-surface-container/30 dark:text-on-dark"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                      {t('table.columns.currentReading')}{' '}
                      <span className="text-error">*</span>
                    </label>

                    <input
                      required
                      type="number"
                      step="0.01"
                      min="0"
                      value={currentReading}
                      onChange={(e) =>
                        setCurrentReading(e.target.value ? Number(e.target.value) : '')
                      }
                      dir="ltr"
                      className={`w-full bg-surface-container-lowest dark:bg-surface-container/30 border text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 transition-shadow text-start ${
                        error
                          ? 'border-error text-error focus:border-error'
                          : 'border-outline/20 dark:border-outline/10 text-on-surface dark:text-on-dark focus:border-primary'
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
                    <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                      {t('table.columns.readingDate')}{' '}
                      <span className="text-error">*</span>
                    </label>

                    <input
                      required
                      type="date"
                      value={readingDate}
                      onChange={(e) => setReadingDate(e.target.value)}
                      dir="ltr"
                      className="w-full bg-surface-container-lowest dark:bg-surface-container/30 border border-outline/20 dark:border-outline/10 text-on-surface dark:text-on-dark text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow text-start"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                      {t('table.columns.pricePerKwh')}{' '}
                      <span className="text-error">*</span>
                    </label>

                    <input
                      required
                      type="number"
                      step="0.01"
                      min="0"
                      value={pricePerKwh}
                      onChange={(e) => setPricePerKwh(Number(e.target.value))}
                      dir="ltr"
                      className="min-h-[44px] w-full rounded-lg border border-outline/20 bg-surface-container-lowest px-4 py-2.5 text-start text-sm text-on-surface transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-outline/10 dark:bg-surface-container/30 dark:text-on-dark"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                      {t('table.columns.method')}
                    </label>

                    <select
                      name="reading_method"
                      value={method}
                      onChange={(e) => setMethod(e.target.value as ReadingMethod)}
                      className="w-full bg-surface-container-lowest dark:bg-surface-container/30 border border-outline/20 dark:border-outline/10 text-on-surface dark:text-on-dark text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow cursor-pointer"
                    >
                      <option value="manual">{t('method.manual')}</option>
                      <option value="qr_scan">{t('method.qr_scan')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Reading Summary */}
              <div className="space-y-4 pt-6 border-t border-outline/10">
                <h3 className="text-sm font-semibold text-primary dark:text-primary-light">
                  {isRTL ? 'ملخص القراءة' : 'Reading Summary'}
                </h3>

                <p className="text-xs text-outline/70 dark:text-outline/50">
                  {isRTL
                    ? 'سيتم احتساب القراءة السابقة والاستهلاك والتكلفة تلقائياً من الباك اند بعد الحفظ.'
                    : 'Previous reading, consumption, and cost will be calculated automatically by the backend after saving.'}
                </p>

                {/* Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="bg-surface-container-lowest dark:bg-surface-container/30 border border-outline/20 dark:border-outline/10 rounded-xl p-4">
                    <p className="text-sm font-medium text-outline mb-2">
                      {t('addModal.preview.consumption')}
                    </p>

                    <p className="font-semibold text-lg text-on-surface dark:text-on-dark" dir="ltr">
                      {formatNumber(consumption)} <span className="text-sm">kWh</span>
                    </p>
                  </div>

                  <div className="bg-surface-container-lowest dark:bg-surface-container/30 border border-outline/20 dark:border-outline/10 rounded-xl p-4">
                    <p className="text-sm font-medium text-outline mb-2">
                      {t('addModal.preview.cost')}
                    </p>

                    <p className="font-semibold text-lg text-success" dir="ltr">
                      {formatCurrency(cost)}
                    </p>
                  </div>
                </div>

                {/* الملاحظات */}
                <div className="space-y-4 border-t border-outline/10 pt-6">
                  <h3 className="text-sm font-semibold text-primary dark:text-primary-light">
                    {isRTL ? 'الملاحظات' : 'Notes'}
                  </h3>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                      {t('details.notes')}
                    </label>

                    <textarea
                      name="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      className="min-h-[100px] w-full resize-none rounded-lg border border-outline/20 bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-outline/10 dark:bg-surface-container/30 dark:text-on-dark"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* الأزرار */}
          <div className="mt-2 flex shrink-0 flex-col items-center justify-end gap-3 border-t border-outline/10 bg-surface-white p-6 pt-4 dark:bg-surface-container-low sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] w-full rounded-lg border border-outline/20 px-6 py-2.5 font-semibold text-on-surface transition-colors hover:bg-surface-variant dark:text-on-dark dark:hover:bg-surface-container sm:w-auto"
            >
              {t('addModal.actions.cancel')}
            </button>

            <button
              type="submit"
              form="add-reading-form"
              disabled={isSubmitting}
              className="min-h-[44px] w-full rounded-lg bg-primary px-6 py-2.5 font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {isSubmitting
                ? t('addModal.actions.saving')
                : isEditMode
                  ? t('addModal.actions.update')
                  : t('addModal.actions.add')}
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
    document.body,
  )
}
