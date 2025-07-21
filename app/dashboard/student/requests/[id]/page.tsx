'use client'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatRelativeTime } from '@/lib/utils/date-formatter'
import { formatCurrency } from '@/lib/utils/fee-calculator'
import { useToast } from '@/hooks/use-toast'
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  DollarSign,
  Users,
  GraduationCap,
  FileText,
  Package,
  MessageSquare,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Pause
} from 'lucide-react'
import type { Database } from '@/types/database'

type Request = Database['public']['Tables']['requests']['Row']
type Proposal = Database['public']['Tables']['proposals']['Row'] & {
  teacher: {
    full_name: string
    avatar_url: string | null
  }
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

export default function RequestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const [request, setRequest] = useState<Request | null>(null)
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRequest() {
      try {
        const { data: requestData, error: requestError } = await supabase
          .from('requests')
          .select('*')
          .eq('id', params.id)
          .single()

        if (requestError) throw requestError

        const { data: proposalsData, error: proposalsError } = await supabase
          .from('proposals')
          .select(`
            *,
            teacher:profiles!teacher_id(full_name, avatar_url)
          `)
          .eq('request_id', params.id)
          .order('created_at', { ascending: false })

        if (proposalsError) throw proposalsError

        setRequest(requestData)
        setProposals(proposalsData as Proposal[] || [])
      } catch (error) {
        console.error('Error fetching request:', error)
        toast({
          title: 'エラー',
          description: 'リクエストの読み込みに失敗しました',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchRequest()
    }
  }, [params.id, supabase, toast])

  async function handleCancelRequest() {
    if (!request) return

    try {
      const { error } = await supabase
        .from('requests')
        .update({ status: 'cancelled' })
        .eq('id', request.id)

      if (error) throw error

      setRequest({ ...request, status: 'cancelled' })
      toast({
        title: '成功',
        description: 'リクエストをキャンセルしました'
      })
    } catch (error) {
      console.error('Error cancelling request:', error)
      toast({
        title: 'エラー',
        description: 'キャンセルに失敗しました',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          リクエストが見つかりません
        </p>
        <Button onClick={() => router.push('/dashboard/student/requests')}>
          リクエスト一覧に戻る
        </Button>
      </div>
    )
  }

  const StatusIcon = statusIcons[request.status as keyof typeof statusIcons]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">{request.title}</h1>
              <Badge 
                variant="outline" 
                className={statusColors[request.status as keyof typeof statusColors]}
              >
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusLabels[request.status as keyof typeof statusLabels]}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              作成日: {formatRelativeTime(request.created_at)}
            </p>
          </div>
        </div>

        {request.status === 'open' && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/student/requests/${request.id}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              編集
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelRequest}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              キャンセル
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>詳細説明</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{request.description}</p>
            </CardContent>
          </Card>

          {/* Requirements */}
          {((request as any).specific_requirements || (request as any).materials_needed) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  追加要件
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(request as any).specific_requirements && (
                  <div>
                    <h4 className="font-medium mb-2">特別な要望</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {(request as any).specific_requirements}
                    </p>
                  </div>
                )}
                {(request as any).materials_needed && (
                  <div>
                    <h4 className="font-medium mb-2">必要な教材・機材</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {(request as any).materials_needed}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Proposals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                提案 ({proposals.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {proposals.length > 0 ? (
                <div className="space-y-4">
                  {proposals.map((proposal) => (
                    <div key={proposal.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                            {proposal.teacher.full_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{proposal.teacher.full_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatRelativeTime(proposal.created_at)}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {formatCurrency(Number(proposal.amount))}
                        </Badge>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">
                        {proposal.message}
                      </p>
                      {proposal.status === 'pending' && request.status === 'open' && (
                        <div className="flex gap-2 mt-3">
                          <Button size="sm">承認</Button>
                          <Button variant="outline" size="sm">拒否</Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  まだ提案がありません
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>基本情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">カテゴリ:</span>
                <span className="font-medium">{request.category}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">経験レベル:</span>
                <span className="font-medium">
                  {(request as any).experience_level === 'beginner' && '初心者'}
                  {(request as any).experience_level === 'intermediate' && '中級者'}
                  {(request as any).experience_level === 'advanced' && '上級者'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">形式:</span>
                <span className="font-medium">
                  {(request as any).format === 'online' && 'オンライン'}
                  {(request as any).format === 'in_person' && '対面'}
                  {(request as any).format === 'both' && 'どちらでも'}
                </span>
              </div>

              {(request as any).location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">場所:</span>
                  <span className="font-medium">{(request as any).location}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">時間:</span>
                <span className="font-medium">{(request as any).duration_hours}時間</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">予算:</span>
                <span className="font-medium">
                  {formatCurrency(Number(request.budget_min))} - {formatCurrency(Number(request.budget_max))}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">期限:</span>
                <span className="font-medium">
                  {new Date((request as any).expires_at).toLocaleDateString('ja-JP')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          {(request as any).preferred_schedule && (
            <Card>
              <CardHeader>
                <CardTitle>希望スケジュール</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">
                  {(request as any).preferred_schedule}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}