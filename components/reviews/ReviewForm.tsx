'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useReviews } from '@/hooks/useReviews'
import { Star, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const reviewSchema = z.object({
  rating: z.number().min(1, '評価を選択してください').max(5),
  title: z.string().max(100, 'タイトルは100文字以内で入力してください').optional(),
  comment: z.string().max(1000, 'コメントは1000文字以内で入力してください').optional(),
  is_anonymous: z.boolean().default(false)
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface ReviewFormProps {
  transactionId: string
  requestId: string
  revieweeId: string
  reviewerType: 'student' | 'teacher'
  revieweeName: string
  requestTitle: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function ReviewForm({
  transactionId,
  requestId,
  revieweeId,
  reviewerType,
  revieweeName,
  requestTitle,
  onSuccess,
  onCancel
}: ReviewFormProps) {
  const { createReview, submitting } = useReviews()
  const [selectedRating, setSelectedRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      is_anonymous: false
    }
  })

  const watchedValues = watch()

  const onSubmit = async (data: ReviewFormData) => {
    const success = await createReview({
      transaction_id: transactionId,
      request_id: requestId,
      reviewee_id: revieweeId,
      reviewer_type: reviewerType,
      rating: data.rating,
      title: data.title || undefined,
      comment: data.comment || undefined,
      is_anonymous: data.is_anonymous
    })

    if (success && onSuccess) {
      onSuccess()
    }
  }

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating)
    setValue('rating', rating)
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1
      const isFilled = starValue <= (hoverRating || selectedRating)
      
      return (
        <button
          key={i}
          type="button"
          className="p-1 hover:scale-110 transition-transform"
          onClick={() => handleStarClick(starValue)}
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
        >
          <Star
            className={cn(
              'h-8 w-8 transition-colors',
              isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
            )}
          />
        </button>
      )
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {reviewerType === 'student' ? '講師' : '学生'}への評価
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          <p><strong>対象:</strong> {revieweeName}</p>
          <p><strong>リクエスト:</strong> {requestTitle}</p>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <Label>評価 *</Label>
            <div className="flex items-center space-x-1">
              {renderStars()}
            </div>
            {selectedRating > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedRating === 1 && '非常に不満'}
                {selectedRating === 2 && '不満'}
                {selectedRating === 3 && '普通'}
                {selectedRating === 4 && '満足'}
                {selectedRating === 5 && '非常に満足'}
              </p>
            )}
            {errors.rating && (
              <p className="text-sm text-destructive">{errors.rating.message}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">タイトル（任意）</Label>
            <Input
              id="title"
              placeholder="レビューのタイトル"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">コメント（任意）</Label>
            <Textarea
              id="comment"
              placeholder="具体的な感想やフィードバックをお聞かせください"
              rows={5}
              {...register('comment')}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {watchedValues.comment?.length || 0} / 1000文字
              </span>
            </div>
            {errors.comment && (
              <p className="text-sm text-destructive">{errors.comment.message}</p>
            )}
          </div>

          {/* Anonymous */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              {...register('is_anonymous')}
            />
            <Label htmlFor="anonymous" className="text-sm">
              匿名で投稿する
            </Label>
          </div>

          <Alert>
            <AlertDescription>
              投稿されたレビューは公開され、他のユーザーが閲覧できます。
              適切な内容で投稿してください。
            </AlertDescription>
          </Alert>

          {/* Buttons */}
          <div className="flex space-x-3">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={submitting}
                className="flex-1"
              >
                キャンセル
              </Button>
            )}
            <Button
              type="submit"
              disabled={submitting || selectedRating === 0}
              className="flex-1"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  投稿中...
                </>
              ) : (
                'レビューを投稿'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}