'use client'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  DollarSign, 
  BookOpen, 
  Calendar,
  Target,
  Activity
} from 'lucide-react'

interface AnalyticsData {
  userGrowth: {
    thisMonth: number
    lastMonth: number
    growth: number
  }
  revenueGrowth: {
    thisMonth: number
    lastMonth: number
    growth: number
  }
  requestStats: {
    total: number
    active: number
    completed: number
    completionRate: number
  }
  teacherStats: {
    total: number
    active: number
    withStripe: number
    averageEarnings: number
  }
  monthlyData: Array<{
    month: string
    users: number
    revenue: number
    requests: number
    completions: number
  }>
  categoryStats: Array<{
    category: string
    count: number
    percentage: number
  }>
}

export default function AdminAnalyticsPage() {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        // Check admin access
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile?.role !== 'admin') {
          toast({
            title: 'アクセス拒否',
            description: '管理者権限が必要です',
            variant: 'destructive'
          })
          router.push('/dashboard')
          return
        }

        // Calculate date ranges
        const now = new Date()
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

        // Fetch user data
        const { data: usersData } = await supabase
          .from('profiles')
          .select('role, created_at')

        const thisMonthUsers = usersData?.filter(u => 
          new Date(u.created_at) >= thisMonth
        ).length || 0

        const lastMonthUsers = usersData?.filter(u => {
          const createdDate = new Date(u.created_at)
          return createdDate >= lastMonth && createdDate <= lastMonthEnd
        }).length || 0

        const userGrowth = lastMonthUsers > 0 ? 
          ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100 : 0

        // Fetch transaction data
        const { data: transactionsData } = await supabase
          .from('transactions')
          .select('amount, created_at, status')

        const thisMonthRevenue = transactionsData?.filter(t => 
          new Date(t.created_at) >= thisMonth
        ).reduce((sum, t) => sum + Number(t.amount), 0) || 0

        const lastMonthRevenue = transactionsData?.filter(t => {
          const createdDate = new Date(t.created_at)
          return createdDate >= lastMonth && createdDate <= lastMonthEnd
        }).reduce((sum, t) => sum + Number(t.amount), 0) || 0

        const revenueGrowth = lastMonthRevenue > 0 ? 
          ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0

        // Fetch request data
        const { data: requestsData } = await supabase
          .from('requests')
          .select('status, category, created_at')

        const totalRequests = requestsData?.length || 0
        const activeRequests = requestsData?.filter(r => 
          ['open', 'in_progress'].includes(r.status)
        ).length || 0
        const completedRequests = requestsData?.filter(r => 
          r.status === 'completed'
        ).length || 0
        const completionRate = totalRequests > 0 ? 
          (completedRequests / totalRequests) * 100 : 0

        // Teacher stats
        const teachers = usersData?.filter(u => u.role === 'teacher') || []
        const { data: teacherProfiles } = await supabase
          .from('profiles')
          .select('stripe_account_enabled')
          .eq('role', 'teacher')

        const teachersWithStripe = teacherProfiles?.filter(p => 
          p.stripe_account_enabled
        ).length || 0

        const teacherTransactions = transactionsData?.filter(t => 
          t.status === 'completed'
        ) || []
        const averageEarnings = teacherTransactions.length > 0 ? 
          teacherTransactions.reduce((sum, t) => sum + Number(t.amount), 0) / teachers.length : 0

        // Monthly data for last 6 months
        const monthlyData = []
        for (let i = 5; i >= 0; i--) {
          const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
          const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
          
          const monthUsers = usersData?.filter(u => {
            const createdDate = new Date(u.created_at)
            return createdDate >= monthStart && createdDate <= monthEnd
          }).length || 0

          const monthRevenue = transactionsData?.filter(t => {
            const createdDate = new Date(t.created_at)
            return createdDate >= monthStart && createdDate <= monthEnd
          }).reduce((sum, t) => sum + Number(t.amount), 0) || 0

          const monthRequests = requestsData?.filter(r => {
            const createdDate = new Date(r.created_at)
            return createdDate >= monthStart && createdDate <= monthEnd
          }).length || 0

          const monthCompletions = requestsData?.filter(r => {
            const createdDate = new Date(r.created_at)
            return createdDate >= monthStart && createdDate <= monthEnd && r.status === 'completed'
          }).length || 0

          monthlyData.push({
            month: monthStart.toLocaleDateString('ja-JP', { month: 'short' }),
            users: monthUsers,
            revenue: monthRevenue,
            requests: monthRequests,
            completions: monthCompletions
          })
        }

        // Category stats
        const categoryStats = []
        const categories = [...new Set(requestsData?.map(r => r.category).filter(Boolean))]
        
        for (const category of categories) {
          const count = requestsData?.filter(r => r.category === category).length || 0
          const percentage = totalRequests > 0 ? (count / totalRequests) * 100 : 0
          
          categoryStats.push({
            category: category || '未分類',
            count,
            percentage
          })
        }

        categoryStats.sort((a, b) => b.count - a.count)

        setAnalytics({
          userGrowth: {
            thisMonth: thisMonthUsers,
            lastMonth: lastMonthUsers,
            growth: userGrowth
          },
          revenueGrowth: {
            thisMonth: thisMonthRevenue,
            lastMonth: lastMonthRevenue,
            growth: revenueGrowth
          },
          requestStats: {
            total: totalRequests,
            active: activeRequests,
            completed: completedRequests,
            completionRate
          },
          teacherStats: {
            total: teachers.length,
            active: teachers.length, // Simplified - could be calculated differently
            withStripe: teachersWithStripe,
            averageEarnings
          },
          monthlyData,
          categoryStats
        })

      } catch (error) {
        console.error('Error fetching analytics:', error)
        toast({
          title: 'エラー',
          description: '分析データの取得に失敗しました',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [supabase, router, toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">分析データの読み込みに失敗しました</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">分析ダッシュボード</h1>
        <p className="text-muted-foreground">
          プラットフォームのパフォーマンス分析と洞察
        </p>
      </div>

      {/* Growth Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              今月のユーザー増加
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.userGrowth.thisMonth}</div>
            <div className="flex items-center text-xs">
              {analytics.userGrowth.growth > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
              )}
              <span className={analytics.userGrowth.growth > 0 ? 'text-green-600' : 'text-red-600'}>
                {analytics.userGrowth.growth > 0 ? '+' : ''}{analytics.userGrowth.growth.toFixed(1)}%
              </span>
              <span className="text-muted-foreground ml-1">前月比</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              今月の売上
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{analytics.revenueGrowth.thisMonth.toLocaleString()}
            </div>
            <div className="flex items-center text-xs">
              {analytics.revenueGrowth.growth > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
              )}
              <span className={analytics.revenueGrowth.growth > 0 ? 'text-green-600' : 'text-red-600'}>
                {analytics.revenueGrowth.growth > 0 ? '+' : ''}{analytics.revenueGrowth.growth.toFixed(1)}%
              </span>
              <span className="text-muted-foreground ml-1">前月比</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              完了率
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.requestStats.completionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.requestStats.completed}/{analytics.requestStats.total} リクエスト
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              アクティブ講師
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.teacherStats.withStripe}</div>
            <p className="text-xs text-muted-foreground">
              全講師 {analytics.teacherStats.total} 名中
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>月次推移</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.monthlyData.map((month, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">月</div>
                  <div className="font-medium">{month.month}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">新規ユーザー</div>
                  <div className="font-medium">{month.users}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">売上</div>
                  <div className="font-medium">¥{month.revenue.toLocaleString()}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">リクエスト</div>
                  <div className="font-medium">{month.requests}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>カテゴリ別分析</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.categoryStats.slice(0, 10).map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{category.category}</h4>
                  <p className="text-sm text-muted-foreground">
                    {category.count} リクエスト
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium">{category.percentage.toFixed(1)}%</div>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${Math.min(category.percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle>主要な洞察</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">ユーザー成長</h4>
              <p className="text-sm text-muted-foreground">
                {analytics.userGrowth.growth > 0 
                  ? `前月比${analytics.userGrowth.growth.toFixed(1)}%の成長を記録しており、順調にユーザーベースが拡大しています。`
                  : '前月比でユーザー成長が鈍化しています。マーケティング戦略の見直しが必要かもしれません。'
                }
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">収益性</h4>
              <p className="text-sm text-muted-foreground">
                {analytics.revenueGrowth.growth > 0
                  ? `売上が前月比${analytics.revenueGrowth.growth.toFixed(1)}%増加しており、事業の収益性が向上しています。`
                  : '売上の成長が鈍化しています。リクエストの質向上や手数料構造の見直しを検討してください。'
                }
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">講師活用率</h4>
              <p className="text-sm text-muted-foreground">
                {((analytics.teacherStats.withStripe / analytics.teacherStats.total) * 100).toFixed(1)}%の講師がStripe設定を完了しており、
                {analytics.teacherStats.withStripe / analytics.teacherStats.total > 0.7 
                  ? 'アクティブな講師比率が高い状態です。'
                  : '講師のオンボーディング改善が必要です。'
                }
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">マッチング効率</h4>
              <p className="text-sm text-muted-foreground">
                リクエストの完了率が{analytics.requestStats.completionRate.toFixed(1)}%
                {analytics.requestStats.completionRate > 70 
                  ? 'と高く、効果的なマッチングが行われています。'
                  : 'で、マッチング精度の向上が必要です。'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}