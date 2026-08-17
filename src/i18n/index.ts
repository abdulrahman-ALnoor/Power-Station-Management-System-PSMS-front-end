// ============================================================
// i18n initialization — react-i18next + i18next
// Supports Arabic (RTL) and English (LTR)
// ============================================================

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import ar from './ar'
import en from './en'

export const SUPPORTED_LANGUAGES = ['ar', 'en'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: SupportedLanguage = 'ar'
export const DEFAULT_NAMESPACE = 'common'

const resources = {
  ar: { ...ar },
  en: { ...en },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    defaultNS: DEFAULT_NAMESPACE,
    ns: ['common', 'navigation', 'auth', 'dashboard', 'employees', 'meters', 'equipment'],
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'psms_language',
      caches: ['localStorage'],
    },
  })

export default i18n
