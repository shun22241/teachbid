// Business metrics and KPI tracking for TeachBid

export interface BusinessMetrics {
  // User metrics
  totalUsers: number
  activeUsers: number
  newRegistrations: number
  userRetention: number
  
  // Request metrics
  totalRequests: number
  activeRequests: number
  completedRequests: number
  averageRequestBudget: number
  
  // Proposal metrics
  totalProposals: number
  acceptedProposals: number
  proposalAcceptanceRate: number
  averageProposalTime: number
  
  // Revenue metrics
  totalRevenue: number
  platformFees: number
  averageTransactionValue: number
  monthlyRecurringRevenue: number
  
  // Quality metrics
  averageRating: number
  completionRate: number
  disputeRate: number
  customerSatisfaction: number
}

export interface MetricsTimeRange {
  startDate: string
  endDate: string
  period: 'day' | 'week' | 'month' | 'quarter' | 'year'
}

class MetricsCollector {
  private cache = new Map<string, { data: any; timestamp: number }>()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  // Get business metrics for a time range
  async getBusinessMetrics(timeRange: MetricsTimeRange): Promise<BusinessMetrics> {
    const cacheKey = `metrics_${timeRange.startDate}_${timeRange.endDate}`
    const cached = this.getFromCache(cacheKey)
    
    if (cached) {
      return cached
    }

    // In a real implementation, this would query the database
    const metrics = await this.calculateMetrics(timeRange)
    this.setCache(cacheKey, metrics)
    
    return metrics
  }

  private async calculateMetrics(timeRange: MetricsTimeRange): Promise<BusinessMetrics> {
    // Mock implementation - in production, this would use Supabase queries
    return {
      totalUsers: 1250,
      activeUsers: 890,
      newRegistrations: 45,
      userRetention: 0.78,
      
      totalRequests: 2340,
      activeRequests: 156,
      completedRequests: 1980,
      averageRequestBudget: 12500,
      
      totalProposals: 8760,
      acceptedProposals: 2180,
      proposalAcceptanceRate: 0.25,
      averageProposalTime: 4.2,
      
      totalRevenue: 23400000,
      platformFees: 4680000,
      averageTransactionValue: 11850,
      monthlyRecurringRevenue: 1950000,
      
      averageRating: 4.7,
      completionRate: 0.94,
      disputeRate: 0.02,
      customerSatisfaction: 0.91
    }
  }

  // Track conversion funnel
  async getConversionFunnel(): Promise<{
    visitors: number
    signups: number
    firstRequest: number
    firstProposal: number
    firstTransaction: number
  }> {
    return {
      visitors: 10000,
      signups: 850,
      firstRequest: 420,
      firstProposal: 380,
      firstTransaction: 280
    }
  }

  // Get user cohort analysis
  async getCohortAnalysis(months: number = 12): Promise<{
    cohort: string
    month0: number
    month1: number
    month3: number
    month6: number
    month12: number
  }[]> {
    // Mock cohort data
    return [
      { cohort: '2024-01', month0: 100, month1: 78, month3: 65, month6: 52, month12: 45 },
      { cohort: '2024-02', month0: 120, month1: 85, month3: 70, month6: 58, month12: 0 },
      { cohort: '2024-03', month0: 135, month1: 98, month3: 82, month6: 0, month12: 0 }
    ]
  }

  // Track real-time metrics
  getRealTimeMetrics(): {
    activeUsers: number
    activeRequests: number
    activeProposals: number
    ongoingSessions: number
  } {
    return {
      activeUsers: 45,
      activeRequests: 12,
      activeProposals: 28,
      ongoingSessions: 15
    }
  }

  // Cache management
  private getFromCache(key: string) {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data
    }
    return null
  }

  private setCache(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  // Generate insights and alerts
  generateInsights(metrics: BusinessMetrics): {
    type: 'warning' | 'success' | 'info'
    message: string
    value?: number
  }[] {
    const insights = []

    if (metrics.proposalAcceptanceRate < 0.2) {
      insights.push({
        type: 'warning' as const,
        message: '提案承認率が低下しています。講師のマッチング精度を改善する必要があります。',
        value: metrics.proposalAcceptanceRate
      })
    }

    if (metrics.averageRating > 4.5) {
      insights.push({
        type: 'success' as const,
        message: 'サービス評価が非常に高水準を維持しています。',
        value: metrics.averageRating
      })
    }

    if (metrics.userRetention < 0.7) {
      insights.push({
        type: 'warning' as const,
        message: 'ユーザー継続率が低下しています。ユーザーエンゲージメント施策が必要です。',
        value: metrics.userRetention
      })
    }

    if (metrics.monthlyRecurringRevenue > 0) {
      insights.push({
        type: 'info' as const,
        message: `月間経常収益: ¥${metrics.monthlyRecurringRevenue.toLocaleString()}`,
        value: metrics.monthlyRecurringRevenue
      })
    }

    return insights
  }
}

// Export singleton instance
export const metricsCollector = new MetricsCollector()

// React hook for metrics
export function useMetrics() {
  const [metrics, setMetrics] = React.useState<BusinessMetrics | null>(null)
  const [loading, setLoading] = React.useState(false)

  const loadMetrics = async (timeRange: MetricsTimeRange) => {
    setLoading(true)
    try {
      const data = await metricsCollector.getBusinessMetrics(timeRange)
      setMetrics(data)
    } catch (error) {
      console.error('Failed to load metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  return { metrics, loading, loadMetrics }
}