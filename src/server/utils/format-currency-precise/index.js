/**
 * Format a currency value with up to four decimal places.
 *
 * Used for levy figures that need more precision than whole pence (for
 * example per-unit base charges). Shared here so every service formats
 * precise figures identically; nrf-admin-frontend registers it as a Nunjucks
 * filter.
 *
 * @param {number | string} value - The amount to format.
 * @param {string} [locale='en-GB'] - BCP 47 locale tag.
 * @param {string} [currency='GBP'] - ISO 4217 currency code.
 * @returns {string} The formatted currency string.
 */
export function formatCurrencyPrecise(
  value,
  locale = 'en-GB',
  currency = 'GBP'
) {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  })

  return formatter.format(value)
}
