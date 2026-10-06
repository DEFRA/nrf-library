import { formatCurrency } from './index.js'

describe('#formatCurrency', () => {
  describe('With defaults', () => {
    it.each([
      ['formats string input', '20000000', '£20,000,000.00'],
      ['formats whole numbers', 1100, '£1,100.00'],
      ['keeps pence', 1600.5, '£1,600.50'],
      ['formats zero', 0, '£0.00'],
      ['formats large values', 1234567.89, '£1,234,567.89']
    ])('should %s', (_, value, expected) => {
      expect(formatCurrency(value)).toBe(expected)
    })
  })

  describe('With currency attributes', () => {
    it('should be in the provided format', () => {
      expect(formatCurrency('5500000', 'en-US', 'USD')).toBe('$5,500,000.00')
    })
  })
})
