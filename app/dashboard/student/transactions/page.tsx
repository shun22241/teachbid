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
  Receipt, 
  Calendar, 
  User, 
  ArrowUpRight,
  Filter,
  Search
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Transaction {
  id: string
  amount: number
  student_fee_amount: number
  teacher_fee_amount: number
  platform_fee_amount: number
  status: string
  created_at: string
  completed_at: string | null
  request: {
    title: string
    id: string
  }
  proposal: {
    teacher: {
      full_name: string
    }
  }
}

export default function StudentTransactionsPage() {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [stats, setStats] = useState({
    totalSpent: 0,
    completedLessons: 0,
    pendingPayments: 0
  })

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const { data: transactionData, error } = await supabase
          .from('transactions')
          .select(`
            *,
            request:requests!inner(title, id),
            proposal:proposals!inner(
              teacher:profiles!teacher_id(full_name)
            )
          `)
          .eq('student_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        setTransactions(transactionData || [])
        setFilteredTransactions(transactionData || [])

        // Calculate stats
        const totalSpent = transactionData?.reduce((sum, t) => 
          sum + Number(t.student_fee_amount), 0) || 0
        
        const completedLessons = transactionData?.filter(t => t.status === 'completed').length || 0
        
        const pendingPayments = transactionData?.filter(t => t.status === 'pending').length || 0

        setStats({
          totalSpent,
          completedLessons,
          pendingPayments
        })

      } catch (error) {
        console.error('Error fetching transactions:', error)
        toast({
          title: 'エラー',
          description: '取引履歴の取得に失敗しました',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [supabase, router, toast])

  useEffect(() => {
    let filtered = transactions

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.proposal.teacher.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter)
    }

    setFilteredTransactions(filtered)
  }, [transactions, searchQuery, statusFilter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">完了</Badge>
      case 'pending':
        return <Badge variant="secondary">進行中</Badge>
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">決済履歴</h1>
        <p className="text-muted-foreground">
          これまでの決済と取引履歴を確認できます
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              総支払額
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{stats.totalSpent.toLocaleString()}
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              進行中決済
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.pendingPayments}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            フィルター
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="リクエストタイトルや講師名で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="ステータス" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="pending">進行中</SelectItem>
                <SelectItem value="completed">完了</SelectItem>
                <SelectItem value="refunded">返金済み</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>取引履歴</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' 
                  ? '条件に一致する取引がありません' 
                  : 'まだ決済履歴がありません'
                }
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Button onClick={() => router.push('/dashboard/student/dashboard')}>
                  レッスンを探す
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{transaction.request.title}</h4>
                      {getStatusBadge(transaction.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      講師: {transaction.proposal.teacher.full_name}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(transaction.created_at).toLocaleDateString('ja-JP')}
                      </div>
                      {transaction.completed_at && (
                        <div>
                          完了: {new Date(transaction.completed_at).toLocaleDateString('ja-JP')}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <div className="text-lg font-semibold">
                      ¥{Number(transaction.student_fee_amount).toLocaleString()}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/dashboard/student/requests/${transaction.request.id}`)}
                    >
                      詳細を見る
                      <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Section */}
      <Alert>
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">決済に関するお問い合わせ</p>
            <p className="text-sm">
              決済や返金に関してご不明な点がございましたら、
              <Button variant="link" className="p-0 h-auto">サポートセンター</Button>
              までお気軽にお問い合わせください。
            </p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}