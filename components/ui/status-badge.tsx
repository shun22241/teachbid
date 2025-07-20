import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Pause,
  RefreshCw
} from 'lucide-react'

interface StatusBadgeProps {
  status: string
  type?: 'request' | 'proposal' | 'transaction' | 'user'
  className?: string
  showIcon?: boolean
}

export function StatusBadge({ 
  status, 
  type = 'request', 
  className,
  showIcon = false 
}: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (type) {
      case 'request':
        return getRequestStatusConfig(status)
      case 'proposal':
        return getProposalStatusConfig(status)
      case 'transaction':
        return getTransactionStatusConfig(status)
      case 'user':
        return getUserStatusConfig(status)
      default:
        return getRequestStatusConfig(status)
    }
  }

  const config = getStatusConfig()

  return (
    <Badge 
      variant={config.variant} 
      className={cn(config.className, className)}
    >
      {showIcon && config.icon && (
        <config.icon className="h-3 w-3 mr-1" />
      )}
      {config.label}
    </Badge>
  )
}

function getRequestStatusConfig(status: string) {
  switch (status) {
    case 'open':
      return {
        variant: 'secondary' as const,
        className: 'bg-green-100 text-green-800 border-green-200',
        label: '募集中',
        icon: Clock
      }
    case 'in_progress':
      return {
        variant: 'default' as const,
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        label: '進行中',
        icon: RefreshCw
      }
    case 'completed':
      return {
        variant: 'default' as const,
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        label: '完了',
        icon: CheckCircle
      }
    case 'cancelled':
      return {
        variant: 'destructive' as const,
        className: 'bg-red-100 text-red-800 border-red-200',
        label: 'キャンセル',
        icon: XCircle
      }
    case 'expired':
      return {
        variant: 'secondary' as const,
        className: 'bg-orange-100 text-orange-800 border-orange-200',
        label: '期限切れ',
        icon: Pause
      }
    default:
      return {
        variant: 'outline' as const,
        className: '',
        label: status,
        icon: undefined
      }
  }
}

function getProposalStatusConfig(status: string) {
  switch (status) {
    case 'pending':
      return {
        variant: 'secondary' as const,
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        label: '審査中',
        icon: Clock
      }
    case 'accepted':
      return {
        variant: 'default' as const,
        className: 'bg-green-100 text-green-800 border-green-200',
        label: '承認',
        icon: CheckCircle
      }
    case 'rejected':
      return {
        variant: 'destructive' as const,
        className: 'bg-red-100 text-red-800 border-red-200',
        label: '却下',
        icon: XCircle
      }
    default:
      return {
        variant: 'outline' as const,
        className: '',
        label: status,
        icon: undefined
      }
  }
}

function getTransactionStatusConfig(status: string) {
  switch (status) {
    case 'pending':
      return {
        variant: 'secondary' as const,
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        label: '保留中',
        icon: Clock
      }
    case 'completed':
      return {
        variant: 'default' as const,
        className: 'bg-green-100 text-green-800 border-green-200',
        label: '完了',
        icon: CheckCircle
      }
    case 'refunded':
      return {
        variant: 'destructive' as const,
        className: 'bg-red-100 text-red-800 border-red-200',
        label: '返金済み',
        icon: RefreshCw
      }
    case 'failed':
      return {
        variant: 'destructive' as const,
        className: 'bg-red-100 text-red-800 border-red-200',
        label: '失敗',
        icon: XCircle
      }
    default:
      return {
        variant: 'outline' as const,
        className: '',
        label: status,
        icon: undefined
      }
  }
}

function getUserStatusConfig(status: string) {
  switch (status) {
    case 'active':
      return {
        variant: 'default' as const,
        className: 'bg-green-100 text-green-800 border-green-200',
        label: 'アクティブ',
        icon: CheckCircle
      }
    case 'inactive':
      return {
        variant: 'secondary' as const,
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        label: '非アクティブ',
        icon: Pause
      }
    case 'suspended':
      return {
        variant: 'destructive' as const,
        className: 'bg-red-100 text-red-800 border-red-200',
        label: '停止中',
        icon: XCircle
      }
    case 'pending':
      return {
        variant: 'secondary' as const,
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        label: '承認待ち',
        icon: Clock
      }
    default:
      return {
        variant: 'outline' as const,
        className: '',
        label: status,
        icon: undefined
      }
  }
}