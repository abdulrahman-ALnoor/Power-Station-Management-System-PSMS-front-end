import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, UserPlus } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

export interface CustomerData {
  customer_number?: string
  full_name: string
  customer_type: 'residential' | 'commercial' | 'industrial'
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

export function AddCustomerModal({ isOpen, onClose, onAdd }: AddCustomerModalProps) {
  const { t } = useTranslation('customers')
  const { isRTL } = useLanguage()

  const [formData, setFormData] = useState<CustomerData>({
    customer_number: '',
    full_name: '',
    customer_type: 'residential',
    phone: '',
    alternative_phone: '',
    address_description: '',
    notes: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
  }

  if (!isOpen) return null

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
                <UserPlus size={20} className="text-primary" />
                {t('addModal.title')}
              </h2>
              <p className="text-sm text-outline dark:text-outline/80 mt-2">
                {t('addModal.description')}
              </p>
            </div>
            <button 
              onClick={onClose}
              aria-label={t('addModal.actions.cancel')}
              className="p-2 rounded-full hover:bg-surface-variant dark:hover:bg-surface-container transition-colors text-outline self-start mt-[-4px]"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <form id="add-customer-form" onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                    {t('addModal.fields.fullName')} <span className="text-error">*</span>
                  </label>
                  <input
                    required
                    maxLength={150}
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full bg-surface-container-lowest dark:bg-surface-container/30 border border-outline/20 dark:border-outline/10 text-on-surface dark:text-on-dark text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                    {t('addModal.fields.customerNumber')}
                  </label>
                  <input
                    maxLength={50}
                    name="customer_number"
                    value={formData.customer_number}
                    onChange={handleChange}
                    className="w-full bg-surface-container-lowest dark:bg-surface-container/30 border border-outline/20 dark:border-outline/10 text-on-surface dark:text-on-dark text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                    {t('addModal.fields.customerType')} <span className="text-error">*</span>
                  </label>
                  <select
                    required
                    name="customer_type"
                    value={formData.customer_type}
                    onChange={handleChange}
                    className="w-full bg-surface-container-lowest dark:bg-surface-container/30 border border-outline/20 dark:border-outline/10 text-on-surface dark:text-on-dark text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow cursor-pointer"
                  >
                    <option value="residential">{t('addModal.types.residential')}</option>
                    <option value="commercial">{t('addModal.types.commercial')}</option>
                    <option value="industrial">{t('addModal.types.industrial')}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                    {t('addModal.fields.phone')} <span className="text-error">*</span>
                  </label>
                  <input
                    required
                    maxLength={30}
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    dir="ltr"
                    className="w-full text-start bg-surface-container-lowest dark:bg-surface-container/30 border border-outline/20 dark:border-outline/10 text-on-surface dark:text-on-dark text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                    {t('addModal.fields.alternativePhone')}
                  </label>
                  <input
                    maxLength={30}
                    name="alternative_phone"
                    value={formData.alternative_phone}
                    onChange={handleChange}
                    dir="ltr"
                    className="w-full text-start bg-surface-container-lowest dark:bg-surface-container/30 border border-outline/20 dark:border-outline/10 text-on-surface dark:text-on-dark text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                    {t('addModal.fields.address')}
                  </label>
                  <textarea
                    name="address_description"
                    value={formData.address_description}
                    onChange={handleChange}
                    rows={2}
                    className="w-full min-h-[80px] bg-surface-container-lowest dark:bg-surface-container/30 border border-outline/20 dark:border-outline/10 text-on-surface dark:text-on-dark text-sm rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow resize-none"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                    {t('addModal.fields.notes')}
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
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
              form="add-customer-form"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary-dark transition-colors shadow-sm min-h-[44px]"
            >
              {t('addModal.actions.add')}
            </button>
          </div>

        </div>
      </div>
    </>
  )
}
