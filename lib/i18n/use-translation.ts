'use client'

import { useCallback, useMemo } from 'react'
import { translations, type ValidTranslationPath } from './translations'

type Locale = keyof typeof translations

export function useTranslation(locale: Locale = 'ja') {
  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    const keys = key.split('.')
    let value: any = translations[locale]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Fallback to Japanese if key not found in current locale
        if (locale !== 'ja') {
          let fallbackValue: any = translations.ja
          for (const fallbackKey of keys) {
            if (fallbackValue && typeof fallbackValue === 'object' && fallbackKey in fallbackValue) {
              fallbackValue = fallbackValue[fallbackKey]
            } else {
              return key // Return key if not found in fallback either
            }
          }
          value = fallbackValue
        } else {
          return key // Return key if not found
        }
        break
      }
    }
    
    if (typeof value === 'string') {
      // Replace parameters in the string
      if (params) {
        return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
          return params[paramKey]?.toString() || match
        })
      }
      return value
    }
    
    return key // Return key if value is not a string
  }, [locale])

  const currentLocale = useMemo(() => locale, [locale])
  
  return { t, locale: currentLocale }
}

// Hook for getting translation function with type safety
export function useT(locale?: Locale) {
  const { t } = useTranslation(locale)
  return t
}