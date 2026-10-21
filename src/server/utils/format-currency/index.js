const PENCE_PER_POUND = 100

/**
 * Format a currency value with two decimal places, or with no decimal places
 * when `hideZeroPence` is set and the amount is a whole number of pounds
 * (£21,650 rather than £21,650.00).
 *
 * Byte-identical between nrf-frontend and nrf-admin-frontend (where it is
 * registered as a Nunjucks filter), with the same body in nrf-backend.
 * Sibling of formatCurrencyPrecise, which keeps up to four decimal places
 * for levy figures.
 *
 * @param {number | string} value - the amount to format
 * @param {object} [options]
 * @param {string} [options.locale='en-GB'] - BCP 47 locale tag
 * @param {string} [options.currency='GBP'] - ISO 4217 currency code
 * @param {boolean} [options.hideZeroPence=false] - omit the pence when the amount is whole
 * @returns {string} the formatted currency string
 */
export function formatCurrency(
  value,
  { locale = 'en-GB', currency = 'GBP', hideZeroPence = false } = {}
) {
  const isWholeAmount =
    Math.round(Number(value) * PENCE_PER_POUND) % PENCE_PER_POUND === 0

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...(hideZeroPence && isWholeAmount && { maximumFractionDigits: 0 })
  })

  return formatter.format(value)
}
