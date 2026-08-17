import React from 'react'
import { useTranslation } from 'react-i18next'
import { X, Calendar, User, FileText, CheckCircle2, XCircle, Clock, Hash } from 'lucide-react'
import { MeterReading } from '../types'
import { useLanguage } from '@/hooks/useLanguage'

interface MeterReadingDetailsDrawerProps {
  reading: MeterReading | null
  isOpen: boolean
  onClose: () => void
}

export function MeterReadingDetailsDrawer({ reading, isOpen, onClose }: MeterReadingDetailsDrawerProps) {
  const { t } = useTranslation('readings')
  const { isRTL } = useLanguage()

  if (!isOpen || !reading) return null

  const formatNumber = (val: number) => new Intl.NumberFormat('en-US').format(val)
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'YER' }).format(val)

  const getStatusBadge = (status: MeterReading['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-success/10 text-success">
            <CheckCircle2 size={16} />
            {t('status.approved')}
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-error/10 text-error">
            <XCircle size={16} />
            {t('status.rejected')}
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-warning/10 text-warning dark:bg-amber-500/10 dark:text-amber-500">
            <Clock size={16} />
            {t('status.pending')}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-outline/10 text-outline">
            {t('status.unspecified')}
          </span>
        )
    }
  }

  const getMethodText = (method: MeterReading['reading_method']) => {
    switch (method) {
      case 'manual': return t('method.manual')
      case 'qr_scan': return t('method.qr_scan')
      default: return t('method.unspecified')
    }
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      <div 
        className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} bottom-0 w-full max-w-md bg-surface-white dark:bg-surface-container-low shadow-2xl z-50 flex flex-col transition-transform transform`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="flex items-center justify-between p-6 border-b border-outline/10 shrink-0">
          <div>
            <h2 className="font-headline-sm font-bold text-on-surface dark:text-on-dark flex items-center gap-2">
              <Hash size={20} className="text-primary" />
              {t('details.title')} #{reading.id}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-variant dark:hover:bg-surface-container transition-colors text-outline"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-label-sm font-bold text-outline dark:text-outline/70 mb-1">
                {t('table.columns.meterNumber')}
              </p>
              <p className="font-title-lg font-black text-on-surface dark:text-on-dark">
                {reading.meter?.meter_number || reading.meter_id}
              </p>
            </div>
            <div>
              {getStatusBadge(reading.status)}
            </div>
          </div>

          <div className="bg-surface-container-lowest dark:bg-surface-container/30 rounded-xl p-5 border border-outline/10 grid grid-cols-2 gap-4">
            <div>
              <p className="text-label-xs text-outline dark:text-outline/70 mb-1">{t('table.columns.previousReading')}</p>
              <p className="font-bold text-on-surface dark:text-on-dark" dir="ltr">{formatNumber(reading.previous_reading)}</p>
            </div>
            <div>
              <p className="text-label-xs text-outline dark:text-outline/70 mb-1">{t('table.columns.currentReading')}</p>
              <p className="font-bold text-on-surface dark:text-on-dark" dir="ltr">{formatNumber(reading.current_reading)}</p>
            </div>
            <div className="col-span-2 pt-2 border-t border-outline/10">
              <div className="flex justify-between items-center">
                <p className="text-label-sm font-bold text-outline dark:text-outline/70">{t('table.columns.consumption')}</p>
                <p className="font-black text-lg text-accent dark:text-accent-amber" dir="ltr">{formatNumber(reading.consumption)} kWh</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-outline/10">
              <span className="text-label-md text-outline dark:text-outline/80">{t('table.columns.pricePerKwh')}</span>
              <span className="font-bold text-on-surface dark:text-on-dark" dir="ltr">{formatCurrency(reading.price_per_kwh)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-outline/10">
              <span className="text-label-md font-bold text-outline dark:text-outline/80">{t('table.columns.readingCost')}</span>
              <span className="font-black text-teal-600 dark:text-teal-400" dir="ltr">{formatCurrency(reading.reading_cost)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-outline/10">
              <span className="text-label-md text-outline dark:text-outline/80">{t('table.columns.method')}</span>
              <span className="font-medium text-on-surface dark:text-on-dark">{getMethodText(reading.reading_method)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-outline/10">
              <span className="text-label-md text-outline dark:text-outline/80 flex items-center gap-2"><Calendar size={16}/> {t('table.columns.readingDate')}</span>
              <span className="font-medium text-on-surface dark:text-on-dark">{reading.reading_date}</span>
            </div>
          </div>

          {reading.notes && (
            <div className="bg-surface-variant/50 dark:bg-surface-container/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-outline dark:text-outline/80 mb-2">
                <FileText size={16} />
                <span className="text-label-sm font-bold">{t('details.notes')}</span>
              </div>
              <p className="text-sm text-on-surface-variant dark:text-outline leading-relaxed whitespace-pre-wrap">
                {reading.notes}
              </p>
            </div>
          )}

          <div className="text-xs text-outline/60 dark:text-outline/50 space-y-2 pt-4">
            {reading.createdBy && (
              <div className="flex items-center gap-2">
                <User size={14} />
                {t('details.createdBy')}: {reading.createdBy.name}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock size={14} />
              {t('details.createdAt')}: {new Date(reading.created_at).toLocaleString()}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} />
              {t('details.updatedAt')}: {new Date(reading.updated_at).toLocaleString()}
            </div>
          </div>
          
        </div>
      </div>
    </>
  )
}
