import React from 'react'
import { useTranslation } from 'react-i18next'
import { Receipt } from 'lucide-react'
import { CompanyProfile } from '../types'

interface CompanyBillingSectionProps {
  data: CompanyProfile
  onChange: (field: keyof CompanyProfile, value: any) => void
}

export function CompanyBillingSection({ data, onChange }: CompanyBillingSectionProps) {
  const { t } = useTranslation('settings')

  return (
    <div className="bg-surface-white dark:bg-surface-container-low rounded-2xl p-6 md:p-8 shadow-sm border border-outline/10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-500">
          <Receipt size={22} />
        </div>
        <h3 className="font-headline-sm font-bold text-on-surface dark:text-on-dark">
          {t('sections.billingSettings')}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="currency" className="block text-label-md font-bold text-on-surface dark:text-on-dark">
            {t('fields.currency')} <span className="text-error">*</span>
          </label>
          <input
            id="currency"
            type="text"
            value={data.currency}
            onChange={(e) => onChange('currency', e.target.value)}
            placeholder={t('placeholders.currency')}
            maxLength={20}
            className="w-full px-4 py-3 rounded-xl border border-outline/20 dark:border-outline/10 bg-surface-container-lowest dark:bg-surface-container/30 text-on-surface dark:text-on-dark focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow placeholder:text-outline/50"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="price_per_kwh" className="block text-label-md font-bold text-on-surface dark:text-on-dark">
            {t('fields.pricePerKwh')} <span className="text-error">*</span>
          </label>
          <input
            id="price_per_kwh"
            type="number"
            step="0.01"
            min="0"
            value={data.price_per_kwh}
            onChange={(e) => onChange('price_per_kwh', parseFloat(e.target.value) || 0)}
            placeholder={t('placeholders.pricePerKwh')}
            dir="ltr"
            className="w-full px-4 py-3 rounded-xl border border-outline/20 dark:border-outline/10 bg-surface-container-lowest dark:bg-surface-container/30 text-on-surface dark:text-on-dark focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow placeholder:text-outline/50 text-start"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="reading_cycle_days" className="block text-label-md font-bold text-on-surface dark:text-on-dark">
            {t('fields.readingCycleDays')}
          </label>
          <input
            id="reading_cycle_days"
            type="number"
            step="1"
            min="1"
            value={data.reading_cycle_days || ''}
            onChange={(e) => onChange('reading_cycle_days', parseInt(e.target.value, 10) || null)}
            placeholder={t('placeholders.readingCycleDays')}
            dir="ltr"
            className="w-full px-4 py-3 rounded-xl border border-outline/20 dark:border-outline/10 bg-surface-container-lowest dark:bg-surface-container/30 text-on-surface dark:text-on-dark focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow placeholder:text-outline/50 text-start"
          />
        </div>
      </div>
    </div>
  )
}
