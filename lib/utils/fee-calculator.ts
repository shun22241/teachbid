import { FEE_RATES, calculateFeeRate, calculateTotalFees } from '@/lib/constants/fee-rates'

export interface FeeCalculationResult {
  amount: number
  feeRate: number
  commissionFee: number
  stripeFee: number
  totalFees: number
  netAmount: number
  breakdown: {
    baseAmount: number
    commission: {
      rate: number
      amount: number
    }
    stripe: {
      rate: number
      amount: number
    }
    discounts?: {
      newTeacher?: number
      verified?: number
      topRated?: number
      total: number
    }
  }
}

export interface TeacherStats {
  transactionCount?: number
  isVerified?: boolean
  rating?: number
}

/**
 * Calculate comprehensive fee breakdown for a transaction
 */
export function calculateFeeBreakdown(
  amount: number,
  teacherStats?: TeacherStats
): FeeCalculationResult {
  const baseFeeRate = calculateFeeRate(amount, teacherStats)
  const commissionFee = Math.round(amount * baseFeeRate)
  const stripeFee = Math.round(amount * FEE_RATES.STRIPE_FEE_RATE) + FEE_RATES.STRIPE_FIXED_FEE
  const totalFees = commissionFee + stripeFee
  const netAmount = amount - totalFees

  // Calculate discounts applied
  let discounts: FeeCalculationResult['breakdown']['discounts']
  if (teacherStats) {
    const { transactionCount = 0, isVerified = false, rating = 0 } = teacherStats
    const baseRate = FEE_RATES.VOLUME_TIERS.find(
      t => amount >= t.min && amount <= t.max
    )?.rate || FEE_RATES.BASE_COMMISSION

    let totalDiscount = 0
    const discountBreakdown: any = {}

    if (transactionCount < 5) {
      const discount = Math.round(amount * FEE_RATES.EXPERIENCE_DISCOUNTS.NEW_TEACHER)
      discountBreakdown.newTeacher = discount
      totalDiscount += discount
    }

    if (isVerified) {
      const discount = Math.round(amount * FEE_RATES.EXPERIENCE_DISCOUNTS.VERIFIED_TEACHER)
      discountBreakdown.verified = discount
      totalDiscount += discount
    }

    if (rating >= 4.8) {
      const discount = Math.round(amount * FEE_RATES.EXPERIENCE_DISCOUNTS.TOP_RATED)
      discountBreakdown.topRated = discount
      totalDiscount += discount
    }

    if (totalDiscount > 0) {
      discounts = {
        ...discountBreakdown,
        total: totalDiscount,
      }
    }
  }

  return {
    amount,
    feeRate: baseFeeRate,
    commissionFee,
    stripeFee,
    totalFees,
    netAmount,
    breakdown: {
      baseAmount: amount,
      commission: {
        rate: baseFeeRate,
        amount: commissionFee,
      },
      stripe: {
        rate: FEE_RATES.STRIPE_FEE_RATE,
        amount: stripeFee,
      },
      ...(discounts && { discounts }),
    },
  }
}

/**
 * Calculate the minimum amount a teacher will receive after all fees
 */
export function calculateMinimumPayout(amount: number, teacherStats?: TeacherStats): number {
  const result = calculateFeeBreakdown(amount, teacherStats)
  return result.netAmount
}

/**
 * Calculate what amount a student needs to pay to ensure teacher receives target amount
 */
export function calculateRequiredAmount(targetNetAmount: number, teacherStats?: TeacherStats): number {
  // Binary search for the required amount
  let low = targetNetAmount
  let high = targetNetAmount * 2
  let result = high

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const calculation = calculateFeeBreakdown(mid, teacherStats)
    
    if (calculation.netAmount >= targetNetAmount) {
      result = mid
      high = mid - 1
    } else {
      low = mid + 1
    }
  }

  return result
}

/**
 * Get fee tier information for display
 */
export function getFeeTeierInfo(amount: number) {
  const tier = FEE_RATES.VOLUME_TIERS.find(
    t => amount >= t.min && amount <= t.max
  )
  
  if (!tier) return null

  const tierIndex = FEE_RATES.VOLUME_TIERS.indexOf(tier)
  const tierNames = ['～5万円', '5万円～10万円', '10万円～20万円', '20万円～50万円', '50万円以上']
  
  return {
    name: tierNames[tierIndex],
    rate: tier.rate,
    min: tier.min,
    max: tier.max === Infinity ? null : tier.max,
  }
}

/**
 * Calculate referral bonus amounts
 */
export function calculateReferralBonus(transactionAmount: number) {
  return {
    referrer: FEE_RATES.REFERRAL_BONUS.REFERRER,
    referred: FEE_RATES.REFERRAL_BONUS.REFERRED,
    total: FEE_RATES.REFERRAL_BONUS.REFERRER + FEE_RATES.REFERRAL_BONUS.REFERRED,
  }
}

/**
 * Validate transaction amount
 */
export function validateTransactionAmount(amount: number): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (amount < FEE_RATES.MIN_REQUEST_AMOUNT) {
    errors.push(`最小金額は${FEE_RATES.MIN_REQUEST_AMOUNT.toLocaleString()}円です`)
  }

  if (amount > FEE_RATES.MAX_REQUEST_AMOUNT) {
    errors.push(`最大金額は${FEE_RATES.MAX_REQUEST_AMOUNT.toLocaleString()}円です`)
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Format fee calculation for display
 */
export function formatFeeCalculation(calculation: FeeCalculationResult) {
  return {
    amount: `¥${calculation.amount.toLocaleString()}`,
    feeRate: `${(calculation.feeRate * 100).toFixed(1)}%`,
    commissionFee: `¥${calculation.commissionFee.toLocaleString()}`,
    stripeFee: `¥${calculation.stripeFee.toLocaleString()}`,
    totalFees: `¥${calculation.totalFees.toLocaleString()}`,
    netAmount: `¥${calculation.netAmount.toLocaleString()}`,
  }
}

/**
 * Calculate estimated earnings for different amounts
 */
export function calculateEarningsEstimate(
  amounts: number[],
  teacherStats?: TeacherStats
) {
  return amounts.map(amount => {
    const calculation = calculateFeeBreakdown(amount, teacherStats)
    return {
      amount,
      netAmount: calculation.netAmount,
      feeRate: calculation.feeRate,
      formatted: {
        amount: `¥${amount.toLocaleString()}`,
        netAmount: `¥${calculation.netAmount.toLocaleString()}`,
        feeRate: `${(calculation.feeRate * 100).toFixed(1)}%`,
      },
    }
  })
}

/**
 * Format currency amount for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Calculate the total amount a student pays (including fees)
 */
export function calculateStudentFee(baseAmount: number, teacherStats?: TeacherStats): number {
  const calculation = calculateFeeBreakdown(baseAmount, teacherStats)
  return calculation.amount
}

/**
 * Calculate the net amount a teacher receives (after fees)
 */
export function calculateTeacherFee(amount: number, teacherStats?: TeacherStats): number {
  const calculation = calculateFeeBreakdown(amount, teacherStats)
  return calculation.netAmount
}