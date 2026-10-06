import { tracing } from '@defra/hapi-tracing'

/**
 * Create the @defra/hapi-tracing plugin registration object.
 *
 * Shared between nrf-backend, nrf-frontend and nrf-admin-frontend; each repo
 * passes its configured tracing header name (config `tracing.header`).
 *
 * @param {string} tracingHeader - the request tracing header name
 * @returns {{ plugin: object, options: { tracingHeader: string } }} the
 * plugin registration object
 */
export function createRequestTracing(tracingHeader) {
  return {
    plugin: tracing.plugin,
    options: { tracingHeader }
  }
}
