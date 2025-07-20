// Fee rates for different transaction types
export const FEE_RATES = {
  // Base commission rate (20%)
  BASE_COMMISSION: 0.20,
  
  // Volume-based fee tiers
  VOLUME_TIERS: [
    { min: 0, max: 50000, rate: 0.25 },          // Up to 50,000 yen: 25%
    { min: 50001, max: 100000, rate: 0.22 },     // 50,001-100,000 yen: 22%
    { min: 100001, max: 200000, rate: 0.20 },    // 100,001-200,000 yen: 20%
    { min: 200001, max: 500000, rate: 0.18 },    // 200,001-500,000 yen: 18%
    { min: 500001, max: Infinity, rate: 0.15 },  // 500,001+ yen: 15%
  ],
  
  // Teacher experience-based discounts
  EXPERIENCE_DISCOUNTS: {
    NEW_TEACHER: 0.05,      // 5% discount for new teachers (first 5 transactions)
    VERIFIED_TEACHER: 0.02, // 2% discount for verified teachers
    TOP_RATED: 0.03,        // 3% discount for 4.8+ rating teachers
  },
  
  // Special options
  URGENT_LISTING_FEE: 2000,    // 2,000 yen for urgent listing
  PROPOSAL_BOOST_FEE: 1000,    // 1,000 yen for proposal boost
  
  // Referral bonuses
  REFERRAL_BONUS: {
    REFERRER: 3000,     // 3,000 yen for referrer
    REFERRED: 2000,     // 2,000 yen for referred user
  },
  
  // Payment processing fees (Stripe)
  STRIPE_FEE_RATE: 0.036,      // 3.6%
  STRIPE_FIXED_FEE: 10,        // 10 yen fixed fee
  
  // Minimum amounts
  MIN_REQUEST_AMOUNT: 1000,    // Minimum 1,000 yen per request
  MIN_PAYOUT_AMOUNT: 1000,     // Minimum 1,000 yen for payout
  
  // Maximum amounts
  MAX_REQUEST_AMOUNT: 1000000, // Maximum 1,000,000 yen per request
} as const

// Helper function to calculate fee based on amount and teacher tier
export const calculateFeeRate = (
  amount: number,
  teacherStats?: {
    transactionCount?: number
    isVerified?: boolean
    rating?: number
  }
): number => {
  // Find base rate from volume tiers
  const tier = FEE_RATES.VOLUME_TIERS.find(
    t => amount >= t.min && amount <= t.max
  )
  let feeRate = tier?.rate || FEE_RATES.BASE_COMMISSION

  // Apply teacher discounts if provided
  if (teacherStats) {
    const { transactionCount = 0, isVerified = false, rating = 0 } = teacherStats
    
    // New teacher discount (first 5 transactions)
    if (transactionCount < 5) {
      feeRate -= FEE_RATES.EXPERIENCE_DISCOUNTS.NEW_TEACHER
    }
    
    // Verified teacher discount
    if (isVerified) {
      feeRate -= FEE_RATES.EXPERIENCE_DISCOUNTS.VERIFIED_TEACHER
    }
    
    // Top-rated teacher discount
    if (rating >= 4.8) {
      feeRate -= FEE_RATES.EXPERIENCE_DISCOUNTS.TOP_RATED
    }
  }

  // Ensure fee rate doesn't go below 10%
  return Math.max(feeRate, 0.10)
}

// Calculate total fees including Stripe processing
export const calculateTotalFees = (
  amount: number,
  teacherStats?: {
    transactionCount?: number
    isVerified?: boolean
    rating?: number
  }
) => {
  const feeRate = calculateFeeRate(amount, teacherStats)
  const commissionFee = Math.round(amount * feeRate)
  const stripeFee = Math.round(amount * FEE_RATES.STRIPE_FEE_RATE) + FEE_RATES.STRIPE_FIXED_FEE
  const totalFees = commissionFee + stripeFee
  const netAmount = amount - totalFees

  return {
    amount,
    feeRate,
    commissionFee,
    stripeFee,
    totalFees,
    netAmount,
  }
}

// Fee tier display names for UI
export const FEE_TIER_NAMES = [
  '～5万円',
  '5万円～10万円',
  '10万円～20万円',
  '20万円～50万円',
  '50万円以上',
] as const