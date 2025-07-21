'use client'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import {
  BookOpen,
  TrendingUp,
  Star,
  Calendar,
  PlusCircle,
  ArrowRight,
  MessageSquare,
  Users,
  DollarSign
} from 'lucide-react'
import type { Database } from '@/types/database'

type Activity = {
  id: string
  type: 'request' | 'proposal' | 'payment' | 'review' | 'message'
  title: string
  description: string
  timestamp: string
  status?: 'success' | 'pending' | 'failed'
  metadata?: any
}

type Request = Database['public']['Tables']['requests']['Row']

export default function TeacherDashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [stats, setStats] = useState({
    activeProposals: 0,
    totalEarnings: 0,
    averageRating: 0,
    completedSessions: 0,
    activeProposalsTrend: 0,
    earningsTrend: 0
  })
  const [activities, setActivities] = useState<Activity[]>([])
  const [recentRequests, setRecentRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Fetch active proposals count
        const { count: activeCount } = await supabase
          .from('proposals')
          .select('*', { count: 'exact', head: true })
          .eq('teacher_id', user.id)
          .eq('status', 'pending')

        // Fetch total earnings
        const { data: transactions } = await supabase
          .from('transactions')
          .select('teacher_fee_amount')
          .eq('teacher_id', user.id)
          .eq('status', 'completed')
        
        const totalEarnings = transactions
          ? transactions.reduce((sum, t) => sum + Number(t.teacher_fee_amount), 0)
          : 0

        // Fetch completed sessions count
        const { count: completedCount } = await supabase
          .from('transactions')
          .select('*', { count: 'exact', head: true })
          .eq('teacher_id', user.id)
          .eq('status', 'completed')

        // Fetch average rating
        const { data: reviews } = await supabase
          .from('reviews')
          .select('rating')
          .eq('reviewee_id', user.id)
        
        const averageRating = reviews && reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0

        // Fetch recent activities
        const { data: recentActivities } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5)

        // Transform notifications to activities
        const transformedActivities: Activity[] = recentActivities?.map(notif => ({
          id: notif.id,
          type: notif.type as any,
          title: notif.title,
          description: notif.body,
          timestamp: notif.created_at,
          status: notif.is_read ? 'success' : 'pending'
        })) || []

        // Fetch recent open requests for browsing
        const { data: requests } = await supabase
          .from('requests')
          .select('*')
          .eq('status', 'open')
          .order('created_at', { ascending: false })
          .limit(5)

        setStats({
          activeProposals: activeCount || 0,
          totalEarnings,
          averageRating: Number(averageRating.toFixed(1)),
          completedSessions: completedCount || 0,
          activeProposalsTrend: 12, // Mock data
          earningsTrend: 25 // Mock data
        })

        setActivities(transformedActivities)
        setRecentRequests(requests || [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">講師ダッシュボード</h1>
          <p className="text-muted-foreground">
            指導実績と提案の管理
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/teacher/browse')}>
          <BookOpen className="mr-2 h-4 w-4" />
          リクエストを探す
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="アクティブな提案"
          value={stats.activeProposals}
          description="審査待ちの提案数"
          icon={MessageSquare}
          trend={{
            value: stats.activeProposalsTrend,
            isPositive: true
          }}
        />
        <StatsCard
          title="総収益"
          value={`¥${stats.totalEarnings.toLocaleString()}`}
          description="これまでの指導収入"
          icon={DollarSign}
          trend={{
            value: stats.earningsTrend,
            isPositive: true
          }}
        />
        <StatsCard
          title="完了したセッション"
          value={stats.completedSessions}
          description="指導回数の実績"
          icon={Users}
        />
        <StatsCard
          title="平均評価"
          value={stats.averageRating || '---'}
          description="生徒からの評価"
          icon={Star}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Recent Requests */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">新着リクエスト</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard/teacher/browse')}
            >
              すべて見る
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          {recentRequests.length > 0 ? (
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <Card key={request.id} className="transition-colors hover:bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium line-clamp-1 mb-2">
                          {request.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {request.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{request.category}</span>
                          <span>¥{Number(request.budget_min).toLocaleString()} - ¥{Number(request.budget_max).toLocaleString()}</span>
                          <span>{(request as any).duration_hours}時間</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => router.push(`/dashboard/teacher/browse/${request.id}`)}
                      >
                        詳細
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg p-8 text-center">
              <p className="text-muted-foreground mb-4">
                新しいリクエストがありません
              </p>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/teacher/browse')}
              >
                リクエストを探す
              </Button>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-3">
          <RecentActivity activities={activities} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer transition-colors hover:bg-muted/50" 
              onClick={() => router.push('/dashboard/teacher/proposals')}>
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-medium mb-2">提案管理</h3>
            <p className="text-sm text-muted-foreground">
              送信した提案の状況を確認
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => router.push('/dashboard/teacher/schedule')}>
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-medium mb-2">スケジュール</h3>
            <p className="text-sm text-muted-foreground">
              指導予定と空き時間の管理
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => router.push('/dashboard/teacher/earnings')}>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-medium mb-2">収益管理</h3>
            <p className="text-sm text-muted-foreground">
              収入履歴と支払い状況
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}