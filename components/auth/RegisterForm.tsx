'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RoleSelector } from '@/components/auth/RoleSelector'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { registerSchema, type RegisterFormData } from '@/lib/utils/validation-schemas'
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/lib/constants/messages'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export function RegisterForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'student'
    }
  })

  const watchedRole = watch('role')

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            display_name: data.displayName,
            role: data.role
          }
        }
      })

      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: 'エラー',
            description: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
            variant: 'destructive'
          })
        } else {
          toast({
            title: 'エラー',
            description: error.message,
            variant: 'destructive'
          })
        }
        return
      }

      toast({
        title: '成功',
        description: SUCCESS_MESSAGES.ACCOUNT_CREATED,
        variant: 'default'
      })

      // Redirect to appropriate dashboard based on role
      const redirectPath = data.role === 'student' 
        ? '/dashboard/student/dashboard'
        : '/dashboard/teacher/dashboard'
      
      router.push(redirectPath)

    } catch (error) {
      console.error('Registration error:', error)
      toast({
        title: 'エラー',
        description: ERROR_MESSAGES.UNKNOWN_ERROR,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">TeachBidに登録</CardTitle>
          <p className="text-muted-foreground">
            アカウントを作成して学習または指導を始めましょう
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-2">
              <RoleSelector
                value={watchedRole}
                onChange={(role) => setValue('role', role)}
              />
              {errors.role && (
                <p className="text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">表示名 *</Label>
                <Input
                  id="displayName"
                  placeholder="山田太郎"
                  {...register('displayName')}
                />
                {errors.displayName && (
                  <p className="text-sm text-red-600">{errors.displayName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@teachbid.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">パスワード *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="8文字以上"
                    {...register('password')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">パスワード確認 *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="パスワードを再入力"
                    {...register('confirmPassword')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1"
                  {...register('terms')}
                />
                <Label htmlFor="terms" className="text-sm leading-5">
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    利用規約
                  </Link>
                  および
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    プライバシーポリシー
                  </Link>
                  に同意します *
                </Label>
              </div>
              {errors.terms && (
                <p className="text-sm text-red-600">{errors.terms.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              アカウントを作成
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              既にアカウントをお持ちですか？{' '}
              <Link 
                href="/login" 
                className="text-blue-600 hover:underline font-medium"
              >
                ログイン
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          登録後、メール認証が必要です
        </p>
        <p className="text-xs text-muted-foreground">
          迷惑メールフォルダもご確認ください
        </p>
      </div>
    </div>
  )
}