'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatRelativeTime } from '@/lib/utils/date-formatter'
import { formatCurrency, calculateTeacherFee } from '@/lib/utils/fee-calculator'
import { useToast } from '@/hooks/use-toast'
import {
  ArrowLeft,
  User,
  MessageSquare,
  FileText,
  DollarSign,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  Trash2,
  MapPin,
  GraduationCap
} from 'lucide-react'
import type { Database } from '@/types/database'

type Proposal = Database['public']['Tables']['proposals']['Row'] & {
  request: {
    title: string
    description: string
    category: string
    format: string
    location: string | null
    budget_min: number
    budget_max: number
    duration_hours: number
    preferred_schedule: string | null
    specific_requirements: string | null
    materials_needed: string | null
    experience_level: string
    status: string
    student: {
      full_name: string
      avatar_url: string | null
    }
  }
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  accepted: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  withdrawn: 'bg-gray-100 text-gray-800 border-gray-200'
}

const statusIcons = {
  pending: Clock,
  accepted: CheckCircle,
  rejected: XCircle,
  withdrawn: XCircle
}

const statusLabels = {
  pending: '審査中',
  accepted: '承認済み',
  rejected: '却下',
  withdrawn: '取り下げ'
}

export default function ProposalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProposal() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from('proposals')
          .select(`
            *,
            request:requests!inner(
              title,
              description,
              category,
              format,
              location,
              budget_min,
              budget_max,
              duration_hours,
              preferred_schedule,
              specific_requirements,
              materials_needed,
              experience_level,
              status,
              student:profiles!student_id(full_name, avatar_url)
            )
          `)
          .eq('id', params.id)
          .eq('teacher_id', user.id)
          .single()

        if (error) throw error

        setProposal(data as Proposal)
      } catch (error) {
        console.error('Error fetching proposal:', error)
        toast({
          title: 'エラー',
          description: '提案の読み込みに失敗しました',
          variant: 'destructive'
        })
        router.push('/dashboard/teacher/proposals')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProposal()
    }
  }, [params.id, supabase, toast, router])

  async function handleWithdrawProposal() {
    if (!proposal) return

    try {
      const { error } = await supabase
        .from('proposals')
        .update({ status: 'withdrawn' })
        .eq('id', proposal.id)

      if (error) throw error

      setProposal({ ...proposal, status: 'withdrawn' })
      toast({
        title: '成功',
        description: '提案を取り下げました'
      })
    } catch (error) {
      console.error('Error withdrawing proposal:', error)
      toast({
        title: 'エラー',
        description: '提案の取り下げに失敗しました',
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

  if (!proposal) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          提案が見つかりません
        </p>
        <Button onClick={() => router.push('/dashboard/teacher/proposals')}>
          提案一覧に戻る
        </Button>
      </div>
    )
  }

  const StatusIcon = statusIcons[proposal.status as keyof typeof statusIcons]
  const teacherFee = calculateTeacherFee(Number(proposal.proposed_fee))

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
              <h1 className="text-3xl font-bold tracking-tight">提案詳細</h1>
              <Badge 
                variant="outline" 
                className={statusColors[proposal.status as keyof typeof statusColors]}
              >
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusLabels[proposal.status as keyof typeof statusLabels]}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              送信日: {formatRelativeTime(proposal.created_at)}
            </p>
          </div>
        </div>

        {proposal.status === 'pending' && (
          <Button
            variant="destructive"
            onClick={handleWithdrawProposal}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            提案を取り下げ
          </Button>
        )}

        {proposal.status === 'accepted' && proposal.request.status === 'in_progress' && (
          <Button
            onClick={() => router.push(`/dashboard/teacher/sessions/${proposal.id}`)}
          >
            セッション開始
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                リクエスト詳細
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Student Info */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  {proposal.request.student.full_name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{proposal.request.student.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    経験レベル: {
                      proposal.request.experience_level === 'beginner' ? '初心者' :
                      proposal.request.experience_level === 'intermediate' ? '中級者' : '上級者'
                    }
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{proposal.request.title}</h3>
                <p className="whitespace-pre-wrap text-sm">
                  {proposal.request.description}
                </p>
              </div>

              {/* Requirements */}
              {(proposal.request.specific_requirements || proposal.request.materials_needed) && (
                <div className="space-y-3">
                  <Separator />
                  {proposal.request.specific_requirements && (
                    <div>
                      <h4 className="font-medium mb-2">特別な要望</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {proposal.request.specific_requirements}
                      </p>
                    </div>
                  )}
                  {proposal.request.materials_needed && (
                    <div>
                      <h4 className="font-medium mb-2">必要な教材・機材</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {proposal.request.materials_needed}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Your Proposal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                あなたの提案
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">提案メッセージ</h4>
                <p className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-lg">
                  {proposal.message}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">レッスンプラン</h4>
                <p className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-lg">
                  {proposal.lesson_plan}
                </p>
              </div>

              {proposal.availability && (
                <div>
                  <h4 className="font-medium mb-2">対応可能時間</h4>
                  <p className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-lg">
                    {proposal.availability}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Proposal Summary */}
          <Card>
            <CardHeader>
              <CardTitle>提案サマリー</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">提案金額:</span>
                <span className="font-medium">
                  {formatCurrency(Number(proposal.proposed_fee))}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">受取予定額:</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(teacherFee)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">指導時間:</span>
                <span className="font-medium">
                  {proposal.estimated_duration}時間
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">送信日:</span>
                <span className="font-medium">
                  {new Date(proposal.created_at).toLocaleDateString('ja-JP')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Request Info */}
          <Card>
            <CardHeader>
              <CardTitle>リクエスト情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">カテゴリ:</span>
                <span className="font-medium">{proposal.request.category}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">形式:</span>
                <span className="font-medium">
                  {proposal.request.format === 'online' && 'オンライン'}
                  {proposal.request.format === 'in_person' && '対面'}
                  {proposal.request.format === 'both' && 'どちらでも'}
                </span>
              </div>

              {proposal.request.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">場所:</span>
                  <span className="font-medium">{proposal.request.location}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">予算:</span>
                <span className="font-medium">
                  {formatCurrency(proposal.request.budget_min)} - {formatCurrency(proposal.request.budget_max)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">希望時間:</span>
                <span className="font-medium">{proposal.request.duration_hours}時間</span>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          {proposal.request.preferred_schedule && (
            <Card>
              <CardHeader>
                <CardTitle>希望スケジュール</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">
                  {proposal.request.preferred_schedule}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}