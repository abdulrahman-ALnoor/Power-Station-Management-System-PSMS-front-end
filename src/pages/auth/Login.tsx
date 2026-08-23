// ============================================================
// Login Page — Main authentication screen
// Combines LoginForm (60%) and LoginBrandingPanel (40%)
// ============================================================

import { useEffect } from 'react'
import { LoginForm } from './components/LoginForm'
import { useLoginForm } from '@/hooks/useLoginForm'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'
import { useTranslation } from 'react-i18next'

export default function Login() {
 const { t } = useTranslation('auth')
 const { isRTL } = useLanguage()

 const {
 values,
 errors,
 isLoading,
 showPassword,
 handleChange,
 handleSubmit,
 toggleShowPassword,
 } = useLoginForm()

 // Update page title
 useEffect(() => {
 document.title = t('login.pageTitle')
 }, [t])

 return (
 <div
 className={cn(
 'flex min-h-screen items-center justify-center p-4 sm:p-8',
 'bg-[var(--color-surface-bright,#f8f9fb)]'
 )}
 dir={isRTL ? 'rtl' : 'ltr'}
 >
 <main className="w-full max-w-[480px] flex flex-col items-center">
 <LoginForm
 values={values}
 errors={errors}
 isLoading={isLoading}
 showPassword={showPassword}
 isRTL={isRTL}
 onFieldChange={handleChange}
 onSubmit={handleSubmit}
 onTogglePassword={toggleShowPassword}
 />

 {/* Footer */}
 <footer
 className="mt-8 text-center text-sm opacity-60"
 style={{
 fontFamily: 'Cairo, sans-serif',
 color: 'var(--color-text-muted)'
 }}
 >
 <p>{t('login.footerText')}</p>
 </footer>
 </main>
 </div>
 )
}
