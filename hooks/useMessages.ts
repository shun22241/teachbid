'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: string
  attachment_url: string | null
  is_read: boolean
  created_at: string
  sender: {
    full_name: string
    avatar_url: string | null
  }
}

interface Conversation {
  id: string
  request_id: string | null
  student_id: string
  teacher_id: string
  status: string
  last_message_at: string
  created_at: string
  request?: {
    title: string
  }
  student: {
    full_name: string
    avatar_url: string | null
  }
  teacher: {
    full_name: string
    avatar_url: string | null
  }
  unread_count?: number
}

export function useMessages() {
  const supabase = createClient()
  const { toast } = useToast()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)

  // Fetch conversations for current user
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          request:requests(title),
          student:profiles!student_id(full_name, avatar_url),
          teacher:profiles!teacher_id(full_name, avatar_url)
        `)
        .or(`student_id.eq.${user.id},teacher_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false })

      if (error) throw error

      // Get unread message counts
      const conversationsWithUnread = await Promise.all(
        (data || []).map(async (conversation) => {
          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conversation.id)
            .eq('is_read', false)
            .neq('sender_id', user.id)

          return {
            ...conversation,
            unread_count: count || 0
          }
        })
      )

      setConversations(conversationsWithUnread)
    } catch (error) {
      console.error('Error fetching conversations:', error)
      toast({
        title: 'エラー',
        description: '会話の取得に失敗しました',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [supabase, toast])

  // Fetch messages for a specific conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!sender_id(full_name, avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])

      // Mark messages as read
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.rpc('mark_messages_as_read', {
          p_conversation_id: conversationId,
          p_user_id: user.id
        })
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast({
        title: 'エラー',
        description: 'メッセージの取得に失敗しました',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [supabase, toast])

  // Send a new message
  const sendMessage = useCallback(async (conversationId: string, content: string) => {
    try {
      setSending(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim(),
          message_type: 'text'
        })

      if (error) throw error

      // Refresh messages and conversations
      await fetchMessages(conversationId)
      await fetchConversations()

      return true
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: 'エラー',
        description: 'メッセージの送信に失敗しました',
        variant: 'destructive'
      })
      return false
    } finally {
      setSending(false)
    }
  }, [supabase, toast, fetchMessages, fetchConversations])

  // Create or get conversation
  const createConversation = useCallback(async (
    studentId: string, 
    teacherId: string, 
    requestId?: string
  ) => {
    try {
      const { data, error } = await supabase.rpc('get_or_create_conversation', {
        p_student_id: studentId,
        p_teacher_id: teacherId,
        p_request_id: requestId || null
      })

      if (error) throw error
      
      await fetchConversations()
      return data
    } catch (error) {
      console.error('Error creating conversation:', error)
      toast({
        title: 'エラー',
        description: '会話の作成に失敗しました',
        variant: 'destructive'
      })
      return null
    }
  }, [supabase, toast, fetchConversations])

  // Set up real-time subscriptions
  useEffect(() => {
    async function setupSubscriptions() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      // Subscribe to new messages
      const messagesChannel = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages'
          },
          (payload) => {
            const newMessage = payload.new as any
            
            // If the message is for the current conversation, add it to messages
            if (currentConversation && newMessage.conversation_id === currentConversation.id) {
              fetchMessages(currentConversation.id)
            }
            
            // Refresh conversations to update last message and unread counts
            fetchConversations()
          }
        )
        .subscribe()

      // Subscribe to conversation updates
      const conversationsChannel = supabase
        .channel('conversations')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'conversations'
          },
          () => {
            fetchConversations()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(messagesChannel)
        supabase.removeChannel(conversationsChannel)
      }
    }
    
    setupSubscriptions()
  }, [supabase, currentConversation, fetchMessages, fetchConversations])

  return {
    conversations,
    currentConversation,
    setCurrentConversation,
    messages,
    loading,
    sending,
    fetchConversations,
    fetchMessages,
    sendMessage,
    createConversation
  }
}