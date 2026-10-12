import { withTraceId } from '@defra/hapi-tracing'

/**
 * Build headers for a service-to-service call: the CDP trace header (when a
 * trace id is active in the request context), any extra headers, and a
 * service key header when a key is configured.
 *
 * Shared between nrf-backend, nrf-frontend and nrf-admin-frontend, which
 * each keep repo-local convict config — callers pass resolved values, the
 * library never reads config. Replaces six hand-rolled copies (the
 * backend/admin/frontend x-api-key builders, the impact-assessor x-api-key
 * and x-data-sync-token builders, and the frontend map-tile x-api-key block).
 *
 * Precedence: an active trace id overrides a same-named header in
 * extraHeaders; the service key is set last and wins collisions. Neither
 * the caller's extraHeaders object nor a trace header is mutated.
 *
 * @param {object} params
 * @param {string} params.traceHeaderName - header name for the trace id, e.g. config.get('tracing.header')
 * @param {string} [params.serviceKey] - the configured service key; the header is omitted when falsy
 * @param {string} [params.serviceKeyHeaderName='x-api-key'] - header name the service key is set under
 * @param {object} [params.extraHeaders={}] - additional headers merged into the base
 * @returns {object} the assembled headers
 */
export function buildServiceHeaders({
  traceHeaderName,
  serviceKey,
  serviceKeyHeaderName = 'x-api-key',
  extraHeaders = {}
}) {
  const headers = withTraceId(traceHeaderName, { ...extraHeaders })
  if (serviceKey) {
    headers[serviceKeyHeaderName] = serviceKey
  }
  return headers
}
