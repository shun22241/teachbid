'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatRelativeTime } from '@/lib/utils/date-formatter'
import { formatCurrency } from '@/lib/utils/fee-calculator'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import {
  Search,
  Filter,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  ArrowRight
} from 'lucide-react'
import type { Database } from '@/types/database'

type Proposal = Database['public']['Tables']['proposals']['Row'] & {
  request: {
    title: string
    status: string
    student: {
      full_name: string
    }
  }
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  accepted: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  withdrawn: 'bg-gray-100 text-gray-800 border-gray-200'
}

const statusIcons = {
  pending: Clock,
  accepted: CheckCircle,
  rejected: XCircle,
  withdrawn: XCircle
}

const statusLabels = {
  pending: '審査中',
  accepted: '承認済み',
  rejected: '却下',
  withdrawn: '取り下げ'
}

export default function TeacherProposalsPage() {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    async function fetchProposals() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from('proposals')
          .select(`
            *,
            request:requests!inner(
              title,
              status,
              student:profiles!student_id(full_name)
            )
          `)
          .eq('teacher_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        setProposals(data as Proposal[] || [])
        setFilteredProposals(data as Proposal[] || [])
      } catch (error) {
        console.error('Error fetching proposals:', error)
        toast({
          title: 'エラー',
          description: '提案の読み込みに失敗しました',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProposals()
  }, [supabase, toast])

  useEffect(() => {
    let filtered = proposals

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(proposal => proposal.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(proposal =>
        proposal.request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proposal.request.student.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredProposals(filtered)
  }, [proposals, statusFilter, searchQuery])

  const getProposalsByStatus = (status: string) => {
    return proposals.filter(proposal => proposal.status === status)
  }

  async function handleWithdrawProposal(proposalId: string) {
    try {
      const { error } = await supabase
        .from('proposals')
        .update({ status: 'withdrawn' })
        .eq('id', proposalId)

      if (error) throw error

      setProposals(proposals.map(proposal =>
        proposal.id === proposalId
          ? { ...proposal, status: 'withdrawn' as const }
          : proposal
      ))

      toast({
        title: '成功',
        description: '提案を取り下げました'
      })
    } catch (error) {
      console.error('Error withdrawing proposal:', error)
      toast({
        title: 'エラー',
        description: '提案の取り下げに失敗しました',
        variant: 'destructive'
      })
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">提案管理</h1>
          <p className="text-muted-foreground">
            送信した提案の状況を確認・管理
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/teacher/browse')}>
          <MessageSquare className="mr-2 h-4 w-4" />
          新しい提案を作成
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="リクエストまたは生徒名で検索..."
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
            <SelectItem value="pending">審査中</SelectItem>
            <SelectItem value="accepted">承認済み</SelectItem>
            <SelectItem value="rejected">却下</SelectItem>
            <SelectItem value="withdrawn">取り下げ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            すべて ({proposals.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            審査中 ({getProposalsByStatus('pending').length})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            承認済み ({getProposalsByStatus('accepted').length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            却下 ({getProposalsByStatus('rejected').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ProposalsList 
            proposals={filteredProposals} 
            onWithdraw={handleWithdrawProposal}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
          />
        </TabsContent>

        <TabsContent value="pending">
          <ProposalsList 
            proposals={getProposalsByStatus('pending')} 
            onWithdraw={handleWithdrawProposal}
          />
        </TabsContent>

        <TabsContent value="accepted">
          <ProposalsList 
            proposals={getProposalsByStatus('accepted')} 
            onWithdraw={handleWithdrawProposal}
          />
        </TabsContent>

        <TabsContent value="rejected">
          <ProposalsList 
            proposals={getProposalsByStatus('rejected')} 
            onWithdraw={handleWithdrawProposal}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProposalsList({ 
  proposals, 
  onWithdraw,
  searchQuery = '',
  statusFilter = 'all'
}: {
  proposals: Proposal[]
  onWithdraw: (id: string) => void
  searchQuery?: string
  statusFilter?: string
}) {
  const router = useRouter()

  if (proposals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          {searchQuery || statusFilter !== 'all'
            ? '条件に一致する提案が見つかりません'
            : 'まだ提案がありません'
          }
        </p>
        {(!searchQuery && statusFilter === 'all') && (
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/teacher/browse')}
          >
            リクエストを探す
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {proposals.map((proposal) => {
        const StatusIcon = statusIcons[proposal.status as keyof typeof statusIcons]
        
        return (
          <Card key={proposal.id} className="transition-colors hover:bg-muted/50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold line-clamp-1">
                      {proposal.request.title}
                    </h3>
                    <Badge 
                      variant="outline" 
                      className={statusColors[proposal.status as keyof typeof statusColors]}
                    >
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusLabels[proposal.status as keyof typeof statusLabels]}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {proposal.message}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div>
                      <span className="text-muted-foreground">生徒:</span>
                      <span className="ml-1 font-medium">
                        {proposal.request.student.full_name}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">提案金額:</span>
                      <span className="ml-1 font-medium">
                        {formatCurrency(Number(proposal.proposed_fee))}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">送信日:</span>
                      <span className="ml-1">
                        {formatRelativeTime(proposal.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/teacher/proposals/${proposal.id}`)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    詳細
                  </Button>
                  
                  {proposal.status === 'pending' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onWithdraw(proposal.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      取り下げ
                    </Button>
                  )}
                  
                  {proposal.status === 'accepted' && proposal.request.status === 'in_progress' && (
                    <Button
                      size="sm"
                      onClick={() => router.push(`/dashboard/teacher/sessions/${proposal.id}`)}
                    >
                      セッション開始
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}