'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Locale = 'ja' | 'en'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
  defaultLocale?: Locale
}

export function LanguageProvider({ children, defaultLocale = 'ja' }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  useEffect(() => {
    // Load locale from localStorage
    const savedLocale = localStorage.getItem('teachbid-locale') as Locale
    if (savedLocale && ['ja', 'en'].includes(savedLocale)) {
      setLocaleState(savedLocale)
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0]
      if (browserLang === 'ja' || browserLang === 'en') {
        setLocaleState(browserLang as Locale)
      }
    }
  }, [])

  useEffect(() => {
    // Update document language
    document.documentElement.lang = locale
    
    // Update document direction (RTL for Arabic, Hebrew, etc.)
    document.documentElement.dir = isRTL(locale) ? 'rtl' : 'ltr'
  }, [locale])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('teachbid-locale', newLocale)
  }

  const isRTL = (locale: Locale): boolean => {
    // Add RTL languages here if needed
    const rtlLanguages = ['ar', 'he', 'fa', 'ur']
    return rtlLanguages.includes(locale)
  }

  const value: LanguageContextType = {
    locale,
    setLocale,
    isRTL: isRTL(locale),
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}