'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Elements } from '@stripe/react-stripe-js'
import { createClient } from '@/lib/supabase/client'
import { getStripe } from '@/lib/stripe/client'
import { PaymentForm } from '@/components/payments/PaymentForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, User, MessageSquare, Clock, MapPin } from 'lucide-react'
import type { Database } from '@/types/database'

type Proposal = Database['public']['Tables']['proposals']['Row'] & {
  teacher: {
    full_name: string
    avatar_url: string | null
    bio: string | null
  }
  request: {
    title: string
    description: string
    format: string
    duration_hours: number
    location: string | null
  }
}

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentDetails, setPaymentDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProposalAndCreatePayment() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        // Get proposal details
        const { data: proposalData, error: proposalError } = await supabase
          .from('proposals')
          .select(`
            *,
            teacher:profiles!teacher_id(full_name, avatar_url, bio),
            request:requests!request_id(title, description, format, duration_hours, location, student_id)
          `)
          .eq('id', params.proposalId)
          .single()

        if (proposalError) throw proposalError

        // Verify user is the student
        if (proposalData.request.student_id !== user.id) {
          toast({
            title: 'エラー',
            description: 'このページにアクセスする権限がありません',
            variant: 'destructive'
          })
          router.push('/dashboard/student/requests')
          return
        }

        // Verify proposal is pending
        if (proposalData.status !== 'pending') {
          toast({
            title: 'エラー',
            description: 'この提案は決済できません',
            variant: 'destructive'
          })
          router.push(`/dashboard/student/requests/${params.id}`)
          return
        }

        setProposal(proposalData as Proposal)

        // Create payment intent
        const response = await fetch('/api/payments/intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            proposalId: params.proposalId,
          }),
        })

        if (!response.ok) {
          const { error } = await response.json()
          throw new Error(error || 'Failed to create payment intent')
        }

        const paymentData = await response.json()
        setClientSecret(paymentData.client_secret)
        setPaymentDetails(paymentData)

      } catch (error) {
        console.error('Error:', error)
        toast({
          title: 'エラー',
          description: error instanceof Error ? error.message : '決済の準備に失敗しました',
          variant: 'destructive'
        })
        router.push(`/dashboard/student/requests/${params.id}`)
      } finally {
        setLoading(false)
      }
    }

    if (params.proposalId) {
      fetchProposalAndCreatePayment()
    }
  }, [params.proposalId, params.id, supabase, router, toast])

  const handlePaymentSuccess = (proposalId: string) => {
    router.push(`/dashboard/student/requests/${params.id}?payment=success`)
  }

  const handleCancel = () => {
    router.push(`/dashboard/student/requests/${params.id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!proposal || !clientSecret || !paymentDetails) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          決済情報の読み込みに失敗しました
        </p>
        <Button onClick={() => router.push(`/dashboard/student/requests/${params.id}`)}>
          リクエスト詳細に戻る
        </Button>
      </div>
    )
  }

  const stripePromise = getStripe()

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
          <h1 className="text-3xl font-bold tracking-tight">決済手続き</h1>
          <p className="text-muted-foreground">
            選択した講師への決済を行います
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Payment Form */}
        <div className="lg:col-span-4">
          <Elements 
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'stripe',
                variables: {
                  colorPrimary: 'hsl(var(--primary))',
                },
              },
            }}
          >
            <PaymentForm
              proposalId={proposal.id}
              amount={paymentDetails.amount}
              proposalFee={paymentDetails.proposal_fee}
              teacherFee={paymentDetails.teacher_fee}
              onSuccess={handlePaymentSuccess}
              onCancel={handleCancel}
            />
          </Elements>
        </div>

        {/* Proposal Summary */}
        <div className="lg:col-span-3 space-y-6">
          {/* Request Info */}
          <Card>
            <CardHeader>
              <CardTitle>リクエスト詳細</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{proposal.request.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {proposal.request.description}
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {proposal.request.format === 'online' ? 'オンライン' :
                     proposal.request.format === 'in_person' ? '対面' : 'どちらでも'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{proposal.request.duration_hours}時間</span>
                </div>
                {proposal.request.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{proposal.request.location}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Teacher Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                選択した講師
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  {proposal.teacher.full_name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{proposal.teacher.full_name}</p>
                  <Badge variant="outline">講師</Badge>
                </div>
              </div>
              
              {proposal.teacher.bio && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {proposal.teacher.bio}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Proposal Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                提案内容
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">提案金額</h4>
                <p className="text-2xl font-bold text-primary">
                  ¥{Number(proposal.amount).toLocaleString()}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">メッセージ</h4>
                <p className="text-sm text-muted-foreground line-clamp-4">
                  {proposal.message}
                </p>
              </div>
              
              {proposal.lesson_plan && (
                <div>
                  <h4 className="font-medium mb-2">レッスンプラン</h4>
                  <p className="text-sm text-muted-foreground line-clamp-4">
                    {proposal.lesson_plan}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}