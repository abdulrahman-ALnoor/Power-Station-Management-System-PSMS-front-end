import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { showSuccess } from '@/utils/toast'

import {
  updateEmployee,
  type UpdateEmployeePayload,
} from '@/services/employees.service'

import type { Employee } from '../types'
import type { ApiError } from '@/types/api'

interface EditEmployeeModalProps {
  employee: Employee | null
  isOpen: boolean
  onClose: () => void
  onUpdated?: () => void
}

export function EditEmployeeModal({
  employee,
  isOpen,
  onClose,
  onUpdated,
}: EditEmployeeModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [role, setRole] = useState<
    'admin' | 'engineer' | 'accountant' | 'reader'
  >('admin')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!employee) return

    setName(employee.name)
    setEmail(employee.email)
    setPhone(employee.phone ?? '')
    setStatus(employee.status)
    setRole(
      (employee.roles?.[0] as
        | 'admin'
        | 'engineer'
        | 'accountant'
        | 'reader') ?? 'admin',
    )
  }, [employee])

  if (!isOpen || !employee) return null

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()

    setError(null)
    setIsSubmitting(true)

    try {
      const payload: UpdateEmployeePayload = {
        name,
        email,
        phone: phone || undefined,
        status,
        role,
      }

      await updateEmployee(employee.id, payload)

      showSuccess('تم تعديل بيانات الموظف بنجاح.')

      onUpdated?.()

      onClose()
    } catch (err) {
      const apiError = err as ApiError

      setError(
        apiError?.message ||
          'تعذر تعديل بيانات الموظف.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4">

      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-surface shadow-2xl dark:bg-surface-container-low">

        {/* Header */}
        <div className="flex items-center justify-between bg-primary p-6 text-on-primary">

          <h3 className="text-xl font-bold">
            تعديل بيانات الموظف
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="transition-colors hover:opacity-70"
          >
            <X size={24} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-8"
        >

          {error && (
            <div className="rounded-lg bg-error/10 p-3 text-error">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            <div>
              <label className="mb-1 block font-bold text-primary dark:text-on-dark">
                الاسم
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-border-muted bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary dark:bg-surface"
              />
            </div>

            <div>
              <label className="mb-1 block font-bold text-primary dark:text-on-dark">
                البريد الإلكتروني
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-border-muted bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary dark:bg-surface"
              />
            </div>

            <div>
              <label className="mb-1 block font-bold text-primary dark:text-on-dark">
                رقم الهاتف
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-border-muted bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary dark:bg-surface"
                dir="ltr"
              />
            </div>

            <div>
              <label className="mb-1 block font-bold text-primary dark:text-on-dark">
                الدور
              </label>

              <select
                value={role}
                onChange={(e) =>
                  setRole(
                    e.target.value as
                      | 'admin'
                      | 'engineer'
                      | 'accountant'
                      | 'reader',
                  )
                }
                className="w-full rounded-lg border border-border-muted bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary dark:bg-surface"
              >
                <option value="admin">مدير</option>
                <option value="engineer">مهندس</option>
                <option value="reader">قارئ عدادات</option>
                <option value="accountant">محاسب</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block font-bold text-primary dark:text-on-dark">
                الحالة
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as 'active' | 'inactive',
                  )
                }
                className="w-full rounded-lg border border-border-muted bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-primary dark:bg-surface"
              >
                <option value="active">
                  نشط
                </option>

                <option value="inactive">
                  غير نشط
                </option>
              </select>
            </div>

          </div>

          <div className="flex justify-end gap-3 border-t border-border pt-4">

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg px-6 py-2 font-bold text-on-surface-variant hover:bg-surface-container"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary px-8 py-2 font-bold text-on-primary transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {isSubmitting
                ? 'جاري الحفظ...'
                : 'حفظ التعديلات'}
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}