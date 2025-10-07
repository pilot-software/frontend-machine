import { cn, formatMedicalDate, formatMedicalTime, calculateAge, formatCurrency, getStatusColor, getPriorityColor } from '../utils'

describe('Utils', () => {
  describe('cn', () => {
    it('merges class names', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('handles conditional classes', () => {
      expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
    })
  })

  describe('formatMedicalDate', () => {
    it('formats date string', () => {
      const result = formatMedicalDate('2024-01-15')
      expect(result).toMatch(/Jan 15, 2024/)
    })

    it('formats Date object', () => {
      const date = new Date('2024-01-15')
      const result = formatMedicalDate(date)
      expect(result).toMatch(/Jan 15, 2024/)
    })
  })

  describe('formatMedicalTime', () => {
    it('formats morning time', () => {
      expect(formatMedicalTime('09:30')).toBe('9:30 AM')
    })

    it('formats afternoon time', () => {
      expect(formatMedicalTime('14:45')).toBe('2:45 PM')
    })

    it('formats midnight', () => {
      expect(formatMedicalTime('00:00')).toBe('12:00 AM')
    })

    it('formats noon', () => {
      expect(formatMedicalTime('12:00')).toBe('12:00 PM')
    })
  })

  describe('calculateAge', () => {
    it('calculates age correctly', () => {
      const birthDate = new Date()
      birthDate.setFullYear(birthDate.getFullYear() - 30)
      expect(calculateAge(birthDate.toISOString())).toBe(30)
    })

    it('handles birthday not yet occurred this year', () => {
      const today = new Date()
      const birthDate = new Date(today.getFullYear() - 25, today.getMonth() + 1, today.getDate())
      expect(calculateAge(birthDate.toISOString())).toBe(24)
    })
  })

  describe('formatCurrency', () => {
    it('formats currency with decimals', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
    })

    it('formats whole numbers', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00')
    })

    it('handles zero', () => {
      expect(formatCurrency(0)).toBe('$0.00')
    })
  })

  describe('getStatusColor', () => {
    it('returns green for active status', () => {
      expect(getStatusColor('active')).toContain('green')
    })

    it('returns blue for pending status', () => {
      expect(getStatusColor('pending')).toContain('blue')
    })

    it('returns red for cancelled status', () => {
      expect(getStatusColor('cancelled')).toContain('red')
    })

    it('returns gray for unknown status', () => {
      expect(getStatusColor('unknown')).toContain('gray')
    })

    it('is case insensitive', () => {
      expect(getStatusColor('ACTIVE')).toContain('green')
    })
  })

  describe('getPriorityColor', () => {
    it('returns red for urgent priority', () => {
      expect(getPriorityColor('urgent')).toContain('red')
    })

    it('returns yellow for medium priority', () => {
      expect(getPriorityColor('medium')).toContain('yellow')
    })

    it('returns green for low priority', () => {
      expect(getPriorityColor('low')).toContain('green')
    })

    it('returns gray for unknown priority', () => {
      expect(getPriorityColor('unknown')).toContain('gray')
    })
  })
})
