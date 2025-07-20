'use client'

import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { Loader2, CreditCard, Shield, Check } from 'lucide-react'

interface PaymentFormProps {
  proposalId: string
  amount: number
  proposalFee: number
  teacherFee: number
  onSuccess: (proposalId: string) => void
  onCancel: () => void
}

export function PaymentForm({ 
  proposalId, 
  amount, 
  proposalFee, 
  teacherFee, 
  onSuccess, 
  onCancel 
}: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      })

      if (stripeError) {
        setError(stripeError.message || 'Payment failed')
        return
      }

      if (paymentIntent?.status === 'succeeded') {
        // Confirm payment on server
        const response = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payment_intent_id: paymentIntent.id,
          }),
        })

        if (!response.ok) {
          const { error } = await response.json()
          throw new Error(error || 'Payment confirmation failed')
        }

        toast({
          title: '決済完了',
          description: '決済が正常に処理されました。講師とのレッスンが開始されます。'
        })

        onSuccess(proposalId)
      }
    } catch (error) {
      console.error('Payment error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
      toast({
        title: 'エラー',
        description: '決済処理中にエラーが発生しました',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            決済内容の確認
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>レッスン料金</span>
              <span className="font-medium">¥{proposalFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>プラットフォーム手数料</span>
              <span>¥{(amount - proposalFee).toLocaleString()}</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between text-lg font-semibold">
                <span>お支払い合計</span>
                <span>¥{amount.toLocaleString()}</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <span>講師受取額: ¥{teacherFee.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">安全な決済について</p>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-600" />
                <span>Stripe社による業界最高水準のセキュリティ</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-600" />
                <span>レッスン完了まで資金を安全に保管</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-600" />
                <span>万が一の場合の返金保証</span>
              </div>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle>決済情報</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <PaymentElement 
                options={{
                  layout: 'tabs',
                  paymentMethodOrder: ['card']
                }}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1"
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={!stripe || !elements || isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    処理中...
                  </>
                ) : (
                  `¥${amount.toLocaleString()}を決済`
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}