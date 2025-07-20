'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useReviews } from '@/hooks/useReviews'
import { formatRelativeTime } from '@/lib/utils/date-formatter'
import { Star, ThumbsUp, User } from 'lucide-react'
import { cn } from '@/lib/utils'

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

interface ReviewCardProps {
  review: Review
  showReviewee?: boolean
  className?: string
}

export function ReviewCard({ review, showReviewee = false, className }: ReviewCardProps) {
  const { toggleHelpfulVote } = useReviews()
  const [isVoting, setIsVoting] = useState(false)

  const handleHelpfulVote = async () => {
    setIsVoting(true)
    await toggleHelpfulVote(review.id)
    setIsVoting(false)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          'h-4 w-4',
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        )}
      />
    ))
  }

  const displayUser = showReviewee ? review.reviewee : review.reviewer
  const userRole = showReviewee 
    ? (review.reviewer_type === 'student' ? '講師' : '学生')
    : (review.reviewer_type === 'student' ? '学生' : '講師')

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {review.is_anonymous ? (
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
            ) : (
              <Avatar className="h-10 w-10">
                <AvatarImage src={displayUser.avatar_url || undefined} />
                <AvatarFallback>
                  {displayUser.full_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
            
            <div>
              <h4 className="font-medium">
                {review.is_anonymous ? '匿名ユーザー' : displayUser.full_name}
              </h4>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Badge variant="outline">{userRole}</Badge>
                <span>•</span>
                <span>{formatRelativeTime(review.created_at)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {renderStars(review.rating)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {review.title && (
          <h5 className="font-medium text-foreground">
            {review.title}
          </h5>
        )}
        
        {review.comment && (
          <p className="text-muted-foreground whitespace-pre-wrap">
            {review.comment}
          </p>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-sm text-muted-foreground">
            リクエスト: {review.request.title}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHelpfulVote}
              disabled={isVoting}
              className="text-muted-foreground hover:text-foreground"
            >
              <ThumbsUp className="h-3 w-3 mr-1" />
              参考になった ({review.helpful_count})
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}