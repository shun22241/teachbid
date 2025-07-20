'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatRelativeTime } from '@/lib/utils/date-formatter'
import { MessageSquare, User } from 'lucide-react'

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

interface ConversationListProps {
  conversations: Conversation[]
  currentUserId: string
  selectedConversationId?: string
  onSelectConversation: (conversation: Conversation) => void
  className?: string
}

export function ConversationList({ 
  conversations, 
  currentUserId,
  selectedConversationId,
  onSelectConversation,
  className 
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center h-full p-8', className)}>
        <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          会話がありません
        </h3>
        <p className="text-sm text-muted-foreground text-center">
          リクエストに提案が届いたり、講師にメッセージを送ると会話が始まります
        </p>
      </div>
    )
  }

  return (
    <div className={cn('divide-y divide-border', className)}>
      {conversations.map((conversation) => {
        // Determine the other user (not current user)
        const isStudent = currentUserId === conversation.student_id
        const otherUser = isStudent ? conversation.teacher : conversation.student
        const isSelected = selectedConversationId === conversation.id

        return (
          <Button
            key={conversation.id}
            variant="ghost"
            className={cn(
              'w-full h-auto p-4 justify-start hover:bg-muted/50 transition-colors',
              isSelected && 'bg-muted'
            )}
            onClick={() => onSelectConversation(conversation)}
          >
            <div className="flex items-start space-x-3 w-full">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={otherUser.avatar_url || undefined} />
                <AvatarFallback>
                  {otherUser.full_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {otherUser.full_name}
                    </h4>
                    <div className="flex items-center space-x-1 mt-1">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {isStudent ? '講師' : '学生'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-1">
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(conversation.last_message_at)}
                    </span>
                    {conversation.unread_count && conversation.unread_count > 0 && (
                      <Badge variant="destructive" className="h-5 min-w-[20px] text-xs">
                        {conversation.unread_count > 99 ? '99+' : conversation.unread_count}
                      </Badge>
                    )}
                  </div>
                </div>

                {conversation.request && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground truncate">
                      関連リクエスト: {conversation.request.title}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Button>
        )
      })}
    </div>
  )
}