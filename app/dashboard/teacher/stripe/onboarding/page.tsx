'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { Loader2, ExternalLink, CreditCard, Shield, Check } from 'lucide-react'

export default function StripeOnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error

        setProfile(profileData)

        // Redirect if already has Stripe account
        if (profileData.stripe_account_id && profileData.stripe_account_enabled) {
          router.push('/dashboard/teacher/earnings')
          return
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast({
          title: 'エラー',
          description: 'プロフィールの取得に失敗しました',
          variant: 'destructive'
        })
      } finally {
        setLoadingProfile(false)
      }
    }

    fetchProfile()
  }, [supabase, router, toast])

  const handleCreateAccount = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || 'Failed to create Stripe account')
      }

      const { onboarding_url } = await response.json()
      
      // Redirect to Stripe onboarding
      window.location.href = onboarding_url

    } catch (error) {
      console.error('Error creating Stripe account:', error)
      toast({
        title: 'エラー',
        description: error instanceof Error ? error.message : 'Stripeアカウントの作成に失敗しました',
        variant: 'destructive'
      })
      setLoading(false)
    }
  }

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">収益の受け取り設定</h1>
        <p className="text-muted-foreground">
          レッスン料金を受け取るためにStripeアカウントを設定します
        </p>
      </div>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Stripe決済のメリット
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">迅速な振込</p>
                <p className="text-sm text-muted-foreground">レッスン完了後、最短2営業日で振込</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">低い手数料</p>
                <p className="text-sm text-muted-foreground">業界最低水準の決済手数料</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">安全な取引</p>
                <p className="text-sm text-muted-foreground">PCI DSS準拠の最高レベルセキュリティ</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">詳細な売上分析</p>
                <p className="text-sm text-muted-foreground">Stripeダッシュボードで収益を詳細に管理</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">安全性について</p>
            <p className="text-sm">
              Stripeは世界中の企業に利用されている決済プラットフォームです。
              お客様の個人情報や銀行口座情報は暗号化されて安全に管理されます。
            </p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Account Setup */}
      <Card>
        <CardHeader>
          <CardTitle>アカウント設定を開始</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">必要な情報</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 本人確認書類（運転免許証、マイナンバーカードなど）</li>
                <li>• 銀行口座情報（振込先口座）</li>
                <li>• 住所確認書類（住民票、公共料金の請求書など）</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">設定の流れ</h4>
              <ol className="text-sm text-muted-foreground space-y-1">
                <li>1. Stripeアカウント作成</li>
                <li>2. 本人確認書類のアップロード</li>
                <li>3. 銀行口座情報の入力</li>
                <li>4. 審査完了（通常1-2営業日）</li>
              </ol>
            </div>
          </div>

          <Button
            onClick={handleCreateAccount}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                設定中...
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                Stripeアカウントを設定する
              </>
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            Stripeの設定ページに移動します。設定完了後、自動的にダッシュボードに戻ります。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}