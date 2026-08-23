// ============================================================
// LanguageContext — Language + Direction global state
// ============================================================

import {
 createContext,
 useContext,
 useEffect,
 useState,
 type ReactNode,
} from 'react'
import i18n from '@/i18n'
import { STORAGE_KEYS } from '@/config/constants'
import type { Language, Direction } from '@/types/common'
import { LANGUAGE_DIRECTION } from '@/types/common'

interface LanguageContextValue {
 language: Language
 direction: Direction
 setLanguage: (lang: Language) => void
 toggleLanguage: () => void
 isRTL: boolean
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

interface LanguageProviderProps {
 children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
 const [language, setLanguageState] = useState<Language>(() => {
 const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE)
 return (saved === 'ar' || saved === 'en') ? saved : 'ar'
 })

 const direction: Direction = LANGUAGE_DIRECTION[language]
 const isRTL = direction === 'rtl'

 // Sync direction to <html> element + i18n
 useEffect(() => {
 const html = document.documentElement
 html.setAttribute('dir', direction)
 html.setAttribute('lang', language)
 i18n.changeLanguage(language)
 localStorage.setItem(STORAGE_KEYS.LANGUAGE, language)
 }, [language, direction])

 const setLanguage = (lang: Language) => {
 setLanguageState(lang)
 }

 const toggleLanguage = () => {
 setLanguageState((prev) => (prev === 'ar' ? 'en' : 'ar'))
 }

 return (
 <LanguageContext.Provider
 value={{ language, direction, setLanguage, toggleLanguage, isRTL }}
 >
 {children}
 </LanguageContext.Provider>
 )
}

export function useLanguageContext(): LanguageContextValue {
 const ctx = useContext(LanguageContext)
 if (!ctx) {
 throw new Error('useLanguageContext must be used inside <LanguageProvider>')
 }
 return ctx
}
