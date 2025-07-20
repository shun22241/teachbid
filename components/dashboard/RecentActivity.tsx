'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils/date-formatter'
import { 
  BookOpen, 
  MessageSquare, 
  DollarSign, 
  Star,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'

interface Activity {
  id: string
  type: 'request' | 'proposal' | 'payment' | 'review' | 'message'
  title: string
  description: string
  timestamp: string
  status?: 'success' | 'pending' | 'failed'
  metadata?: any
}

interface RecentActivityProps {
  activities: Activity[]
  className?: string
}

const activityIcons = {
  request: BookOpen,
  proposal: MessageSquare,
  payment: DollarSign,
  review: Star,
  message: MessageSquare,
}

const statusIcons = {
  success: CheckCircle,
  pending: Clock,
  failed: XCircle,
}

const statusColors = {
  success: 'text-green-600',
  pending: 'text-yellow-600',
  failed: 'text-red-600',
}

export function RecentActivity({ activities, className }: RecentActivityProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>最近のアクティビティ</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              まだアクティビティがありません
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activityIcons[activity.type]
              const StatusIcon = activity.status ? statusIcons[activity.status] : null
              
              return (
                <div key={activity.id} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <Icon className="h-5 w-5 text-secondary-foreground" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{activity.title}</p>
                      {StatusIcon && (
                        <StatusIcon 
                          className={`h-4 w-4 ${statusColors[activity.status!]}`} 
                        />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}