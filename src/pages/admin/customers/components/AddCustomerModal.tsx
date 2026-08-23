import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, UserPlus } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

import {
  createCustomer,
  type CustomerPayload,
} from '@/services/customers.service'

import {
  showSuccess,
  showError,
} from '@/utils/toast'


export interface CustomerData {
  customer_number?: string
  full_name: string
  customer_type:
    | 'residential'
    | 'commercial'
    | 'industrial'
  phone: string
  alternative_phone?: string
  address_description?: string
  notes?: string
}


interface AddCustomerModalProps {
 isOpen: boolean
 onClose: () => void
 onAdd?: (data: CustomerData) => void
}


export function AddCustomerModal({
  isOpen,
  onClose,
  onAdd,
}: AddCustomerModalProps) {
  const { t } = useTranslation('customers')
  const { isRTL } = useLanguage()

  const [formData, setFormData] =
    useState<CustomerData>({
      customer_number: '',
      full_name: '',
      customer_type: 'residential',
      phone: '',
      alternative_phone: '',
      address_description: '',
      notes: '',
    })

  const [isSubmitting, setIsSubmitting] =
    useState(false)


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }


  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault()

    setIsSubmitting(true)

    try {
      const payload: CustomerPayload = {
        customer_number:
          formData.customer_number || undefined,

        full_name:
          formData.full_name.trim(),

        customer_type:
          formData.customer_type,

        phone:
          formData.phone.trim(),

        alternative_phone:
          formData.alternative_phone?.trim()
          || undefined,

        address_description:
          formData.address_description?.trim()
          || undefined,

        notes:
          formData.notes?.trim()
          || undefined,
      }


      await createCustomer(payload)


      showSuccess(
        'تمت إضافة العميل بنجاح.',
        'تمت العملية بنجاح',
      )


      onAdd?.(formData)


      setFormData({
        customer_number: '',
        full_name: '',
        customer_type: 'residential',
        phone: '',
        alternative_phone: '',
        address_description: '',
        notes: '',
      })


      onClose()

    } catch (error) {
      const apiError = error as {
        message?: string
        status?: number
        errors?: Record<
          string,
          string[]
        >
      }


      const validationMessage =
        apiError.errors
          ? Object
              .values(apiError.errors)
              .flat()
              .join(' ')
          : undefined


      showError(
        validationMessage
          || apiError.message
          || 'تعذر إضافة العميل. يرجى المحاولة مرة أخرى.',

        'فشلت إضافة العميل',
      )

    } finally {
      setIsSubmitting(false)
    }
  }


  if (!isOpen) return null


  return (
    <>
      {/* الخلفية */}
      <div
        className="
          fixed
          inset-0
          z-40
          bg-black/45
          transition-opacity
        "
        onClick={onClose}
      />


      {/* النافذة */}
      <div
        className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          p-4
          sm:p-6
        "
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div
          className="
            flex
            w-full
            max-w-2xl
            max-h-[calc(100vh-32px)]
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
                <UserPlus
                  size={20}
                  className="text-primary"
                />

                {t('addModal.title')}
              </h2>


              <p
                className="
                  mt-2
                  text-sm
                  text-outline
                  dark:text-outline/80
                "
              >
                {t('addModal.description')}
              </p>
            </div>


            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              aria-label={
                t('addModal.actions.cancel')
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
                disabled:opacity-50
              "
            >
              <X size={20} />
            </button>
          </div>


          {/* Form */}
          <div
            className="
              flex-1
              overflow-y-auto
              p-6
            "
          >
            <form
              id="add-customer-form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              <div
                className="
                  grid
                  grid-cols-1
                  gap-5
                  md:grid-cols-2
                "
              >

                {/* الاسم */}
                <div className="space-y-2 md:col-span-2">
                  <label
                    className="
                      block
                      text-sm
                      font-medium
                      text-on-surface
                      dark:text-on-dark
                    "
                  >
                    {t('addModal.fields.fullName')}

                    <span className="text-error">
                      {' '}*
                    </span>
                  </label>

                  <input
                    required
                    maxLength={150}
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="
                      min-h-[44px]
                      w-full
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


                {/* رقم العميل */}
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
                      'addModal.fields.customerNumber',
                    )}
                  </label>

                  <input
                    maxLength={50}
                    name="customer_number"
                    value={formData.customer_number}
                    onChange={handleChange}
                    className="
                      min-h-[44px]
                      w-full
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


                {/* نوع العميل */}
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
                      'addModal.fields.customerType',
                    )}

                    <span className="text-error">
                      {' '}*
                    </span>
                  </label>

                  <select
                    required
                    name="customer_type"
                    value={formData.customer_type}
                    onChange={handleChange}
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
                    <option value="residential">
                      {t(
                        'addModal.types.residential',
                      )}
                    </option>

                    <option value="commercial">
                      {t(
                        'addModal.types.commercial',
                      )}
                    </option>

                    <option value="industrial">
                      {t(
                        'addModal.types.industrial',
                      )}
                    </option>
                  </select>
                </div>


                {/* رقم الهاتف */}
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
                    {t('addModal.fields.phone')}

                    <span className="text-error">
                      {' '}*
                    </span>
                  </label>

                  <input
                    required
                    maxLength={30}
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
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


                {/* رقم الهاتف البديل */}
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
                      'addModal.fields.alternativePhone',
                    )}
                  </label>

                  <input
                    maxLength={30}
                    name="alternative_phone"
                    value={
                      formData.alternative_phone
                    }
                    onChange={handleChange}
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


                {/* العنوان */}
                <div className="space-y-2 md:col-span-2">
                  <label
                    className="
                      block
                      text-sm
                      font-medium
                      text-on-surface
                      dark:text-on-dark
                    "
                  >
                    {t('addModal.fields.address')}
                  </label>

                  <textarea
                    name="address_description"
                    value={
                      formData.address_description
                    }
                    onChange={handleChange}
                    rows={2}
                    className="
                      min-h-[80px]
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


                {/* الملاحظات */}
                <div className="space-y-2 md:col-span-2">
                  <label
                    className="
                      block
                      text-sm
                      font-medium
                      text-on-surface
                      dark:text-on-dark
                    "
                  >
                    {t('addModal.fields.notes')}
                  </label>

                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
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


          {/* Footer */}
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
              bg-white
              p-6
              pt-4
              sm:flex-row
              dark:bg-surface-container-low
            "
          >

            {/* إلغاء */}
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
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
                disabled:opacity-50
                sm:w-auto
                dark:text-on-dark
                dark:hover:bg-surface-container
              "
            >
              {t('addModal.actions.cancel')}
            </button>


            {/* إضافة */}
            <button
              type="submit"
              form="add-customer-form"
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
                disabled:opacity-50
                sm:w-auto
              "
            >
              {isSubmitting
                ? 'جاري الحفظ...'
                : t('addModal.actions.add')}
            </button>

          </div>

        </div>
      </div>
    </>
  )
}
