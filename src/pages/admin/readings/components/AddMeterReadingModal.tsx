import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Plus, Edit2 } from 'lucide-react'

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
} from "@/utils/toast"

import type { Meter } from '@/pages/admin/meters/types'

import type {
  MeterReading,
  ReadingMethod,
  CreateReadingPayload,
} from '../types'

import type { ApiError } from '@/types/api'


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

  const [meters, setMeters] =
    useState<Meter[]>([])

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)


  // ==============================
  // تحميل العدادات عند الإضافة
  // ==============================

  useEffect(() => {

    if (!isOpen || isEditMode) {
      return
    }

    fetchMeterList({
      page: 1,
    })
      .then((res) => {

        setMeters(
          res.data.map(mapMeter),
        )

      })
      .catch(() => {

        setError(
          t('errors.loadMetersFailed'),
        )

      })

  }, [
    isOpen,
    isEditMode,
    t,
  ])


  // ==============================
  // إذا كانت النافذة مغلقة
  // ==============================

  if (!isOpen) {
    return null
  }


  // ==============================
  // حفظ القراءة
  // ==============================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {

    e.preventDefault()

    setError(null)

    const formElement =
      e.currentTarget

    const form =
      new FormData(formElement)


    // ==============================
    // قراءة البيانات
    // ==============================

    const currentReading =
      Number(
        form.get('current_reading') || 0,
      )

    const readingDate =
      String(
        form.get('reading_date') || '',
      )

    const readingMethod =
      (form.get(
        'reading_method',
      ) as ReadingMethod)
      || undefined

    const notes =
      String(
        form.get('notes') || '',
      )
      || null


    setIsSubmitting(true)


    try {

      // ==============================
      // تعديل القراءة
      // ==============================

      if (
        isEditMode &&
        reading
      ) {

        await updateReading(
          reading.id,
          {
            current_reading:
              currentReading,

            reading_date:
              readingDate,

            reading_method:
              readingMethod,

            notes,
          },
        )

      } else {

        // ==============================
        // إضافة قراءة جديدة
        // ==============================

        const meterId =
          Number(
            form.get('meter_id') || 0,
          )

        const payload:
          CreateReadingPayload = {

          meter_id:
            meterId,

          current_reading:
            currentReading,

          reading_date:
            readingDate,

          reading_method:
            readingMethod,

          notes,
        }

        await createReading(
          payload,
        )
      }


      // ==============================
      // إعادة النموذج
      // ==============================

      formElement.reset()


      // ==============================
      // تحديث البيانات
      // ==============================

      onSaved?.()


      // ==============================
      // إغلاق النافذة
      // ==============================

      onClose()


      // ==============================
      // رسالة النجاح
      // ==============================

      showSuccess(
        isEditMode
          ? 'تم تعديل قراءة العداد بنجاح.'
          : 'تمت إضافة قراءة العداد بنجاح.',
        isEditMode
          ? 'تم التعديل بنجاح'
          : 'تمت الإضافة بنجاح',
      )


    } catch (err) {

      const apiError =
        err as ApiError


      // ==============================
      // استخراج رسالة التحقق
      // ==============================

      const validationMessage =
        apiError.errors
          ? Object.values(
              apiError.errors,
            )
              .flat()
              .join(' ')
          : undefined


      const errorMessage =
        validationMessage
        || apiError?.message
        || t('errors.saveFailed')


      // عرض الخطأ داخل النموذج
      setError(
        errorMessage,
      )


      // عرض رسالة الخطأ العامة
      showError(
        errorMessage,
        'فشلت العملية',
      )

    } finally {

      setIsSubmitting(
        false,
      )

    }
  }


  return (
    <>
      {/* الخلفية */}

      <div
        className="fixed inset-0 z-40 bg-black/45 transition-opacity"
        onClick={onClose}
      />


      {/* النافذة */}

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        dir={isRTL ? 'rtl' : 'ltr'}
      >

        <div
          className="
            flex
            max-h-[calc(100vh-32px)]
            w-full
            max-w-2xl
            flex-col
            overflow-hidden
            rounded-2xl
            border
            border-outline/10
            bg-white
            shadow-2xl
            dark:bg-surface-container-low
          "
        >

          {/* Header */}

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-outline/10
              p-6
            "
          >

            <div>

              <h2
                className="
                  flex
                  items-center
                  gap-2
                  text-xl
                  font-semibold
                  text-on-surface
                  dark:text-on-dark
                "
              >

                {isEditMode ? (
                  <Edit2
                    size={20}
                    className="text-primary"
                  />
                ) : (
                  <Plus
                    size={20}
                    className="text-primary"
                  />
                )}

                {isEditMode
                  ? t('addModal.editTitle')
                  : t('addModal.title')
                }

              </h2>


              <p
                className="
                  mt-2
                  text-sm
                  text-outline
                  dark:text-outline/80
                "
              >

                {isEditMode
                  ? t('addModal.editDescription')
                  : t('addModal.description')
                }

              </p>

            </div>


            <button
              type="button"
              onClick={onClose}
              aria-label={
                isRTL
                  ? 'إغلاق'
                  : 'Close'
              }
              className="
                mt-[-4px]
                self-start
                rounded-full
                p-2
                text-outline
                transition-colors
                hover:bg-surface-variant
                dark:hover:bg-surface-container
              "
            >

              <X size={20} />

            </button>

          </div>


          {/* المحتوى */}

          <div
            className="
              flex-1
              overflow-y-auto
              p-6
            "
          >

            <form
              key={
                reading?.id
                ?? 'new'
              }
              id="add-reading-form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* رسالة الخطأ */}

              {error && (

                <div
                  className="
                    rounded-lg
                    bg-error/10
                    p-3
                    text-sm
                    text-error
                  "
                >
                  {error}
                </div>

              )}


              {/* بيانات العداد */}

              <div className="space-y-4">

                <h3
                  className="
                    text-sm
                    font-semibold
                    text-primary
                    dark:text-primary-light
                  "
                >
                  {isRTL
                    ? 'بيانات العداد'
                    : 'Meter Information'
                  }
                </h3>


                <div className="space-y-2">

                  <label
                    className="
                      block
                      text-sm
                      font-medium
                      text-on-surface
                      dark:text-on-dark
                    "
                  >
                    {t(
                      'table.columns.meterNumber',
                    )}

                    {' '}

                    <span className="text-error">
                      *
                    </span>

                  </label>


                  {isEditMode ? (

                    <div
                      className="
                        flex
                        min-h-[44px]
                        w-full
                        items-center
                        rounded-lg
                        border
                        border-outline/20
                        bg-surface-container-lowest
                        px-4
                        py-2.5
                        text-sm
                        text-on-surface
                        dark:border-outline/10
                        dark:bg-surface-container/30
                        dark:text-on-dark
                      "
                    >

                      {reading?.meter?.meter_number}

                      {reading?.meter?.customerName
                        ? ` — ${reading.meter.customerName}`
                        : ''
                      }

                    </div>

                  ) : (

                    <select
                      name="meter_id"
                      required
                      defaultValue=""
                      className="
                        min-h-[44px]
                        w-full
                        min-w-0
                        cursor-pointer
                        rounded-lg
                        border
                        border-outline/20
                        bg-surface-container-lowest
                        px-4
                        py-2.5
                        text-sm
                        text-on-surface
                        transition-shadow
                        focus:border-primary
                        focus:ring-2
                        focus:ring-primary/20
                        dark:border-outline/10
                        dark:bg-surface-container/30
                        dark:text-on-dark
                      "
                    >

                      <option
                        value=""
                        disabled
                      >
                        {t(
                          'addModal.meterSelect',
                        )}
                      </option>


                      {meters.map((m) => (

                        <option
                          key={m.id}
                          value={m.id}
                        >

                          {m.meter_number}

                          {m.customerName
                            ? ` — ${m.customerName}`
                            : ''
                          }

                        </option>

                      ))}

                    </select>

                  )}

                </div>

              </div>


              {/* بيانات القراءة */}

              <div
                className="
                  space-y-4
                  border-t
                  border-outline/10
                  pt-6
                "
              >

                <h3
                  className="
                    text-sm
                    font-semibold
                    text-primary
                    dark:text-primary-light
                  "
                >
                  {isRTL
                    ? 'بيانات القراءة'
                    : 'Reading Information'
                  }
                </h3>


                <div
                  className="
                    grid
                    grid-cols-1
                    gap-5
                    md:grid-cols-2
                  "
                >

                  <div className="space-y-2">

                    <label
                      className="
                        block
                        text-sm
                        font-medium
                        text-on-surface
                        dark:text-on-dark
                      "
                    >

                      {t(
                        'table.columns.currentReading',
                      )}

                      {' '}

                      <span className="text-error">
                        *
                      </span>

                    </label>


                    <input
                      name="current_reading"
                      required
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={
                        reading?.current_reading
                        ?? ''
                      }
                      dir="ltr"
                      className="
                        min-h-[44px]
                        w-full
                        rounded-lg
                        border
                        border-outline/20
                        bg-surface-container-lowest
                        px-4
                        py-2.5
                        text-start
                        text-sm
                        text-on-surface
                        transition-shadow
                        focus:border-primary
                        focus:ring-2
                        focus:ring-primary/20
                        dark:border-outline/10
                        dark:bg-surface-container/30
                        dark:text-on-dark
                      "
                    />

                  </div>


                  <div className="space-y-2">

                    <label
                      className="
                        block
                        text-sm
                        font-medium
                        text-on-surface
                        dark:text-on-dark
                      "
                    >

                      {t(
                        'table.columns.readingDate',
                      )}

                      {' '}

                      <span className="text-error">
                        *
                      </span>

                    </label>


                    <input
                      name="reading_date"
                      required
                      type="date"
                      defaultValue={
                        reading?.reading_date
                        ?? new Date()
                          .toISOString()
                          .split('T')[0]
                      }
                      dir="ltr"
                      className="
                        min-h-[44px]
                        w-full
                        rounded-lg
                        border
                        border-outline/20
                        bg-surface-container-lowest
                        px-4
                        py-2.5
                        text-start
                        text-sm
                        text-on-surface
                        transition-shadow
                        focus:border-primary
                        focus:ring-2
                        focus:ring-primary/20
                        dark:border-outline/10
                        dark:bg-surface-container/30
                        dark:text-on-dark
                      "
                    />

                  </div>


                  <div
                    className="
                      space-y-2
                      md:col-span-2
                    "
                  >

                    <label
                      className="
                        block
                        text-sm
                        font-medium
                        text-on-surface
                        dark:text-on-dark
                      "
                    >
                      {t(
                        'table.columns.method',
                      )}
                    </label>


                    <select
                      name="reading_method"
                      defaultValue={
                        reading?.reading_method
                        ?? 'manual'
                      }
                      className="
                        min-h-[44px]
                        w-full
                        cursor-pointer
                        rounded-lg
                        border
                        border-outline/20
                        bg-surface-container-lowest
                        px-4
                        py-2.5
                        text-sm
                        text-on-surface
                        transition-shadow
                        focus:border-primary
                        focus:ring-2
                        focus:ring-primary/20
                        dark:border-outline/10
                        dark:bg-surface-container/30
                        dark:text-on-dark
                      "
                    >

                      <option value="manual">
                        {t(
                          'method.manual',
                        )}
                      </option>

                      <option value="qr_scan">
                        {t(
                          'method.qr_scan',
                        )}
                      </option>

                    </select>

                  </div>

                </div>


                <p
                  className="
                    text-xs
                    text-outline/70
                    dark:text-outline/50
                  "
                >

                  {isRTL
                    ? 'سيتم احتساب القراءة السابقة والاستهلاك والتكلفة تلقائياً من الباك اند بعد الحفظ.'
                    : 'Previous reading, consumption, and cost will be calculated automatically by the backend after saving.'
                  }

                </p>

              </div>


              {/* الملاحظات */}

              <div
                className="
                  space-y-4
                  border-t
                  border-outline/10
                  pt-6
                "
              >

                <h3
                  className="
                    text-sm
                    font-semibold
                    text-primary
                    dark:text-primary-light
                  "
                >
                  {isRTL
                    ? 'الملاحظات'
                    : 'Notes'
                  }
                </h3>


                <div className="space-y-2">

                  <label
                    className="
                      block
                      text-sm
                      font-medium
                      text-on-surface
                      dark:text-on-dark
                    "
                  >
                    {t('details.notes')}
                  </label>


                  <textarea
                    name="notes"
                    defaultValue={
                      reading?.notes
                      ?? ''
                    }
                    rows={4}
                    className="
                      min-h-[100px]
                      w-full
                      resize-none
                      rounded-lg
                      border
                      border-outline/20
                      bg-surface-container-lowest
                      px-4
                      py-2.5
                      text-sm
                      text-on-surface
                      transition-shadow
                      focus:border-primary
                      focus:ring-2
                      focus:ring-primary/20
                      dark:border-outline/10
                      dark:bg-surface-container/30
                      dark:text-on-dark
                    "
                  />

                </div>

              </div>

            </form>

          </div>


          {/* الأزرار */}

          <div
            className="
              mt-2
              flex
              shrink-0
              flex-col
              items-center
              justify-end
              gap-3
              border-t
              border-outline/10
              bg-surface-white
              p-6
              pt-4
              dark:bg-surface-container-low
              sm:flex-row
            "
          >

            <button
              type="button"
              onClick={onClose}
              className="
                min-h-[44px]
                w-full
                rounded-lg
                border
                border-outline/20
                px-6
                py-2.5
                font-semibold
                text-on-surface
                transition-colors
                hover:bg-surface-variant
                dark:text-on-dark
                dark:hover:bg-surface-container
                sm:w-auto
              "
            >
              {t(
                'addModal.actions.cancel',
              )}
            </button>


            <button
              type="submit"
              form="add-reading-form"
              disabled={isSubmitting}
              className="
                min-h-[44px]
                w-full
                rounded-lg
                bg-primary
                px-6
                py-2.5
                font-semibold
                text-on-primary
                shadow-sm
                transition-colors
                hover:bg-primary-dark
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:w-auto
              "
            >

              {isSubmitting
                ? t(
                    'addModal.actions.saving',
                  )
                : (
                    isEditMode
                      ? t(
                          'addModal.actions.update',
                        )
                      : t(
                          'addModal.actions.add',
                        )
                  )
              }

            </button>

          </div>

        </div>

      </div>
    </>
  )
}