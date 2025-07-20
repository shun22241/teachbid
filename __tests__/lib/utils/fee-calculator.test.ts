import { calculateFee, calculateTotalWithFee, getFeeRate } from '@/lib/utils/fee-calculator'

describe('Fee Calculator', () => {
  describe('getFeeRate', () => {
    it('returns correct fee rate for different amounts', () => {
      expect(getFeeRate(5000)).toBe(0.25) // 25% for amounts under 10,000
      expect(getFeeRate(15000)).toBe(0.20) // 20% for 10,000-50,000
      expect(getFeeRate(75000)).toBe(0.18) // 18% for 50,000-100,000
      expect(getFeeRate(150000)).toBe(0.15) // 15% for amounts over 100,000
    })

    it('handles edge cases correctly', () => {
      expect(getFeeRate(0)).toBe(0.25)
      expect(getFeeRate(10000)).toBe(0.20) // Exactly at tier boundary
      expect(getFeeRate(50000)).toBe(0.18) // Exactly at tier boundary
      expect(getFeeRate(100000)).toBe(0.15) // Exactly at tier boundary
    })
  })

  describe('calculateFee', () => {
    it('calculates fees correctly for different amounts', () => {
      expect(calculateFee(8000)).toBe(2000) // 8000 * 0.25
      expect(calculateFee(20000)).toBe(4000) // 20000 * 0.20
      expect(calculateFee(60000)).toBe(10800) // 60000 * 0.18
      expect(calculateFee(120000)).toBe(18000) // 120000 * 0.15
    })

    it('handles zero and negative amounts', () => {
      expect(calculateFee(0)).toBe(0)
      expect(calculateFee(-1000)).toBe(0)
    })

    it('rounds fees correctly', () => {
      expect(calculateFee(8333)).toBe(2083) // Should round properly
    })
  })

  describe('calculateTotalWithFee', () => {
    it('returns correct totals with fees', () => {
      const result = calculateTotalWithFee(10000)
      expect(result.originalAmount).toBe(10000)
      expect(result.fee).toBe(2000) // 10000 * 0.20
      expect(result.total).toBe(12000)
      expect(result.feeRate).toBe(0.20)
    })

    it('handles different fee tiers', () => {
      const lowAmount = calculateTotalWithFee(5000)
      expect(lowAmount.feeRate).toBe(0.25)
      expect(lowAmount.fee).toBe(1250)

      const highAmount = calculateTotalWithFee(150000)
      expect(highAmount.feeRate).toBe(0.15)
      expect(highAmount.fee).toBe(22500)
    })
  })
})