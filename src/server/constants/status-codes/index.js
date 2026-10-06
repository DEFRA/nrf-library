// Single source of truth for HTTP status codes, shared between nrf-backend,
// nrf-frontend and nrf-admin-frontend (NRF2-1213). Union of the three repos'
// former local maps: `found` (302) replaces nrf-admin-frontend's former
// `redirect` alias, and every repo gains the keys it was missing. Deliberately
// camelCase so each repo's local re-export shim keeps existing
// `statusCodes.x` call sites unchanged.
export const statusCodes = {
  ok: 200,
  created: 201,
  noContent: 204,
  found: 302,
  redirectAfterPost: 303,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  payloadTooLarge: 413,
  imATeapot: 418,
  tooManyRequests: 429,
  internalServerError: 500,
  badGateway: 502,
  serviceUnavailable: 503
}
