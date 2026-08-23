// ============================================================
// AdminHeader — Sticky top header bar (64px)
// Design: White surface | shadow | RTL-aware
// Based on Stitch Integrated Design System (Al-Barq Identity)
// ============================================================

import { useState } from 'react'
import { Menu, Globe, ChevronDown, Moon, Sun } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useLanguage } from '@/hooks/useLanguage'

import { useTheme } from '@/context/ThemeContext'
import type { Language } from '@/types/common'

interface AdminHeaderProps {
 /** Page title to display */
 title?: string
 /** Optional subtitle to display below title */
 subtitle?: string
 /** Called when mobile menu button is pressed */
 onMobileMenuToggle: () => void
}

export function AdminHeader({ title, subtitle, onMobileMenuToggle }: AdminHeaderProps) {
 const { t, isRTL, language, setLanguage } = useLanguage()
 const { theme, toggleTheme } = useTheme()
 const [showLangMenu, setShowLangMenu] = useState(false)

 const toggleLanguage = (lang: Language) => {
 setLanguage(lang)
 setShowLangMenu(false)
 }

 return (
 <header className="admin-header" role="banner">
 {/* ── Start: Mobile menu + Title ───────────────────── */}
 <div
 className={cn(
 'flex items-center gap-3 min-w-0',
 isRTL ? 'flex-row-reverse' : 'flex-row',
 )}
 >
 {/* Mobile hamburger */}
 <button
 className="lg:hidden p-2 rounded-lg hover:bg-surface-hover transition-colors"
 onClick={onMobileMenuToggle}
 aria-label="Open navigation menu"
 >
 <Menu size={20} style={{ color: 'var(--color-text-muted)' }} />
 </button>

 {/* Page title & subtitle */}
 {(title || subtitle) && (
 <div className="flex flex-col justify-center min-w-0">
 {title && (
 <h1
 className="text-headline truncate leading-tight"
 style={{ color: 'var(--color-text)' }}
 >
 {title}
 </h1>
 )}
 {subtitle && (
 <p
 className="text-xs truncate"
 style={{ color: 'var(--color-text-muted)' }}
 >
 {subtitle}
 </p>
 )}
 </div>
 )}
 </div>

 {/* ── End: Actions ─────────────────────────────────── */}
 <div
 className={cn(
 'flex items-center gap-2 ms-auto',
 isRTL ? 'flex-row-reverse' : 'flex-row',
 )}
 >


 {/* Theme toggle */}
 <button
 className="relative p-2 rounded-lg hover:bg-surface-hover transition-colors"
 onClick={toggleTheme}
 aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
 >
 {theme === 'dark' ? (
 <Sun size={20} style={{ color: 'var(--color-text-muted)' }} />
 ) : (
 <Moon size={20} style={{ color: 'var(--color-text-muted)' }} />
 )}
 </button>

 {/* Language switcher */}
 <div className="relative">
 <button
 className={cn(
 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors',
 'hover:bg-surface-hover',
 )}
 style={{ color: 'var(--color-text-muted)' }}
 onClick={() => setShowLangMenu((v) => !v)}
 aria-label={t('common:language.switchTo')}
 aria-expanded={showLangMenu}
 aria-haspopup="listbox"
 >
 <Globe size={16} />
 <span className="hidden sm:inline">
 {language === 'ar' ? 'ع' : 'EN'}
 </span>
 <ChevronDown size={14} />
 </button>

 {/* Language dropdown */}
 {showLangMenu && (
 <div
 className="absolute top-full mt-1 rounded-lg border py-1 z-50 min-w-32"
 style={{
 background: 'var(--color-surface)',
 borderColor: 'var(--color-border)',
 boxShadow: 'var(--shadow-dropdown)',
 insetInlineEnd: 0,
 }}
 role="listbox"
 aria-label="Select language"
 >
 {([['ar', 'العربية'], ['en', 'English']] as [Language, string][]).map(
 ([code, label]) => (
 <button
 key={code}
 role="option"
 aria-selected={language === code}
 onClick={() => toggleLanguage(code)}
 className={cn(
 'w-full px-3 py-2 text-sm text-start transition-colors hover:bg-surface-hover',
 language === code && 'font-semibold',
 )}
 style={{
 color:
 language === code
 ? 'var(--color-primary)'
 : 'var(--color-text)',
 }}
 >
 {label}
 </button>
 ),
 )}
 </div>
 )}
 </div>


 </div>
 </header>
 )
}
