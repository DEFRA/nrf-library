import { pino } from 'pino'

/**
 * Build a pino logger from the caller's logger options.
 *
 * Shared between nrf-backend, nrf-frontend and nrf-admin-frontend, which
 * each keep repo-local logger options. Each repo wraps the returned instance
 * in its own singleton getter (createLogger) so existing import sites are
 * unaffected. Deliberately not memoized — the consuming repo owns the
 * singleton.
 *
 * @param {object} loggerOptions - repo-local pino options (level, redact,
 * formatters, …)
 * @returns {object} a pino logger instance
 */
export function buildLogger(loggerOptions) {
  return pino(loggerOptions)
}
