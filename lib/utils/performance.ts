// Performance monitoring utilities

export function startPerformanceTimer(label: string): () => void {
  const start = performance.now()
  
  return () => {
    const end = performance.now()
    const duration = end - start
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`)
    }
    
    // Send to analytics in production
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      // Example: Analytics tracking
      // analytics.track('performance_timing', { label, duration })
    }
  }
}

export function measureAsyncOperation<T>(
  operation: () => Promise<T>,
  label: string
): Promise<T> {
  const stopTimer = startPerformanceTimer(label)
  
  return operation()
    .finally(() => {
      stopTimer()
    })
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
      timeout = null
    }, wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

// Web Vitals monitoring
export function observeWebVitals() {
  if (typeof window === 'undefined') return
  
  // Observe Largest Contentful Paint (LCP)
  new PerformanceObserver((list) => {
    const entries = list.getEntries()
    const lastEntry = entries[entries.length - 1]
    
    if (process.env.NODE_ENV === 'development') {
      console.log('LCP:', lastEntry.startTime)
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] })
  
  // Observe First Input Delay (FID)
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (process.env.NODE_ENV === 'development') {
        console.log('FID:', (entry as any).processingStart - entry.startTime)
      }
    }
  }).observe({ entryTypes: ['first-input'] })
  
  // Observe Cumulative Layout Shift (CLS)
  let clsValue = 0
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value
      }
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('CLS:', clsValue)
    }
  }).observe({ entryTypes: ['layout-shift'] })
}