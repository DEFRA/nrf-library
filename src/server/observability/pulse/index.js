import hapiPulse from 'hapi-pulse'

const tenSeconds = 10 * 1000

/**
 * Create the hapi-pulse graceful-shutdown plugin registration object.
 *
 * Shared between nrf-backend, nrf-frontend and nrf-admin-frontend, which
 * each pass their own logger singleton.
 *
 * @param {object} logger - the repo's logger
 * @param {object} [options]
 * @param {number} [options.timeout=10000] - shutdown timeout in ms
 * @returns {{ plugin: object, options: { logger: object, timeout: number } }}
 * the plugin registration object
 */
export function createPulse(logger, { timeout = tenSeconds } = {}) {
  return {
    plugin: hapiPulse,
    options: {
      logger,
      timeout
    }
  }
}
