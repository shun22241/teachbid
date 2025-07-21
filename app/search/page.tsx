'use client'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSearch } from '@/hooks/useSearch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { EmptyState } from '@/components/ui/empty-state'
import { Pagination } from '@/components/ui/pagination'
import { FilterBar, SearchFilter, SelectFilter, DateFilter } from '@/components/ui/filters'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatusBadge } from '@/components/ui/status-badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency } from '@/lib/utils/fee-calculator'
import { formatRelativeTime } from '@/lib/utils/date-formatter'
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Calendar,
  Star,
  MessageSquare,
  Filter,
  Users,
  BookOpen
} from 'lucide-react'
import Link from 'next/link'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const {
    loading,
    filters,
    requests,
    teachers,
    totalResults,
    currentPage,
    totalPages,
    updateFilters,
    clearFilters,
    setCurrentPage,
    searchTeachers,
    getFilterOptions
  } = useSearch()

  const [searchType, setSearchType] = useState<'requests' | 'teachers'>('requests')
  const [filterOptions, setFilterOptions] = useState<{
    categories: any[]
    subjects: any[]
    locations: any[]
    formats: string[]
    sortOptions: { value: string; label: string }[]
  }>({
    categories: [],
    subjects: [],
    locations: [],
    formats: [],
    sortOptions: []
  })

  // Initialize search from URL params
  useEffect(() => {
    const query = searchParams.get('q')
    const category = searchParams.get('category')
    const format = searchParams.get('format')
    const type = searchParams.get('type') as 'requests' | 'teachers'

    if (query || category || format) {
      updateFilters({
        query: query || undefined,
        category: category || undefined,
        format: format || undefined
      })
    }

    if (type && ['requests', 'teachers'].includes(type)) {
      setSearchType(type)
    }
  }, [searchParams, updateFilters])

  // Load filter options
  useEffect(() => {
    async function loadOptions() {
      const options = await getFilterOptions()
      setFilterOptions(options)
    }
    loadOptions()
  }, [getFilterOptions])

  // Search teachers when switching to teachers tab
  useEffect(() => {
    if (searchType === 'teachers') {
      searchTeachers(filters, currentPage)
    }
  }, [searchType, filters, currentPage, searchTeachers])

  const handleFilterChange = (key: string, value: any) => {
    updateFilters({ [key]: value })
  }

  const handleDateRangeChange = (start: string, end: string) => {
    updateFilters({
      dateRange: {
        start: start || undefined,
        end: end || undefined
      }
    })
  }

  const renderRequestCard = (request: any) => (
    <Card key={request.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link href={`/requests/${request.id}`}>
              <h3 className="text-lg font-semibold hover:text-primary cursor-pointer line-clamp-2">
                {request.title}
              </h3>
            </Link>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline">{request.category}</Badge>
              <Badge variant="secondary">{request.subject}</Badge>
            </div>
          </div>
          <StatusBadge status={request.status} type="request" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground line-clamp-3">
          {request.description}
        </p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>
              {formatCurrency(request.budget_min)} - {formatCurrency(request.budget_max)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{request.duration_hours}時間</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>
              {request.format === 'online' ? 'オンライン' :
               request.format === 'in_person' ? '対面' : 'どちらでも'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              締切: {new Date(request.deadline).toLocaleDateString('ja-JP')}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={request.student.avatar_url || undefined} />
              <AvatarFallback>
                {request.student.full_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {request.student.full_name}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-3 w-3" />
              <span>{request.proposals_count || 0}件の提案</span>
            </div>
            <span>{formatRelativeTime(request.created_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderTeacherCard = (teacher: any) => (
    <Card key={teacher.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={teacher.avatar_url || undefined} />
            <AvatarFallback className="text-lg">
              {teacher.full_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <Link href={`/teachers/${teacher.id}`}>
              <h3 className="text-lg font-semibold hover:text-primary cursor-pointer">
                {teacher.full_name}
              </h3>
            </Link>
            
            <div className="flex items-center space-x-2 mt-1">
              {teacher.average_rating > 0 && (
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">
                    {teacher.average_rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({teacher.total_reviews}件)
                  </span>
                </div>
              )}
            </div>
            
            {teacher.subjects && teacher.subjects.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {teacher.subjects.slice(0, 3).map((subject: string) => (
                  <Badge key={subject} variant="outline" className="text-xs">
                    {subject}
                  </Badge>
                ))}
                {teacher.subjects.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{teacher.subjects.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {teacher.bio && (
          <p className="text-muted-foreground line-clamp-3">
            {teacher.bio}
          </p>
        )}
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          {teacher.hourly_rate_min && teacher.hourly_rate_max && (
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>
                {formatCurrency(teacher.hourly_rate_min)} - {formatCurrency(teacher.hourly_rate_max)}/時間
              </span>
            </div>
          )}
          
          {teacher.experience_years && (
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>経験 {teacher.experience_years}年</span>
            </div>
          )}
          
          {teacher.location && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{teacher.location}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t">
          <span className="text-sm text-muted-foreground">
            登録: {formatRelativeTime(teacher.created_at)}
          </span>
          
          <Button size="sm" asChild>
            <Link href={`/teachers/${teacher.id}`}>
              プロフィールを見る
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="検索"
        description="リクエストや講師を検索・フィルタリングできます"
      />

      {/* Filters */}
      <FilterBar onReset={clearFilters}>
        <SearchFilter
          value={filters.query || ''}
          onChange={(value) => handleFilterChange('query', value)}
          placeholder="キーワードで検索..."
          className="flex-1"
        />
        
        <SelectFilter
          value={filters.category || ''}
          onChange={(value) => handleFilterChange('category', value)}
          options={filterOptions.categories.map(cat => ({ value: cat, label: cat }))}
          placeholder="カテゴリ"
        />
        
        <SelectFilter
          value={filters.format || ''}
          onChange={(value) => handleFilterChange('format', value)}
          options={[
            { value: 'online', label: 'オンライン' },
            { value: 'in_person', label: '対面' },
            { value: 'hybrid', label: 'どちらでも' }
          ]}
          placeholder="形式"
        />
        
        <DateFilter
          startDate={filters.dateRange?.start || ''}
          endDate={filters.dateRange?.end || ''}
          onStartDateChange={(date) => handleDateRangeChange(date, filters.dateRange?.end || '')}
          onEndDateChange={(date) => handleDateRangeChange(filters.dateRange?.start || '', date)}
        />
      </FilterBar>

      {/* Search Type Tabs */}
      <Tabs value={searchType} onValueChange={(value) => setSearchType(value as 'requests' | 'teachers')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            リクエスト ({searchType === 'requests' ? totalResults : '...'})
          </TabsTrigger>
          <TabsTrigger value="teachers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            講師 ({searchType === 'teachers' ? totalResults : '...'})
          </TabsTrigger>
        </TabsList>

        {/* Results */}
        <TabsContent value="requests" className="space-y-6">
          {loading ? (
            <LoadingSpinner size="lg" className="py-12" />
          ) : requests.length === 0 ? (
            <EmptyState
              icon={<Search className="h-12 w-12" />}
              title="リクエストが見つかりません"
              description="検索条件を変更して再度お試しください"
            />
          ) : (
            <>
              <div className="text-sm text-muted-foreground">
                {totalResults}件のリクエストが見つかりました
              </div>
              
              <div className="grid gap-6">
                {requests.map(renderRequestCard)}
              </div>
              
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="teachers" className="space-y-6">
          {loading ? (
            <LoadingSpinner size="lg" className="py-12" />
          ) : teachers.length === 0 ? (
            <EmptyState
              icon={<Search className="h-12 w-12" />}
              title="講師が見つかりません"
              description="検索条件を変更して再度お試しください"
            />
          ) : (
            <>
              <div className="text-sm text-muted-foreground">
                {totalResults}人の講師が見つかりました
              </div>
              
              <div className="grid gap-6">
                {teachers.map(renderTeacherCard)}
              </div>
              
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}