import { formatLevyCurrency } from './index.js'

describe('#formatLevyCurrency', () => {
  describe('With defaults', () => {
    it.each([
      ['omits .00 for a whole number', 21650, '£21,650'],
      ['omits .00 for a numeric string with .00', '21650.00', '£21,650'],
      ['omits .00 for zero', 0, '£0'],
      ['omits the pence for a large whole number', 1234567, '£1,234,567'],
      ['keeps both decimals for whole pence', 21650.5, '£21,650.50'],
      [
        'keeps both decimals for a numeric string with pence',
        '21650.05',
        '£21,650.05'
      ],
      ['keeps both decimals for a value of 1p', 0.01, '£0.01'],
      [
        'rounds to 2 decimals and treats a rounded whole amount as whole',
        100.004,
        '£100'
      ],
      [
        'rounds to 2 decimals when the rounded amount has pence',
        100.006,
        '£100.01'
      ]
    ])('should %s', (_, value, expected) => {
      expect(formatLevyCurrency(value)).toBe(expected)
    })
  })

  describe('With currency attributes', () => {
    it('should omit the pence in the provided format', () => {
      expect(formatLevyCurrency('5500000', 'en-US', 'USD')).toBe('$5,500,000')
    })

    it('should keep the pence in the provided format', () => {
      expect(formatLevyCurrency('5500000.5', 'en-US', 'USD')).toBe(
        '$5,500,000.50'
      )
    })
  })
})
