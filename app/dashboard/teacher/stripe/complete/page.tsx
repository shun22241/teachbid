'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react'

export default function StripeCompletePage() {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [accountEnabled, setAccountEnabled] = useState(false)

  useEffect(() => {
    async function checkAccountStatus() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        // Wait a bit for webhook to process
        await new Promise(resolve => setTimeout(resolve, 2000))

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('stripe_account_enabled')
          .eq('id', user.id)
          .single()

        if (error) throw error

        setAccountEnabled(profile.stripe_account_enabled || false)

        if (profile.stripe_account_enabled) {
          toast({
            title: '設定完了',
            description: 'Stripeアカウントの設定が完了しました。収益の受け取りが可能になりました。'
          })
        }
      } catch (error) {
        console.error('Error checking account status:', error)
        toast({
          title: 'エラー',
          description: 'アカウント状況の確認に失敗しました',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    checkAccountStatus()
  }, [supabase, router, toast])

  const handleGoToDashboard = () => {
    router.push('/dashboard/teacher/dashboard')
  }

  const handleGoToEarnings = () => {
    router.push('/dashboard/teacher/earnings')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          {accountEnabled ? 'アカウント設定完了' : 'アカウント設定中'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {accountEnabled 
            ? 'Stripeアカウントの設定が完了しました'
            : 'Stripeアカウントの審査を進めています'
          }
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {accountEnabled ? '次のステップ' : '審査状況'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {accountEnabled ? (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">アカウント有効化完了</span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  収益の受け取りが可能になりました。
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">今すぐできること：</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    レッスンの提案を送信
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    学生からの決済を受け取り
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    収益の詳細分析を確認
                  </li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleGoToDashboard} variant="outline" className="flex-1">
                  ダッシュボードへ
                </Button>
                <Button onClick={handleGoToEarnings} className="flex-1">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  収益を確認
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="font-medium">審査進行中</span>
                </div>
                <p className="text-yellow-700 text-sm mt-1">
                  Stripeによるアカウント審査が進行中です。通常1-2営業日で完了します。
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">審査中にできること：</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• プロフィールの充実</li>
                  <li>• スキルや経歴の追加</li>
                  <li>• レッスンリクエストの確認</li>
                </ul>
              </div>

              <Button onClick={handleGoToDashboard} className="w-full">
                ダッシュボードに戻る
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}