// ============================================================
// LoginForm — The login form card (60% panel)
// Matches the Stitch "Login Area" exactly
// ============================================================

import { useId, type FormEvent } from 'react'
import { User, Lock, Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'
import type { LoginFormValues, LoginFormErrors } from '@/hooks/useLoginForm'

// Al-Barq logo from Stitch design
const ALBARQ_LOGO =
 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-iuv__1A5HSnrlzChp-IHLKLzCAYPD01Py9MbSOGlKeaysnwOYWFuEZ921HsuhH-kZRvZaTBSiDgWXxC_xgHDsBzilwXAN4be03cy-wwJZ5PidbexAf8C679d4_94Jpo7SWpo7sCR2NIgn3rQHfbALyo1IIwublPdnRy7q4Zg4Sx6suim-gN6qeAdR0FnQkBxfDj4FpzNfCCPeg2ddV5C_YGMBJmgv1hi6W3eOT7Ab70PLOoZLH8JWERCGTiEqeFy0SvlPHwrnQ'

interface LoginFormProps {
 values: LoginFormValues
 errors: LoginFormErrors
 isLoading: boolean
 showPassword: boolean
 isRTL: boolean
 onFieldChange: (field: keyof LoginFormValues, value: string | boolean) => void
 onSubmit: (e: FormEvent) => Promise<void>
 onTogglePassword: () => void
}

export function LoginForm({
 values,
 errors,
 isLoading,
 showPassword,
 isRTL,
 onFieldChange,
 onSubmit,
 onTogglePassword,
}: LoginFormProps) {
 const { t } = useTranslation('auth')
 const usernameId = useId()
 const passwordId = useId()
 const rememberMeId = useId()

 return (
 <div className="w-full max-w-[480px]">
 {/* ── White Card ──────────────────────────────────────── */}
 <div
 className="w-full bg-surface rounded-xl border transition-shadow duration-300"
 style={{
 padding: '2.5rem',
 boxShadow: '0px 4px 24px rgba(0,0,0,0.06)',
 borderColor: 'rgba(224,227,229,0.5)',
 }}
 onMouseEnter={(e) => {
 e.currentTarget.style.boxShadow = '0px 8px 32px rgba(0,0,0,0.08)'
 }}
 onMouseLeave={(e) => {
 e.currentTarget.style.boxShadow = '0px 4px 24px rgba(0,0,0,0.06)'
 }}
 >
 {/* ── Logo + Heading ─────────────────────────────────── */}
 <div className="flex flex-col items-center mb-10">
 <img
 src={ALBARQ_LOGO}
 alt={t('login.logoAlt')}
 className="mb-6"
 style={{ height: '6rem', objectFit: 'contain' }}
 onError={(e) => {
 // Fallback if logo fails to load
 e.currentTarget.style.display = 'none'
 }}
 />

 <h1
 className="font-extrabold mb-2 text-center"
 style={{
 fontFamily: 'Cairo, sans-serif',
 fontSize: '1.75rem',
 color: 'var(--color-primary)',
 lineHeight: 1.2,
 }}
 >
 {t('login.heading')}
 </h1>

 <p
 className="text-center leading-relaxed"
 style={{
 fontFamily: 'Cairo, sans-serif',
 fontSize: '0.9rem',
 color: 'var(--color-text-muted)',
 }}
 >
 {t('login.subtitle')}
 </p>
 </div>

 {/* ── Login Form ──────────────────────────────────────── */}
 <form onSubmit={onSubmit} noValidate className="space-y-6">

 {/* General error */}
 {errors.general && (
 <div
 className="px-4 py-3 rounded-lg text-sm font-medium text-center"
 style={{
 background: 'var(--color-danger-light)',
 color: 'var(--color-danger)',
 border: '1px solid rgba(186,26,26,0.15)',
 fontFamily: 'Cairo, sans-serif',
 }}
 role="alert"
 >
 {errors.general}
 </div>
 )}

 {/* ── Username field ─────────────────────────────── */}
 <div className="space-y-2">
 <label
 htmlFor={usernameId}
 className="block font-medium"
 style={{
 fontFamily: 'Cairo, sans-serif',
 fontSize: '0.875rem',
 color: 'var(--color-text-muted)',
 paddingInlineEnd: '0.25rem',
 }}
 >
 {t('login.usernameLabel')}
 </label>

 <div className="relative group">
 {/* Icon — inline-end (right in RTL, right in design) */}
 <div
 className="absolute inset-y-0 flex items-center pointer-events-none transition-colors"
 style={{
 insetInlineEnd: 0,
 paddingInlineEnd: '1rem',
 color: errors.username
 ? 'var(--color-danger)'
 : 'var(--color-text-muted)',
 }}
 aria-hidden="true"
 >
 <User size={20} />
 </div>

 <input
 id={usernameId}
 type="text"
 name="username"
 autoComplete="username"
 required
 value={values.username}
 onChange={(e) => onFieldChange('username', e.target.value)}
 placeholder={t('login.usernamePlaceholder')}
 aria-invalid={!!errors.username}
 aria-describedby={errors.username ? `${usernameId}-error` : undefined}
 className={cn(
 'block w-full rounded-lg transition-all duration-200',
 'focus:outline-none font-body',
 isRTL
 ? 'text-right'
 : 'text-left',
 )}
 style={{
 fontFamily: 'Cairo, sans-serif',
 fontSize: '0.9375rem',
 paddingTop: '0.875rem',
 paddingBottom: '0.875rem',
 paddingInlineStart: '1rem',
 paddingInlineEnd: '3rem',
 background: 'var(--color-surface-low)',
 border: 'none',
 boxShadow: errors.username
 ? 'inset 0 0 0 2px var(--color-danger)'
 : 'inset 0 0 0 1px var(--color-border)',
 color: 'var(--color-text)',
 }}
 onFocus={(e) => {
 if (!errors.username) {
 e.currentTarget.style.boxShadow = 'inset 0 0 0 2px var(--color-steel-blue)'
 }
 }}
 onBlur={(e) => {
 if (!errors.username) {
 e.currentTarget.style.boxShadow = 'inset 0 0 0 1px var(--color-border)'
 }
 }}
 />
 </div>

 {errors.username && (
 <p
 id={`${usernameId}-error`}
 className="text-sm font-medium"
 style={{ color: 'var(--color-danger)', fontFamily: 'Cairo, sans-serif' }}
 role="alert"
 >
 {errors.username}
 </p>
 )}
 </div>

 {/* ── Password field ─────────────────────────────── */}
 <div className="space-y-2">
 <label
 htmlFor={passwordId}
 className="block font-medium"
 style={{
 fontFamily: 'Cairo, sans-serif',
 fontSize: '0.875rem',
 color: 'var(--color-text-muted)',
 paddingInlineEnd: '0.25rem',
 }}
 >
 {t('login.passwordLabel')}
 </label>

 <div className="relative group">
 {/* Lock icon — inline-end */}
 <div
 className="absolute inset-y-0 flex items-center pointer-events-none transition-colors"
 style={{
 insetInlineEnd: 0,
 paddingInlineEnd: '1rem',
 color: errors.password
 ? 'var(--color-danger)'
 : 'var(--color-text-muted)',
 }}
 aria-hidden="true"
 >
 <Lock size={20} />
 </div>

 {/* Visibility toggle — inline-start */}
 <button
 type="button"
 onClick={onTogglePassword}
 className="absolute inset-y-0 flex items-center transition-colors"
 style={{
 insetInlineStart: 0,
 paddingInlineStart: '1rem',
 color: 'var(--color-text-muted)',
 }}
 aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
 aria-pressed={showPassword}
 >
 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
 </button>

 <input
 id={passwordId}
 type={showPassword ? 'text' : 'password'}
 name="password"
 autoComplete="current-password"
 required
 value={values.password}
 onChange={(e) => onFieldChange('password', e.target.value)}
 placeholder={t('login.passwordPlaceholder')}
 aria-invalid={!!errors.password}
 aria-describedby={errors.password ? `${passwordId}-error` : undefined}
 className={cn(
 'block w-full rounded-lg transition-all duration-200',
 'focus:outline-none',
 isRTL ? 'text-right' : 'text-left',
 )}
 style={{
 fontFamily: 'Cairo, sans-serif',
 fontSize: '0.9375rem',
 paddingTop: '0.875rem',
 paddingBottom: '0.875rem',
 paddingInlineStart: '3rem',
 paddingInlineEnd: '3rem',
 background: 'var(--color-surface-low)',
 border: 'none',
 boxShadow: errors.password
 ? 'inset 0 0 0 2px var(--color-danger)'
 : 'inset 0 0 0 1px var(--color-border)',
 color: 'var(--color-text)',
 }}
 onFocus={(e) => {
 if (!errors.password) {
 e.currentTarget.style.boxShadow = 'inset 0 0 0 2px var(--color-steel-blue)'
 }
 }}
 onBlur={(e) => {
 if (!errors.password) {
 e.currentTarget.style.boxShadow = 'inset 0 0 0 1px var(--color-border)'
 }
 }}
 />
 </div>

 {errors.password && (
 <p
 id={`${passwordId}-error`}
 className="text-sm font-medium"
 style={{ color: 'var(--color-danger)', fontFamily: 'Cairo, sans-serif' }}
 role="alert"
 >
 {errors.password}
 </p>
 )}
 </div>

 {/* ── Remember me + Forgot password ──────────────── */}
 <div
 className="flex items-center justify-between"
 style={{ direction: isRTL ? 'rtl' : 'ltr' }}
 >
 {/* Remember me */}
 <div className="flex items-center gap-2">
 <input
 id={rememberMeId}
 type="checkbox"
 name="remember-me"
 checked={values.rememberMe}
 onChange={(e) => onFieldChange('rememberMe', e.target.checked)}
 className="rounded transition-colors cursor-pointer"
 style={{
 width: '1.1rem',
 height: '1.1rem',
 accentColor: 'var(--color-primary)',
 }}
 />
 <label
 htmlFor={rememberMeId}
 className="cursor-pointer select-none"
 style={{
 fontFamily: 'Cairo, sans-serif',
 fontSize: '0.9rem',
 color: 'var(--color-text)',
 }}
 >
 {t('login.rememberMe')}
 </label>
 </div>

 {/* Forgot password */}
 <Link
 to="/admin/forgot-password"
 className="font-bold transition-colors hover:underline"
 style={{
 fontFamily: 'Cairo, sans-serif',
 fontSize: '0.875rem',
 color: 'var(--color-steel-blue)',
 }}
 >
 {t('login.forgotPassword')}
 </Link>
 </div>

 {/* ── Submit Button ─────────────────────────────── */}
 <button
 type="submit"
 disabled={isLoading}
 className={cn(
 'relative overflow-hidden w-full text-white rounded-lg font-bold',
 'transition-all duration-200 active:scale-[0.98]',
 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
 isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-90',
 )}
 style={{
 background: '#1D4E89',
 padding: '1rem 1.5rem',
 fontFamily: 'Cairo, sans-serif',
 fontSize: '1rem',
 boxShadow: '0 4px 12px rgba(29,78,137,0.3)',
 // focusRingColor: 'var(--color-steel-blue)',
 }}
 aria-busy={isLoading}
 >
 {/* Shimmer hover effect from Stitch */}
 <div
 className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
 style={{
 background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
 backgroundSize: '200% 100%',
 animation: 'shimmer 3s infinite',
 }}
 aria-hidden="true"
 />

 <span className="relative z-10 flex items-center justify-center gap-2">
 {isLoading && (
 <span
 className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
 aria-hidden="true"
 />
 )}
 {t('login.submitButton')}
 </span>
 </button>
 </form>
 </div>
 </div>
 )
}
