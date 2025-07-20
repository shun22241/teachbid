'use client'

import { useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { formatRelativeTime } from '@/lib/utils/date-formatter'

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

interface MessageListProps {
  messages: Message[]
  currentUserId: string
  className?: string
}

export function MessageList({ messages, currentUserId, className }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className={cn('flex items-center justify-center h-full', className)}>
        <div className="text-center">
          <p className="text-muted-foreground">まだメッセージがありません</p>
          <p className="text-sm text-muted-foreground mt-1">
            最初のメッセージを送信してください
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col space-y-4 p-4 overflow-y-auto', className)}>
      {messages.map((message) => {
        const isOwnMessage = message.sender_id === currentUserId
        
        return (
          <div
            key={message.id}
            className={cn(
              'flex items-start space-x-2',
              isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''
            )}
          >
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={message.sender.avatar_url || undefined} />
              <AvatarFallback>
                {message.sender.full_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className={cn('flex flex-col', isOwnMessage ? 'items-end' : 'items-start')}>
              <div
                className={cn(
                  'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
                  isOwnMessage
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <p className="text-sm whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              </div>
              
              <div className={cn('flex items-center space-x-1 mt-1')}>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(message.created_at)}
                </span>
                {isOwnMessage && (
                  <span className="text-xs text-muted-foreground">
                    {message.is_read ? '既読' : '未読'}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
      <div ref={messagesEndRef} />
    </div>
  )
}