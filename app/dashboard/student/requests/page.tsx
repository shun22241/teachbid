'use client'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RequestList } from '@/components/requests/RequestList'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'
import { PlusCircle, Search, Filter } from 'lucide-react'
import type { Database } from '@/types/database'

type Request = Database['public']['Tables']['requests']['Row']

export default function StudentRequestsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [requests, setRequests] = useState<Request[]>([])
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    async function fetchRequests() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from('requests')
          .select('*')
          .eq('student_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        setRequests(data || [])
        setFilteredRequests(data || [])
      } catch (error) {
        console.error('Error fetching requests:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [supabase])

  useEffect(() => {
    let filtered = requests

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter)
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(request => request.category === categoryFilter)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(request =>
        request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredRequests(filtered)
  }, [requests, statusFilter, categoryFilter, searchQuery])

  const getRequestsByStatus = (status: string) => {
    return requests.filter(request => request.status === status)
  }

  const categories = [...new Set(requests.map(request => request.category))]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">リクエスト管理</h1>
          <p className="text-muted-foreground">
            あなたの学習リクエストを管理
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/student/requests/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          新規リクエスト
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="リクエストを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="open">募集中</SelectItem>
            <SelectItem value="in_progress">進行中</SelectItem>
            <SelectItem value="completed">完了</SelectItem>
            <SelectItem value="cancelled">キャンセル</SelectItem>
            <SelectItem value="expired">期限切れ</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="カテゴリ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            すべて ({requests.length})
          </TabsTrigger>
          <TabsTrigger value="open">
            募集中 ({getRequestsByStatus('open').length})
          </TabsTrigger>
          <TabsTrigger value="in_progress">
            進行中 ({getRequestsByStatus('in_progress').length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            完了 ({getRequestsByStatus('completed').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {filteredRequests.length > 0 ? (
            <RequestList requests={filteredRequests} showStatus />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? '条件に一致するリクエストが見つかりません'
                  : 'まだリクエストがありません'
                }
              </p>
              {(!searchQuery && statusFilter === 'all' && categoryFilter === 'all') && (
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/student/requests/new')}
                >
                  最初のリクエストを作成
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="open">
          <RequestList requests={getRequestsByStatus('open')} showStatus />
        </TabsContent>

        <TabsContent value="in_progress">
          <RequestList requests={getRequestsByStatus('in_progress')} showStatus />
        </TabsContent>

        <TabsContent value="completed">
          <RequestList requests={getRequestsByStatus('completed')} showStatus />
        </TabsContent>
      </Tabs>
    </div>
  )
}