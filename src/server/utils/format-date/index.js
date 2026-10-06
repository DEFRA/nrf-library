import { format, isDate, parseISO } from 'date-fns'

/**
 * Format a date with date-fns, defaulting to the GOV.UK-style
 * 'EEE do MMMM yyyy' (for example 'Wed 1st February 2023').
 *
 * Byte-identical between nrf-frontend and nrf-admin-frontend (where it is
 * registered as a Nunjucks filter). nrf-admin-frontend additionally keeps a
 * local formatDateTime variant.
 *
 * @param {Date | string} value - the date to format
 * @param {string} [formattedDateStr='EEE do MMMM yyyy'] - date-fns format
 * string
 * @returns {string} the formatted date string
 */
export function formatDate(value, formattedDateStr = 'EEE do MMMM yyyy') {
  const date = isDate(value) ? value : parseISO(value)

  return format(date, formattedDateStr)
}
