'use client'

import { useEffect } from 'react'
import { serviceWorkerManager, offlineStorageManager } from '@/lib/pwa/service-worker'

export function PWAInitializer() {
  useEffect(() => {
    const initializePWA = async () => {
      try {
        // Register service worker
        const swRegistered = await serviceWorkerManager.register()
        if (swRegistered) {
          console.log('PWA: Service Worker registered successfully')
        }

        // Initialize offline storage
        await offlineStorageManager.init()
        console.log('PWA: Offline storage initialized')

        // Subscribe to push notifications if permission granted
        if (Notification.permission === 'granted') {
          const subscription = await serviceWorkerManager.subscribeToPushNotifications()
          if (subscription) {
            // Send subscription to server
            console.log('PWA: Push notifications subscribed')
          }
        }

        // Register background sync
        await serviceWorkerManager.registerBackgroundSync('background-sync')

      } catch (error) {
        console.error('PWA: Initialization failed', error)
      }
    }

    // Only initialize in browser environment
    if (typeof window !== 'undefined') {
      initializePWA()
    }
  }, [])

  // This component doesn't render anything
  return null
}