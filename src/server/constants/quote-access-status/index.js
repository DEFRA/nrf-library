// The outcome of validating a quote access token, shared between nrf-backend
// (which computes it) and nrf-frontend (which branches on it), cf.
// BOUNDARY_ERRORS. Values are snake_case on the wire.
export const QUOTE_ACCESS_STATUS = {
  valid: 'valid',
  invalid: 'invalid',
  expired: 'expired',
  notFound: 'not_found'
}
