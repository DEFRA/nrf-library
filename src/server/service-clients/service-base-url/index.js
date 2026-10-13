/**
 * Resolve a CDP service base URL: explicit config, else the CDP internal
 * domain derived from ENVIRONMENT, else a local-dev default.
 *
 * Extracted from nrf-backend's cdp-uploader and impact-assessor clients,
 * which differed only in service name and port. nrf-admin-frontend's
 * cdp-uploader reads plain config today and can adopt the same chain when
 * its fork is aligned. Reads process.env.ENVIRONMENT by default — pass
 * `environment` explicitly in tests.
 *
 * @param {object} params
 * @param {string} [params.configuredUrl] - explicit URL from config, wins when set
 * @param {string} params.serviceName - service sub-domain, e.g. 'cdp-uploader'
 * @param {number} params.localhostPort - local development fallback port
 * @param {string} [params.environment=process.env.ENVIRONMENT] - CDP environment name
 * @returns {string} the resolved base URL
 */
export function serviceBaseUrl({
  configuredUrl,
  serviceName,
  localhostPort,
  environment = process.env.ENVIRONMENT
}) {
  if (configuredUrl) {
    return configuredUrl
  }
  if (environment) {
    return `https://${serviceName}.${environment}.cdp-int.defra.cloud`
  }
  return `http://localhost:${localhostPort}`
}
