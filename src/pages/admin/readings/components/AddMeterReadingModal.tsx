import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Plus, AlertCircle } from 'lucide-react'
import { MeterReading, ReadingMethod } from '../types'
import { useLanguage } from '@/hooks/useLanguage'

interface AddMeterReadingModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (reading: Omit<MeterReading, 'id' | 'created_at' | 'updated_at' | 'status' | 'created_by'>) => void
}

export function AddMeterReadingModal({ isOpen, onClose, onAdd }: AddMeterReadingModalProps) {
  const { t } = useTranslation('readings')
  const { isRTL } = useLanguage()

  const [meterId, setMeterId] = useState('')
  const [previousReading, setPreviousReading] = useState<number | ''>('')
  const [currentReading, setCurrentReading] = useState<number | ''>('')
  const [pricePerKwh, setPricePerKwh] = useState<number>(250) // Default for demo
  const [readingDate, setReadingDate] = useState(() => new Date().toISOString().split('T')[0])
  const [method, setMethod] = useState<ReadingMethod>('manual')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)

  const consumption = (typeof currentReading === 'number' && typeof previousReading === 'number') 
    ? Math.max(0, currentReading - previousReading) 
    : 0

  const cost = consumption * pricePerKwh

  const formatNumber = (val: number) => new Intl.NumberFormat('en-US').format(val)
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'YER' }).format(val)

  useEffect(() => {
    if (typeof currentReading === 'number' && typeof previousReading === 'number') {
      if (currentReading < previousReading) {
        setError(t('addModal.validation.currentLessThanPrevious'))
      } else {
        setError(null)
      }
    } else {
      setError(null)
    }
  }, [currentReading, previousReading, t])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (
      error ||
      !meterId ||
      previousReading === '' ||
      currentReading === '' ||
      previousReading === null ||
      currentReading === null ||
      pricePerKwh === null
    ) {
      return
    }
    onAdd({
      meter_id: parseInt(meterId, 10),
      previous_reading: Number(previousReading),
      current_reading: Number(currentReading),
      consumption,
      price_per_kwh: pricePerKwh,
      reading_cost: cost,
      reading_date: readingDate,
      reading_method: method,
      notes: notes || null
    })

    // Reset
    setMeterId('')
    setPreviousReading('')
    setCurrentReading('')
    setNotes('')
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
                <Plus size={20} className="text-primary" />
                {t('addModal.title')}
              </h2>
              <p className="text-sm text-outline dark:text-outline/80 mt-2">
                {t('addModal.description')}
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
            <form id="add-reading-form" onSubmit={handleSubmit} className="space-y-6">
              
              {/* SECTION 1: Meter Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-primary dark:text-primary-light">
                  {isRTL ? 'بيانات العداد' : 'Meter Information'}
                </h3>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                    {t('table.columns.meterNumber')} <span className="text-error">*</span>
                  </label>
                  <select
                    required
                    value={meterId}
                    onChange={(e) => setMeterId(e.target.value)}
                    className="w-full min-w-0 bg-surface-container-lowest dark:bg-surface-container/30 border border-outline/20 dark:border-outline/10 text-on-surface dark:text-on-dark text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow cursor-pointer"
                  >
                    <option value="" disabled>{t('addModal.meterSelect')}</option>
                    <option value="101">MET-10001</option>
                    <option value="102">MET-10002</option>
                    <option value="103">MET-10003</option>
                    <option value="104">MET-10004</option>
                    <option value="105">MET-10005</option>
                  </select>
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
                      {t('table.columns.previousReading')} <span className="text-error">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      min="0"
                      value={previousReading}
                      onChange={(e) => setPreviousReading(e.target.value ? Number(e.target.value) : '')}
                      dir="ltr"
                      className="w-full bg-surface-container-lowest dark:bg-surface-container/30 border border-outline/20 dark:border-outline/10 text-on-surface dark:text-on-dark text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow text-start"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                      {t('table.columns.currentReading')} <span className="text-error">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      min="0"
                      value={currentReading}
                      onChange={(e) => setCurrentReading(e.target.value ? Number(e.target.value) : '')}
                      dir="ltr"
                      className={`w-full bg-surface-container-lowest dark:bg-surface-container/30 border text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 transition-shadow text-start ${
                        error ? 'border-error text-error focus:border-error' : 'border-outline/20 dark:border-outline/10 text-on-surface dark:text-on-dark focus:border-primary'
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
                      {t('table.columns.readingDate')} <span className="text-error">*</span>
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
                      {t('table.columns.pricePerKwh')} <span className="text-error">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      min="0"
                      value={pricePerKwh}
                      onChange={(e) => setPricePerKwh(Number(e.target.value))}
                      dir="ltr"
                      className="w-full bg-surface-container-lowest dark:bg-surface-container/30 border border-outline/20 dark:border-outline/10 text-on-surface dark:text-on-dark text-sm rounded-lg min-h-[44px] py-2.5 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow text-start"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                      {t('table.columns.method')}
                    </label>
                    <select
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
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-4">
                    <p className="text-sm font-medium text-outline dark:text-outline/80 mb-2">
                      {t('addModal.preview.consumption')}
                    </p>
                    <p className="font-semibold text-lg text-on-surface dark:text-on-dark" dir="ltr">
                      {formatNumber(consumption)} <span className="text-sm">kWh</span>
                    </p>
                  </div>
                  
                  <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-4">
                    <p className="text-sm font-medium text-outline dark:text-outline/80 mb-2">
                      {t('addModal.preview.cost')}
                    </p>
                    <p className="font-semibold text-lg text-teal-600 dark:text-teal-400" dir="ltr">
                      {formatCurrency(cost)}
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Notes */}
              <div className="space-y-4 pt-6 border-t border-outline/10">
                <h3 className="text-sm font-semibold text-primary dark:text-primary-light">
                  {isRTL ? 'الملاحظات' : 'Notes'}
                </h3>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-on-surface dark:text-on-dark">
                    {t('details.notes')}
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
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
              disabled={!!error}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              {t('addModal.actions.add')}
            </button>
          </div>

        </div>
      </div>
    </>
  )
}
