const PENCE_PER_POUND = 100
const PENCE_DIGITS = 2

/**
 * Format a levy amount, omitting the pence when the amount is a whole number
 * of pounds (£21,650) and showing both decimal places otherwise (£21,650.50).
 *
 * @param {number | string} value - The amount to format. Callers must pass a
 * number or numeric string (non-numeric input renders as £NaN).
 * @param {string} [locale='en-GB'] - BCP 47 locale tag.
 * @param {string} [currency='GBP'] - ISO 4217 currency code.
 * @returns {string} The formatted currency string.
 */
export function formatLevyCurrency(value, locale = 'en-GB', currency = 'GBP') {
  const pence = Math.round(Number(value) * PENCE_PER_POUND)
  const fractionDigits = pence % PENCE_PER_POUND === 0 ? 0 : PENCE_DIGITS

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  })

  return formatter.format(value)
}
