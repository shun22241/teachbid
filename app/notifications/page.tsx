'use client'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useNotifications } from '@/hooks/useNotifications'
import { NotificationItem } from '@/components/notifications/NotificationItem'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/layout/PageHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bell, BellOff, CheckCheck, Trash2 } from 'lucide-react'

export default function NotificationsPage() {
  const router = useRouter()
  const supabase = createClient()
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getNotificationIcon,
    getNotificationAction
  } = useNotifications()

  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      
      // Fetch all notifications
      fetchNotifications(100)
    }

    checkAuth()
  }, [supabase, router, fetchNotifications])

  const handleNotificationClick = async (notification: any) => {
    // Mark as read
    if (!notification.is_read) {
      await markAsRead(notification.id)
    }

    // Navigate to action
    const actionUrl = getNotificationAction(notification)
    if (actionUrl) {
      router.push(actionUrl)
    }
  }

  const handleDeleteAll = async () => {
    if (confirm('すべての通知を削除してもよろしいですか？')) {
      // Delete all notifications one by one
      // In a real app, you'd want a bulk delete endpoint
      for (const notification of notifications) {
        await deleteNotification(notification.id)
      }
    }
  }

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.is_read)
    : notifications

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="通知"
        description="アカウントのすべての通知を管理します"
        action={
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                すべて既読にする
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteAll}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                すべて削除
              </Button>
            )}
          </div>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              通知一覧
            </CardTitle>
            {unreadCount > 0 && (
              <div className="text-sm text-muted-foreground">
                {unreadCount}件の未読
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs value={filter} onValueChange={(value) => setFilter(value as 'all' | 'unread')}>
            <div className="border-b px-6">
              <TabsList className="h-12 p-0 bg-transparent">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:border-b-2 rounded-none h-12"
                >
                  すべて ({notifications.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="unread" 
                  className="data-[state=active]:border-b-2 rounded-none h-12"
                >
                  未読 ({unreadCount})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={filter} className="m-0">
              {loading ? (
                <LoadingSpinner className="py-8" />
              ) : filteredNotifications.length === 0 ? (
                <EmptyState
                  icon={<BellOff className="h-12 w-12" />}
                  title={filter === 'unread' ? '未読の通知はありません' : '通知はありません'}
                  description="新しい通知が届くとここに表示されます"
                />
              ) : (
                <div className="divide-y">
                  {filteredNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onClick={() => handleNotificationClick(notification)}
                      onDelete={() => deleteNotification(notification.id)}
                      icon={getNotificationIcon(notification.type)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>通知設定</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              通知の受信設定は設定ページから変更できます。
            </p>
            <Button variant="outline" onClick={() => router.push('/settings/notifications')}>
              通知設定を開く
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}