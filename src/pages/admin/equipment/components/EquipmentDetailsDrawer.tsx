import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Calendar } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { Equipment } from '../types'
import { cn } from '@/utils/cn'

interface EquipmentDetailsDrawerProps {
 equipment: Equipment | null
 isOpen: boolean
 onClose: () => void
}

export function EquipmentDetailsDrawer({
  equipment,
  isOpen,
  onClose,
}: EquipmentDetailsDrawerProps) {
  const { t } = useTranslation('equipment')
  const { isRTL } = useLanguage()

  const [shouldRender, setShouldRender] =
    useState(false)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
    } else {
      const timer = setTimeout(
        () => setShouldRender(false),
        300,
      )

      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!shouldRender || !equipment) {
    return null
  }

  const getStatusStyle = (
    status: string | null,
  ) => {
    switch (status) {
      case 'available':
        return 'bg-green-50 text-green-600'

      case 'maintenance':
        return 'bg-amber-50 text-amber-600'

      case 'damaged':
        return 'bg-red-50 text-red-600'

      case 'lost':
        return 'bg-red-50 text-red-600'

      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const formatDate = (
    dateString: string,
  ) => {
    return new Date(
      dateString,
    ).toLocaleDateString(
      isRTL ? 'ar-SA' : 'en-US',
    )
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-[70] flex items-center justify-center p-4 transition-opacity duration-300',
        isOpen
          ? 'opacity-100'
          : 'pointer-events-none opacity-0',
      )}
    >
      {/* الخلفية */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* نافذة التفاصيل */}
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className="relative z-10 flex w-full max-w-2xl max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white p-6">

          <h3 className="font-headline-md font-bold text-gray-900">
            {t('drawer.title')}
          </h3>

          <button
            type="button"
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            onClick={onClose}
          >
            <X size={22} />
          </button>

        </div>

        {/* Content */}
        <div className="flex-grow space-y-8 overflow-y-auto bg-white p-6">

          {/* بيانات المعدة */}
          <div className="space-y-4">

            <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">

              <span className="text-sm text-gray-400">
                {t('drawer.imagePlaceholder')}
              </span>

              <span
                className={cn(
                  'absolute top-4 rounded-full px-3 py-1 text-[12px] font-bold shadow-sm',
                  isRTL
                    ? 'left-4'
                    : 'right-4',
                  getStatusStyle(
                    equipment.status,
                  ),
                )}
              >
                {equipment.status
                  ? t(`status.${equipment.status}`)
                  : '-'}
              </span>

            </div>

            <div>

              <h4 className="font-headline-md font-bold text-gray-900">
                {equipment.equipment_name}
              </h4>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div className="rounded-xl border border-gray-200 bg-white p-4">

                  <p className="mb-1 text-sm text-gray-500">
                    {t('drawer.equipmentId')}
                  </p>

                  <p className="font-bold text-gray-900">
                    {equipment.id}
                  </p>

                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4">

                  <p className="mb-1 text-sm text-gray-500">
                    {t('drawer.serialNumber')}
                  </p>

                  <p className="font-bold text-gray-900">
                    {equipment.serial_number || '-'}
                  </p>

                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4">

                  <p className="mb-1 text-sm text-gray-500">
                    {t('drawer.createdAt')}
                  </p>

                  <p className="flex items-center gap-2 font-bold text-gray-900">

                    <Calendar
                      size={16}
                      className="text-gray-400"
                    />

                    <span dir="ltr">
                      {formatDate(
                        equipment.created_at,
                      )}
                    </span>

                  </p>

                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4">

                  <p className="mb-1 text-sm text-gray-500">
                    {t('drawer.createdBy')}
                  </p>

                  <p className="font-bold text-gray-900">
                    {equipment.createdBy?.name || '-'}
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* المستخدم المرتبط */}
          <div className="space-y-4">

            <h5 className="border-b border-gray-200 pb-2 font-bold text-gray-900">
              {t('drawer.assignedUser')}
            </h5>

            {equipment.user ? (

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

                <p className="font-bold text-gray-900">
                  {equipment.user.name}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  ID: {equipment.user.id}
                </p>

              </div>

            ) : (

              <div className="flex items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-gray-500">

                {t('drawer.unassignedUser')}

              </div>

            )}

          </div>

          {/* الملاحظات */}
          <div className="space-y-4">

            <h5 className="border-b border-gray-200 pb-2 font-bold text-gray-900">
              {t('drawer.notes')}
            </h5>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

              {equipment.notes ? (

                <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
                  {equipment.notes}
                </p>

              ) : (

                <p className="italic text-gray-400">
                  لا توجد ملاحظات
                </p>

              )}

            </div>

          </div>

          {/* آخر تحديث */}
          <div>

            <p className="flex gap-2 text-sm text-gray-500">

              <span>
                {t('drawer.updatedAt')}:
              </span>

              <span dir="ltr">
                {formatDate(
                  equipment.updated_at,
                )}
              </span>

            </p>

          </div>

        </div>

        {/* Footer - زر واحد فقط */}
        <div className="border-t border-gray-200 bg-white p-6">

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-primary py-3 font-bold text-white transition-colors hover:bg-primary/90"
          >
            إغلاق
          </button>

        </div>

      </div>
    </div>
  )
}
