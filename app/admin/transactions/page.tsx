'use client'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { 
  Search, 
  Filter, 
  Download,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Calendar,
  User
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TransactionDetail {
  id: string
  amount: number
  student_fee_amount: number
  teacher_fee_amount: number
  platform_fee_amount: number
  status: string
  payment_intent_id: string | null
  created_at: string
  completed_at: string | null
  request: {
    title: string
    id: string
  }
  student: {
    full_name: string
    email: string
  }
  teacher: {
    full_name: string
    email: string
  }
}

export default function AdminTransactionsPage() {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<TransactionDetail[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalVolume: 0,
    platformRevenue: 0,
    pendingCount: 0,
    completedCount: 0,
    refundedCount: 0
  })

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        // Check admin access
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile?.role !== 'admin') {
          toast({
            title: 'アクセス拒否',
            description: '管理者権限が必要です',
            variant: 'destructive'
          })
          router.push('/dashboard')
          return
        }

        // Fetch all transactions with related data
        const { data: transactionsData, error } = await supabase
          .from('transactions')
          .select(`
            *,
            request:requests!inner(title, id),
            student:profiles!student_id(full_name, email),
            teacher:profiles!teacher_id(full_name, email)
          `)
          .order('created_at', { ascending: false })

        if (error) throw error

        setTransactions(transactionsData || [])
        setFilteredTransactions(transactionsData || [])

        // Calculate stats
        const totalTransactions = transactionsData?.length || 0
        const totalVolume = transactionsData?.reduce((sum, t) => 
          sum + Number(t.amount), 0) || 0
        const platformRevenue = transactionsData?.reduce((sum, t) => 
          sum + Number(t.platform_fee_amount), 0) || 0
        const pendingCount = transactionsData?.filter(t => t.status === 'pending').length || 0
        const completedCount = transactionsData?.filter(t => t.status === 'completed').length || 0
        const refundedCount = transactionsData?.filter(t => t.status === 'refunded').length || 0

        setStats({
          totalTransactions,
          totalVolume,
          platformRevenue,
          pendingCount,
          completedCount,
          refundedCount
        })

      } catch (error) {
        console.error('Error fetching transactions:', error)
        toast({
          title: 'エラー',
          description: '取引データの取得に失敗しました',
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
      filtered = filtered.filter(transaction => 
        transaction.request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.teacher.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.payment_intent_id?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === statusFilter)
    }

    setFilteredTransactions(filtered)
  }, [transactions, searchQuery, statusFilter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            完了
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            保留中
          </Badge>
        )
      case 'refunded':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            返金済み
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const exportTransactions = () => {
    const csvContent = [
      ['取引ID', '学生名', '講師名', 'リクエストタイトル', '金額', '手数料', 'ステータス', '作成日', '完了日'].join(','),
      ...filteredTransactions.map(t => [
        t.id,
        t.student.full_name,
        t.teacher.full_name,
        t.request.title,
        t.amount,
        t.platform_fee_amount,
        t.status,
        new Date(t.created_at).toLocaleDateString('ja-JP'),
        t.completed_at ? new Date(t.completed_at).toLocaleDateString('ja-JP') : ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">取引管理</h1>
          <p className="text-muted-foreground">
            プラットフォームの全取引を監視・管理します
          </p>
        </div>
        <Button onClick={exportTransactions} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          CSVエクスポート
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">総取引数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">総取引額</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{stats.totalVolume.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">手数料収益</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{stats.platformRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">保留中</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">完了</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.completedCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">返金</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.refundedCount}
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
                  placeholder="リクエストタイトル、ユーザー名、取引IDで検索..."
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
                <SelectItem value="pending">保留中</SelectItem>
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
          <CardTitle>取引一覧</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== 'all' 
                  ? '条件に一致する取引がありません' 
                  : '取引がありません'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{transaction.request.title}</h4>
                      {getStatusBadge(transaction.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        学生: {transaction.student.full_name}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        講師: {transaction.teacher.full_name}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        作成: {new Date(transaction.created_at).toLocaleDateString('ja-JP')}
                      </div>
                      {transaction.completed_at && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          完了: {new Date(transaction.completed_at).toLocaleDateString('ja-JP')}
                        </div>
                      )}
                      {transaction.payment_intent_id && (
                        <div className="text-xs font-mono">
                          ID: {transaction.payment_intent_id.substring(0, 20)}...
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <div className="text-lg font-semibold">
                      ¥{Number(transaction.amount).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      手数料: ¥{Number(transaction.platform_fee_amount).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      講師受取: ¥{Number(transaction.teacher_fee_amount).toLocaleString()}
                    </div>
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