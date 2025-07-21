// Service Worker registration and management

export class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null
  
  async register(): Promise<boolean> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.log('Service Worker not supported')
      return false
    }

    try {
      console.log('Registering Service Worker...')
      
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })

      console.log('Service Worker registered successfully:', this.registration.scope)

      // Update found
      this.registration.addEventListener('updatefound', () => {
        console.log('Service Worker update found')
        const newWorker = this.registration?.installing
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New update available
              this.showUpdateNotification()
            }
          })
        }
      })

      // Listen for controlling service worker change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker controller changed')
        window.location.reload()
      })

      return true
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      return false
    }
  }

  async update(): Promise<void> {
    if (this.registration) {
      await this.registration.update()
    }
  }

  private showUpdateNotification(): void {
    // Show update notification to user
    if (confirm('新しいバージョンが利用可能です。更新しますか？')) {
      this.skipWaiting()
    }
  }

  private skipWaiting(): void {
    if (this.registration?.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
  }

  // Background sync registration
  async registerBackgroundSync(tag: string): Promise<void> {
    if (this.registration && 'sync' in this.registration) {
      try {
        await (this.registration as any).sync.register(tag)
        console.log('Background sync registered:', tag)
      } catch (error) {
        console.error('Background sync registration failed:', error)
      }
    }
  }

  // Push notification subscription
  async subscribeToPushNotifications(): Promise<PushSubscription | null> {
    if (!this.registration || !('PushManager' in window)) {
      console.log('Push notifications not supported')
      return null
    }

    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        console.log('Push notification permission denied')
        return null
      }

      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidPublicKey) {
        console.error('VAPID public key not found')
        return null
      }

      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
      })

      console.log('Push notification subscription created')
      return subscription
    } catch (error) {
      console.error('Push notification subscription failed:', error)
      return null
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }
}

// Offline storage management
export class OfflineStorageManager {
  private dbName = 'TeachBidOffline'
  private dbVersion = 1
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object stores
        if (!db.objectStoreNames.contains('actions')) {
          const actionsStore = db.createObjectStore('actions', { 
            keyPath: 'id', 
            autoIncrement: true 
          })
          actionsStore.createIndex('timestamp', 'timestamp', { unique: false })
          actionsStore.createIndex('type', 'type', { unique: false })
        }

        if (!db.objectStoreNames.contains('cache')) {
          const cacheStore = db.createObjectStore('cache', { keyPath: 'key' })
          cacheStore.createIndex('expiry', 'expiry', { unique: false })
        }
      }
    })
  }

  async storeOfflineAction(action: {
    type: string
    data: any
    url: string
    method: string
  }): Promise<void> {
    if (!this.db) return

    const transaction = this.db.transaction(['actions'], 'readwrite')
    const store = transaction.objectStore('actions')
    
    await store.add({
      ...action,
      timestamp: Date.now(),
      synced: false
    })
  }

  async getOfflineActions(): Promise<any[]> {
    if (!this.db) return []

    const transaction = this.db.transaction(['actions'], 'readonly')
    const store = transaction.objectStore('actions')
    
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async clearSyncedActions(): Promise<void> {
    if (!this.db) return

    const transaction = this.db.transaction(['actions'], 'readwrite')
    const store = transaction.objectStore('actions')
    const index = store.index('timestamp')
    
    const request = index.openCursor()
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result
      if (cursor) {
        if (cursor.value.synced) {
          cursor.delete()
        }
        cursor.continue()
      }
    }
  }
}

// Export singleton instances
export const serviceWorkerManager = new ServiceWorkerManager()
export const offlineStorageManager = new OfflineStorageManager()