import {
  CheckCircle2,
  XCircle,
  TriangleAlert,
  Info,
  X,
} from 'lucide-react'

import {
  createRoot,
  type Root,
} from 'react-dom/client'

type DialogType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'

interface DialogOptions {
  type: DialogType
  title: string
  message: string
}

let root: Root | null = null

let container: HTMLDivElement | null = null


function getDialogContent(
  type: DialogType,
) {
  switch (type) {
    case 'success':
      return {
        icon: (
          <CheckCircle2
            size={52}
            className="text-green-500"
          />
        ),
        iconBg: 'bg-green-50',
      }

    case 'error':
      return {
        icon: (
          <XCircle
            size={52}
            className="text-red-500"
          />
        ),
        iconBg: 'bg-red-50',
      }

    case 'warning':
      return {
        icon: (
          <TriangleAlert
            size={52}
            className="text-amber-500"
          />
        ),
        iconBg: 'bg-amber-50',
      }

    case 'info':
      return {
        icon: (
          <Info
            size={52}
            className="text-blue-500"
          />
        ),
        iconBg: 'bg-blue-50',
      }
  }
}


function destroyDialog() {
  if (root) {
    root.unmount()
    root = null
  }

  if (container) {
    container.remove()
    container = null
  }
}


function Dialog({
  type,
  title,
  message,
}: DialogOptions) {
  const content = getDialogContent(type)

  const handleClose = () => {
    destroyDialog()
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[99999]
        flex
        items-center
        justify-center
        p-4
      "
      dir="rtl"
    >
      {/* الخلفية المظللة */}
      <div
        className="
          absolute
          inset-0
          bg-black/50
          backdrop-blur-sm
        "
        onClick={handleClose}
      />

      {/* مربع الرسالة */}
      <div
        className="
          relative
          z-10
          w-[90vw]
          max-w-[500px]
          min-w-[320px]
          rounded-2xl
          bg-white
          px-8
          py-7
          text-center
          shadow-2xl
        "
      >
        {/* زر الإغلاق */}
        <button
          type="button"
          onClick={handleClose}
          className="
            absolute
            left-4
            top-4
            rounded-full
            p-2
            text-gray-400
            transition-colors
            hover:bg-gray-100
            hover:text-gray-700
          "
          aria-label="إغلاق"
        >
          <X size={20} />
        </button>

        {/* الأيقونة */}
        <div
          className={`
            mx-auto
            mb-5
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-full
            ${content.iconBg}
          `}
        >
          {content.icon}
        </div>

        {/* العنوان */}
        <h2
          className="
            mb-3
            text-2xl
            font-bold
            text-gray-900
          "
        >
          {title}
        </h2>

        {/* الرسالة */}
        <p
          className="
            mb-7
            text-base
            leading-7
            text-gray-500
          "
        >
          {message}
        </p>

        {/* زر حسناً */}
        <button
          type="button"
          onClick={handleClose}
          className="
            w-full
            rounded-xl
            bg-primary
            py-3
            font-bold
            text-white
            shadow-sm
            transition-all
            hover:bg-primary/90
            active:scale-[0.98]
          "
        >
          حسنًا
        </button>
      </div>
    </div>
  )
}


function showDialog(
  options: DialogOptions,
) {
  destroyDialog()

  container =
    document.createElement('div')

  document.body.appendChild(
    container,
  )

  root = createRoot(container)

  root.render(
    <Dialog {...options} />,
  )
}


/* ===============================
   رسائل المشروع العامة
================================ */

export function showSuccess(
  message: string,
  title = 'تمت العملية بنجاح',
) {
  showDialog({
    type: 'success',
    title,
    message,
  })
}


export function showError(
  message: string,
  title = 'حدث خطأ',
) {
  showDialog({
    type: 'error',
    title,
    message,
  })
}


export function showWarning(
  message: string,
  title = 'تنبيه',
) {
  showDialog({
    type: 'warning',
    title,
    message,
  })
}


export function showInfo(
  message: string,
  title = 'معلومات',
) {
  showDialog({
    type: 'info',
    title,
    message,
  })
}


export function showConfirm(
  message: string,
  onConfirm: () => void | Promise<void>,
  title = 'تأكيد الحذف',
  confirmText = 'حذف',
  confirmButtonClass = 'bg-red-600 hover:bg-red-700',
) {
  destroyDialog()

  container = document.createElement('div')

  document.body.appendChild(container)

  root = createRoot(container)

  const ConfirmDialog = () => {
    const handleCancel = () => {
      destroyDialog()
    }

    const handleConfirm = async () => {
      // أغلق نافذة التأكيد أولاً
      destroyDialog()

      // نفذ العملية
      await onConfirm()
    }

    return (
      <div
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
        dir="rtl"
      >
        {/* الخلفية */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleCancel}
        />

        {/* مربع التأكيد */}
        <div className="relative z-10 w-[90vw] max-w-[500px] min-w-[320px] rounded-2xl bg-white px-8 py-7 text-center shadow-2xl">

          {/* زر الإغلاق */}
          <button
            type="button"
            onClick={handleCancel}
            className="absolute left-4 top-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="إغلاق"
          >
            <X size={20} />
          </button>

          {/* أيقونة التحذير */}
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
            <TriangleAlert
              size={52}
              className="text-amber-500"
            />
          </div>

          {/* العنوان */}
          <h2 className="mb-3 text-2xl font-bold text-gray-900">
            {title}
          </h2>

          {/* الرسالة */}
          <p className="mb-7 text-base leading-7 text-gray-500">
            {message}
          </p>

          {/* الأزرار */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 rounded-xl border border-gray-300 bg-white py-3 font-bold text-gray-700 transition-colors hover:bg-gray-50"
            >
              إلغاء
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className={`flex-1 rounded-xl py-3 font-bold text-white transition-colors active:scale-[0.98] ${confirmButtonClass}`}
            >
              {confirmText}
            </button>
          </div>

        </div>
      </div>
    )
  }

  root.render(<ConfirmDialog />)
}

