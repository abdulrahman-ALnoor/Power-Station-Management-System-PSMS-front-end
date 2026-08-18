// ============================================================
// useLoginForm — Login form state, validation, and submission
// Separates form logic from the visual Login component
// ============================================================

import { useState, useCallback, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { loginRequest } from '@/services/auth.service'
import type { ApiError } from '@/types/api'
import type { UserRole } from '@/types/common'

export interface LoginFormValues {
  username: string
  password: string
  rememberMe: boolean
}

export interface LoginFormErrors {
  username?: string
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
    username: '',
    password: '',
    rememberMe: false,
  })

  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = useCallback(
    (field: keyof LoginFormValues, value: string | boolean) => {
      setValues((prev) => ({ ...prev, [field]: value }))
      // Clear field error on change
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

    if (!values.username.trim()) {
      newErrors.username = t('login.usernameRequired')
    }

    if (!values.password) {
      newErrors.password = t('login.passwordRequired')
    } else if (values.password.length < 6) {
      newErrors.password = t('login.passwordMinLength')
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
        // ── Backend integration ─────────────────────────────
        // The username field is used as the email — the login form only
        // has one identity field, and the backend's /login expects email.
        const result = await loginRequest({
          email: values.username,
          password: values.password,
        })

        login(result.token, {
          id: result.user_info.id,
          name: result.user_info.name,
          email: result.user_info.email,
          role: result.user_info.role as UserRole,
          permissions: result.user_info.permissions,
        })

        navigate('/admin/dashboard')
      } catch (err) {
        const apiError = err as ApiError
        setErrors({
          general: apiError.message || t('login.loginFailed'),
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