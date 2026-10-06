/**
 * Format a currency value with two decimal places.
 *
 * Byte-identical between nrf-frontend and nrf-admin-frontend (where it is
 * registered as a Nunjucks filter), with the same body in nrf-backend.
 * Sibling of formatCurrencyPrecise, which keeps up to four decimal places
 * for levy figures.
 *
 * @param {number | string} value - the amount to format
 * @param {string} [locale='en-GB'] - BCP 47 locale tag
 * @param {string} [currency='GBP'] - ISO 4217 currency code
 * @returns {string} the formatted currency string
 */
export function formatCurrency(value, locale = 'en-GB', currency = 'GBP') {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  })

  return formatter.format(value)
}
