'use client'

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
  User,
  Star,
  CheckCircle
} from 'lucide-react'
import type { Database } from '@/types/database'

type Request = Database['public']['Tables']['requests']['Row'] & {
  student: {
    full_name: string
    avatar_url: string | null
  }
}

type Proposal = Database['public']['Tables']['proposals']['Row'] & {
  teacher: {
    full_name: string
    avatar_url: string | null
  }
}

export default function TeacherRequestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const [request, setRequest] = useState<Request | null>(null)
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [userProposal, setUserProposal] = useState<Proposal | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRequest() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: requestData, error: requestError } = await supabase
          .from('requests')
          .select(`
            *,
            student:profiles!student_id(full_name, avatar_url)
          `)
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

        // Find user's proposal
        const myProposal = proposalsData?.find(p => p.teacher_id === user.id)

        setRequest(requestData as Request)
        setProposals(proposalsData as Proposal[] || [])
        setUserProposal(myProposal as Proposal || null)
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
        <Button onClick={() => router.push('/dashboard/teacher/browse')}>
          リクエスト一覧に戻る
        </Button>
      </div>
    )
  }

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
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                募集中
              </Badge>
            </div>
            <p className="text-muted-foreground">
              投稿日: {formatRelativeTime(request.created_at)}
            </p>
          </div>
        </div>

        {!userProposal && request.status === 'open' && (
          <Button
            onClick={() => router.push(`/dashboard/teacher/browse/${request.id}/proposal`)}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            提案する
          </Button>
        )}

        {userProposal && (
          <Badge variant="secondary">
            提案済み
          </Badge>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                生徒情報
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  {request.student.full_name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{request.student.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    経験レベル: {
                      request.experience_level === 'beginner' ? '初心者' :
                      request.experience_level === 'intermediate' ? '中級者' : '上級者'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

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
          {(request.specific_requirements || request.materials_needed) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  追加要件
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {request.specific_requirements && (
                  <div>
                    <h4 className="font-medium mb-2">特別な要望</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {request.specific_requirements}
                    </p>
                  </div>
                )}
                {request.materials_needed && (
                  <div>
                    <h4 className="font-medium mb-2">必要な教材・機材</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {request.materials_needed}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Other Proposals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                他の提案 ({proposals.length})
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
                            <p className="font-medium">
                              {proposal.teacher_id === (await supabase.auth.getUser()).data.user?.id 
                                ? 'あなた' 
                                : proposal.teacher.full_name
                              }
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatRelativeTime(proposal.created_at)}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {formatCurrency(Number(proposal.proposed_fee))}
                        </Badge>
                      </div>
                      {proposal.teacher_id === (await supabase.auth.getUser()).data.user?.id ? (
                        <p className="text-sm bg-muted p-3 rounded">
                          {proposal.message}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          他の講師の提案内容は表示されません
                        </p>
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
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">形式:</span>
                <span className="font-medium">
                  {request.format === 'online' && 'オンライン'}
                  {request.format === 'in_person' && '対面'}
                  {request.format === 'both' && 'どちらでも'}
                </span>
              </div>

              {request.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">場所:</span>
                  <span className="font-medium">{request.location}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">時間:</span>
                <span className="font-medium">{request.duration_hours}時間</span>
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
                  {new Date(request.expires_at).toLocaleDateString('ja-JP')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          {request.preferred_schedule && (
            <Card>
              <CardHeader>
                <CardTitle>希望スケジュール</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">
                  {request.preferred_schedule}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Button */}
          {!userProposal && request.status === 'open' && (
            <Button
              className="w-full"
              size="lg"
              onClick={() => router.push(`/dashboard/teacher/browse/${request.id}/proposal`)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              提案を送信
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}