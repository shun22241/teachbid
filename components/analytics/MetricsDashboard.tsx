'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  MessageSquare, 
  DollarSign,
  Star,
  Target,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'
import { metricsCollector, type BusinessMetrics, type MetricsTimeRange } from '@/lib/analytics/metrics'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
  format?: 'number' | 'currency' | 'percentage'
}

function MetricCard({ title, value, change, icon, format = 'number' }: MetricCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val
    
    switch (format) {
      case 'currency':
        return `¥${val.toLocaleString()}`
      case 'percentage':
        return `${(val * 100).toFixed(1)}%`
      default:
        return val.toLocaleString()
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        {change !== undefined && (
          <div className={`text-xs flex items-center mt-1 ${
            change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
          }`}>
            {change > 0 ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : change < 0 ? (
              <TrendingDown className="h-3 w-3 mr-1" />
            ) : null}
            {change > 0 ? '+' : ''}{change}% from last period
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface InsightCardProps {
  insights: {
    type: 'warning' | 'success' | 'info'
    message: string
    value?: number
  }[]
}

function InsightCard({ insights }: InsightCardProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />
      case 'success':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getVariant = (type: string) => {
    switch (type) {
      case 'warning':
        return 'destructive' as const
      case 'success':
        return 'success' as const
      default:
        return 'secondary' as const
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>インサイト</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            現在、注目すべきインサイトはありません。
          </p>
        ) : (
          insights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3">
              <Badge variant={getVariant(insight.type)} className="mt-0.5">
                {getIcon(insight.type)}
              </Badge>
              <div className="flex-1">
                <p className="text-sm">{insight.message}</p>
                {insight.value && (
                  <p className="text-xs text-muted-foreground mt-1">
                    値: {insight.value}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

export function MetricsDashboard() {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<MetricsTimeRange>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    period: 'month'
  })

  useEffect(() => {
    loadMetrics()
  }, [timeRange])

  const loadMetrics = async () => {
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

  const insights = metrics ? metricsCollector.generateInsights(metrics) : []

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">メトリクスの読み込みに失敗しました。</p>
        <Button onClick={loadMetrics} className="mt-4">
          再試行
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">アナリティクス ダッシュボード</h2>
        <div className="flex space-x-2">
          <Button
            variant={timeRange.period === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange({ ...timeRange, period: 'week' })}
          >
            週間
          </Button>
          <Button
            variant={timeRange.period === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange({ ...timeRange, period: 'month' })}
          >
            月間
          </Button>
          <Button
            variant={timeRange.period === 'quarter' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange({ ...timeRange, period: 'quarter' })}
          >
            四半期
          </Button>
        </div>
      </div>

      {/* User Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">ユーザーメトリクス</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="総ユーザー数"
            value={metrics.totalUsers}
            change={5.2}
            icon={<Users />}
          />
          <MetricCard
            title="アクティブユーザー"
            value={metrics.activeUsers}
            change={3.1}
            icon={<Users />}
          />
          <MetricCard
            title="新規登録"
            value={metrics.newRegistrations}
            change={-2.4}
            icon={<Users />}
          />
          <MetricCard
            title="ユーザー継続率"
            value={metrics.userRetention}
            change={1.8}
            icon={<Target />}
            format="percentage"
          />
        </div>
      </div>

      {/* Request & Proposal Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">リクエスト・提案メトリクス</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="総リクエスト数"
            value={metrics.totalRequests}
            change={8.7}
            icon={<FileText />}
          />
          <MetricCard
            title="総提案数"
            value={metrics.totalProposals}
            change={12.3}
            icon={<MessageSquare />}
          />
          <MetricCard
            title="提案承認率"
            value={metrics.proposalAcceptanceRate}
            change={-1.2}
            icon={<Target />}
            format="percentage"
          />
          <MetricCard
            title="平均予算"
            value={metrics.averageRequestBudget}
            change={4.5}
            icon={<DollarSign />}
            format="currency"
          />
        </div>
      </div>

      {/* Revenue Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">収益メトリクス</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="総収益"
            value={metrics.totalRevenue}
            change={15.6}
            icon={<DollarSign />}
            format="currency"
          />
          <MetricCard
            title="プラットフォーム手数料"
            value={metrics.platformFees}
            change={15.6}
            icon={<DollarSign />}
            format="currency"
          />
          <MetricCard
            title="平均取引額"
            value={metrics.averageTransactionValue}
            change={7.2}
            icon={<DollarSign />}
            format="currency"
          />
          <MetricCard
            title="月間経常収益"
            value={metrics.monthlyRecurringRevenue}
            change={9.8}
            icon={<TrendingUp />}
            format="currency"
          />
        </div>
      </div>

      {/* Quality Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">品質メトリクス</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="平均評価"
            value={metrics.averageRating}
            change={0.2}
            icon={<Star />}
          />
          <MetricCard
            title="完了率"
            value={metrics.completionRate}
            change={1.1}
            icon={<CheckCircle />}
            format="percentage"
          />
          <MetricCard
            title="紛争率"
            value={metrics.disputeRate}
            change={-0.5}
            icon={<AlertTriangle />}
            format="percentage"
          />
          <MetricCard
            title="顧客満足度"
            value={metrics.customerSatisfaction}
            change={2.3}
            icon={<Star />}
            format="percentage"
          />
        </div>
      </div>

      {/* Insights */}
      <InsightCard insights={insights} />
    </div>
  )
}