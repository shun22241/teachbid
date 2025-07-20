'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface PriceDisplayProps {
  amount: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showCurrency?: boolean
  variant?: 'default' | 'range' | 'negotiable'
  maxAmount?: number
}

export function PriceDisplay({
  amount,
  className,
  size = 'md',
  showCurrency = true,
  variant = 'default',
  maxAmount
}: PriceDisplayProps) {
  const formatPrice = (price: number) => {
    if (showCurrency) {
      return new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price)
    }
    return price.toLocaleString()
  }

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg font-semibold'
  }

  if (variant === 'range' && maxAmount) {
    return (
      <div className={cn('flex items-center gap-1', sizeClasses[size], className)}>
        <span>{formatPrice(amount)}</span>
        <span className="text-muted-foreground">〜</span>
        <span>{formatPrice(maxAmount)}</span>
      </div>
    )
  }

  if (variant === 'negotiable') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <span className={cn(sizeClasses[size])}>{formatPrice(amount)}</span>
        <Badge variant="outline" className="text-xs">
          相談可
        </Badge>
      </div>
    )
  }

  return (
    <span className={cn(sizeClasses[size], className)}>
      {formatPrice(amount)}
    </span>
  )
}

interface PriceRangeDisplayProps {
  minAmount: number
  maxAmount: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showCurrency?: boolean
}

export function PriceRangeDisplay({
  minAmount,
  maxAmount,
  className,
  size = 'md',
  showCurrency = true
}: PriceRangeDisplayProps) {
  return (
    <PriceDisplay
      amount={minAmount}
      maxAmount={maxAmount}
      variant="range"
      className={className}
      size={size}
      showCurrency={showCurrency}
    />
  )
}

interface BudgetDisplayProps {
  budgetMin: number
  budgetMax: number
  proposedAmount?: number
  className?: string
}

export function BudgetDisplay({
  budgetMin,
  budgetMax,
  proposedAmount,
  className
}: BudgetDisplayProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const isInRange = proposedAmount && 
    proposedAmount >= budgetMin && 
    proposedAmount <= budgetMax

  return (
    <div className={cn('space-y-1', className)}>
      <div className="text-sm text-muted-foreground">予算</div>
      <div className="flex items-center gap-2">
        <PriceRangeDisplay
          minAmount={budgetMin}
          maxAmount={budgetMax}
          size="md"
        />
        {proposedAmount && (
          <>
            <span className="text-muted-foreground">|</span>
            <span className="text-sm text-muted-foreground">提案:</span>
            <span className={cn(
              'font-medium',
              isInRange ? 'text-green-600' : 'text-orange-600'
            )}>
              {formatPrice(proposedAmount)}
            </span>
            {!isInRange && (
              <Badge variant="warning" className="text-xs">
                予算外
              </Badge>
            )}
          </>
        )}
      </div>
    </div>
  )
}