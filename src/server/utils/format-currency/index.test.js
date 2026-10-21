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
      expect(
        formatCurrency('5500000', { locale: 'en-US', currency: 'USD' })
      ).toBe('$5,500,000.00')
    })
  })

  describe('With hideZeroPence', () => {
    it.each([
      ['omits .00 for a whole number', 21650, '£21,650'],
      ['omits .00 for a numeric string with .00', '21650.00', '£21,650'],
      ['omits .00 for zero', 0, '£0'],
      ['omits .00 for a large whole number', 1234567, '£1,234,567'],
      ['keeps both decimals for whole pence', 21650.5, '£21,650.50'],
      ['keeps both decimals for 1p', 0.01, '£0.01'],
      [
        'treats an amount that rounds to whole pounds as whole',
        100.004,
        '£100'
      ],
      ['keeps both decimals when rounding gives pence', 100.006, '£100.01']
    ])('should %s', (_, value, expected) => {
      expect(formatCurrency(value, { hideZeroPence: true })).toBe(expected)
    })

    it('should omit .00 in the provided format', () => {
      expect(
        formatCurrency('5500000', {
          locale: 'en-US',
          currency: 'USD',
          hideZeroPence: true
        })
      ).toBe('$5,500,000')
    })
  })
})
