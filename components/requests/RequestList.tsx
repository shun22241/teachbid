'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatRelativeTime } from '@/lib/utils/date-formatter'
import { formatCurrency } from '@/lib/utils/fee-calculator'
import { useRouter } from 'next/navigation'
import {
  Clock,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  CheckCircle,
  XCircle,
  Pause
} from 'lucide-react'
import type { Database } from '@/types/database'

type Request = Database['public']['Tables']['requests']['Row']

interface RequestListProps {
  requests: Request[]
  showStatus?: boolean
  className?: string
}

const statusColors = {
  open: 'bg-green-100 text-green-800 border-green-200',
  in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-gray-100 text-gray-800 border-gray-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  expired: 'bg-orange-100 text-orange-800 border-orange-200'
}

const statusIcons = {
  open: Clock,
  in_progress: Users,
  completed: CheckCircle,
  cancelled: XCircle,
  expired: Pause
}

const statusLabels = {
  open: '募集中',
  in_progress: '進行中',
  completed: '完了',
  cancelled: 'キャンセル',
  expired: '期限切れ'
}

export function RequestList({ requests, showStatus = false, className }: RequestListProps) {
  const router = useRouter()

  if (requests.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-muted-foreground">
          リクエストがありません
        </p>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {requests.map((request) => {
        const StatusIcon = statusIcons[request.status as keyof typeof statusIcons]
        
        return (
          <Card key={request.id} className="transition-colors hover:bg-muted/50">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">
                    {request.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {(request as any).format === 'online' ? 'オンライン' : '対面'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatRelativeTime(request.created_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {(request as any).duration_hours}時間
                    </div>
                  </div>
                </div>
                {showStatus && (
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={statusColors[request.status as keyof typeof statusColors]}
                    >
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusLabels[request.status as keyof typeof statusLabels]}
                    </Badge>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {request.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">予算:</span>
                    <span className="ml-1 font-semibold">
                      {formatCurrency(Number(request.budget_min))} - {formatCurrency(Number(request.budget_max))}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">カテゴリ:</span>
                    <span className="ml-1 font-medium">
                      {request.category}
                    </span>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/dashboard/student/requests/${request.id}`)}
                >
                  詳細を見る
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}