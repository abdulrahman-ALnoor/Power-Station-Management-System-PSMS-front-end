// ============================================================
// App.tsx — Root application component
// Provides: i18n, Language context, Auth context, Router
// ============================================================

import { BrowserRouter } from 'react-router-dom'
import { Suspense } from 'react'
import { LanguageProvider } from '@/context/LanguageContext'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { AppRouter } from '@/routes'
import '@/i18n' // Initialize i18n

function AppFallback() {
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ background: 'var(--color-background)' }}
    >
      <div
        className="w-10 h-10 border-4 rounded-full animate-spin"
        style={{
          borderColor: 'var(--color-border)',
          borderTopColor: 'var(--color-primary)',
        }}
        aria-label="Loading application"
      />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <Suspense fallback={<AppFallback />}>
              <AppRouter />
            </Suspense>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}
