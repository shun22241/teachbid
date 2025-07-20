'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Clock, 
  DollarSign, 
  Star, 
  TrendingUp, 
  Users,
  Calendar,
  MessageSquare,
  Bell,
  Award,
  Target,
  Activity,
  ChevronRight,
  Plus
} from 'lucide-react'
import { StatsCard } from '@/components/dashboard/StatsCard'
import Link from 'next/link'

export default function DemoPage() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'login'>('dashboard')

  const stats = {
    activeRequests: 3,
    totalSpent: 45000,
    completedLessons: 12,
    averageRating: 4.8
  }

  const upcomingLessons = [
    {
      id: '1',
      subject: '英語会話',
      teacher_name: '山田先生',
      scheduled_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      duration: 60
    },
    {
      id: '2',
      subject: '数学',
      teacher_name: '田中先生',
      scheduled_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      duration: 90
    }
  ]

  const recentActivity = [
    {
      id: '1',
      type: 'lesson',
      title: '数学のレッスンが完了しました',
      description: '田中先生との微積分レッスン',
      timestamp: '2時間前',
      icon: BookOpen
    },
    {
      id: '2',
      type: 'bid',
      title: '新しい応募がありました',
      description: '英語レッスンのリクエストに3件の応募',
      timestamp: '4時間前',
      icon: Users
    },
    {
      id: '3',
      type: 'review',
      title: 'レビューが投稿されました',
      description: '佐藤先生から5つ星の評価',
      timestamp: '1日前',
      icon: Star
    }
  ]

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">TeachBidデモ</CardTitle>
            <p className="text-muted-foreground">
              学習プラットフォームのデモンストレーション
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => setCurrentView('dashboard')} 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              学生ダッシュボードを表示
            </Button>
            <div className="text-center">
              <p className="text-sm text-gray-500">
                ※ これはデモ版です。実際のデータベースには接続されていません。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold">TeachBid</h1>
            </div>
            <Button onClick={() => setCurrentView('login')} variant="outline">
              ログアウト
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Welcome Header */}
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
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                新規リクエスト
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="アクティブなリクエスト"
              value={stats.activeRequests}
              description="現在募集中"
              icon={BookOpen}
              trend={{ value: 12, isPositive: true }}
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
              value={stats.completedLessons}
              description="受講済み"
              icon={Users}
              trend={{ value: 15, isPositive: true }}
              className="border-l-4 border-l-purple-500"
            />
            <StatsCard
              title="平均評価"
              value={stats.averageRating}
              description="5点満点"
              icon={Star}
              trend={{ value: 5, isPositive: true }}
              className="border-l-4 border-l-yellow-500"
            />
          </div>

          {/* Three Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Schedule */}
            <Card>
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
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-600" />
                  最近のアクティビティ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <activity.icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500">{activity.description}</p>
                        <p className="text-xs text-gray-400">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-3">
                  すべてのアクティビティを表示
                </Button>
              </CardContent>
            </Card>

            {/* Learning Progress */}
            <Card>
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

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center p-6">
                <MessageSquare className="w-8 h-8 text-blue-600 mr-4" />
                <div>
                  <h3 className="font-medium">メッセージ</h3>
                  <p className="text-sm text-gray-600">講師とやり取り</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center p-6">
                <DollarSign className="w-8 h-8 text-green-600 mr-4" />
                <div>
                  <h3 className="font-medium">支払い履歴</h3>
                  <p className="text-sm text-gray-600">取引を確認</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center p-6">
                <Star className="w-8 h-8 text-yellow-600 mr-4" />
                <div>
                  <h3 className="font-medium">レビュー</h3>
                  <p className="text-sm text-gray-600">評価を管理</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center p-6">
                <Users className="w-8 h-8 text-purple-600 mr-4" />
                <div>
                  <h3 className="font-medium">プロフィール</h3>
                  <p className="text-sm text-gray-600">設定を変更</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}