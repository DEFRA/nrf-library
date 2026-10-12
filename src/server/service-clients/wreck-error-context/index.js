/**
 * Unwrap the fields NRF logs from a Wreck error in service catch-blocks.
 *
 * Shared between nrf-frontend (uploader, boundary), nrf-backend
 * (cdp-uploader) and nrf-admin-frontend (cdp-uploader, impact-assessor
 * data-sync), which all log `statusCode` from error.output.statusCode and
 * the upstream body from error.data.payload. Only the Wreck-specific
 * unwrapping lives here: callers keep their own message templates (some
 * append error.message — the error passed as the logger's first argument
 * is serialised by pino anyway).
 *
 * @param {Error} [error] - a Wreck error (or anything shaped like one)
 * @returns {{statusCode: number | undefined, responsePayload: *}} optional-chained fields; both undefined for non-Wreck errors
 */
export function wreckErrorContext(error) {
  return {
    statusCode: error?.output?.statusCode,
    responsePayload: error?.data?.payload
  }
}
