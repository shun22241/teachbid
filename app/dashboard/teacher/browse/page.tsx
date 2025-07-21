'use client'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RequestList } from '@/components/requests/RequestList'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatRelativeTime } from '@/lib/utils/date-formatter'
import { formatCurrency } from '@/lib/utils/fee-calculator'
import { useRouter } from 'next/navigation'
import { Search, Filter, BookOpen, Clock, MapPin, Users, DollarSign } from 'lucide-react'
import type { Database } from '@/types/database'

type Request = Database['public']['Tables']['requests']['Row'] & {
  proposal_count?: number
}

export default function TeacherBrowsePage() {
  const router = useRouter()
  const supabase = createClient()
  const [requests, setRequests] = useState<Request[]>([])
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [formatFilter, setFormatFilter] = useState<string>('all')
  const [budgetFilter, setBudgetFilter] = useState<string>('all')

  useEffect(() => {
    async function fetchRequests() {
      try {
        const { data, error } = await supabase
          .from('requests')
          .select(`
            *,
            proposals(count)
          `)
          .eq('status', 'open')
          .order('created_at', { ascending: false })

        if (error) throw error

        // Transform data to include proposal count
        const requestsWithCount = data?.map(request => ({
          ...request,
          proposal_count: request.proposals?.[0]?.count || 0
        })) || []

        setRequests(requestsWithCount)
        setFilteredRequests(requestsWithCount)
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

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(request => request.category === categoryFilter)
    }

    // Filter by format
    if (formatFilter !== 'all') {
      filtered = filtered.filter(request => 
        (request as any).format === formatFilter || (request as any).format === 'both'
      )
    }

    // Filter by budget
    if (budgetFilter !== 'all') {
      const [min, max] = budgetFilter.split('-').map(Number)
      filtered = filtered.filter(request => {
        const budgetMin = Number(request.budget_min)
        const budgetMax = Number(request.budget_max)
        if (max) {
          return budgetMin >= min && budgetMax <= max
        } else {
          return budgetMin >= min
        }
      })
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(request =>
        request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredRequests(filtered)
  }, [requests, categoryFilter, formatFilter, budgetFilter, searchQuery])

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">リクエスト一覧</h1>
        <p className="text-muted-foreground">
          学習したい生徒のリクエストを探して提案しましょう
        </p>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="リクエストを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
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

        <Select value={formatFilter} onValueChange={setFormatFilter}>
          <SelectTrigger>
            <SelectValue placeholder="形式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="online">オンライン</SelectItem>
            <SelectItem value="in_person">対面</SelectItem>
          </SelectContent>
        </Select>

        <Select value={budgetFilter} onValueChange={setBudgetFilter}>
          <SelectTrigger>
            <SelectValue placeholder="予算" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="0-3000">¥3,000以下</SelectItem>
            <SelectItem value="3000-5000">¥3,000-5,000</SelectItem>
            <SelectItem value="5000-10000">¥5,000-10,000</SelectItem>
            <SelectItem value="10000">¥10,000以上</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredRequests.length} 件のリクエストが見つかりました
        </p>
      </div>

      {/* Request Cards */}
      {filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="transition-colors hover:bg-muted/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                          {request.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {request.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {request.category}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {(request as any).format === 'online' ? 'オンライン' : 
                             (request as any).format === 'in_person' ? '対面' : 'どちらでも'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {(request as any).duration_hours}時間
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {(request as any).experience_level === 'beginner' ? '初心者' :
                             (request as any).experience_level === 'intermediate' ? '中級者' : '上級者'}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">
                              {formatCurrency(Number(request.budget_min))} - {formatCurrency(Number(request.budget_max))}
                            </span>
                          </div>
                          {request.proposal_count && request.proposal_count > 0 && (
                            <Badge variant="secondary">
                              {request.proposal_count}件の提案
                            </Badge>
                          )}
                          <span className="text-sm text-muted-foreground">
                            {formatRelativeTime(request.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      onClick={() => router.push(`/dashboard/teacher/browse/${request.id}`)}
                    >
                      詳細を見る
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/dashboard/teacher/browse/${request.id}/proposal`)}
                    >
                      提案する
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {searchQuery || categoryFilter !== 'all' || formatFilter !== 'all' || budgetFilter !== 'all'
              ? '条件に一致するリクエストが見つかりません'
              : 'まだリクエストがありません'
            }
          </p>
        </div>
      )}
    </div>
  )
}