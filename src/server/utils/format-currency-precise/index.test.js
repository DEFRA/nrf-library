import { formatCurrencyPrecise } from './index.js'

describe('#formatCurrencyPrecise', () => {
  describe('With defaults', () => {
    it.each([
      [
        'keeps up to four decimal places for unrounded values',
        '2193.6649',
        '£2,193.6649'
      ],
      ['pads values with fewer than two decimal places', '2193.6', '£2,193.60'],
      ['leaves already rounded values unchanged', '2193.66', '£2,193.66'],
      ['formats whole numbers to two decimal places', 999, '£999.00']
    ])('should %s', (_, value, expected) => {
      expect(formatCurrencyPrecise(value)).toBe(expected)
    })
  })

  describe('With currency attributes', () => {
    it('should be in provided format', () => {
      expect(formatCurrencyPrecise('2193.6649', 'en-US', 'USD')).toBe(
        '$2,193.6649'
      )
    })
  })
})
