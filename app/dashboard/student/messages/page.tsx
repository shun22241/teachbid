'use client'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useMessages } from '@/hooks/useMessages'
import { ConversationList } from '@/components/messages/ConversationList'
import { MessageList } from '@/components/messages/MessageList'
import { MessageInput } from '@/components/messages/MessageInput'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/layout/PageHeader'
import { MessageSquare, User } from 'lucide-react'

export default function StudentMessagesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const {
    conversations,
    currentConversation,
    setCurrentConversation,
    messages,
    loading: messagesLoading,
    sending,
    fetchConversations,
    fetchMessages,
    sendMessage,
    createConversation
  } = useMessages()

  // Initialize conversation if teacher ID is provided in URL
  useEffect(() => {
    async function initializeConversation() {
      const teacherId = searchParams.get('teacher')
      const requestId = searchParams.get('request')
      
      if (teacherId && currentUser) {
        try {
          const conversationId = await createConversation(
            currentUser.id,
            teacherId,
            requestId || undefined
          )
          
          if (conversationId) {
            const conversation = conversations.find(c => c.id === conversationId)
            if (conversation) {
              setCurrentConversation(conversation)
            }
          }
        } catch (error) {
          console.error('Error initializing conversation:', error)
        }
      }
    }

    if (currentUser && conversations.length > 0) {
      initializeConversation()
    }
  }, [searchParams, currentUser, conversations, createConversation, setCurrentConversation])

  // Get current user and fetch conversations
  useEffect(() => {
    async function initialize() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profile?.role !== 'student') {
          router.push('/dashboard')
          return
        }

        setCurrentUser({ ...user, ...profile })
        await fetchConversations()
      } catch (error) {
        console.error('Error initializing:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    initialize()
  }, [supabase, router, fetchConversations])

  // Fetch messages when conversation changes
  useEffect(() => {
    if (currentConversation) {
      fetchMessages(currentConversation.id)
    }
  }, [currentConversation, fetchMessages])

  const handleSelectConversation = (conversation: any) => {
    setCurrentConversation(conversation)
    // Update URL without page reload
    const url = new URL(window.location.href)
    url.searchParams.delete('teacher')
    url.searchParams.delete('request')
    window.history.replaceState({}, '', url.pathname)
  }

  const handleSendMessage = async (content: string) => {
    if (!currentConversation) return false
    return await sendMessage(currentConversation.id, content)
  }

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[400px]" />
  }

  const otherUser = currentConversation 
    ? currentConversation.teacher
    : null

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="メッセージ"
        description="講師とのやり取りを管理します"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversation List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              会話一覧
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-80px)] overflow-y-auto">
            <ConversationList
              conversations={conversations}
              currentUserId={currentUser?.id || ''}
              selectedConversationId={currentConversation?.id}
              onSelectConversation={handleSelectConversation}
            />
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col">
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={otherUser?.avatar_url || undefined} />
                    <AvatarFallback>
                      {otherUser?.full_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{otherUser?.full_name}</h3>
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">講師</span>
                    </div>
                  </div>
                  {currentConversation.request && (
                    <Badge variant="outline" className="ml-auto">
                      {currentConversation.request.title}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-0 overflow-hidden">
                {messagesLoading ? (
                  <LoadingSpinner className="h-full" />
                ) : (
                  <MessageList
                    messages={messages}
                    currentUserId={currentUser?.id || ''}
                    className="h-full"
                  />
                )}
              </CardContent>

              {/* Message Input */}
              <MessageInput
                onSendMessage={handleSendMessage}
                disabled={sending}
              />
            </>
          ) : (
            <CardContent className="flex-1 p-0">
              <EmptyState
                icon={<MessageSquare className="h-12 w-12" />}
                title="会話を選択してください"
                description="左側の会話一覧から会話を選択してメッセージを開始できます"
              />
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}