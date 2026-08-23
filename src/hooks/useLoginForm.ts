import { useState, useCallback, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { loginRequest } from '@/services/auth.service'
import type { ApiError } from '@/types/api'
import type { UserRole } from '@/types/common'

export interface LoginFormValues {
  email: string
  password: string
  rememberMe: boolean
}

export interface LoginFormErrors {
  email?: string
  password?: string
  general?: string
}

interface UseLoginFormReturn {
  values: LoginFormValues
  errors: LoginFormErrors
  isLoading: boolean
  showPassword: boolean
  handleChange: (field: keyof LoginFormValues, value: string | boolean) => void
  handleSubmit: (e: FormEvent) => Promise<void>
  toggleShowPassword: () => void
  clearError: (field: keyof LoginFormErrors) => void
}

export function useLoginForm(): UseLoginFormReturn {
  const { t } = useTranslation('auth')
  const { login } = useAuth()
  const navigate = useNavigate()

  const [values, setValues] = useState<LoginFormValues>({
    email: '',
    password: '',
    rememberMe: false,
  })

  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = useCallback(
    (field: keyof LoginFormValues, value: string | boolean) => {
      setValues((prev) => ({ ...prev, [field]: value }))
      if (errors[field as keyof LoginFormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    },
    [errors],
  )

  const clearError = useCallback((field: keyof LoginFormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }, [])

  const validate = useCallback((): boolean => {
    const newErrors: LoginFormErrors = {}

    if (!values.email.trim()) {
      newErrors.email = t('login.emailRequired', 'البريد الإلكتروني مطلوب')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      newErrors.email = t('login.emailInvalid', 'يرجى إدخال بريد إلكتروني صحيح')
    }

    if (!values.password) {
      newErrors.password = t('login.passwordRequired', 'كلمة المرور مطلوبة')
    } else if (values.password.length < 6) {
      newErrors.password = t('login.passwordMinLength', 'كلمة المرور يجب أن لا تقل عن 6 أحرف')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [values, t])

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()

      if (!validate()) return

      setIsLoading(true)
      setErrors({})

      try {
        const result = await loginRequest({
          email: values.email.trim(),
          password: values.password,
        })

        const userInfo = result.user_info || (result as any).user

        login(result.token, {
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          role: userInfo.role as UserRole,
          permissions: userInfo.permissions || [],
        })

        const userRole = (userInfo.role || '').toLowerCase()
        if (userRole === 'accountant') {
          navigate('/accountant/dashboard')
        } else if (userRole === 'engineer') {
          navigate('/engineer/dashboard')
        } else if (userRole === 'reader') {
          navigate('/reader/dashboard')
        } else {
          navigate('/admin/dashboard')
        }
      } catch (err: any) {
        const apiError = err as ApiError
        setErrors({
          general: apiError?.message || err?.response?.data?.message || t('login.loginFailed', 'فشل في تسجيل الدخول. يرجى التأكد من البيانات.'),
        })
      } finally {
        setIsLoading(false)
      }
    },
    [validate, values, login, navigate, t],
  )

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  return {
    values,
    errors,
    isLoading,
    showPassword,
    handleChange,
    handleSubmit,
    toggleShowPassword,
    clearError,
  }
}
