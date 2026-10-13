import Wreck from '@hapi/wreck'

/**
 * GET JSON from a service via Wreck, logging and rethrowing on failure.
 *
 * Shared GET core of the nrf-backend clients in nrf-frontend
 * (getRequestFromBackend) and nrf-admin-frontend (getRequestFromBackend),
 * which keep their own header builders, base-URL config and log message
 * wording on top of it. The frontend's POST/PATCH support and the admin
 * DELETE stay repo-local.
 *
 * @param {object} params
 * @param {string} params.url - absolute URL to request
 * @param {object} [params.headers={}] - request headers (typically from buildServiceHeaders)
 * @param {{error: Function}} params.logger - repo logger used for the failure log
 * @param {string} [params.errorMessage='Service request failed'] - log message on failure
 * @returns {Promise<object>} the Wreck response ({ res, payload })
 * @throws {Error} rethrows the Wreck error after logging
 */
export async function getRequestFromService({
  url,
  headers = {},
  logger,
  errorMessage = 'Service request failed'
}) {
  try {
    return await Wreck.get(url, { json: true, headers })
  } catch (error) {
    logger.error(error, errorMessage)
    throw error
  }
}
