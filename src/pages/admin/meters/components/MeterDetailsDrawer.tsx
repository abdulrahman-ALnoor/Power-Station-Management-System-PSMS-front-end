import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  X,
  Zap,
  User,
  Wrench,
  MapPin,
  Calendar,
  QrCode,
} from 'lucide-react'

import { useLanguage } from '@/hooks/useLanguage'
import { Meter } from '../types'
import { cn } from '@/utils/cn'


interface MeterDetailsDrawerProps {
  meter: Meter | null
  isOpen: boolean
  onClose: () => void
}


export function MeterDetailsDrawer({
  meter,
  isOpen,
  onClose,
}: MeterDetailsDrawerProps) {

  const { t } = useTranslation('meters')

  const { isRTL } =
    useLanguage()

  const [shouldRender, setShouldRender] =
    useState(false)


  // إبقاء النافذة موجودة قليلًا عند الإغلاق
  useEffect(() => {

    if (isOpen) {
      setShouldRender(true)
    } else {

      const timer =
        setTimeout(
          () => setShouldRender(false),
          300,
        )

      return () =>
        clearTimeout(timer)
    }

  }, [isOpen])


  if (!shouldRender || !meter) {
    return null
  }


  const getStatusStyle = (
    status: string,
  ) => {

    switch (status) {

      case 'active':
        return 'bg-green-50 text-green-700'

      case 'maintenance':
        return 'bg-blue-50 text-blue-700'

      case 'damaged':
        return 'bg-red-50 text-red-700'

      case 'disconnected':
        return 'bg-amber-50 text-amber-700'

      default:
        return 'bg-gray-100 text-gray-700'
    }
  }


  const formatDate = (
    dateString: string | null,
  ) => {

    if (!dateString) {
      return '-'
    }

    const date =
      new Date(dateString)

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return dateString
    }

    return date.toLocaleDateString(
      isRTL
        ? 'ar-SA'
        : 'en-US',
    )
  }


  return (

    <>
      {/* الخلفية المظللة */}

      <div
        className={cn(
          `
            fixed
            inset-0
            z-[60]
            bg-black/50
            backdrop-blur-sm
            transition-opacity
            duration-300
          `,
          isOpen
            ? 'opacity-100'
            : 'opacity-0',
        )}
        onClick={onClose}
      />


      {/* نافذة التفاصيل في المنتصف */}

      <div
        className="
          fixed
          inset-0
          z-[70]
          flex
          items-center
          justify-center
          p-4
        "
        dir={isRTL ? 'rtl' : 'ltr'}
      >

        <div
          className={cn(
            `
              relative
              flex
              w-full
              max-w-2xl
              max-h-[90vh]
              flex-col
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-2xl
              transition-all
              duration-300
            `,
            isOpen
              ? 'scale-100 opacity-100'
              : 'scale-95 opacity-0',
          )}
        >

          {/* Header */}

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-gray-100
              px-6
              py-5
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-primary/10
                  text-primary
                "
              >
                <Zap size={23} />
              </div>

              <div>

                <h3
                  className="
                    text-xl
                    font-bold
                    text-gray-900
                  "
                >
                  {t('drawer.title')}
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    text-gray-500
                  "
                >
                  تفاصيل ومعلومات العداد
                </p>

              </div>

            </div>


            {/* زر الإغلاق */}

            <button
              type="button"
              onClick={onClose}
              aria-label={t('drawer.close')}
              className="
                rounded-full
                p-2
                text-gray-400
                transition-colors
                hover:bg-gray-100
                hover:text-gray-700
              "
            >
              <X size={21} />
            </button>

          </div>


          {/* المحتوى */}

          <div
            className="
              flex-1
              overflow-y-auto
              p-6
              space-y-7
            "
          >

            {/* معلومات العداد */}

            <div
              className="
                flex
                items-center
                gap-4
                rounded-xl
                border
                border-gray-100
                bg-gray-50
                p-4
              "
            >

              {meter.qr_code_url ? (

                <img
                  src={meter.qr_code_url}
                  alt={t('drawer.qrImage')}
                  className="
                    h-16
                    w-16
                    shrink-0
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    object-contain
                  "
                />

              ) : (

                <div
                  className="
                    flex
                    h-16
                    w-16
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-primary/10
                    text-primary
                  "
                >
                  <Zap size={30} />
                </div>

              )}


              <div
                className="
                  min-w-0
                  flex-1
                "
              >

                <h4
                  className="
                    truncate
                    text-lg
                    font-bold
                    text-gray-900
                  "
                >
                  {meter.meter_number}
                </h4>

                <p
                  className="
                    mt-1
                    flex
                    items-center
                    gap-1
                    truncate
                    text-sm
                    text-gray-500
                  "
                >
                  <QrCode size={14} />

                  {meter.qr_code || '-'}

                </p>

              </div>


              <span
                className={cn(
                  `
                    shrink-0
                    rounded-full
                    px-3
                    py-1
                    text-sm
                    font-semibold
                  `,
                  getStatusStyle(
                    meter.status || '',
                  ),
                )}
              >
                {meter.status
                  ? t(
                      `status.${meter.status}`,
                    )
                  : '-'}
              </span>

            </div>


            {/* معلومات العميل */}

            <section>

              <h5
                className="
                  mb-4
                  flex
                  items-center
                  gap-2
                  text-lg
                  font-bold
                  text-gray-900
                "
              >
                <User
                  size={20}
                  className="text-primary"
                />

                {t('table.customer')}

              </h5>


              <div
                className="
                  rounded-xl
                  bg-gray-50
                  p-4
                "
              >

                <p
                  className="
                    mb-1
                    text-sm
                    text-gray-500
                  "
                >
                  {t('table.customer')}
                </p>

                <p
                  className="
                    font-semibold
                    text-gray-900
                  "
                >
                  {meter.customerName || '-'}

                </p>

              </div>

            </section>


            {/* معلومات التركيب */}

            <section>

              <h5
                className="
                  mb-4
                  flex
                  items-center
                  gap-2
                  text-lg
                  font-bold
                  text-gray-900
                "
              >

                <Wrench
                  size={20}
                  className="text-primary"
                />

                {t('modal.sectionInstallation')}

              </h5>


              <div
                className="
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                "
              >

                {/* تاريخ التركيب */}

                <div
                  className="
                    rounded-xl
                    bg-gray-50
                    p-4
                  "
                >

                  <p
                    className="
                      mb-2
                      flex
                      items-center
                      gap-2
                      text-sm
                      text-gray-500
                    "
                  >

                    <Calendar size={15} />

                    {t('table.installationDate')}

                  </p>


                  <p
                    className="
                      font-semibold
                      text-gray-900
                    "
                  >

                    {formatDate(
                      meter.installation_date,
                    )}

                  </p>

                </div>


                {/* تم التركيب بواسطة */}

                <div
                  className="
                    rounded-xl
                    bg-gray-50
                    p-4
                  "
                >

                  <p
                    className="
                      mb-2
                      flex
                      items-center
                      gap-2
                      text-sm
                      text-gray-500
                    "
                  >

                    <User size={15} />

                    {t('table.installedBy')}

                  </p>


                  <p
                    className="
                      font-semibold
                      text-gray-900
                    "
                  >

                    {meter.installedByName || '-'}

                  </p>

                </div>


                {/* موقع التركيب */}

                <div
                  className="
                    rounded-xl
                    bg-gray-50
                    p-4
                    sm:col-span-2
                  "
                >

                  <p
                    className="
                      mb-2
                      flex
                      items-center
                      gap-2
                      text-sm
                      text-gray-500
                    "
                  >

                    <MapPin size={15} />

                    {t('table.installationLocation')}

                  </p>


                  <p
                    className="
                      font-semibold
                      text-gray-900
                    "
                  >

                    {meter.installation_location || '-'}

                  </p>

                </div>


                {/* تاريخ الإنشاء */}

                <div
                  className="
                    rounded-xl
                    bg-gray-50
                    p-4
                    sm:col-span-2
                  "
                >

                  <p
                    className="
                      mb-2
                      flex
                      items-center
                      gap-2
                      text-sm
                      text-gray-500
                    "
                  >

                    <Calendar size={15} />

                    {t('drawer.createdAt')}

                  </p>


                  <p
                    className="
                      font-semibold
                      text-gray-900
                    "
                    dir="ltr"
                  >

                    {formatDate(
                      meter.created_at,
                    )}

                  </p>

                </div>

              </div>

            </section>

          </div>


          {/* زر واحد فقط */}

          <div
            className="
              border-t
              border-gray-100
              bg-white
              p-5
            "
          >

            <button
              type="button"
              onClick={onClose}
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                bg-white
                py-3
                font-bold
                text-gray-700
                transition-colors
                hover:bg-gray-50
              "
            >
              إلغاء
            </button>

          </div>

        </div>

      </div>
    </>
  )
}