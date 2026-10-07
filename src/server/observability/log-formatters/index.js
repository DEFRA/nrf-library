// Structures errors for ECS (Elastic Common Schema) logging. Lifted verbatim
// from nrf-backend and nrf-frontend (byte-identical copies), where each
// repo's local logger-options wires it into pino's ECS formatters. Shared
// here so error shapes stay aligned across services.
function extractHttpStatusCode(error) {
  return (
    error.response?.statusCode ||
    error.res?.statusCode ||
    error.statusCode ||
    error.status ||
    error.output?.statusCode
  )
}

function buildHttpContext(statusCode) {
  return statusCode ? { response: { status_code: statusCode } } : undefined
}

function buildErrorMessage(error) {
  const baseMessage =
    (error && typeof error.message === 'string' && error.message) ||
    String(error)

  const payload =
    (error && typeof error === 'object' && 'data' in error && error.data) ||
    error?.response?.data

  if (!payload) {
    return baseMessage
  }

  try {
    const serialisedPayload =
      typeof payload === 'string' ? payload : JSON.stringify(payload)
    return `${baseMessage} | response: ${serialisedPayload}`
  } catch {
    return baseMessage
  }
}

function buildErrorDetails(error) {
  const details = {
    message: buildErrorMessage(error),
    stack_trace: error.stack || undefined,
    type: error.name || error.constructor?.name || 'Error',
    code: error.code || error.statusCode || undefined
  }
  for (const key of Object.keys(details)) {
    if (details[key] === undefined) {
      delete details[key]
    }
  }
  return details
}

/**
 * Structure an error for ECS (Elastic Common Schema) logging.
 *
 * @param {Error | object | unknown} error - the error to structure
 * @returns {object} ECS-shaped `{ error, http? }` object; `{}` for falsy input
 */
export function structureErrorForECS(error) {
  if (!error) {
    return {}
  }

  const statusCode = extractHttpStatusCode(error)
  const errorObj = { error: buildErrorDetails(error) }
  const httpContext = buildHttpContext(statusCode)
  if (httpContext) {
    errorObj.http = httpContext
  }
  return errorObj
}
