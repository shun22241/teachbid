export const FEE_RATES = {
  FIRST_TIME: 0.25,      // 25% for first transaction
  UNDER_30K: 0.20,       // 20% for under 30,000 yen
  UNDER_50K: 0.18,       // 18% for 30,000-50,000 yen
  UNDER_100K: 0.15,      // 15% for 50,000-100,000 yen
  OVER_100K: 0.12,       // 12% for over 100,000 yen
  PRO_PLAN_DISCOUNT: 0.03, // 3% discount for pro plan
  MINIMUM: 0.10,         // Minimum fee rate
} as const

export const OPTION_PRICES = {
  URGENT_LISTING: 500,   // 24 hours urgent listing
  PROPOSAL_BOOST: 300,   // Boost proposal visibility
} as const

export const SUBSCRIPTION_PRICES = {
  STUDENT_PREMIUM: 2980, // Monthly student premium
  TEACHER_PRO: 3980,     // Monthly teacher pro plan
} as const