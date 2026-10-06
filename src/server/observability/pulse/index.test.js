import hapiPulse from 'hapi-pulse'

import { createPulse } from './index.js'

describe('#createPulse', () => {
  const logger = { info: () => {} }

  it('should return the hapi-pulse plugin with the given logger and default timeout', () => {
    const pulse = createPulse(logger)

    expect(pulse.plugin).toBe(hapiPulse)
    expect(pulse.options).toEqual({ logger, timeout: 10000 })
  })

  it('should honour a custom timeout', () => {
    const pulse = createPulse(logger, { timeout: 5000 })

    expect(pulse.options.timeout).toBe(5000)
  })
})
