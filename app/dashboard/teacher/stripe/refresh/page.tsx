'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, ArrowLeft } from 'lucide-react'

export default function StripeRefreshPage() {
  const router = useRouter()

  const handleRetryOnboarding = () => {
    router.push('/dashboard/teacher/stripe/onboarding')
  }

  const handleGoBack = () => {
    router.push('/dashboard/teacher/dashboard')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
          <RefreshCw className="h-8 w-8 text-orange-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">設定を再開</h1>
        <p className="text-muted-foreground mt-2">
          Stripeアカウントの設定を続行してください
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>設定の続行</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Stripeアカウントの設定が完了していないようです。
            収益を受け取るには設定を完了する必要があります。
          </p>

          <div className="space-y-3">
            <h4 className="font-medium">設定を完了すると：</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• レッスン料金の受け取りが可能になります</li>
              <li>• 詳細な収益分析を確認できます</li>
              <li>• 迅速な振込処理が利用できます</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleGoBack} variant="outline" className="flex-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              ダッシュボードに戻る
            </Button>
            <Button onClick={handleRetryOnboarding} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              設定を続行
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}