'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { 
  ArrowLeft, 
  RefreshCw, 
  AlertTriangle,
  User,
  Calendar,
  DollarSign
} from 'lucide-react'

interface RequestWithTransaction {
  id: string
  title: string
  status: string
  transactions: Array<{
    id: string
    amount: number
    student_fee_amount: number
    teacher_fee_amount: number
    status: string
    created_at: string
  }>
  proposals: Array<{
    teacher: {
      full_name: string
    }
  }>
}

export default function RefundRequestPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const [request, setRequest] = useState<RequestWithTransaction | null>(null)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

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
            transactions(*),
            proposals!inner(
              teacher:profiles!teacher_id(full_name)
            )
          `)
          .eq('id', params.id)
          .eq('student_id', user.id)
          .eq('proposals.status', 'accepted')
          .single()

        if (error) throw error
        setRequest(requestData)

        // Check if refund is possible
        const transaction = requestData.transactions[0]
        if (!transaction || transaction.status !== 'pending') {
          toast({
            title: '返金不可',
            description: 'この取引は返金対象ではありません',
            variant: 'destructive'
          })
          router.push(`/dashboard/student/requests/${params.id}`)
          return
        }

      } catch (error) {
        console.error('Error fetching request:', error)
        toast({
          title: 'エラー',
          description: 'リクエストの取得に失敗しました',
          variant: 'destructive'
        })
        router.push('/dashboard/student/requests')
      } finally {
        setLoading(false)
      }
    }

    fetchRequest()
  }, [params.id, supabase, router, toast])

  const handleSubmitRefund = async () => {
    if (!reason.trim()) {
      toast({
        title: 'エラー',
        description: '返金理由を入力してください',
        variant: 'destructive'
      })
      return
    }

    if (!request) return

    setSubmitting(true)
    try {
      const transaction = request.transactions[0]

      // Create refund request via database function
      const { error } = await supabase.rpc('process_refund', {
        p_transaction_id: transaction.id,
        p_refund_amount: transaction.student_fee_amount,
        p_reason: reason
      })

      if (error) throw error

      // Create notification for admin
      await supabase.from('notifications').insert({
        user_id: 'admin', // This would need to be handled differently in production
        type: 'refund_requested',
        title: '返金リクエスト',
        body: `「${request.title}」の返金が申請されました。`,
        metadata: {
          request_id: request.id,
          transaction_id: transaction.id,
          reason: reason
        }
      })

      toast({
        title: '返金申請完了',
        description: '返金申請を受け付けました。審査結果をお待ちください。'
      })

      router.push(`/dashboard/student/requests/${params.id}`)

    } catch (error) {
      console.error('Error submitting refund:', error)
      toast({
        title: 'エラー',
        description: '返金申請に失敗しました',
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
        <Button onClick={() => router.push('/dashboard/student/requests')}>
          リクエスト一覧に戻る
        </Button>
      </div>
    )
  }

  const transaction = request.transactions[0]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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
          <h1 className="text-3xl font-bold tracking-tight">返金申請</h1>
          <p className="text-muted-foreground">
            レッスンの返金を申請します
          </p>
        </div>
      </div>

      {/* Warning Alert */}
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">重要事項</p>
            <ul className="text-sm space-y-1">
              <li>• 返金申請後のキャンセルはできません</li>
              <li>• 審査には2-3営業日かかる場合があります</li>
              <li>• 理由によっては返金が承認されない場合があります</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* Transaction Info */}
      <Card>
        <CardHeader>
          <CardTitle>返金対象取引</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">{request.title}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>講師: {request.proposals[0].teacher.full_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>決済日: {new Date(transaction.created_at).toLocaleDateString('ja-JP')}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>支払額: ¥{Number(transaction.student_fee_amount).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <Badge variant="secondary">進行中</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Refund Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            返金理由
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">返金を希望する理由 *</Label>
            <Textarea
              id="reason"
              placeholder="返金を希望する詳細な理由をご記入ください..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground">
              具体的な理由を記載いただくことで、迅速な審査が可能になります。
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">一般的な返金理由例</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 講師との連絡が取れない</li>
              <li>• 事前に合意した内容と異なる</li>
              <li>• やむを得ない事情による受講困難</li>
              <li>• サービス品質に関する問題</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={submitting}
              className="flex-1"
            >
              キャンセル
            </Button>
            <Button
              onClick={handleSubmitRefund}
              disabled={submitting || !reason.trim()}
              className="flex-1"
            >
              {submitting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  申請中...
                </>
              ) : (
                '返金を申請'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Help */}
      <Alert>
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">サポートが必要ですか？</p>
            <p className="text-sm">
              返金に関してご不明な点がございましたら、
              <Button variant="link" className="p-0 h-auto">サポートセンター</Button>
              までお気軽にお問い合わせください。
            </p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}