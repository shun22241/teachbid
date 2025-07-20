'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { RequestList } from '@/components/requests/RequestList'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  BookOpen,
  Clock,
  CheckCircle,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  Calendar,
  Star,
  DollarSign,
  Users,
  MessageSquare,
  Bell,
  Award,
  Target,
  Activity,
  ChevronRight
} from 'lucide-react'
import type { Database } from '@/types/database'

type ActivityType = {
  id: string
  type: 'request' | 'proposal' | 'payment' | 'review' | 'message' | 'lesson' | 'bid'
  title: string
  description: string
  timestamp: string
  status?: 'success' | 'pending' | 'failed'
  metadata?: any
  icon?: any
}

type Request = Database['public']['Tables']['requests']['Row']

interface UpcomingLesson {
  id: string
  subject: string
  teacher_name: string
  scheduled_at: string
  duration: number
}

export default function StudentDashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [stats, setStats] = useState({
    activeRequests: 0,
    completedSessions: 0,
    averageRating: 0,
    totalSpent: 0,
    activeRequestsTrend: 0,
    completedSessionsTrend: 0
  })
  const [activities, setActivities] = useState<ActivityType[]>([])
  const [recentRequests, setRecentRequests] = useState<Request[]>([])
  const [upcomingLessons, setUpcomingLessons] = useState<UpcomingLesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Fetch active requests count
        const { count: activeCount } = await supabase
          .from('requests')
          .select('*', { count: 'exact', head: true })
          .eq('student_id', user.id)
          .in('status', ['open', 'in_progress'])

        // Fetch completed transactions count
        const { count: completedCount } = await supabase
          .from('transactions')
          .select('*', { count: 'exact', head: true })
          .eq('student_id', user.id)
          .eq('status', 'completed')

        // Fetch average rating
        const { data: reviews } = await supabase
          .from('reviews')
          .select('rating')
          .eq('reviewee_id', user.id)
        
        const averageRating = reviews && reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0

        // Fetch total spent
        const { data: transactions } = await supabase
          .from('transactions')
          .select('student_fee_amount')
          .eq('student_id', user.id)
          .eq('status', 'completed')
        
        const totalSpent = transactions
          ? transactions.reduce((sum, t) => sum + Number(t.student_fee_amount), 0)
          : 0

        // Fetch recent activities
        const { data: recentActivities } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5)

        // Transform notifications to activities with enhanced data
        const transformedActivities: ActivityType[] = recentActivities?.map(notif => ({
          id: notif.id,
          type: notif.type as any,
          title: notif.title,
          description: notif.body,
          timestamp: notif.created_at,
          status: notif.is_read ? 'success' : 'pending',
          icon: notif.type === 'lesson' ? BookOpen : 
                notif.type === 'bid' ? Users :
                notif.type === 'review' ? Star : MessageSquare
        })) || []

        // Mock upcoming lessons data
        setUpcomingLessons([
          {
            id: '1',
            subject: '英語会話',
            teacher_name: '山田先生',
            scheduled_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
            duration: 60
          },
          {
            id: '2', 
            subject: '数学',
            teacher_name: '田中先生',
            scheduled_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
            duration: 90
          }
        ])

        // Fetch recent requests
        const { data: requests } = await supabase
          .from('requests')
          .select('*')
          .eq('student_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3)

        setStats({
          activeRequests: activeCount || 0,
          completedSessions: completedCount || 0,
          averageRating: Number(averageRating.toFixed(1)),
          totalSpent,
          activeRequestsTrend: 15, // Mock data
          completedSessionsTrend: 8 // Mock data
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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Welcome Message */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">おかえりなさい！</h1>
          <p className="text-gray-600 mt-1">今日も学習を続けましょう</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            通知
          </Button>
          <Link href="/dashboard/student/requests/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="w-4 h-4 mr-2" />
              新規リクエスト
            </Button>
          </Link>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="アクティブなリクエスト"
          value={stats.activeRequests}
          description="現在募集中"
          icon={BookOpen}
          trend={{ value: stats.activeRequestsTrend, isPositive: true }}
          className="border-l-4 border-l-blue-500"
        />
        <StatsCard
          title="総支払額"
          value={`¥${stats.totalSpent.toLocaleString()}`}
          description="累計金額"
          icon={DollarSign}
          trend={{ value: 8, isPositive: true }}
          className="border-l-4 border-l-green-500"
        />
        <StatsCard
          title="完了レッスン"
          value={stats.completedSessions}
          description="受講済み"
          icon={Users}
          trend={{ value: stats.completedSessionsTrend, isPositive: true }}
          className="border-l-4 border-l-purple-500"
        />
        <StatsCard
          title="平均評価"
          value={stats.averageRating || '---'}
          description="5点満点"
          icon={Star}
          trend={{ value: 5, isPositive: true }}
          className="border-l-4 border-l-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                今日の予定
              </div>
              <Badge variant="outline">{upcomingLessons.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingLessons.length > 0 ? (
              <div className="space-y-3">
                {upcomingLessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{lesson.subject}</p>
                      <p className="text-xs text-gray-600">
                        {lesson.teacher_name} • {formatTime(lesson.scheduled_at)}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-3">
                  スケジュール管理
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">今日の予定はありません</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Recent Activity */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-600" />
              最近のアクティビティ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.length > 0 ? activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    {activity.icon && <activity.icon className="w-4 h-4 text-gray-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500">{activity.description}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(activity.timestamp).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-6">
                  <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">最近のアクティビティはありません</p>
                </div>
              )}
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-3">
              すべてのアクティビティを表示
            </Button>
          </CardContent>
        </Card>

        {/* Learning Progress */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-600" />
              学習進捗
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>今月の目標</span>
                <span>8/10レッスン</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>英語スキル</span>
                <span>75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>数学スキル</span>
                <span>60%</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <Button variant="outline" size="sm" className="w-full">
              <Award className="w-4 h-4 mr-2" />
              実績を確認
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              最近のリクエスト
            </CardTitle>
            <Link href="/dashboard/student/requests">
              <Button variant="outline" size="sm">
                すべて表示
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentRequests.length > 0 ? (
            <RequestList requests={recentRequests} showStatus />
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                まだリクエストがありません
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                初めてのリクエストを作成して、あなたにぴったりの講師を見つけましょう
              </p>
              <Link href="/dashboard/student/requests/new">
                <Button>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  最初のリクエストを作成
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/student/messages">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center p-6">
              <MessageSquare className="w-8 h-8 text-blue-600 mr-4" />
              <div>
                <h3 className="font-medium">メッセージ</h3>
                <p className="text-sm text-gray-600">講師とやり取り</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/student/payments">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center p-6">
              <DollarSign className="w-8 h-8 text-green-600 mr-4" />
              <div>
                <h3 className="font-medium">支払い履歴</h3>
                <p className="text-sm text-gray-600">取引を確認</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/student/reviews">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center p-6">
              <Star className="w-8 h-8 text-yellow-600 mr-4" />
              <div>
                <h3 className="font-medium">レビュー</h3>
                <p className="text-sm text-gray-600">評価を管理</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/student/profile">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center p-6">
              <Users className="w-8 h-8 text-purple-600 mr-4" />
              <div>
                <h3 className="font-medium">プロフィール</h3>
                <p className="text-sm text-gray-600">設定を変更</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}