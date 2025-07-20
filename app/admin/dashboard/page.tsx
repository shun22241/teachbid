'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserCheck,
  UserPlus,
  Activity
} from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalStudents: number
  totalTeachers: number
  newUsersThisWeek: number
  totalRequests: number
  activeRequests: number
  completedRequests: number
  totalTransactions: number
  totalRevenue: number
  platformFees: number
  pendingTransactions: number
  recentActivity: Array<{
    type: string
    user_name: string
    description: string
    created_at: string
  }>
}

export default function AdminDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
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

        // Fetch user statistics
        const { data: userStats } = await supabase
          .from('profiles')
          .select('role, created_at')

        const totalUsers = userStats?.length || 0
        const totalStudents = userStats?.filter(u => u.role === 'student').length || 0
        const totalTeachers = userStats?.filter(u => u.role === 'teacher').length || 0
        
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        const newUsersThisWeek = userStats?.filter(u => 
          new Date(u.created_at) >= oneWeekAgo
        ).length || 0

        // Fetch request statistics
        const { data: requestStats } = await supabase
          .from('requests')
          .select('status, created_at')

        const totalRequests = requestStats?.length || 0
        const activeRequests = requestStats?.filter(r => 
          ['open', 'in_progress'].includes(r.status)
        ).length || 0
        const completedRequests = requestStats?.filter(r => 
          r.status === 'completed'
        ).length || 0

        // Fetch transaction statistics
        const { data: transactionStats } = await supabase
          .from('transactions')
          .select('amount, platform_fee_amount, status')

        const totalTransactions = transactionStats?.length || 0
        const totalRevenue = transactionStats?.reduce((sum, t) => 
          sum + Number(t.amount), 0) || 0
        const platformFees = transactionStats?.reduce((sum, t) => 
          sum + Number(t.platform_fee_amount), 0) || 0
        const pendingTransactions = transactionStats?.filter(t => 
          t.status === 'pending'
        ).length || 0

        // Fetch recent activity (notifications for admin activity log)
        const { data: recentActivity } = await supabase
          .from('notifications')
          .select('type, title, body, created_at')
          .order('created_at', { ascending: false })
          .limit(10)

        const formattedActivity = recentActivity?.map(activity => ({
          type: activity.type,
          user_name: 'システム',
          description: activity.title,
          created_at: activity.created_at
        })) || []

        setStats({
          totalUsers,
          totalStudents,
          totalTeachers,
          newUsersThisWeek,
          totalRequests,
          activeRequests,
          completedRequests,
          totalTransactions,
          totalRevenue,
          platformFees,
          pendingTransactions,
          recentActivity: formattedActivity
        })

      } catch (error) {
        console.error('Error fetching stats:', error)
        toast({
          title: 'エラー',
          description: '統計データの取得に失敗しました',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [supabase, router, toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">データの読み込みに失敗しました</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">管理者ダッシュボード</h1>
        <p className="text-muted-foreground">
          プラットフォームの統計情報と管理機能
        </p>
      </div>

      {/* User Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              総ユーザー数
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              今週 +{stats.newUsersThisWeek} 名
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              学生数
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              全ユーザーの {Math.round(stats.totalStudents / stats.totalUsers * 100)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              講師数
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeachers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              全ユーザーの {Math.round(stats.totalTeachers / stats.totalUsers * 100)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              アクティブリクエスト
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              総リクエスト {stats.totalRequests} 件
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              総取引金額
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalTransactions} 件の取引
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              プラットフォーム手数料
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{stats.platformFees.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              総取引の {Math.round(stats.platformFees / stats.totalRevenue * 100)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              保留中決済
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTransactions}</div>
            <p className="text-xs text-muted-foreground">
              要確認の取引
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Request Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>リクエスト状況</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{stats.activeRequests}</div>
              <div className="text-sm text-muted-foreground">アクティブ</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{stats.completedRequests}</div>
              <div className="text-sm text-muted-foreground">完了</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold">{stats.pendingTransactions}</div>
              <div className="text-sm text-muted-foreground">要対応</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>最近のアクティビティ</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentActivity.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              最近のアクティビティはありません
            </p>
          ) : (
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.user_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{activity.type}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.created_at).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}