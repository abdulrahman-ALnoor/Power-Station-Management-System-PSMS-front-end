import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Plus, Edit2 } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { createReading, updateReading } from '@/services/meterReadings.service'
import { fetchMeterList, mapMeter } from '@/services/meters.service'
import type { Meter } from '@/pages/admin/meters/types'
import type { MeterReading, ReadingMethod, CreateReadingPayload } from '../types'
import type { ApiError } from '@/types/api'

interface AddMeterReadingModalProps {
  isOpen: boolean
  onClose: () => void
  onSaved?: () => void
  /** When provided, the modal edits this reading instead of creating a new one. */
  reading?: MeterReading | null
}

export function AddMeterReadingModal({ isOpen, onClose, onSaved, reading }: AddMeterReadingModalProps) {
  const { t } = useTranslation('readings')
  const { isRTL } = useLanguage()
  const isEditMode = Boolean(reading)

  const [meters, setMeters] = useState<Meter[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || isEditMode) return
    // Only needed for create mode — editing keeps the original meter fixed.
    fetchMeterList({ page: 1 })
      .then((res) => setMeters(res.data.map(mapMeter)))
      .catch(() => setError(t('errors.loadMetersFailed')))
  }, [isOpen, isEditMode, t])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    setError(null)

    const formElement = e.currentTarget
    const form = new FormData(formElement)

    const currentReading = Number(form.get('current_reading') || 0)
    const readingDate = String(form.get('reading_date') || '')
    const readingMethod = (form.get('reading_method') as ReadingMethod) || undefined
    const notes = String(form.get('notes') || '') || null

    setIsSubmitting(true)
    try {
      if (isEditMode && reading) {
        await updateReading(reading.id, {
          current_reading: currentReading,
          reading_date: readingDate,
          reading_method: readingMethod,
          notes,
        })
      } else {
        const meterId = Number(form.get('meter_id') || 0)
        const payload: CreateReadingPayload = {
          meter_id: meterId,
          current_reading: currentReading,
          reading_date: readingDate,
          reading_method: readingMethod,
          notes,
        }
        await createReading(payload)
      }
            formElement.reset()
      window.alert(isEditMode ? 'تم تحديث القراءة بنجاح' : 'تم إضافة القراءة بنجاح')
      onSaved?.()
      onClose()
    } catch (err) {
      const apiError = err as ApiError
      const validationMessage = apiError.errors
        ? Object.values(apiError.errors).flat().join(' ')
        : undefined
      setError(validationMessage || apiError?.message || t('errors.saveFailed'))

    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/45 z-40 transition-opacity"
        onClick={onClose}
      />

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="bg-white dark:bg-surface-container-low w-full max-w-2xl rounded-2xl shadow-2xl border border-outline/10 flex flex-col max-h-[calc(100vh-32px)] overflow-hidden">

          <div className="flex items-center justify-between p-6 border-b border-outline/10">
            <div>
              <h2 className="font-headline-sm text-xl font-semibold text-on-surface dark:text-on-dark flex items-center gap-2">
                {isEditMode ? <Edit2 size={20} className="text-primary" /> : <Plus size={20} className="text-primary" />}
                {isEditMode ? t('addModal.editTitle') : t('addModal.title')}
              </h2>
              <p className="text-sm text-outline dark:text-outline/80 mt-2">
                {isEditMode ? t('addModal.editDescription') : t('addModal.description')}
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label={isRTL ? 'إغلاق' : 'Close'}
              className="p-2 rounded-full hover:bg-surface-variant dark:hover:bg-surface-container transition-colors text-outline self-start mt-[-4px]"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <form
              key={reading?.id ?? 'new'}
              id="add-reading-form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {error && (
                <div className="p-3 rounded-lg bg-error/10 text-error text-sm">{error}</div>
              )}

              {/* SECTION 1: Meter Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-primary dark:text-primary-light">
                  {isRTL ? 'بيانات العداد' : 'Meter Information'}
                </h3>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                    {t('table.columns.meterNumber')} <span className="text-error">*</span>
                  </label>
                  {isEditMode ? (
                    <div className="w-full bg-surface-container-lowest dark:bg-surface-container/30 border border-outline/20 dark:border-outline/10 text-on-surface dark:text-on-dark text-sm rounded-lg min-h-[44px] py-2.5 px-4 flex items-center">
                      {reading?.meter?.meter_number} {reading?.meter?.customerName ? `— ${reading.meter.customerName}` : ''}
                    </div>
                  ) : (
                    <select
                      name="meter_id"
                      required
                      defaultValue=""
                      className="w-full min-w-0 bg-surface-container-lowest dark:bg-surface-container/30 border border-outline/20 dark:border-outline/10 text-on-surface dark:text-on-dark text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow cursor-pointer"
                    >
                      <option value="" disabled>{t('addModal.meterSelect')}</option>
                      {meters.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.meter_number}{m.customerName ? ` — ${m.customerName}` : ''}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* SECTION 2: Reading Information */}
              <div className="space-y-4 pt-6 border-t border-outline/10">
                <h3 className="text-sm font-semibold text-primary dark:text-primary-light">
                  {isRTL ? 'بيانات القراءة' : 'Reading Information'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                      {t('table.columns.currentReading')} <span className="text-error">*</span>
                    </label>
                    <input
                      name="current_reading"
                      required
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={reading?.current_reading ?? ''}
                      dir="ltr"
                      className="w-full bg-surface-container-lowest dark:bg-surface-container/30 border border-outline/20 dark:border-outline/10 text-on-surface dark:text-on-dark text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow text-start"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                      {t('table.columns.readingDate')} <span className="text-error">*</span>
                    </label>
                    <input
                      name="reading_date"
                      required
                      type="date"
                      defaultValue={reading?.reading_date ?? new Date().toISOString().split('T')[0]}
                      dir="ltr"
                      className="w-full bg-surface-container-lowest dark:bg-surface-container/30 border border-outline/20 dark:border-outline/10 text-on-surface dark:text-on-dark text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow text-start"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                      {t('table.columns.method')}
                    </label>
                    <select
                      name="reading_method"
                      defaultValue={reading?.reading_method ?? 'manual'}
                      className="w-full bg-surface-container-lowest dark:bg-surface-container/30 border border-outline/20 dark:border-outline/10 text-on-surface dark:text-on-dark text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow cursor-pointer"
                    >
                      <option value="manual">{t('method.manual')}</option>
                      <option value="qr_scan">{t('method.qr_scan')}</option>
                    </select>
                  </div>
                </div>

                <p className="text-xs text-outline/70 dark:text-outline/50">
                  {isRTL
                    ? 'سيتم احتساب القراءة السابقة والاستهلاك والتكلفة تلقائياً من الباك اند بعد الحفظ.'
                    : 'Previous reading, consumption, and cost will be calculated automatically by the backend after saving.'}
                </p>
              </div>

              {/* SECTION 3: Notes */}
              <div className="space-y-4 pt-6 border-t border-outline/10">
                <h3 className="text-sm font-semibold text-primary dark:text-primary-light">
                  {isRTL ? 'الملاحظات' : 'Notes'}
                </h3>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                    {t('details.notes')}
                  </label>
                  <textarea
                    name="notes"
                    defaultValue={reading?.notes ?? ''}
                    rows={4}
                    className="w-full min-h-[100px] bg-surface-container-lowest dark:bg-surface-container/30 border border-outline/20 dark:border-outline/10 text-on-surface dark:text-on-dark text-sm rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow resize-none"
                  />
                </div>
              </div>

            </form>
          </div>

          <div className="p-6 pt-4 mt-2 border-t border-outline/10 bg-surface-white dark:bg-surface-container-low flex flex-col sm:flex-row items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-outline/20 text-on-surface dark:text-on-dark font-semibold hover:bg-surface-variant dark:hover:bg-surface-container transition-colors min-h-[44px]"
            >
              {t('addModal.actions.cancel')}
            </button>
            <button
              type="submit"
              form="add-reading-form"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              {isSubmitting
                ? t('addModal.actions.saving')
                : (isEditMode ? t('addModal.actions.update') : t('addModal.actions.add'))}
            </button>
          </div>

        </div>
      </div>
    </>
  )
}
