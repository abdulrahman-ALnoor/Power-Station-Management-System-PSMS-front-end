// ============================================================
// useLanguage — Convenience hook for language + direction
// ============================================================

import { useTranslation } from 'react-i18next'
import { useLanguageContext } from '@/context/LanguageContext'
import type { Language, Direction } from '@/types/common'

interface UseLanguageReturn {
  language: Language
  direction: Direction
  isRTL: boolean
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: ReturnType<typeof useTranslation>['t']
}

export function useLanguage(namespace?: string): UseLanguageReturn {
  const { language, direction, isRTL, setLanguage, toggleLanguage } =
    useLanguageContext()
  const { t } = useTranslation(namespace)

  return {
    language,
    direction,
    isRTL,
    setLanguage,
    toggleLanguage,
    t,
  }
}
