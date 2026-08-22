import { toast } from 'sonner'

export const showSuccess = (item: string) => {
  toast.success(`تم إضافة ${item} بنجاح`, {
    duration: 2500,
    position: 'top-center',
  })
}
export const showUpdated = (item: string) => {
  toast.success(`تم تحديث ${item} بنجاح`)
}

export const showDeleted = (item: string) => {
  toast.success(`تم حذف ${item} بنجاح`)
}

export const showError = (message = 'حدث خطأ، يرجى المحاولة مرة أخرى') => {
  toast.error(message)
}