'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  body: string
  metadata: any
  is_read: boolean
  created_at: string
}

export function useNotifications() {
  const supabase = createClient()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  // Fetch notifications for current user
  const fetchNotifications = useCallback(async (limit: number = 50) => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      setNotifications(data || [])
      const unread = data?.filter(n => !n.is_read).length || 0
      setUnreadCount(unread)

    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)

      if (error) throw error

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))

    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }, [supabase])

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false)

      if (error) throw error

      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)

    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }, [supabase])

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (error) throw error

      setNotifications(prev => {
        const notification = prev.find(n => n.id === notificationId)
        if (notification && !notification.is_read) {
          setUnreadCount(count => Math.max(0, count - 1))
        }
        return prev.filter(n => n.id !== notificationId)
      })

    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }, [supabase])

  // Create notification (mainly for system use)
  const createNotification = useCallback(async (
    userId: string,
    type: string,
    title: string,
    body: string,
    metadata?: any
  ) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          body,
          metadata
        })

      if (error) throw error

    } catch (error) {
      console.error('Error creating notification:', error)
    }
  }, [supabase])

  // Set up real-time subscription
  useEffect(() => {
    const { data: { user } } = supabase.auth.getUser()
    
    user.then((userData) => {
      if (!userData.user) return

      const channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userData.user.id}`
          },
          (payload) => {
            const newNotification = payload.new as Notification
            
            // Add to notifications list
            setNotifications(prev => [newNotification, ...prev])
            
            // Increment unread count
            if (!newNotification.is_read) {
              setUnreadCount(prev => prev + 1)
            }
            
            // Show toast notification
            toast({
              title: newNotification.title,
              description: newNotification.body,
            })
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    })
  }, [supabase, toast])

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_proposal':
        return 'MessageSquare'
      case 'proposal_accepted':
        return 'CheckCircle'
      case 'payment_confirmed':
        return 'DollarSign'
      case 'new_message':
        return 'MessageCircle'
      case 'new_review':
        return 'Star'
      case 'refund_requested':
        return 'RefreshCw'
      default:
        return 'Bell'
    }
  }

  // Get notification action based on type
  const getNotificationAction = (notification: Notification) => {
    const { type, metadata } = notification
    
    switch (type) {
      case 'new_proposal':
        return `/dashboard/student/requests/${metadata?.request_id}`
      case 'proposal_accepted':
        return `/dashboard/teacher/proposals/${metadata?.proposal_id}`
      case 'payment_confirmed':
        return `/dashboard/student/transactions`
      case 'new_message':
        return `/dashboard/messages?conversation=${metadata?.conversation_id}`
      case 'new_review':
        return `/dashboard/reviews`
      default:
        return null
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    getNotificationIcon,
    getNotificationAction
  }
}