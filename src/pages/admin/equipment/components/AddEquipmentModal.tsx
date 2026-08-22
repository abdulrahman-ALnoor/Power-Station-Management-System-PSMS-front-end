import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useLanguage } from '@/hooks/useLanguage'
import { showSuccess } from '@/utils/toast'
import { createEquipment, type CreateEquipmentPayload } from '@/services/equipment.service'
import { fetchEmployees, mapEmployee } from '@/services/employees.service'
import type { Employee } from '@/pages/admin/employees/types'
import type { ApiError } from '@/types/api'

interface AddEquipmentModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated?: () => void
}

export function AddEquipmentModal({ isOpen, onClose, onCreated }: AddEquipmentModalProps) {
  const { t } = useTranslation('equipment')
  const { isRTL } = useLanguage()
  const [shouldRender, setShouldRender] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])

  useEffect(() => {
    
    if (isOpen) setShouldRender(true)
    else {
      const timer = setTimeout(() => setShouldRender(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    fetchEmployees({ per_page: 100 })
      .then((res) => setEmployees(res.data.map(mapEmployee)))
      .catch(() => setEmployees([]))
  }, [isOpen])

  if (!shouldRender) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    
    const formElement : HTMLFormElement = e.currentTarget
    const form = new FormData(formElement)
    const userIdRaw = String(form.get('user_id') || '')

    const payload: CreateEquipmentPayload = {
      equipment_name: String(form.get('equipment_name') || ''),
      serial_number: String(form.get('serial_number') || '') || null,
      status: (form.get('status') as CreateEquipmentPayload['status']) || 'available',
      user_id: userIdRaw ? Number(userIdRaw) : null,
      notes: String(form.get('notes') || '') || null,
    }

    setIsSubmitting(true)
    try {
      await createEquipment(payload)
       formElement.reset()
      onCreated?.()
      showSuccess('المعدة')
      onClose()
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError?.message || 'تعذر إضافة المعدة.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClasses = "w-full px-4 py-2 bg-surface-container-lowest dark:bg-surface border border-outline-variant dark:border-border-muted rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:focus:border-primary-fixed dark:focus:ring-primary-fixed text-body-md text-on-surface dark:text-on-dark transition-all placeholder:text-outline/70"
  const labelClasses = "block text-label-sm font-bold text-on-surface dark:text-on-dark mb-2"

  return (
    <div
      className={cn(
        "fixed inset-0 z-[70] overflow-y-auto transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div
        className="fixed inset-0 bg-primary/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />

      <div className="relative min-h-screen flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div
          className={cn(
            "bg-surface-white dark:bg-surface-container w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300",
            isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
          )}
        >
          {/* Header */}
          <div className="p-6 border-b border-outline-variant dark:border-border-muted flex items-center justify-between">
            <h3 className="font-headline-md font-bold text-primary dark:text-on-dark">{t('modal.title')}</h3>
            <button
              className="text-outline hover:text-on-surface dark:hover:text-white p-2 rounded-full hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors"
              onClick={onClose}
              aria-label={t('drawer.close')}
              type="button"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form
            className="p-6 grid grid-cols-2 gap-6"
            onSubmit={handleSubmit}
          >
            {error && (
              <div className="col-span-2 p-3 rounded-lg bg-error/10 text-error text-label-sm">{error}</div>
            )}

            <div className="col-span-2 sm:col-span-1">
              <label className={labelClasses}>{t('modal.equipmentName')}</label>
              <input name="equipment_name" type="text" className={inputClasses} placeholder={t('modal.equipmentNamePlaceholder')} required />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className={labelClasses}>{t('modal.serialNumber')}</label>
              <input name="serial_number" type="text" className={inputClasses} placeholder={t('modal.serialNumberPlaceholder')} />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className={labelClasses}>{t('modal.initialStatus')}</label>
              <select name="status" className={inputClasses} defaultValue="available">
                <option value="available">{t('status.available')}</option>
                <option value="maintenance">{t('status.maintenance')}</option>
                <option value="damaged">{t('status.damaged')}</option>
                <option value="lost">{t('status.lost')}</option>
              </select>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className={labelClasses}>{t('modal.assignTo')}</label>
              <select name="user_id" className={inputClasses} defaultValue="">
                <option value="">{t('modal.assignToPlaceholder')}</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className={labelClasses}>{t('modal.notes')}</label>
              <textarea name="notes" className={inputClasses} rows={4} placeholder={t('modal.notesPlaceholder')} />
            </div>

            {/* Actions */}
            <div className="col-span-2 flex justify-end gap-3 mt-4 pt-6 border-t border-outline-variant dark:border-border-muted">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-outline-variant dark:border-border-muted text-on-surface dark:text-outline rounded-lg font-bold hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors"
              >
                {t('modal.cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-10 py-2 bg-primary text-on-primary rounded-lg font-bold hover:bg-primary-container dark:bg-primary-fixed dark:text-primary dark:hover:bg-primary dark:hover:text-white transition-colors shadow-md disabled:opacity-60"
              >
                {isSubmitting ? '...' : t('modal.save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
