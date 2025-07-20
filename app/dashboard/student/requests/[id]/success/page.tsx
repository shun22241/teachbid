'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  ArrowRight, 
  MessageSquare, 
  Calendar,
  User,
  MapPin,
  Clock
} from 'lucide-react'

interface RequestWithProposal {
  id: string
  title: string
  description: string
  format: string
  duration_hours: number
  location: string | null
  status: string
  proposals: Array<{
    id: string
    teacher_id: string
    status: string
    proposed_fee: number
    message: string
    teacher: {
      full_name: string
      bio: string | null
    }
  }>
  transactions: Array<{
    id: string
    amount: number
    teacher_fee_amount: number
    platform_fee_amount: number
    status: string
    created_at: string
  }>
}

export default function PaymentSuccessPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [request, setRequest] = useState<RequestWithProposal | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRequest() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const { data: requestData, error } = await supabase
          .from('requests')
          .select(`
            *,
            proposals!inner(
              *,
              teacher:profiles!teacher_id(full_name, bio)
            ),
            transactions(*)
          `)
          .eq('id', params.id)
          .eq('student_id', user.id)
          .eq('proposals.status', 'accepted')
          .single()

        if (error) throw error
        setRequest(requestData)

      } catch (error) {
        console.error('Error fetching request:', error)
        router.push('/dashboard/student/requests')
      } finally {
        setLoading(false)
      }
    }

    fetchRequest()
  }, [params.id, supabase, router])

  const handleGoToRequest = () => {
    router.push(`/dashboard/student/requests/${params.id}`)
  }

  const handleGoToDashboard = () => {
    router.push('/dashboard/student/dashboard')
  }

  const handleContactTeacher = () => {
    // Navigate to messages/chat with teacher
    router.push(`/dashboard/student/messages?teacher=${request?.proposals[0].teacher_id}`)
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

  const acceptedProposal = request.proposals[0]
  const transaction = request.transactions[0]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Success Header */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">決済完了</h1>
        <p className="text-muted-foreground mt-2">
          決済が正常に処理されました。レッスンの準備を進めましょう。
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Request Summary */}
        <Card>
          <CardHeader>
            <CardTitle>リクエスト詳細</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">{request.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {request.description}
              </p>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  {request.format === 'online' ? 'オンライン' :
                   request.format === 'in_person' ? '対面' : 'どちらでも'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{request.duration_hours}時間</span>
              </div>
              {request.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{request.location}</span>
                </div>
              )}
            </div>

            <div className="pt-4">
              <Badge variant="secondary">進行中</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Teacher & Payment Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              選択された講師
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                {acceptedProposal.teacher.full_name.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{acceptedProposal.teacher.full_name}</p>
                <Badge variant="outline">講師</Badge>
              </div>
            </div>
            
            {acceptedProposal.teacher.bio && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {acceptedProposal.teacher.bio}
              </p>
            )}

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">決済内容</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>レッスン料金</span>
                  <span>¥{Number(acceptedProposal.proposed_fee).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>プラットフォーム手数料</span>
                  <span>¥{Number(transaction.platform_fee_amount).toLocaleString()}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-medium">
                    <span>お支払い合計</span>
                    <span>¥{Number(transaction.amount).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>次のステップ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-medium mb-1">講師と連絡</h4>
              <p className="text-sm text-muted-foreground mb-3">
                レッスンの詳細を打ち合わせしましょう
              </p>
              <Button onClick={handleContactTeacher} size="sm" className="w-full">
                メッセージを送る
              </Button>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-medium mb-1">日程調整</h4>
              <p className="text-sm text-muted-foreground mb-3">
                都合の良い日時を相談してください
              </p>
              <Button onClick={handleGoToRequest} variant="outline" size="sm" className="w-full">
                詳細を確認
              </Button>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-medium mb-1">レッスン実施</h4>
              <p className="text-sm text-muted-foreground mb-3">
                予定通りレッスンを受講してください
              </p>
              <Button variant="outline" size="sm" className="w-full" disabled>
                準備中
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">お支払いについて</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• お支払いいただいた料金は、レッスン完了まで安全に保管されます</li>
              <li>• レッスン完了後、講師に料金が支払われます</li>
              <li>• 万が一問題が発生した場合は、サポートまでご連絡ください</li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <Button onClick={handleGoToDashboard} variant="outline">
              ダッシュボードに戻る
            </Button>
            <Button onClick={handleGoToRequest}>
              <ArrowRight className="mr-2 h-4 w-4" />
              リクエスト詳細を見る
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}