import { tracing } from '@defra/hapi-tracing'

import { createRequestTracing } from './index.js'

describe('#createRequestTracing', () => {
  it('should return the tracing plugin configured with the given header', () => {
    const requestTracing = createRequestTracing('x-cdp-request-id')

    expect(requestTracing.plugin).toBe(tracing.plugin)
    expect(requestTracing.options).toEqual({
      tracingHeader: 'x-cdp-request-id'
    })
  })
})
