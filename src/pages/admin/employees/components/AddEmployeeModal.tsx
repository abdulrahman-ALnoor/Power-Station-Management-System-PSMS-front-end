import { useState, type FormEvent } from 'react'

import { useTranslation } from 'react-i18next'
import { showSuccess } from '@/utils/toast'
import { X } from 'lucide-react'
import { createEmployee, type CreateEmployeePayload } from '@/services/employees.service'
import type { ApiError } from '@/types/api'

interface AddEmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated?: () => void
}

export function AddEmployeeModal({ isOpen, onClose, onCreated }: AddEmployeeModalProps) {
  const { t } = useTranslation('employees')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formElement: HTMLFormElement = e.currentTarget
      const form =new FormData(formElement)
      const role = String(form.get('role') || '')
      const roleNames:Record<string, string> = {
        admin: 'مدير',
        engineer: 'مهندس',
        reader: 'قارئ',
        accountant: 'محاسب'
      }
  
  
    const password = String(form.get('password') || '')
    const passwordConfirmation = String(form.get('password_confirmation') || '')

    if (password !== passwordConfirmation) {
      setError(t('modal.passwordMismatch', 'كلمتا المرور غير متطابقتين.'))
      return
    }
    if (password.length < 8) {
      setError('كلمة المرور يجب ألا تقل عن 8 أحرف.')
      return
    }

    const payload: CreateEmployeePayload = {
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      password,
      phone: String(form.get('phone') || '') || undefined,
      status: (form.get('status') as CreateEmployeePayload['status']) || 'active',
      role: form.get('role') as CreateEmployeePayload['role'],
    }

    setIsSubmitting(true)
    try {
      await createEmployee(payload)
      formElement.reset()
      
      showSuccess(roleNames[role] || 'الموظف')  
      //window.alert('✅ تم حفظ الموظف بنجاح')
      onCreated?.()
      onClose()
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError?.message || 'تعذر إنشاء الموظف.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="bg-surface w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 dark:bg-surface-container-low"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="bg-primary p-6 text-on-primary flex justify-between items-center">
          <h3 id="modal-title" className="font-headline-md text-headline-md font-bold">
            {t('modal.addTitle')}
          </h3>
          <button
            className="text-on-primary/70 hover:text-on-primary transition-colors"
            onClick={onClose}
            aria-label={t('common.close')}
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        <form className="p-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 rounded-lg bg-error/10 text-error text-label-sm">{error}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="space-y-1">
              <label className="font-label-sm text-label-sm font-bold text-primary dark:text-on-dark px-1">
                {t('modal.fullName')} <span className="text-error">*</span>
              </label>
              <input
                name="name"
                type="text"
                className="w-full border border-border-muted rounded-lg px-4 py-2 bg-background focus:ring-2 focus:ring-primary focus:border-primary dark:bg-surface dark:border-border dark:text-on-dark outline-none transition-colors"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-label-sm text-label-sm font-bold text-primary dark:text-on-dark px-1">
                {t('modal.email')} <span className="text-error">*</span>
              </label>
              <input
                name="email"
                type="email"
                className="w-full border border-border-muted rounded-lg px-4 py-2 bg-background focus:ring-2 focus:ring-primary focus:border-primary dark:bg-surface dark:border-border dark:text-on-dark outline-none transition-colors"
                required
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="font-label-sm text-label-sm font-bold text-primary dark:text-on-dark px-1">
                {t('modal.phone')}
              </label>
              <input
                name="phone"
                type="tel"
                maxLength={30}
                className="w-full border border-border-muted rounded-lg px-4 py-2 bg-background focus:ring-2 focus:ring-primary focus:border-primary dark:bg-surface dark:border-border dark:text-on-dark outline-none transition-colors text-start"
                dir="ltr"
              />
            </div>

            <div className="space-y-1">
              <label className="font-label-sm text-label-sm font-bold text-primary dark:text-on-dark px-1">
                {t('modal.password')} <span className="text-error">*</span>
              </label>
              <input
                name="password"
                type="password"
                minLength={8}
                className="w-full border border-border-muted rounded-lg px-4 py-2 bg-background focus:ring-2 focus:ring-primary focus:border-primary dark:bg-surface dark:border-border dark:text-on-dark outline-none transition-colors text-start"
                dir="ltr"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-label-sm text-label-sm font-bold text-primary dark:text-on-dark px-1">
                {t('modal.passwordConfirmation')} <span className="text-error">*</span>
              </label>
              <input
                name="password_confirmation"
                type="password"
                minLength={8}
                className="w-full border border-border-muted rounded-lg px-4 py-2 bg-background focus:ring-2 focus:ring-primary focus:border-primary dark:bg-surface dark:border-border dark:text-on-dark outline-none transition-colors text-start"
                dir="ltr"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-label-sm text-label-sm font-bold text-primary dark:text-on-dark px-1">
                {t('modal.role')} <span className="text-error">*</span>
              </label>
              <select name="role" required defaultValue="admin" className="w-full border border-border-muted rounded-lg px-4 py-2 bg-background focus:ring-2 focus:ring-primary focus:border-primary dark:bg-surface dark:border-border dark:text-on-dark outline-none transition-colors cursor-pointer">
                <option value="admin">{t('toolbar.roles.manager')}</option>
                <option value="engineer">{t('toolbar.roles.engineer')}</option>
                <option value="reader">{t('toolbar.roles.reader')}</option>
                <option value="accountant">{t('toolbar.roles.accountant')}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-label-sm text-label-sm font-bold text-primary dark:text-on-dark px-1">
                {t('modal.status')} <span className="text-error">*</span>
              </label>
              <select name="status" required defaultValue="active" className="w-full border border-border-muted rounded-lg px-4 py-2 bg-background focus:ring-2 focus:ring-primary focus:border-primary dark:bg-surface dark:border-border dark:text-on-dark outline-none transition-colors cursor-pointer">
                <option value="active">{t('status.active')}</option>
                <option value="inactive">{t('status.inactive')}</option>
              </select>
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border dark:border-border-muted">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-on-surface-variant font-bold hover:bg-surface-container transition-colors dark:text-outline dark:hover:bg-surface-high"
            >
              {t('modal.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2 rounded-lg bg-primary text-on-primary font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 dark:bg-primary-fixed dark:text-primary dark:shadow-none disabled:opacity-60"
            >
              {isSubmitting ? '...' : t('modal.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
