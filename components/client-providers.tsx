'use client'

import { ReactNode } from 'react'
import { AuthProvider } from '@/hooks/useAuth'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { Toaster } from '@/components/ui/toaster'
import { WebVitalsReporter } from '@/components/analytics/WebVitalsReporter'
import { PWAInstallPrompt } from '@/components/pwa/PWAInstallPrompt'
import { PWAInitializer } from '@/components/pwa/PWAInitializer'

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        {children}
        <Toaster />
        <WebVitalsReporter />
        <PWAInstallPrompt />
        <PWAInitializer />
      </AuthProvider>
    </ErrorBoundary>
  )
}