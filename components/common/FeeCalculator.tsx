'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { calculateFeeBreakdown, formatFeeCalculation } from '@/lib/utils/fee-calculator'
import { FEE_RATES } from '@/lib/constants/fee-rates'

interface FeeCalculatorProps {
  defaultAmount?: number
  teacherStats?: {
    transactionCount?: number
    isVerified?: boolean
    rating?: number
  }
  showBreakdown?: boolean
  className?: string
}

export function FeeCalculator({ 
  defaultAmount = 30000, 
  teacherStats,
  showBreakdown = true,
  className 
}: FeeCalculatorProps) {
  const [amount, setAmount] = useState(defaultAmount)
  const [calculation, setCalculation] = useState(() => 
    calculateFeeBreakdown(defaultAmount, teacherStats)
  )

  useEffect(() => {
    if (amount >= FEE_RATES.MIN_REQUEST_AMOUNT) {
      setCalculation(calculateFeeBreakdown(amount, teacherStats))
    }
  }, [amount, teacherStats])

  const handleAmountChange = (value: string) => {
    const numValue = parseInt(value.replace(/,/g, '')) || 0
    setAmount(numValue)
  }

  const formatted = formatFeeCalculation(calculation)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">手数料計算</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">レッスン料金</Label>
          <Input
            id="amount"
            type="text"
            value={amount.toLocaleString()}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="30,000"
          />
        </div>

        {amount >= FEE_RATES.MIN_REQUEST_AMOUNT && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="text-muted-foreground">手数料率</div>
                <div className="font-medium">{formatted.feeRate}</div>
              </div>
              <div className="space-y-1">
                <div className="text-muted-foreground">手数料</div>
                <div className="font-medium text-red-600">{formatted.commissionFee}</div>
              </div>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">先生の受取額</span>
                <span className="text-lg font-bold text-green-600">{formatted.netAmount}</span>
              </div>
            </div>

            {showBreakdown && (
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="border-t pt-2">
                  <div className="font-medium mb-1">内訳</div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>基本料金</span>
                      <span>{formatted.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>プラットフォーム手数料 ({formatted.feeRate})</span>
                      <span>-{formatted.commissionFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>決済手数料</span>
                      <span>-{formatted.stripeFee}</span>
                    </div>
                  </div>
                </div>

                {calculation.breakdown.discounts && (
                  <div className="space-y-1">
                    <div className="font-medium text-green-600">適用割引</div>
                    {calculation.breakdown.discounts.newTeacher && (
                      <div className="flex justify-between">
                        <span>新規講師割引</span>
                        <Badge variant="success" className="text-xs">
                          -¥{calculation.breakdown.discounts.newTeacher.toLocaleString()}
                        </Badge>
                      </div>
                    )}
                    {calculation.breakdown.discounts.verified && (
                      <div className="flex justify-between">
                        <span>認証済み割引</span>
                        <Badge variant="success" className="text-xs">
                          -¥{calculation.breakdown.discounts.verified.toLocaleString()}
                        </Badge>
                      </div>
                    )}
                    {calculation.breakdown.discounts.topRated && (
                      <div className="flex justify-between">
                        <span>高評価割引</span>
                        <Badge variant="success" className="text-xs">
                          -¥{calculation.breakdown.discounts.topRated.toLocaleString()}
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {amount < FEE_RATES.MIN_REQUEST_AMOUNT && (
          <div className="text-sm text-muted-foreground">
            最小金額は{FEE_RATES.MIN_REQUEST_AMOUNT.toLocaleString()}円です
          </div>
        )}
      </CardContent>
    </Card>
  )
}