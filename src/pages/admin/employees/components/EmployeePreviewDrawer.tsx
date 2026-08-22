import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { Employee } from '../types'

interface EmployeePreviewDrawerProps {
  employee: Employee | null
  isOpen: boolean
  onClose: () => void
}

export function EmployeePreviewDrawer({
  employee,
  isOpen,
  onClose,
}: EmployeePreviewDrawerProps) {
  const { t } = useTranslation('employees')

  if (!employee || !isOpen) return null

  const roleName =
    employee.roles && employee.roles.length > 0
      ? employee.roles[0]
      : '-'

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'مدير'

      case 'engineer':
        return 'مهندس'

      case 'accountant':
        return 'محاسب'

      case 'reader':
        return 'قارئ عدادات'

      default:
        return role
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
      dir="rtl"
    >
      {/* الخلفية */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* نافذة التفاصيل */}
      <div
        className="
          relative
          z-10
          flex
          w-full
          max-w-2xl
          max-h-[90vh]
          flex-col
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
        "
      >
        {/* Header */}
        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-gray-200
            bg-white
            px-6
            py-5
          "
        >
          <h2 className="text-xl font-bold text-gray-900">
            تفاصيل الموظف
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-gray-100
              text-gray-700
              transition
              hover:bg-gray-200
            "
          >
            <X size={22} />
          </button>
        </div>

        {/* المحتوى القابل للتمرير */}
        <div
          className="
            flex-1
            overflow-y-auto
            p-6
            outline-none
          "
          tabIndex={0}
        >
          {/* معلومات الموظف */}
          <div className="mb-8 flex flex-col items-center text-center">

            <div className="relative">

              <div
                className="
                  mb-4
                  flex
                  h-24
                  w-24
                  items-center
                  justify-center
                  rounded-full
                  border-4
                  border-primary/20
                  bg-primary/10
                  text-4xl
                  font-bold
                  text-primary
                "
              >
                {employee.name.charAt(0).toUpperCase()}
              </div>

              <span
                className={cn(
                  `
                    absolute
                    bottom-4
                    left-0
                    h-6
                    w-6
                    rounded-full
                    border-4
                    border-white
                  `,
                  employee.status === 'active'
                    ? 'bg-green-500'
                    : 'bg-gray-400',
                )}
              />

            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              {employee.name}
            </h2>

            <p className="mt-1 font-semibold text-primary">
              {getRoleName(roleName)}
            </p>

            <span
              className={cn(
                'mt-3 rounded-full px-4 py-1 text-sm font-bold',
                employee.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700',
              )}
            >
              {employee.status === 'active'
                ? 'نشط'
                : 'غير نشط'}
            </span>

          </div>

          {/* المعلومات الشخصية */}
          <section className="mb-6">

            <h3
              className="
                mb-4
                border-b
                border-gray-200
                pb-2
                text-lg
                font-bold
                text-gray-900
              "
            >
              المعلومات الشخصية
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              <div
                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  p-4
                  shadow-sm
                "
              >
                <p className="mb-1 text-sm text-gray-500">
                  الاسم
                </p>

                <p className="font-bold text-gray-900">
                  {employee.name}
                </p>
              </div>

              <div
                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  p-4
                  shadow-sm
                "
              >
                <p className="mb-1 text-sm text-gray-500">
                  البريد الإلكتروني
                </p>

                <p className="break-all font-bold text-gray-900">
                  {employee.email}
                </p>
              </div>

              <div
                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  p-4
                  shadow-sm
                "
              >
                <p className="mb-1 text-sm text-gray-500">
                  رقم الهاتف
                </p>

                <p
                  className="font-bold text-gray-900"
                  dir="ltr"
                >
                  {employee.phone || 'غير متوفر'}
                </p>
              </div>

              <div
                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  p-4
                  shadow-sm
                "
              >
                <p className="mb-1 text-sm text-gray-500">
                  الدور الوظيفي
                </p>

                <p className="font-bold text-gray-900">
                  {getRoleName(roleName)}
                </p>
              </div>

            </div>

          </section>

          {/* الصلاحيات */}
          {employee.permissions &&
            employee.permissions.length > 0 && (
              <section className="mb-6">

                <h3
                  className="
                    mb-4
                    border-b
                    border-gray-200
                    pb-2
                    text-lg
                    font-bold
                    text-gray-900
                  "
                >
                  الصلاحيات
                </h3>

                <div className="space-y-3">

                  {employee.permissions.map((perm) => (
                    <div
                      key={perm.id}
                      className="
                        flex
                        items-center
                        justify-between
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        p-4
                        shadow-sm
                      "
                    >

                      <span className="font-medium text-gray-800">
                        {t(`permissions.${perm.nameKey}`)}
                      </span>

                      <span
                        className={cn(
                          'rounded-full px-3 py-1 text-xs font-bold',
                          perm.active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700',
                        )}
                      >
                        {perm.active
                          ? 'مسموح'
                          : 'غير مسموح'}
                      </span>

                    </div>
                  ))}

                </div>

              </section>
            )}

        </div>

        {/* Footer */}
        <div
          className="
            shrink-0
            border-t
            border-gray-200
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
              transition
              hover:bg-gray-50
            "
          >
            إلغاء
          </button>
        </div>

      </div>
    </div>
  )
}