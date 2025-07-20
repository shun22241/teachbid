'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  ExternalLink, 
  Calendar,
  User
} from 'lucide-react'

interface Transaction {
  id: string
  amount: number
  teacher_fee_amount: number
  platform_fee_amount: number
  status: string
  created_at: string
  completed_at: string | null
  request: {
    title: string
    student: {
      full_name: string
    }
  }
}

export default function EarningsPage() {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const [profile, setProfile] = useState<any>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingEarnings: 0,
    completedLessons: 0,
    thisMonthEarnings: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        // Get profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) throw profileError
        setProfile(profileData)

        // Get transactions
        const { data: transactionData, error: transactionError } = await supabase
          .from('transactions')
          .select(`
            *,
            request:requests!inner(
              title,
              student:profiles!student_id(full_name)
            )
          `)
          .eq('teacher_id', user.id)
          .order('created_at', { ascending: false })

        if (transactionError) throw transactionError
        setTransactions(transactionData || [])

        // Calculate stats
        const now = new Date()
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        
        const totalEarnings = transactionData?.reduce((sum, t) => 
          t.status === 'completed' ? sum + Number(t.teacher_fee_amount) : sum, 0) || 0
        
        const pendingEarnings = transactionData?.reduce((sum, t) => 
          t.status === 'pending' ? sum + Number(t.teacher_fee_amount) : sum, 0) || 0
        
        const completedLessons = transactionData?.filter(t => t.status === 'completed').length || 0
        
        const thisMonthEarnings = transactionData?.reduce((sum, t) => {
          const transactionDate = new Date(t.created_at)
          return t.status === 'completed' && transactionDate >= thisMonth 
            ? sum + Number(t.teacher_fee_amount) : sum
        }, 0) || 0

        setStats({
          totalEarnings,
          pendingEarnings,
          completedLessons,
          thisMonthEarnings
        })

      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          title: 'エラー',
          description: 'データの取得に失敗しました',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase, router, toast])

  const handleOpenDashboard = async () => {
    try {
      const response = await fetch('/api/stripe/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to create dashboard link')
      }

      const { dashboard_url } = await response.json()
      window.open(dashboard_url, '_blank')

    } catch (error) {
      console.error('Error opening dashboard:', error)
      toast({
        title: 'エラー',
        description: 'Stripeダッシュボードを開けませんでした',
        variant: 'destructive'
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">完了</Badge>
      case 'pending':
        return <Badge variant="secondary">保留中</Badge>
      case 'refunded':
        return <Badge variant="destructive">返金済み</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!profile?.stripe_account_enabled) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">収益管理</h1>
          <p className="text-muted-foreground">
            レッスン料金の受け取りと収益を管理します
          </p>
        </div>

        <Alert>
          <AlertDescription>
            <div className="space-y-4">
              <p className="font-medium">
                Stripeアカウントの設定が完了していません
              </p>
              <p className="text-sm">
                収益を受け取るにはStripeアカウントの設定を完了してください。
              </p>
              <Button onClick={() => router.push('/dashboard/teacher/stripe/onboarding')}>
                Stripeアカウントを設定
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">収益管理</h1>
          <p className="text-muted-foreground">
            レッスン料金の受け取りと収益を管理します
          </p>
        </div>
        
        <Button onClick={handleOpenDashboard} variant="outline">
          <ExternalLink className="mr-2 h-4 w-4" />
          Stripeダッシュボード
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              累計収益
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{stats.totalEarnings.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              今月の収益
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{stats.thisMonthEarnings.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              保留中収益
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{stats.pendingEarnings.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              完了レッスン
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.completedLessons}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>取引履歴</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                まだ取引がありません
              </p>
              <Button onClick={() => router.push('/dashboard/teacher/dashboard')}>
                提案を送信する
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">{transaction.request.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      学生: {transaction.request.student.full_name}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(transaction.created_at).toLocaleDateString('ja-JP')}
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <div className="text-lg font-semibold">
                      ¥{Number(transaction.teacher_fee_amount).toLocaleString()}
                    </div>
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}