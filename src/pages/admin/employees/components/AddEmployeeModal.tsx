import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { showSuccess } from '@/utils/toast'
import { X } from 'lucide-react'

import {
  createEmployee,
  type CreateEmployeePayload,
} from '@/services/employees.service'

import type { ApiError } from '@/types/api'

interface AddEmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated?: () => void
}

export function AddEmployeeModal({
  isOpen,
  onClose,
  onCreated,
}: AddEmployeeModalProps) {
  const { t } = useTranslation('employees')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()

    setError(null)

    const formElement = e.currentTarget
    const form = new FormData(formElement)

    const role = String(form.get('role') || '')

    const roleNames: Record<string, string> = {
      admin: 'مدير',
      engineer: 'مهندس',
      reader: 'قارئ عدادات',
      accountant: 'محاسب',
    }

    const password = String(
      form.get('password') || '',
    )

    const passwordConfirmation = String(
      form.get('password_confirmation') || '',
    )

    /*
    |--------------------------------------------------------------------------
    | التحقق من تطابق كلمة المرور
    |--------------------------------------------------------------------------
    */

    if (password !== passwordConfirmation) {
      setError(
        t(
          'modal.passwordMismatch',
          'كلمتا المرور غير متطابقتين.',
        ),
      )

      return
    }

    /*
    |--------------------------------------------------------------------------
    | التحقق من طول كلمة المرور
    |--------------------------------------------------------------------------
    */

    if (password.length < 8) {
      setError(
        'كلمة المرور يجب ألا تقل عن 8 أحرف.',
      )

      return
    }

    /*
    |--------------------------------------------------------------------------
    | تجهيز البيانات
    |--------------------------------------------------------------------------
    */

    const payload: CreateEmployeePayload = {
      name: String(
        form.get('name') || '',
      ),

      email: String(
        form.get('email') || '',
      ),

      password,

      phone:
        String(form.get('phone') || '') ||
        undefined,

      status:
        (form.get('status') as CreateEmployeePayload['status']) ||
        'active',

      role:
        form.get(
          'role',
        ) as CreateEmployeePayload['role'],
    }

    setIsSubmitting(true)

    try {
      /*
      |--------------------------------------------------------------------------
      | إضافة الموظف
      |--------------------------------------------------------------------------
      */

      await createEmployee(payload)

      /*
      |--------------------------------------------------------------------------
      | إعادة تعيين النموذج
      |--------------------------------------------------------------------------
      */

      formElement.reset()

      /*
      |--------------------------------------------------------------------------
      | إغلاق النافذة وتحديث البيانات
      |--------------------------------------------------------------------------
      */

      onCreated?.()

      onClose()

      /*
      |--------------------------------------------------------------------------
      | رسالة النجاح
      |--------------------------------------------------------------------------
      */

      const roleName =
        roleNames[role] || 'الموظف'

      showSuccess(
        `تمت إضافة ${roleName} بنجاح.`,
        'تمت الإضافة بنجاح',
      )
    } catch (err) {
      const apiError = err as ApiError

      setError(
        apiError?.message ||
          'تعذر إضافة الموظف. يرجى المحاولة مرة أخرى.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/60 p-4">
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-surface shadow-2xl animate-in fade-in zoom-in duration-200 dark:bg-surface-container-low"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* رأس النافذة */}
        <div className="flex items-center justify-between bg-primary p-6 text-on-primary">
          <h3
            id="modal-title"
            className="font-headline-md text-headline-md font-bold"
          >
            {t('modal.addTitle')}
          </h3>

          <button
            type="button"
            className="text-on-primary/70 transition-colors hover:text-on-primary"
            onClick={onClose}
            aria-label={t('common.close')}
          >
            <X size={24} />
          </button>
        </div>

        <form
          className="space-y-6 p-8"
          onSubmit={handleSubmit}
        >
          {/* رسالة الخطأ */}
          {error && (
            <div className="rounded-lg bg-error/10 p-3 text-label-sm text-error">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* الاسم */}
            <div className="space-y-1">
              <label className="px-1 font-label-sm text-label-sm font-bold text-primary dark:text-on-dark">
                {t('modal.fullName')}

                <span className="text-error">
                  {' '}*
                </span>
              </label>

              <input
                name="name"
                type="text"
                required
                className="w-full rounded-lg border border-border-muted bg-background px-4 py-2 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary dark:border-border dark:bg-surface dark:text-on-dark"
              />
            </div>

            {/* البريد الإلكتروني */}
            <div className="space-y-1">
              <label className="px-1 font-label-sm text-label-sm font-bold text-primary dark:text-on-dark">
                {t('modal.email')}

                <span className="text-error">
                  {' '}*
                </span>
              </label>

              <input
                name="email"
                type="email"
                required
                className="w-full rounded-lg border border-border-muted bg-background px-4 py-2 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary dark:border-border dark:bg-surface dark:text-on-dark"
              />
            </div>

            {/* رقم الهاتف */}
            <div className="space-y-1 md:col-span-2">
              <label className="px-1 font-label-sm text-label-sm font-bold text-primary dark:text-on-dark">
                {t('modal.phone')}
              </label>

              <input
                name="phone"
                type="tel"
                maxLength={30}
                dir="ltr"
                className="w-full rounded-lg border border-border-muted bg-background px-4 py-2 text-start outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary dark:border-border dark:bg-surface dark:text-on-dark"
              />
            </div>

            {/* كلمة المرور */}
            <div className="space-y-1">
              <label className="px-1 font-label-sm text-label-sm font-bold text-primary dark:text-on-dark">
                {t('modal.password')}

                <span className="text-error">
                  {' '}*
                </span>
              </label>

              <input
                name="password"
                type="password"
                minLength={8}
                dir="ltr"
                required
                className="w-full rounded-lg border border-border-muted bg-background px-4 py-2 text-start outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary dark:border-border dark:bg-surface dark:text-on-dark"
              />
            </div>

            {/* تأكيد كلمة المرور */}
            <div className="space-y-1">
              <label className="px-1 font-label-sm text-label-sm font-bold text-primary dark:text-on-dark">
                {t('modal.passwordConfirmation')}

                <span className="text-error">
                  {' '}*
                </span>
              </label>

              <input
                name="password_confirmation"
                type="password"
                minLength={8}
                dir="ltr"
                required
                className="w-full rounded-lg border border-border-muted bg-background px-4 py-2 text-start outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary dark:border-border dark:bg-surface dark:text-on-dark"
              />
            </div>

            {/* الدور الوظيفي */}
            <div className="space-y-1">
              <label className="px-1 font-label-sm text-label-sm font-bold text-primary dark:text-on-dark">
                {t('modal.role')}

                <span className="text-error">
                  {' '}*
                </span>
              </label>

              <select
                name="role"
                required
                defaultValue="admin"
                className="w-full cursor-pointer rounded-lg border border-border-muted bg-background px-4 py-2 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary dark:border-border dark:bg-surface dark:text-on-dark"
              >
                <option value="admin">
                  {t('toolbar.roles.manager')}
                </option>

                <option value="engineer">
                  {t('toolbar.roles.engineer')}
                </option>

                <option value="reader">
                  {t('toolbar.roles.reader')}
                </option>

                <option value="accountant">
                  {t('toolbar.roles.accountant')}
                </option>
              </select>
            </div>

            {/* الحالة */}
            <div className="space-y-1">
              <label className="px-1 font-label-sm text-label-sm font-bold text-primary dark:text-on-dark">
                {t('modal.status')}

                <span className="text-error">
                  {' '}*
                </span>
              </label>

              <select
                name="status"
                required
                defaultValue="active"
                className="w-full cursor-pointer rounded-lg border border-border-muted bg-background px-4 py-2 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary dark:border-border dark:bg-surface dark:text-on-dark"
              >
                <option value="active">
                  {t('status.active')}
                </option>

                <option value="inactive">
                  {t('status.inactive')}
                </option>
              </select>
            </div>

          </div>

          {/* الأزرار */}
          <div className="flex justify-end gap-3 border-t border-border pt-4 dark:border-border-muted">

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg px-6 py-2 font-bold text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-50 dark:text-outline dark:hover:bg-surface-high"
            >
              {t('modal.cancel')}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary px-8 py-2 font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:opacity-60 dark:bg-primary-fixed dark:text-primary dark:shadow-none"
            >
              {isSubmitting
                ? 'جارٍ الإضافة...'
                : t('modal.save')}
            </button>

          </div>
        </form>
      </div>
    </div>
  )
}