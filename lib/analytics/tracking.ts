// Analytics and tracking utilities for TeachBid
import React from 'react'

export interface AnalyticsEvent {
  event: string
  category: string
  action: string
  label?: string
  value?: number
  userId?: string
  metadata?: Record<string, any>
}

export interface UserProperties {
  userId: string
  role: 'student' | 'teacher' | 'admin'
  registrationDate: string
  totalRequests?: number
  totalProposals?: number
  totalEarnings?: number
}

class AnalyticsService {
  private isEnabled: boolean
  private queue: AnalyticsEvent[] = []

  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production' && 
                     typeof window !== 'undefined' &&
                     !!process.env.NEXT_PUBLIC_ANALYTICS_ID
  }

  // Track page views
  trackPageView(page: string, title?: string) {
    if (!this.isEnabled) return

    this.track({
      event: 'page_view',
      category: 'navigation',
      action: 'view',
      label: page,
      metadata: {
        page,
        title: title || document.title,
        url: window.location.href,
        referrer: document.referrer
      }
    })
  }

  // Track user interactions
  trackInteraction(action: string, element: string, metadata?: Record<string, any>) {
    this.track({
      event: 'user_interaction',
      category: 'engagement',
      action,
      label: element,
      metadata
    })
  }

  // Track business events
  trackBusinessEvent(eventType: string, data: Record<string, any>) {
    const businessEvents = {
      request_created: {
        category: 'request',
        action: 'create',
        value: data.budget
      },
      proposal_submitted: {
        category: 'proposal', 
        action: 'submit',
        value: data.proposedPrice
      },
      proposal_accepted: {
        category: 'proposal',
        action: 'accept',
        value: data.amount
      },
      payment_completed: {
        category: 'payment',
        action: 'complete',
        value: data.amount
      },
      user_registered: {
        category: 'auth',
        action: 'register',
        label: data.role
      },
      search_performed: {
        category: 'search',
        action: 'query',
        label: data.query
      },
      message_sent: {
        category: 'communication',
        action: 'send_message'
      },
      review_submitted: {
        category: 'review',
        action: 'submit',
        value: data.rating
      }
    }

    const event = businessEvents[eventType as keyof typeof businessEvents]
    if (event) {
      this.track({
        event: eventType,
        ...event,
        metadata: data
      })
    }
  }

  // Track errors and exceptions
  trackError(error: Error, context?: string) {
    this.track({
      event: 'error',
      category: 'error',
      action: 'exception',
      label: error.name,
      metadata: {
        message: error.message,
        stack: error.stack,
        context
      }
    })
  }

  // Track performance metrics
  trackPerformance(metric: string, value: number, metadata?: Record<string, any>) {
    this.track({
      event: 'performance',
      category: 'performance',
      action: metric,
      value,
      metadata
    })
  }

  // Set user properties
  setUserProperties(properties: UserProperties) {
    if (!this.isEnabled) return

    // In production, send to analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_ANALYTICS_ID, {
        user_id: properties.userId,
        custom_map: {
          user_role: properties.role,
          registration_date: properties.registrationDate
        }
      })
    }
  }

  // Core tracking method
  private track(event: AnalyticsEvent) {
    if (!this.isEnabled) {
      // In development, just log to console
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Analytics Event:', event)
      }
      return
    }

    // Add timestamp and session info
    const enrichedEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }

    // Send to analytics service (Google Analytics, Mixpanel, etc.)
    this.sendToAnalytics(enrichedEvent)
  }

  private sendToAnalytics(event: AnalyticsEvent) {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_parameters: event.metadata
      })
    }

    // Custom analytics endpoint
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      }).catch(error => {
        console.error('Failed to send analytics event:', error)
      })
    }
  }

  private getSessionId(): string {
    if (typeof window === 'undefined') return 'server'
    
    let sessionId = sessionStorage.getItem('teachbid_session_id')
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15)
      sessionStorage.setItem('teachbid_session_id', sessionId)
    }
    return sessionId
  }

  // Flush queued events (useful for page unload)
  flush() {
    if (this.queue.length > 0) {
      this.queue.forEach(event => this.sendToAnalytics(event))
      this.queue = []
    }
  }
}

// Singleton instance
export const analytics = new AnalyticsService()

// React hook for analytics
export function useAnalytics() {
  return {
    trackPageView: analytics.trackPageView.bind(analytics),
    trackInteraction: analytics.trackInteraction.bind(analytics),
    trackBusinessEvent: analytics.trackBusinessEvent.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackPerformance: analytics.trackPerformance.bind(analytics),
    setUserProperties: analytics.setUserProperties.bind(analytics)
  }
}

// Higher-order component for automatic page tracking
export function withPageTracking<T extends object>(
  Component: React.ComponentType<T>,
  pageName: string
) {
  return function TrackedComponent(props: T) {
    React.useEffect(() => {
      analytics.trackPageView(pageName)
    }, [])

    return React.createElement(Component, props)
  }
}