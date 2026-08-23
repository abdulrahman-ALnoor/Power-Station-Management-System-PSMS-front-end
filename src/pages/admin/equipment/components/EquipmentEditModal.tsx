import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'

import { cn } from '@/utils/cn'
import { useLanguage } from '@/hooks/useLanguage'
import { showSuccess } from '@/utils/toast'

import {
  updateEquipment,
  mapEquipment,
} from '@/services/equipment.service'

import type { Equipment } from '../types'
import type { EquipmentStatus } from '../types'
import type { ApiError } from '@/types/api'

interface EquipmentEditModalProps {
  equipment: Equipment | null
  isOpen: boolean
  onClose: () => void
  onUpdated: (equipment: Equipment) => void
}

export function EquipmentEditModal({
  equipment,
  isOpen,
  onClose,
  onUpdated,
}: EquipmentEditModalProps) {
  const { t } = useTranslation('equipment')
  const { isRTL } = useLanguage()

  const [shouldRender, setShouldRender] =
    useState(false)

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const [formData, setFormData] = useState({
    equipment_name: '',
    serial_number: '',
    status: 'available' as EquipmentStatus,
    notes: '',
  })

  // ==============================
  // التحكم في ظهور النافذة
  // ==============================

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // ==============================
  // تعبئة البيانات عند فتح التعديل
  // ==============================

  useEffect(() => {
    if (!equipment) return

    setFormData({
      equipment_name:
        equipment.equipment_name || '',

      serial_number:
        equipment.serial_number || '',

      status:
        equipment.status || 'available',

      notes:
        equipment.notes || '',
    })

    setError(null)
  }, [equipment, isOpen])

  if (!shouldRender || !equipment) {
    return null
  }

  // ==============================
  // إغلاق عند الضغط على الخلفية
  // ==============================

  const handleBackdropClick = (
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // ==============================
  // حفظ التعديل
  // ==============================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()

    setError(null)

    setIsSubmitting(true)

    try {
      const updated = await updateEquipment(
        equipment.id,
        {
          equipment_name:
            formData.equipment_name,

          serial_number:
            formData.serial_number || null,

          status:
            formData.status,

          notes:
            formData.notes || null,
        },
      )

      const mappedEquipment =
        mapEquipment(updated)

      // تحديث البيانات في الصفحة
      onUpdated(mappedEquipment)

      // رسالة نجاح التعديل
      showSuccess(
        'تم تعديل بيانات المعدة بنجاح',
      )

    } catch (err) {
      const apiError = err as ApiError

      setError(
        apiError?.message ||
        'تعذر تعديل بيانات المعدة.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // ==============================
  // تنسيق الحقول
  // ==============================

  const inputClasses =
    'w-full rounded-lg border border-outline-variant bg-white px-4 py-2 text-body-md text-gray-900 transition-all placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

  const labelClasses =
    'mb-2 block text-label-sm font-bold text-gray-700'

  return (
    <div
      className={cn(
        'fixed inset-0 z-[80] flex items-center justify-center p-4 transition-opacity duration-300',
        isOpen
          ? 'opacity-100'
          : 'pointer-events-none opacity-0',
      )}
      onClick={handleBackdropClick}
    >
      {/* الخلفية */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* نافذة التعديل */}
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className={cn(
          'relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300',
          isOpen
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-4 scale-95 opacity-0',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white p-6">

          <h3 className="font-headline-md font-bold text-gray-900">
            تعديل بيانات المعدة
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            aria-label="إغلاق"
          >
            <X size={22} />
          </button>

        </div>

        {/* Form */}
        <form
          className="grid grid-cols-1 gap-6 bg-white p-6 sm:grid-cols-2"
          onSubmit={handleSubmit}
        >

          {/* رسالة الخطأ */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 sm:col-span-2">
              {error}
            </div>
          )}

          {/* اسم المعدة */}
          <div>
            <label className={labelClasses}>
              اسم المعدة
            </label>

            <input
              type="text"
              value={formData.equipment_name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  equipment_name: e.target.value,
                })
              }
              className={inputClasses}
              required
            />
          </div>

          {/* الرقم التسلسلي */}
          <div>
            <label className={labelClasses}>
              الرقم التسلسلي
            </label>

            <input
              type="text"
              value={formData.serial_number}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  serial_number: e.target.value,
                })
              }
              className={inputClasses}
            />
          </div>

          {/* الحالة */}
          <div>
            <label className={labelClasses}>
              الحالة
            </label>

            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status:
                    e.target.value as EquipmentStatus,
                })
              }
              className={inputClasses}
            >
              <option value="available">
                متاحة
              </option>

              <option value="maintenance">
                تحت الصيانة
              </option>

              <option value="damaged">
                تالفة
              </option>

              <option value="lost">
                مفقودة
              </option>
            </select>
          </div>

          {/* معرف المعدة */}
          <div>
            <label className={labelClasses}>
              رقم المعدة
            </label>

            <input
              type="text"
              value={equipment.id}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-gray-500"
            />
          </div>

          {/* الملاحظات */}
          <div className="sm:col-span-2">
            <label className={labelClasses}>
              الملاحظات
            </label>

            <textarea
              rows={5}
              value={formData.notes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  notes: e.target.value,
                })
              }
              className={inputClasses}
              placeholder="أضف ملاحظات حول المعدة..."
            />
          </div>

          {/* الأزرار */}
          <div className="flex justify-end gap-3 border-t border-gray-200 pt-6 sm:col-span-2">

            {/* إلغاء */}
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-bold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
            >
              إلغاء
            </button>

            {/* حفظ */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-primary px-8 py-3 font-bold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? 'جاري الحفظ...'
                : 'حفظ التعديلات'}
            </button>

          </div>

        </form>
      </div>
    </div>
  )
}