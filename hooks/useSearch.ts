'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useDebounce } from '@/hooks/useDebounce'

interface SearchFilters {
  query?: string
  category?: string
  format?: string
  minBudget?: number
  maxBudget?: number
  location?: string
  dateRange?: {
    start?: string
    end?: string
  }
  rating?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

interface SearchableRequest {
  id: string
  title: string
  description: string
  category: string
  subject: string
  format: string
  budget_min: number
  budget_max: number
  location: string | null
  duration_hours: number
  deadline: string
  status: string
  created_at: string
  student: {
    full_name: string
    avatar_url: string | null
  }
  proposals_count?: number
}

interface SearchableTeacher {
  id: string
  full_name: string
  bio: string | null
  avatar_url: string | null
  subjects: string[]
  hourly_rate_min: number | null
  hourly_rate_max: number | null
  location: string | null
  experience_years: number | null
  education: string | null
  average_rating: number
  total_reviews: number
  created_at: string
}

export function useSearch() {
  const supabase = createClient()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({})
  const [requests, setRequests] = useState<SearchableRequest[]>([])
  const [teachers, setTeachers] = useState<SearchableTeacher[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)

  // Debounce search query to avoid too many API calls
  const debouncedQuery = useDebounce(filters.query || '', 300)

  // Search requests
  const searchRequests = useCallback(async (searchFilters: SearchFilters, page: number = 1) => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('requests')
        .select(`
          *,
          student:profiles!student_id(full_name, avatar_url),
          proposals(count)
        `, { count: 'exact' })
        .eq('status', 'open')

      // Apply text search
      if (searchFilters.query) {
        query = query.or(`title.ilike.%${searchFilters.query}%,description.ilike.%${searchFilters.query}%,subject.ilike.%${searchFilters.query}%`)
      }

      // Apply category filter
      if (searchFilters.category) {
        query = query.eq('category', searchFilters.category)
      }

      // Apply format filter
      if (searchFilters.format) {
        query = query.eq('format', searchFilters.format)
      }

      // Apply budget filters
      if (searchFilters.minBudget !== undefined) {
        query = query.gte('budget_max', searchFilters.minBudget)
      }
      if (searchFilters.maxBudget !== undefined) {
        query = query.lte('budget_min', searchFilters.maxBudget)
      }

      // Apply location filter
      if (searchFilters.location) {
        query = query.ilike('location', `%${searchFilters.location}%`)
      }

      // Apply date range filter
      if (searchFilters.dateRange?.start) {
        query = query.gte('deadline', searchFilters.dateRange.start)
      }
      if (searchFilters.dateRange?.end) {
        query = query.lte('deadline', searchFilters.dateRange.end)
      }

      // Apply sorting
      const sortBy = searchFilters.sortBy || 'created_at'
      const sortOrder = searchFilters.sortOrder || 'desc'
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })

      // Apply pagination
      const from = (page - 1) * itemsPerPage
      const to = from + itemsPerPage - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      const requestsWithProposalCount = data?.map(request => ({
        ...request,
        proposals_count: request.proposals?.[0]?.count || 0
      })) || []

      setRequests(requestsWithProposalCount)
      setTotalResults(count || 0)

    } catch (error) {
      console.error('Error searching requests:', error)
      toast({
        title: 'エラー',
        description: 'リクエストの検索に失敗しました',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [supabase, toast, itemsPerPage])

  // Search teachers
  const searchTeachers = useCallback(async (searchFilters: SearchFilters, page: number = 1) => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .eq('role', 'teacher')

      // Apply text search
      if (searchFilters.query) {
        query = query.or(`full_name.ilike.%${searchFilters.query}%,bio.ilike.%${searchFilters.query}%,subjects.cs.{${searchFilters.query}}`)
      }

      // Apply location filter
      if (searchFilters.location) {
        query = query.ilike('location', `%${searchFilters.location}%`)
      }

      // Apply rating filter
      if (searchFilters.rating) {
        query = query.gte('average_rating', searchFilters.rating)
      }

      // Apply hourly rate filters
      if (searchFilters.minBudget !== undefined) {
        query = query.gte('hourly_rate_min', searchFilters.minBudget)
      }
      if (searchFilters.maxBudget !== undefined) {
        query = query.lte('hourly_rate_max', searchFilters.maxBudget)
      }

      // Apply sorting
      const sortBy = searchFilters.sortBy || 'average_rating'
      const sortOrder = searchFilters.sortOrder || 'desc'
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })

      // Apply pagination
      const from = (page - 1) * itemsPerPage
      const to = from + itemsPerPage - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      setTeachers(data || [])
      setTotalResults(count || 0)

    } catch (error) {
      console.error('Error searching teachers:', error)
      toast({
        title: 'エラー',
        description: '講師の検索に失敗しました',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [supabase, toast, itemsPerPage])

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setCurrentPage(1) // Reset to first page when filters change
  }, [])

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({})
    setCurrentPage(1)
  }, [])

  // Get available filter options
  const getFilterOptions = useCallback(async () => {
    try {
      // Get categories
      const { data: categoriesData } = await supabase
        .from('requests')
        .select('category')
        .not('category', 'is', null)

      const categories = [...new Set(categoriesData?.map(r => r.category) || [])]

      // Get subjects
      const { data: subjectsData } = await supabase
        .from('requests')
        .select('subject')
        .not('subject', 'is', null)

      const subjects = [...new Set(subjectsData?.map(r => r.subject) || [])]

      // Get locations
      const { data: locationsData } = await supabase
        .from('requests')
        .select('location')
        .not('location', 'is', null)

      const locations = [...new Set(locationsData?.map(r => r.location) || [])]

      return {
        categories: categories.sort(),
        subjects: subjects.sort(),
        locations: locations.sort(),
        formats: ['online', 'in_person', 'hybrid'],
        sortOptions: [
          { value: 'created_at', label: '作成日時' },
          { value: 'deadline', label: '締切日' },
          { value: 'budget_max', label: '予算' },
          { value: 'title', label: 'タイトル' }
        ]
      }
    } catch (error) {
      console.error('Error fetching filter options:', error)
      return {
        categories: [],
        subjects: [],
        locations: [],
        formats: ['online', 'in_person', 'hybrid'],
        sortOptions: []
      }
    }
  }, [supabase])

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(totalResults / itemsPerPage)
  }, [totalResults, itemsPerPage])

  // Effect to trigger search when filters or page changes
  useEffect(() => {
    const searchParams = { ...filters, query: debouncedQuery }
    
    // Only search if we have some criteria or if showing all results
    if (Object.keys(searchParams).some(key => searchParams[key as keyof SearchFilters])) {
      searchRequests(searchParams, currentPage)
    }
  }, [filters, debouncedQuery, currentPage, searchRequests])

  return {
    // State
    loading,
    filters,
    requests,
    teachers,
    totalResults,
    currentPage,
    totalPages,
    itemsPerPage,

    // Actions
    searchRequests,
    searchTeachers,
    updateFilters,
    clearFilters,
    setCurrentPage,
    getFilterOptions
  }
}