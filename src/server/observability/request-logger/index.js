import hapiPino from 'hapi-pino'

/**
 * Create the hapi-pino request-logging plugin registration object.
 *
 * Shared between nrf-backend, nrf-frontend and nrf-admin-frontend, which
 * each pass their own repo-local logger options. nrf-admin-frontend
 * additionally passes `ignoreFunc` as the second argument to skip /public,
 * /health and /favicon.ico requests.
 *
 * @param {object} loggerOptions - repo-local hapi-pino options (level,
 * redact, formatters, …)
 * @param {object} [options] - extra hapi-pino options, spread before
 * loggerOptions so loggerOptions takes precedence on key conflicts
 * @returns {{ plugin: object, options: object }} the plugin registration
 * object
 */
export function createRequestLogger(loggerOptions, options = {}) {
  return {
    plugin: hapiPino,
    options: {
      ...options,
      ...loggerOptions
    }
  }
}
