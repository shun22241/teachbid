'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginFormData } from '@/lib/utils/validation-schemas'
import { MESSAGES } from '@/lib/constants/messages'
import { Eye, EyeOff, Loader2, LogIn, AlertCircle } from 'lucide-react'
import { useAnalytics } from '@/lib/analytics/tracking'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const { trackBusinessEvent } = useAnalytics()

  const redirectTo = searchParams.get('redirect') || '/dashboard'
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const fillDemoAccount = (type: 'student' | 'teacher') => {
    if (type === 'student') {
      setValue('email', 'student1@test.com')
      setValue('password', 'password123')
    } else {
      setValue('email', 'teacher1@test.com')
      setValue('password', 'password123')
    }
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError('')
    
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      })

      if (error) {
        // Detailed error logging
        console.error('Login error details:', {
          message: error.message,
          status: (error as any).status,
          details: (error as any).details,
          error: error,
          email: data.email
        })

        // Track failed login attempt
        trackBusinessEvent('login_failed', {
          email: data.email,
          error: error.message
        })

        // User-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          setError('メールアドレスまたはパスワードが正しくありません')
        } else if (error.message.includes('Email not confirmed')) {
          setError('メールアドレスの認証が完了していません。メールを確認してください。')
        } else if (error.message.includes('Too many requests')) {
          setError('ログイン試行回数が多すぎます。しばらく時間をおいてから再度お試しください。')
        } else {
          setError(`ログインに失敗しました: ${error.message}`)
        }
        return
      }

      if (authData.user) {
        console.log('Login successful for user:', authData.user.email)
        
        // Try to get user profile but don't fail if it doesn't exist
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role, display_name')
            .eq('id', authData.user.id)
            .single()

          if (profileError) {
            console.log('Profile fetch error (will still proceed):', profileError.message)
          } else {
            console.log('Profile found:', profile)
          }

          // Track successful login
          trackBusinessEvent('user_login', {
            userId: authData.user.id,
            role: profile?.role || 'unknown',
            email: authData.user.email
          })
        } catch (error) {
          console.log('Profile check failed, but continuing with login')
        }

        // Set remember me preference
        if (rememberMe) {
          localStorage.setItem('teachbid_remember_me', 'true')
        }

        // Always redirect to success page regardless of profile status
        router.push('/login-success')
      }

    } catch (error) {
      console.error('Login error:', error)
      setError(MESSAGES.ERROR.UNKNOWN_ERROR)
      
      // Track unexpected errors
      trackBusinessEvent('login_error', {
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <Card className="shadow-lg border-0">
        <CardHeader className="text-center pb-4">
          <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <LogIn className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">TeachBidにログイン</CardTitle>
          <p className="text-muted-foreground">
            アカウントにサインインしてください
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@teachbid.com"
                autoComplete="email"
                {...register('email')}
                disabled={isLoading}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">パスワード</Label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-blue-600 hover:underline"
                >
                  パスワードを忘れた方
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="パスワードを入力"
                  autoComplete="current-password"
                  {...register('password')}
                  disabled={isLoading}
                  className={`pr-10 ${errors.password ? 'border-destructive' : ''}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                  </span>
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={isLoading}
              />
              <Label htmlFor="remember" className="text-sm">
                ログイン状態を保持
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              ログイン
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  または
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {/* Googleログインを一時的に無効化
              <Button
                variant="outline"
                className="w-full"
                type="button"
                disabled={true}
                onClick={() => {}}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Googleでログイン (メンテナンス中)
              </Button>
              */}
              
              <p className="text-sm text-gray-500 text-center">
                ※ 現在メール/パスワードログインのみ利用可能です
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              アカウントをお持ちでない方は{' '}
              <Link 
                href="/register" 
                className="text-blue-600 hover:underline font-medium"
              >
                新規登録
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Demo Accounts */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600 font-medium">デモアカウント</p>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="p-3 bg-white rounded-md border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-700">生徒用</div>
                  <div className="text-gray-600 mt-1">student1@test.com / password123</div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => fillDemoAccount('student')}
                  className="text-xs h-7"
                >
                  入力
                </Button>
              </div>
            </div>
            <div className="p-3 bg-white rounded-md border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-700">講師用</div>
                  <div className="text-gray-600 mt-1">teacher1@test.com / password123</div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => fillDemoAccount('teacher')}
                  className="text-xs h-7"
                >
                  入力
                </Button>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            ※ デモ用アカウントでサービスをお試しいただけます
          </p>
        </div>
      </div>
    </div>
  )
}