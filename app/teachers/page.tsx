'use client'

import { useEffect, useState } from 'react'
import { useSearch } from '@/hooks/useSearch'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { EmptyState } from '@/components/ui/empty-state'
import { Pagination } from '@/components/ui/pagination'
import { FilterBar, SearchFilter, SelectFilter } from '@/components/ui/filters'
import { PageHeader } from '@/components/layout/PageHeader'
import { formatCurrency } from '@/lib/utils/fee-calculator'
import { formatRelativeTime } from '@/lib/utils/date-formatter'
import { 
  Star, 
  MapPin, 
  Clock, 
  DollarSign,
  Users,
  GraduationCap,
  BookOpen
} from 'lucide-react'
import Link from 'next/link'

export default function TeachersPage() {
  const {
    loading,
    filters,
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

  const [filterOptions, setFilterOptions] = useState({
    subjects: [],
    locations: [],
    sortOptions: [
      { value: 'average_rating', label: '評価が高い順' },
      { value: 'total_reviews', label: 'レビュー数が多い順' },
      { value: 'hourly_rate_min', label: '料金が安い順' },
      { value: 'created_at', label: '新着順' }
    ]
  })

  // Load filter options
  useEffect(() => {
    async function loadOptions() {
      const options = await getFilterOptions()
      setFilterOptions(prev => ({
        ...prev,
        subjects: options.subjects,
        locations: options.locations
      }))
    }
    loadOptions()
  }, [getFilterOptions])

  // Initial search
  useEffect(() => {
    searchTeachers(filters, currentPage)
  }, [filters, currentPage, searchTeachers])

  const handleFilterChange = (key: string, value: any) => {
    updateFilters({ [key]: value })
  }

  const renderTeacherCard = (teacher: any) => (
    <Card key={teacher.id} className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={teacher.avatar_url || undefined} />
            <AvatarFallback className="text-xl">
              {teacher.full_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div>
              <Link href={`/teachers/${teacher.id}`}>
                <h3 className="text-xl font-semibold hover:text-primary cursor-pointer transition-colors">
                  {teacher.full_name}
                </h3>
              </Link>
              
              {teacher.average_rating > 0 && (
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {teacher.average_rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({teacher.total_reviews}件のレビュー)
                  </span>
                </div>
              )}
            </div>
            
            {teacher.subjects && teacher.subjects.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {teacher.subjects.slice(0, 4).map((subject: string) => (
                  <Badge key={subject} variant="outline" className="text-xs">
                    {subject}
                  </Badge>
                ))}
                {teacher.subjects.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{teacher.subjects.length - 4}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {teacher.bio && (
          <p className="text-muted-foreground line-clamp-3 text-sm">
            {teacher.bio}
          </p>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {teacher.hourly_rate_min && teacher.hourly_rate_max && (
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span>
                {formatCurrency(teacher.hourly_rate_min)} - {formatCurrency(teacher.hourly_rate_max)}/時間
              </span>
            </div>
          )}
          
          {teacher.experience_years && (
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span>指導歴 {teacher.experience_years}年</span>
            </div>
          )}
          
          {teacher.location && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span>{teacher.location}</span>
            </div>
          )}
          
          {teacher.education && (
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="line-clamp-1">{teacher.education}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            登録: {formatRelativeTime(teacher.created_at)}
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/teachers/${teacher.id}`}>
                詳細を見る
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={`/dashboard/student/messages?teacher=${teacher.id}`}>
                メッセージ
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="講師一覧"
        description="あなたにぴったりの講師を見つけましょう"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{totalResults}</p>
              <p className="text-sm text-muted-foreground">登録講師数</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Star className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">4.8</p>
              <p className="text-sm text-muted-foreground">平均評価</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <BookOpen className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">50+</p>
              <p className="text-sm text-muted-foreground">対応科目</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <FilterBar onReset={clearFilters}>
        <SearchFilter
          value={filters.query || ''}
          onChange={(value) => handleFilterChange('query', value)}
          placeholder="講師名や専門分野で検索..."
          className="flex-1"
        />
        
        <SelectFilter
          value={filters.location || ''}
          onChange={(value) => handleFilterChange('location', value)}
          options={filterOptions.locations.map(loc => ({ value: loc, label: loc }))}
          placeholder="地域"
        />
        
        <SelectFilter
          value={filters.rating?.toString() || ''}
          onChange={(value) => handleFilterChange('rating', value ? Number(value) : undefined)}
          options={[
            { value: '4', label: '★4以上' },
            { value: '3', label: '★3以上' },
            { value: '2', label: '★2以上' }
          ]}
          placeholder="評価"
        />
        
        <SelectFilter
          value={filters.sortBy || 'average_rating'}
          onChange={(value) => handleFilterChange('sortBy', value)}
          options={filterOptions.sortOptions}
          placeholder="並び順"
        />
      </FilterBar>

      {/* Results */}
      {loading ? (
        <LoadingSpinner size="lg" className="py-12" />
      ) : teachers.length === 0 ? (
        <EmptyState
          icon={<Users className="h-12 w-12" />}
          title="講師が見つかりません"
          description="検索条件を変更して再度お試しください"
          action={
            <Button onClick={clearFilters} variant="outline">
              フィルターをクリア
            </Button>
          }
        />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {totalResults}人の講師が見つかりました
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
    </div>
  )
}