'use client'

import { useEffect } from 'react'
import { observeWebVitals } from '@/lib/utils/performance'

export function WebVitalsReporter() {
  useEffect(() => {
    // Only run in browser
    if (typeof window !== 'undefined') {
      observeWebVitals()
    }
  }, [])

  // This component doesn't render anything
  return null
}