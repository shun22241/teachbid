'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface Review {
  id: string
  transaction_id: string
  request_id: string
  reviewer_id: string
  reviewee_id: string
  reviewer_type: 'student' | 'teacher'
  rating: number
  title: string | null
  comment: string | null
  is_anonymous: boolean
  is_published: boolean
  helpful_count: number
  created_at: string
  reviewer: {
    full_name: string
    avatar_url: string | null
  }
  reviewee: {
    full_name: string
    avatar_url: string | null
  }
  request: {
    title: string
  }
}

interface ReviewStats {
  total_reviews: number
  average_rating: number
  rating_distribution: Record<string, number>
}

interface CreateReviewData {
  transaction_id: string
  request_id: string
  reviewee_id: string
  reviewer_type: 'student' | 'teacher'
  rating: number
  title?: string
  comment?: string
  is_anonymous?: boolean
}

export function useReviews() {
  const supabase = createClient()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Fetch reviews for a user
  const fetchUserReviews = useCallback(async (userId: string, type: 'received' | 'given' = 'received') => {
    try {
      setLoading(true)
      
      const field = type === 'received' ? 'reviewee_id' : 'reviewer_id'
      
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:profiles!reviewer_id(full_name, avatar_url),
          reviewee:profiles!reviewee_id(full_name, avatar_url),
          request:requests!request_id(title)
        `)
        .eq(field, userId)
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Review[]
    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast({
        title: 'エラー',
        description: 'レビューの取得に失敗しました',
        variant: 'destructive'
      })
      return []
    } finally {
      setLoading(false)
    }
  }, [supabase, toast])

  // Fetch review stats for a user
  const fetchUserReviewStats = useCallback(async (userId: string): Promise<ReviewStats | null> => {
    try {
      const { data, error } = await supabase.rpc('get_user_review_stats', {
        user_id: userId
      })

      if (error) throw error
      
      return data?.[0] ? {
        total_reviews: Number(data[0].total_reviews) || 0,
        average_rating: Number(data[0].average_rating) || 0,
        rating_distribution: data[0].rating_distribution || {}
      } : null
    } catch (error) {
      console.error('Error fetching review stats:', error)
      return null
    }
  }, [supabase])

  // Create a new review
  const createReview = useCallback(async (reviewData: CreateReviewData) => {
    try {
      setSubmitting(true)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('reviews')
        .insert({
          ...reviewData,
          reviewer_id: user.id
        })

      if (error) throw error

      toast({
        title: '成功',
        description: 'レビューを投稿しました'
      })

      return true
    } catch (error) {
      console.error('Error creating review:', error)
      toast({
        title: 'エラー',
        description: 'レビューの投稿に失敗しました',
        variant: 'destructive'
      })
      return false
    } finally {
      setSubmitting(false)
    }
  }, [supabase, toast])

  // Update a review
  const updateReview = useCallback(async (reviewId: string, updates: Partial<CreateReviewData>) => {
    try {
      setSubmitting(true)

      const { error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', reviewId)

      if (error) throw error

      toast({
        title: '成功',
        description: 'レビューを更新しました'
      })

      return true
    } catch (error) {
      console.error('Error updating review:', error)
      toast({
        title: 'エラー',
        description: 'レビューの更新に失敗しました',
        variant: 'destructive'
      })
      return false
    } finally {
      setSubmitting(false)
    }
  }, [supabase, toast])

  // Toggle helpful vote on a review
  const toggleHelpfulVote = useCallback(async (reviewId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('review_helpful')
        .select('id')
        .eq('review_id', reviewId)
        .eq('user_id', user.id)
        .single()

      if (existingVote) {
        // Remove vote
        const { error } = await supabase
          .from('review_helpful')
          .delete()
          .eq('id', existingVote.id)

        if (error) throw error
      } else {
        // Add vote
        const { error } = await supabase
          .from('review_helpful')
          .insert({
            review_id: reviewId,
            user_id: user.id
          })

        if (error) throw error
      }

      return true
    } catch (error) {
      console.error('Error toggling helpful vote:', error)
      toast({
        title: 'エラー',
        description: '評価の更新に失敗しました',
        variant: 'destructive'
      })
      return false
    }
  }, [supabase, toast])

  // Check if user can review a transaction
  const canReviewTransaction = useCallback(async (transactionId: string, reviewerType: 'student' | 'teacher') => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return false

      // Check if transaction is completed
      const { data: transaction } = await supabase
        .from('transactions')
        .select('status, student_id, teacher_id')
        .eq('id', transactionId)
        .single()

      if (!transaction || transaction.status !== 'completed') {
        return false
      }

      // Check if user is part of transaction
      const isValidReviewer = reviewerType === 'student' 
        ? transaction.student_id === user.id
        : transaction.teacher_id === user.id

      if (!isValidReviewer) return false

      // Check if review already exists
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('transaction_id', transactionId)
        .eq('reviewer_type', reviewerType)
        .single()

      return !existingReview
    } catch (error) {
      console.error('Error checking review eligibility:', error)
      return false
    }
  }, [supabase])

  // Get completed transactions that can be reviewed
  const getReviewableTransactions = useCallback(async (userType: 'student' | 'teacher') => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const userIdField = userType === 'student' ? 'student_id' : 'teacher_id'

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select(`
          *,
          request:requests!inner(title),
          ${userType === 'student' ? 'teacher:profiles!teacher_id(full_name, avatar_url)' : 'student:profiles!student_id(full_name, avatar_url)'}
        `)
        .eq(userIdField, user.id)
        .eq('status', 'completed')

      if (error) throw error

      // Filter out transactions that already have reviews from this user
      const reviewableTransactions = []
      
      for (const transaction of transactions || []) {
        const { data: existingReview } = await supabase
          .from('reviews')
          .select('id')
          .eq('transaction_id', transaction.id)
          .eq('reviewer_type', userType)
          .single()

        if (!existingReview) {
          reviewableTransactions.push(transaction)
        }
      }

      return reviewableTransactions
    } catch (error) {
      console.error('Error fetching reviewable transactions:', error)
      return []
    }
  }, [supabase])

  return {
    loading,
    submitting,
    fetchUserReviews,
    fetchUserReviewStats,
    createReview,
    updateReview,
    toggleHelpfulVote,
    canReviewTransaction,
    getReviewableTransactions
  }
}