import { statusCodes } from './index.js'

describe('statusCodes', () => {
  it('should match the agreed shared set of status codes', () => {
    expect(statusCodes).toEqual({
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
    })
  })

  it('should have a unique value for every key', () => {
    expect(new Set(Object.values(statusCodes)).size).toBe(
      Object.keys(statusCodes).length
    )
  })
})
