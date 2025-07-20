'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Star, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReviewStatsProps {
  totalReviews: number
  averageRating: number
  ratingDistribution: Record<string, number>
  className?: string
}

export function ReviewStats({ 
  totalReviews, 
  averageRating, 
  ratingDistribution,
  className 
}: ReviewStatsProps) {
  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const starSize = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4'
    
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          starSize,
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : i < rating 
            ? 'fill-yellow-200 text-yellow-400'
            : 'text-gray-300'
        )}
      />
    ))
  }

  const getRatingPercentage = (rating: number) => {
    if (totalReviews === 0) return 0
    return ((ratingDistribution[rating] || 0) / totalReviews) * 100
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          レビュー統計
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {totalReviews > 0 ? (
          <>
            {/* Overall Rating */}
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-primary">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center space-x-1">
                {renderStars(averageRating, 'lg')}
              </div>
              <p className="text-muted-foreground">
                {totalReviews}件のレビュー
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-3">
              <h4 className="font-medium">評価の分布</h4>
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-12">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <Progress 
                    value={getRatingPercentage(rating)} 
                    className="flex-1 h-2"
                  />
                  <div className="text-sm text-muted-foreground w-12 text-right">
                    {ratingDistribution[rating] || 0}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="pt-4 border-t text-sm text-muted-foreground space-y-1">
              <p>
                推奨度: {Math.round((averageRating / 5) * 100)}%
              </p>
              <p>
                満足度の高いレビュー: {((ratingDistribution[4] || 0) + (ratingDistribution[5] || 0))}件
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>まだレビューがありません</p>
            <p className="text-sm">
              最初のレビューをお待ちしています
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}