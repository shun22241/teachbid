'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatRelativeTime } from '@/lib/utils/date-formatter'
import { 
  MessageSquare, 
  CheckCircle, 
  DollarSign, 
  MessageCircle, 
  Star, 
  RefreshCw, 
  Bell,
  X
} from 'lucide-react'

interface NotificationItemProps {
  notification: {
    id: string
    type: string
    title: string
    body: string
    is_read: boolean
    created_at: string
  }
  onClick?: () => void
  onDelete?: () => void
  icon?: string
  className?: string
}

const iconMap = {
  MessageSquare,
  CheckCircle,
  DollarSign,
  MessageCircle,
  Star,
  RefreshCw,
  Bell
}

export function NotificationItem({ 
  notification, 
  onClick, 
  onDelete,
  icon = 'Bell',
  className 
}: NotificationItemProps) {
  const Icon = iconMap[icon as keyof typeof iconMap] || Bell

  const iconColorMap: Record<string, string> = {
    new_proposal: 'text-blue-600',
    proposal_accepted: 'text-green-600',
    payment_confirmed: 'text-green-600',
    new_message: 'text-purple-600',
    new_review: 'text-yellow-600',
    refund_requested: 'text-red-600',
  }

  return (
    <div
      className={cn(
        'flex items-start space-x-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer relative group',
        !notification.is_read && 'bg-blue-50/50',
        className
      )}
      onClick={onClick}
    >
      <div className={cn(
        'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
        notification.is_read ? 'bg-muted' : 'bg-blue-100'
      )}>
        <Icon className={cn('h-5 w-5', iconColorMap[notification.type] || 'text-muted-foreground')} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className={cn(
              'text-sm font-medium',
              !notification.is_read && 'font-semibold'
            )}>
              {notification.title}
            </h4>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {notification.body}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatRelativeTime(notification.created_at)}
            </p>
          </div>
          
          {!notification.is_read && (
            <div className="ml-2 flex-shrink-0">
              <div className="w-2 h-2 bg-blue-600 rounded-full" />
            </div>
          )}
        </div>
      </div>
      
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}