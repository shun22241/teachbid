'use client'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ProposalForm } from '@/components/proposals/ProposalForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils/fee-calculator'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Clock, DollarSign, MapPin, User } from 'lucide-react'
import type { Database } from '@/types/database'
import type { ProposalCreateData } from '@/lib/utils/validation-schemas'

type Request = Database['public']['Tables']['requests']['Row'] & {
  student: {
    full_name: string
    avatar_url: string | null
  }
}

export default function ProposalPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const [request, setRequest] = useState<Request | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchRequest() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Check if user already has a proposal for this request
        const { data: existingProposal } = await supabase
          .from('proposals')
          .select('id')
          .eq('request_id', params.id)
          .eq('teacher_id', user.id)
          .single()

        if (existingProposal) {
          toast({
            title: 'エラー',
            description: 'このリクエストには既に提案済みです',
            variant: 'destructive'
          })
          router.push(`/dashboard/teacher/browse/${params.id}`)
          return
        }

        const { data: requestData, error: requestError } = await supabase
          .from('requests')
          .select(`
            *,
            student:profiles!student_id(full_name, avatar_url)
          `)
          .eq('id', params.id)
          .single()

        if (requestError) throw requestError

        if (requestData.status !== 'open') {
          toast({
            title: 'エラー',
            description: 'このリクエストは既に終了しています',
            variant: 'destructive'
          })
          router.push(`/dashboard/teacher/browse/${params.id}`)
          return
        }

        // Check if this is user's own request
        if (requestData.student_id === user.id) {
          toast({
            title: 'エラー',
            description: '自分のリクエストには提案できません',
            variant: 'destructive'
          })
          router.push('/dashboard/teacher/browse')
          return
        }

        setRequest(requestData as Request)
      } catch (error) {
        console.error('Error fetching request:', error)
        toast({
          title: 'エラー',
          description: 'リクエストの読み込みに失敗しました',
          variant: 'destructive'
        })
        router.push('/dashboard/teacher/browse')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchRequest()
    }
  }, [params.id, supabase, toast, router])

  async function handleSubmit(data: ProposalCreateData) {
    if (!request) return

    setSubmitting(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast({
          title: 'エラー',
          description: 'ログインが必要です',
          variant: 'destructive'
        })
        return
      }

      const proposalData = {
        request_id: request.id,
        teacher_id: user.id,
        amount: data.amount,
        message: data.message,
        lesson_plan: data.lessonPlan,
        estimated_duration: (data as any).estimatedDuration || null,
        availability: (data as any).availability || null,
        status: 'pending' as const
      }

      const { error } = await supabase
        .from('proposals')
        .insert(proposalData)

      if (error) throw error

      // Create notification for student
      await supabase
        .from('notifications')
        .insert({
          user_id: request.student_id,
          type: 'proposal',
          title: '新しい提案が届きました',
          body: `「${request.title}」に新しい提案が届きました。`,
          metadata: {
            request_id: request.id,
            teacher_id: user.id
          }
        })

      toast({
        title: '成功',
        description: '提案を送信しました。生徒からの返信をお待ちください。'
      })

      router.push('/dashboard/teacher/proposals')
    } catch (error) {
      console.error('Error creating proposal:', error)
      toast({
        title: 'エラー',
        description: '提案の送信に失敗しました',
        variant: 'destructive'
      })
    } finally {
      setSubmitting(false)
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
        <Button onClick={() => router.push('/dashboard/teacher/browse')}>
          リクエスト一覧に戻る
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
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
          <h1 className="text-3xl font-bold tracking-tight">提案を作成</h1>
          <p className="text-muted-foreground">
            リクエストの詳細を確認して提案を送信してください
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Request Summary */}
        <div className="lg:col-span-3">
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
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  {request.student.full_name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{request.student.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(request as any).experience_level === 'beginner' ? '初心者' :
                     (request as any).experience_level === 'intermediate' ? '中級者' : '上級者'}
                  </p>
                </div>
              </div>

              {/* Request Title */}
              <div>
                <h3 className="font-semibold mb-2">{request.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {request.description}
                </p>
              </div>

              {/* Key Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">{request.category}</Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {(request as any).format === 'online' ? 'オンライン' :
                     (request as any).format === 'in_person' ? '対面' : 'どちらでも'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{(request as any).duration_hours}時間</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {formatCurrency(Number(request.budget_min))} - {formatCurrency(Number(request.budget_max))}
                  </span>
                </div>
              </div>

              {/* Schedule */}
              {request.preferred_schedule && (
                <div>
                  <h4 className="font-medium mb-2">希望スケジュール</h4>
                  <p className="text-sm text-muted-foreground">
                    {JSON.stringify((request as any).preferred_schedule)}
                  </p>
                </div>
              )}

              {/* Requirements */}
              {(request as any).specific_requirements && (
                <div>
                  <h4 className="font-medium mb-2">特別な要望</h4>
                  <p className="text-sm text-muted-foreground">
                    {(request as any).specific_requirements}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Proposal Form */}
        <div className="lg:col-span-4">
          <ProposalForm
            onSubmit={handleSubmit}
            loading={submitting}
            budgetMin={Number(request.budget_min)}
            budgetMax={Number(request.budget_max)}
            durationHours={(request as any).duration_hours}
          />
        </div>
      </div>
    </div>
  )
}