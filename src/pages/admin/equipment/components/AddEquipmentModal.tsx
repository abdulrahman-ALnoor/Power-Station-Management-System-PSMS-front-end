import {
  useEffect,
  useState,
} from 'react'

import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'

import { cn } from '@/utils/cn'
import { useLanguage } from '@/hooks/useLanguage'
import { showSuccess } from '@/utils/toast'

import {
  createEquipment,
  type CreateEquipmentPayload,
} from '@/services/equipment.service'

import {
  fetchEmployees,
  mapEmployee,
} from '@/services/employees.service'

import type { Employee } from '@/pages/admin/employees/types'
import type { ApiError } from '@/types/api'

interface AddEquipmentModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated?: () => void
}

export function AddEquipmentModal({
  isOpen,
  onClose,
  onCreated,
}: AddEquipmentModalProps) {
  const { t } = useTranslation('equipment')
  const { isRTL } = useLanguage()

  const [shouldRender, setShouldRender] =
    useState(false)

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const [employees, setEmployees] =
    useState<Employee[]>([])

  // التحكم في ظهور النافذة
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

  // جلب الموظفين
  useEffect(() => {
    if (!isOpen) return

    const loadEmployees = async () => {
      try {
        const response = await fetchEmployees({
          per_page: 100,
        })


        setEmployees(
          response.data.map(mapEmployee),
        )
      } catch {
        setEmployees([])
      }
    }

    loadEmployees()
  }, [isOpen])

  if (!shouldRender) {
    return null
  }

const handleBackdropClick = (e: React.MouseEvent) => {
  if (e.target === e.currentTarget) {
    onClose()
  }
}

setEmployees(
  response.data.map(mapEmployee),
)
} catch {
  setEmployees([])
}
}

loadEmployees()
}, [isOpen])

if (!shouldRender) {
  return null
}


  // إضافة المعدة
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    setError(null)

    const formElement = event.currentTarget

    const formData = new FormData(formElement)

    const userIdRaw = String(
      formData.get('user_id') || '',
    )

    const payload: CreateEquipmentPayload = {
      equipment_name: String(
        formData.get('equipment_name') || '',
      ),

      serial_number:
        String(
          formData.get('serial_number') || '',
        ) || null,

      status:
        (
          formData.get(
            'status',
          ) as CreateEquipmentPayload['status']
        ) || 'available',

      user_id: userIdRaw
        ? Number(userIdRaw)
        : null,

      notes:
        String(
          formData.get('notes') || '',
        ) || null,
    }

    setIsSubmitting(true)

    try {
      await createEquipment(payload)

      formElement.reset()

      onCreated?.()

      onClose()

      showSuccess(
        'تمت إضافة المعدة الجديدة بنجاح.',
        'تمت الإضافة بنجاح',
      )
    } catch (err) {
      const apiError = err as ApiError

      setError(
        apiError?.message ||
          'تعذر إضافة المعدة.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClasses =
    'w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 transition-all placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

  const labelClasses =
    'mb-2 block text-sm font-bold text-gray-800'

  return (
    <div
      className={cn(
        'fixed inset-0 z-[70] overflow-y-auto transition-opacity duration-300',
        isOpen
          ? 'opacity-100'
          : 'pointer-events-none opacity-0',
      )}
    >
      {/* الخلفية المظللة */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* الحاوية */}
      <div
        className="relative flex min-h-screen items-center justify-center p-4"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* نافذة الإضافة */}
        <div
          className={cn(
            'relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white text-gray-900 shadow-2xl transition-all duration-300',
            isOpen
              ? 'translate-y-0 scale-100'
              : 'translate-y-4 scale-95',
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-white p-6">

            <h3 className="text-xl font-bold text-gray-900">
              {t('modal.title')}
            </h3>

            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق"
              className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <X size={22} />
            </button>

          </div>

          {/* Form */}
          <form
            className="grid grid-cols-2 gap-6 bg-white p-6"
            onSubmit={handleSubmit}
          >
            {/* رسالة الخطأ */}
            {error && (
              <div className="col-span-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* اسم المعدة */}
            <div className="col-span-2 sm:col-span-1">

              <label className={labelClasses}>
                {t('modal.equipmentName')}
              </label>

              <input
                name="equipment_name"
                type="text"
                required
                className={inputClasses}
                placeholder={t(
                  'modal.equipmentNamePlaceholder',
                )}
              />

            </div>

            {/* الرقم التسلسلي */}
            <div className="col-span-2 sm:col-span-1">

              <label className={labelClasses}>
                {t('modal.serialNumber')}
              </label>

              <input
                name="serial_number"
                type="text"
                className={inputClasses}
                placeholder={t(
                  'modal.serialNumberPlaceholder',
                )}
              />

            </div>

            {/* الحالة */}
            <div className="col-span-2 sm:col-span-1">

              <label className={labelClasses}>
                {t('modal.initialStatus')}
              </label>

              <select
                name="status"
                defaultValue="available"
                className={inputClasses}
              >
                <option value="available">
                  {t('status.available')}
                </option>

                <option value="maintenance">
                  {t('status.maintenance')}
                </option>

                <option value="damaged">
                  {t('status.damaged')}
                </option>

                <option value="lost">
                  {t('status.lost')}
                </option>

              </select>

            </div>

            {/* الموظف المسؤول */}
            <div className="col-span-2 sm:col-span-1">

              <label className={labelClasses}>
                {t('modal.assignTo')}
              </label>

              <select
                name="user_id"
                defaultValue=""
                className={inputClasses}
              >
                <option value="">
                  {t(
                    'modal.assignToPlaceholder',
                  )}
                </option>

                {employees.map((employee) => (
                  <option
                    key={employee.id}
                    value={employee.id}
                  >
                    {employee.name}
                  </option>
                ))}

              </select>

            </div>

            {/* الملاحظات */}
            <div className="col-span-2">

              <label className={labelClasses}>
                {t('modal.notes')}
              </label>

              <textarea
                name="notes"
                rows={4}
                className={inputClasses}
                placeholder={t(
                  'modal.notesPlaceholder',
                )}
              />

            </div>

            {/* الأزرار */}
            <div className="col-span-2 mt-4 flex justify-end gap-3 border-t border-gray-200 pt-6">

              {/* إلغاء */}
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 bg-white px-6 py-2 font-bold text-gray-700 transition-colors hover:bg-gray-100"
              >
                {t('modal.cancel')}
              </button>

              {/* حفظ */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-primary px-10 py-2 font-bold text-white shadow-md transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? 'جارٍ الحفظ...'
                  : t('modal.save')}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  )
}